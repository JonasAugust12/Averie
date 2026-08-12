'use client';

import { useEffect, useState } from 'react';
import { Loader2, Moon, Plus, Sun, Sunset, Trash2 } from 'lucide-react';
import { useScheduleSettings, useSaveScheduleSettings } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common/Button';
import { Input } from '@components/ui';
import { cn } from '@utils/cn.util';
import {
    DAY_OFF_SCOPE_OPTIONS,
    WEEKDAY_LABELS,
    normalizeTimeInput,
    sortTimes,
} from '@utils/schedule.util';
import type { DayOffEntry, DayOffScope, DayPeriod, ScheduleSettings } from '@typings/salon.type';

const PERIOD_META: { key: DayPeriod; icon: typeof Sun }[] = [
    { key: 'morning', icon: Sun },
    { key: 'afternoon', icon: Sunset },
    { key: 'evening', icon: Moon },
];

export default function ScheduleSettingsPage() {
    const t = useAdminTranslations();
    const { data: settings, isLoading } = useScheduleSettings();
    const saveSettings = useSaveScheduleSettings();
    const [form, setForm] = useState<ScheduleSettings | null>(null);
    const [newSlot, setNewSlot] = useState<Record<DayPeriod, string>>({
        morning: '',
        afternoon: '',
        evening: '',
    });
    const [newDayOff, setNewDayOff] = useState<{ date: string; scope: DayOffScope }>({
        date: '',
        scope: 'full',
    });

    useEffect(() => {
        if (settings) setForm(structuredClone(settings));
    }, [settings]);

    if (isLoading || !form) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    function toggleWeekday(day: number) {
        setForm((prev) => {
            if (!prev) return prev;
            const has = prev.workingWeekdays.includes(day);
            const workingWeekdays = has
                ? prev.workingWeekdays.filter((d) => d !== day)
                : [...prev.workingWeekdays, day].sort((a, b) => a - b);
            return { ...prev, workingWeekdays };
        });
    }

    function addSlot(period: DayPeriod) {
        const raw = newSlot[period].trim();
        if (!raw) return;
        const time = normalizeTimeInput(raw);
        setForm((prev) => {
            if (!prev) return prev;
            if (prev.periodSlots[period].includes(time)) return prev;
            return {
                ...prev,
                periodSlots: {
                    ...prev.periodSlots,
                    [period]: sortTimes([...prev.periodSlots[period], time]),
                },
            };
        });
        setNewSlot((s) => ({ ...s, [period]: '' }));
    }

    function removeSlot(period: DayPeriod, time: string) {
        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                periodSlots: {
                    ...prev.periodSlots,
                    [period]: prev.periodSlots[period].filter((t) => t !== time),
                },
            };
        });
    }

    function addDayOff() {
        if (!newDayOff.date) return;
        setForm((prev) => {
            if (!prev) return prev;
            const entry: DayOffEntry = {
                id: `do-${Date.now()}`,
                date: newDayOff.date,
                scope: newDayOff.scope,
            };
            return {
                ...prev,
                dayOffs: [
                    ...prev.dayOffs.filter((d) => d.date !== entry.date || d.scope !== entry.scope),
                    entry,
                ],
            };
        });
        setNewDayOff({ date: '', scope: 'full' });
    }

    function removeDayOff(id: string) {
        setForm((prev) => {
            if (!prev) return prev;
            return { ...prev, dayOffs: prev.dayOffs.filter((d) => d.id !== id) };
        });
    }

    async function handleSave() {
        if (!form) return;
        await saveSettings.mutateAsync(form);
    }

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                        {t('schedule.settings')}
                    </h1>
                    <p className="mt-1 font-sans text-sm text-stone-500">
                        {t('schedule.settingsSubtitle')}
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saveSettings.isPending}>
                    {saveSettings.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        t('schedule.save')
                    )}
                </Button>
            </div>

            {/* Working days */}
            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-stone-900">
                    {t('schedule.workingDays')}
                </h2>
                <p className="mt-1 font-sans text-xs text-stone-400">
                    {t('schedule.workingDaysHint')}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {WEEKDAY_LABELS.map((label, index) => {
                        const active = form.workingWeekdays.includes(index);
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => toggleWeekday(index)}
                                className={cn(
                                    'rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-colors',
                                    active
                                        ? 'border-stone-800 bg-stone-800 text-white'
                                        : 'border-stone-200 bg-stone-50 text-stone-400 hover:border-stone-300',
                                )}
                            >
                                {t(`schedule.weekdays.${label.toLowerCase()}`)}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Period slots */}
            <section className="space-y-4">
                <div>
                    <h2 className="font-display text-lg font-semibold text-stone-900">
                        {t('schedule.periodSlots')}
                    </h2>
                    <p className="mt-1 font-sans text-xs text-stone-400">
                        {t('schedule.periodSlotsHint')}
                    </p>
                </div>

                {PERIOD_META.map(({ key, icon: Icon }) => (
                    <div
                        key={key}
                        className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm"
                    >
                        <h3 className="mb-3 flex items-center gap-2 font-sans text-sm font-bold text-stone-800">
                            <Icon className="h-4 w-4 text-stone-400" />
                            {t(`schedule.periods.${key}`)}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {form.periodSlots[key].map((time) => (
                                <span
                                    key={time}
                                    className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-sans text-xs font-medium text-stone-700"
                                >
                                    {time}
                                    <button
                                        type="button"
                                        onClick={() => removeSlot(key, time)}
                                        className="rounded-full p-0.5 text-stone-400 hover:bg-stone-200 hover:text-red-600"
                                        aria-label={t('schedule.removeSlot')}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                            <Input
                                placeholder="07:30 AM"
                                value={newSlot[key]}
                                onChange={(e) =>
                                    setNewSlot((s) => ({ ...s, [key]: e.target.value }))
                                }
                                onKeyDown={(e) => e.key === 'Enter' && addSlot(key)}
                                className="max-w-40 border-neutral-200 bg-stone-50"
                            />
                            <Button
                                type="button"
                                variant="outlined"
                                size="sm"
                                onClick={() => addSlot(key)}
                                className="border-neutral-200"
                            >
                                <Plus className="h-4 w-4" />
                                {t('schedule.addSlot')}
                            </Button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Day offs */}
            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-stone-900">
                    {t('schedule.dayOffs')}
                </h2>
                <p className="mt-1 font-sans text-xs text-stone-400">{t('schedule.dayOffsHint')}</p>

                <div className="mt-4 space-y-2">
                    {form.dayOffs.length === 0 ? (
                        <p className="font-sans text-sm text-stone-400 italic">
                            {t('schedule.dayOffsEmpty')}
                        </p>
                    ) : (
                        form.dayOffs.map((off) => (
                            <div
                                key={off.id}
                                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/50 px-4 py-3"
                            >
                                <div>
                                    <p className="font-sans text-sm font-semibold text-stone-800">
                                        {off.date}
                                    </p>
                                    <p className="font-sans text-xs text-stone-500">
                                        {t(`schedule.dayOffScope.${off.scope}`)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeDayOff(off.id)}
                                    className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                            {t('schedule.dayOffDate')}
                        </label>
                        <Input
                            type="date"
                            value={newDayOff.date}
                            onChange={(e) => setNewDayOff((s) => ({ ...s, date: e.target.value }))}
                            className="border-neutral-200 bg-stone-50"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                            {t('schedule.dayOffScopeLabel')}
                        </label>
                        <select
                            value={newDayOff.scope}
                            onChange={(e) =>
                                setNewDayOff((s) => ({
                                    ...s,
                                    scope: e.target.value as DayOffScope,
                                }))
                            }
                            className="rounded-xl border border-neutral-200 bg-stone-50 px-3 py-2 font-sans text-sm"
                        >
                            {DAY_OFF_SCOPE_OPTIONS.map((scope) => (
                                <option key={scope} value={scope}>
                                    {t(`schedule.dayOffScope.${scope}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={addDayOff}
                        className="border-neutral-200"
                    >
                        <Plus className="h-4 w-4" />
                        {t('schedule.addDayOff')}
                    </Button>
                </div>
            </section>
        </div>
    );
}
