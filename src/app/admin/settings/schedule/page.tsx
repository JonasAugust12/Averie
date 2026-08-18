'use client';

import { useEffect, useState } from 'react';
import { Loader2, Moon, Plus, Sun, Sunset, Trash2 } from 'lucide-react';
import { useScheduleSettings, useUpdateScheduleSettings } from '@services/schedule.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useUIStore } from '@stores/ui.store';
import { ScheduleSettingsSkeleton } from '@components/skeletons';
import { Button } from '@components/common';
import { Input } from '@components/ui';
import { cn } from '@utils/cn.util';
import {
    DAY_OFF_SCOPE_OPTIONS,
    WEEKDAY_ORDER_MON_SUN,
    dayOffDisplayId,
    getPeriodForTime,
    getPeriodSlotBadge,
    normalizePeriodSlots,
    normalizeTimeInput,
    PERIOD_SLOT_PLACEHOLDERS,
    sanitizeDayOffsForSave,
    sortTimes,
} from '@utils/schedule.util';
import type { DayOffDto, ScheduleSettingsDto } from '@typings/schedule-settings.type';
import type { DayOffScope, DayPeriod } from '@typings/salon-common.type';
import { toastSuccess } from '@utils/toast.util';

const PERIOD_META: { key: DayPeriod; icon: typeof Sun }[] = [
    { key: 'morning', icon: Sun },
    { key: 'afternoon', icon: Sunset },
    { key: 'evening', icon: Moon },
];

const WEEKDAY_I18N_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export default function ScheduleSettingsPage() {
    const t = useAdminTranslations();
    const { data: settings, isLoading } = useScheduleSettings();
    const { showConfirm, hideConfirm, setConfirmLoading } = useUIStore();
    const saveSettings = useUpdateScheduleSettings();
    const [form, setForm] = useState<ScheduleSettingsDto | null>(null);
    const [selectedWeekday, setSelectedWeekday] = useState<number>(1);
    const [newSlot, setNewSlot] = useState<Record<DayPeriod, string>>({
        morning: '',
        afternoon: '',
        evening: '',
    });
    const [slotErrors, setSlotErrors] = useState<Partial<Record<DayPeriod, string>>>({});
    const [newDayOff, setNewDayOff] = useState<{ date: string; scope: DayOffScope }>({
        date: '',
        scope: 'full',
    });

    useEffect(() => {
        if (!settings) return;
        const cloned = structuredClone(settings);
        cloned.weekdaySchedules = cloned.weekdaySchedules.map((day) => ({
            ...day,
            periodSlots: normalizePeriodSlots(day.periodSlots),
        }));
        cloned.dayOffs = cloned.dayOffs.map((off) => ({
            ...off,
            id: dayOffDisplayId(off),
        }));
        setForm(cloned);
    }, [settings]);

    const selectedDay =
        form?.weekdaySchedules.find((entry) => entry.weekday === selectedWeekday) ?? null;

    if (isLoading || !form || !selectedDay) {
        return <ScheduleSettingsSkeleton />;
    }

    function updateSelectedDay(
        updater: (
            day: ScheduleSettingsDto['weekdaySchedules'][number],
        ) => ScheduleSettingsDto['weekdaySchedules'][number],
    ) {
        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                weekdaySchedules: prev.weekdaySchedules.map((entry) =>
                    entry.weekday === selectedWeekday ? updater(entry) : entry,
                ),
            };
        });
    }

    function toggleDayOpen() {
        updateSelectedDay((day) => ({ ...day, isOpen: !day.isOpen }));
    }

    function addSlot(period: DayPeriod) {
        const raw = newSlot[period].trim();
        if (!raw) return;
        const time = normalizeTimeInput(raw);
        const actualPeriod = getPeriodForTime(time);
        if (actualPeriod !== period) {
            setSlotErrors((prev) => ({
                ...prev,
                [period]: t('schedule.slotWrongPeriod', {
                    period: t(`schedule.periods.${actualPeriod}`),
                }),
            }));
            return;
        }
        setSlotErrors((prev) => ({ ...prev, [period]: undefined }));
        updateSelectedDay((day) => {
            if (day.periodSlots[period].includes(time)) return day;
            return {
                ...day,
                periodSlots: {
                    ...day.periodSlots,
                    [period]: sortTimes([...day.periodSlots[period], time]),
                },
            };
        });
        setNewSlot((s) => ({ ...s, [period]: '' }));
    }

    function removeSlot(period: DayPeriod, time: string) {
        updateSelectedDay((day) => ({
            ...day,
            periodSlots: {
                ...day.periodSlots,
                [period]: day.periodSlots[period].filter((t) => t !== time),
            },
        }));
    }

    function addDayOff() {
        if (!newDayOff.date) return;
        setForm((prev) => {
            if (!prev) return prev;
            const entry: DayOffDto = {
                id: dayOffDisplayId({ date: newDayOff.date, scope: newDayOff.scope }),
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
        showConfirm({
            title: t('schedule.confirmSaveTitle'),
            message: t('schedule.confirmSaveMsg'),
            confirmText: t('schedule.confirmSaveBtn'),
            cancelText: t('schedule.confirmCancelBtn'),
            type: 'info',
            onConfirm: async () => {
                setConfirmLoading(true);
                try {
                    await saveSettings.mutateAsync({
                        allowStaffSelection: form.allowStaffSelection,
                        allowGuestLanguageSwitch: form.allowGuestLanguageSwitch,
                        weekdaySchedules: form.weekdaySchedules.map((day) => ({
                            ...day,
                            periodSlots: normalizePeriodSlots(day.periodSlots),
                        })),
                        dayOffs: sanitizeDayOffsForSave(form.dayOffs),
                    });
                    toastSuccess(t('toasts.scheduleSaved'));
                    hideConfirm();
                } catch (e) {
                    console.error(e);
                } finally {
                    setConfirmLoading(false);
                }
            },
        });
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

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm hover:shadow-xs transition-all duration-300">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="font-display text-lg font-bold text-stone-900">
                            {t('schedule.allowStaffSelection')}
                        </h2>
                        <p className="font-sans text-xs text-stone-400 max-w-xl">
                            {t('schedule.allowStaffSelectionHint')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setForm((prev) => {
                                if (!prev) return prev;
                                return {
                                    ...prev,
                                    allowStaffSelection: !prev.allowStaffSelection,
                                };
                            })
                        }
                        className={cn(
                            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-hidden hover:scale-105 active:scale-95',
                            form.allowStaffSelection ? 'bg-stone-800' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={form.allowStaffSelection}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5',
                                form.allowStaffSelection ? 'translate-x-6' : 'translate-x-0.5',
                            )}
                        />
                    </button>
                </div>
            </section>

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm hover:shadow-xs transition-all duration-300">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="font-display text-lg font-bold text-stone-900">
                            {t('schedule.allowGuestLanguageSwitch')}
                        </h2>
                        <p className="font-sans text-xs text-stone-400 max-w-xl">
                            {t('schedule.allowGuestLanguageSwitchHint')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setForm((prev) => {
                                if (!prev) return prev;
                                return {
                                    ...prev,
                                    allowGuestLanguageSwitch: !prev.allowGuestLanguageSwitch,
                                };
                            })
                        }
                        className={cn(
                            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-hidden hover:scale-105 active:scale-95',
                            form.allowGuestLanguageSwitch ? 'bg-stone-800' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={form.allowGuestLanguageSwitch}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5',
                                form.allowGuestLanguageSwitch ? 'translate-x-6' : 'translate-x-0.5',
                            )}
                        />
                    </button>
                </div>
            </section>

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm space-y-5">
                <div>
                    <h2 className="font-display text-lg font-semibold text-stone-900">
                        {t('schedule.weekdaySchedule')}
                    </h2>
                    <p className="mt-1 font-sans text-xs text-stone-400">
                        {t('schedule.weekdayScheduleHint')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {WEEKDAY_ORDER_MON_SUN.map((weekday) => {
                        const day = form.weekdaySchedules.find(
                            (entry) => entry.weekday === weekday,
                        );
                        const active = selectedWeekday === weekday;
                        const labelKey = WEEKDAY_I18N_KEYS[weekday];
                        return (
                            <button
                                key={weekday}
                                type="button"
                                onClick={() => setSelectedWeekday(weekday)}
                                className={cn(
                                    'rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-colors',
                                    active
                                        ? 'border-stone-800 bg-stone-800 text-white'
                                        : day?.isOpen
                                          ? 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                                          : 'border-stone-200 bg-stone-50 text-stone-400 line-through hover:border-stone-300',
                                )}
                            >
                                {t(`schedule.weekdays.${labelKey}`)}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-stone-100 bg-stone-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-sans text-sm font-semibold text-stone-800">
                            {t(`schedule.weekdays.${WEEKDAY_I18N_KEYS[selectedWeekday]}`)}
                        </p>
                        <p className="font-sans text-xs text-stone-500">
                            {selectedDay.isOpen
                                ? t('schedule.dayOpenHint')
                                : t('schedule.dayClosedHint')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleDayOpen}
                        className={cn(
                            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-hidden',
                            selectedDay.isOpen ? 'bg-stone-800' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={selectedDay.isOpen}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5',
                                selectedDay.isOpen ? 'translate-x-6' : 'translate-x-0.5',
                            )}
                        />
                    </button>
                </div>

                {!selectedDay.isOpen ? (
                    <p className="font-sans text-sm italic text-stone-400">
                        {t('schedule.dayClosed')}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {PERIOD_META.map(({ key, icon: Icon }) => (
                            <div
                                key={key}
                                className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm"
                            >
                                <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <h3 className="flex items-center gap-2 font-sans text-sm font-bold text-stone-800">
                                        <Icon className="h-4 w-4 text-stone-400" />
                                        {t(`schedule.periods.${key}`)}
                                    </h3>
                                    <span className="font-sans text-xs text-stone-400">
                                        {t(`schedule.periodRange.${key}`)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDay.periodSlots[key].map((time) => {
                                        const badge = getPeriodSlotBadge(
                                            key,
                                            time,
                                            selectedDay.periodSlots[key],
                                        );
                                        return (
                                            <span
                                                key={time}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-sans text-xs font-medium text-stone-700"
                                            >
                                                <span className="flex flex-col leading-tight">
                                                    <span>{time}</span>
                                                    {badge === 'open' && (
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                                                            {t('schedule.slotOpen')}
                                                        </span>
                                                    )}
                                                    {badge === 'closed' && (
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                                                            {t('schedule.slotClosed')}
                                                        </span>
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSlot(key, time)}
                                                    className="rounded-full p-0.5 text-stone-400 hover:bg-stone-200 hover:text-red-600"
                                                    aria-label={t('schedule.removeSlot')}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 space-y-1">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder={PERIOD_SLOT_PLACEHOLDERS[key]}
                                            value={newSlot[key]}
                                            onChange={(e) => {
                                                setNewSlot((s) => ({
                                                    ...s,
                                                    [key]: e.target.value,
                                                }));
                                                if (slotErrors[key]) {
                                                    setSlotErrors((prev) => ({
                                                        ...prev,
                                                        [key]: undefined,
                                                    }));
                                                }
                                            }}
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
                                    {slotErrors[key] ? (
                                        <p className="font-sans text-xs text-red-600">
                                            {slotErrors[key]}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

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
                                key={dayOffDisplayId(off)}
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
                        variant="secondary"
                        onClick={addDayOff}
                        className="rounded-xl border border-secondary-300 bg-secondary-100 font-semibold text-primary shadow-sm hover:bg-secondary-200"
                    >
                        <Plus className="h-4 w-4" />
                        {t('schedule.addDayOff')}
                    </Button>
                </div>
            </section>
        </div>
    );
}
