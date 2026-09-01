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

    // Safe translation resolution helper to prevent runtime MISSING_MESSAGE crashes
    const safeT = (key: string, fallback: string) => {
        try {
            return t(key) || fallback;
        } catch {
            return fallback;
        }
    };
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
                        bookingEnabled: form.bookingEnabled,
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
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900">
                        {t('schedule.settings') || 'Schedule Settings'}
                    </h1>
                    <p className="mt-1 font-sans text-xs text-stone-500">
                        {t('schedule.settingsSubtitle') ||
                            'Configure salon availability, booking rules, time slots, and day-offs'}
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saveSettings.isPending}
                    className="rounded-full bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider shadow-xs active:scale-98 transition-all"
                >
                    {saveSettings.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {safeT('schedule.saving', 'Saving…')}
                        </>
                    ) : (
                        safeT('schedule.save', 'Save Changes')
                    )}
                </Button>
            </div>

            {/* Online booking master toggle */}
            <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-2xs backdrop-blur-xs transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="font-display text-base font-bold text-stone-900">
                            {t('schedule.bookingEnabled')}
                        </h2>
                        <p className="font-sans text-xs text-stone-500 leading-relaxed">
                            {t('schedule.bookingEnabledDesc')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setForm((prev) => {
                                if (!prev) return prev;
                                return { ...prev, bookingEnabled: !prev.bookingEnabled };
                            })
                        }
                        className={cn(
                            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden active:scale-95',
                            form.bookingEnabled ? 'bg-emerald-600' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={form.bookingEnabled}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5',
                                form.bookingEnabled ? 'translate-x-5.5' : 'translate-x-0.5',
                            )}
                        />
                    </button>
                </div>
            </section>

            {/* General Toggles */}
            <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-2xs backdrop-blur-xs transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="font-display text-base font-bold text-stone-900">
                                {t('schedule.allowStaffSelection') || 'Allow Staff Selection'}
                            </h2>
                            <p className="font-sans text-xs text-stone-500 leading-relaxed">
                                {t('schedule.allowStaffSelectionHint') ||
                                    'When enabled, clients can choose a specific technician during booking'}
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
                                'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden active:scale-95',
                                form.allowStaffSelection ? 'bg-stone-900' : 'bg-stone-200',
                            )}
                            role="switch"
                            aria-checked={form.allowStaffSelection}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5',
                                    form.allowStaffSelection
                                        ? 'translate-x-5.5'
                                        : 'translate-x-0.5',
                                )}
                            />
                        </button>
                    </div>
                </section>

                <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-2xs backdrop-blur-xs transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="font-display text-base font-bold text-stone-900">
                                {t('schedule.allowGuestLanguageSwitch') || 'Guest Language Switch'}
                            </h2>
                            <p className="font-sans text-xs text-stone-500 leading-relaxed">
                                {t('schedule.allowGuestLanguageSwitchHint') ||
                                    'Show language switcher for clients on booking flow'}
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
                                'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden active:scale-95',
                                form.allowGuestLanguageSwitch ? 'bg-stone-900' : 'bg-stone-200',
                            )}
                            role="switch"
                            aria-checked={form.allowGuestLanguageSwitch}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5',
                                    form.allowGuestLanguageSwitch
                                        ? 'translate-x-5.5'
                                        : 'translate-x-0.5',
                                )}
                            />
                        </button>
                    </div>
                </section>
            </div>

            {/* Weekday Schedule */}
            <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 md:p-8 shadow-2xs backdrop-blur-xs space-y-6">
                <div>
                    <h2 className="font-display text-lg font-bold text-stone-900">
                        {t('schedule.weekdaySchedule') || 'Weekly Schedule & Time Slots'}
                    </h2>
                    <p className="mt-0.5 font-sans text-xs text-stone-500">
                        {t('schedule.weekdayScheduleHint') ||
                            'Select a day to configure open status and specific booking time slots'}
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
                                    'rounded-xl px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200',
                                    active
                                        ? 'bg-stone-900 text-white shadow-xs'
                                        : day?.isOpen
                                          ? 'border border-stone-200/80 bg-stone-50/70 text-stone-700 hover:bg-stone-100'
                                          : 'border border-stone-200/50 bg-stone-50/40 text-stone-400 line-through hover:bg-stone-100/60',
                                )}
                            >
                                {t(`schedule.weekdays.${labelKey}`)}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                            {t(`schedule.weekdays.${WEEKDAY_I18N_KEYS[selectedWeekday]}`)}
                        </p>
                        <p className="font-sans text-xs text-stone-500">
                            {selectedDay.isOpen
                                ? t('schedule.dayOpenHint') ||
                                  'Salon is open on this day and accepts bookings'
                                : t('schedule.dayClosedHint') || 'Salon is closed on this day'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleDayOpen}
                        className={cn(
                            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden active:scale-95',
                            selectedDay.isOpen ? 'bg-stone-900' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={selectedDay.isOpen}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5',
                                selectedDay.isOpen ? 'translate-x-5.5' : 'translate-x-0.5',
                            )}
                        />
                    </button>
                </div>

                {!selectedDay.isOpen ? (
                    <div className="rounded-2xl border border-dashed border-stone-200/80 bg-stone-50/40 p-8 text-center">
                        <p className="font-sans text-xs italic text-stone-400">
                            {t('schedule.dayClosed') ||
                                'This day is marked as closed. No booking slots will be generated.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {PERIOD_META.map(({ key, icon: Icon }) => (
                            <div
                                key={key}
                                className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-5 space-y-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/50 pb-3">
                                    <h3 className="flex items-center gap-2 font-display text-sm font-bold text-stone-900">
                                        <Icon className="h-4 w-4 text-stone-500" />
                                        {t(`schedule.periods.${key}`)}
                                    </h3>
                                    <span className="rounded-full bg-white px-2.5 py-1 font-sans text-[11px] font-semibold text-stone-500 border border-stone-200/60 shadow-2xs">
                                        {t(`schedule.periodRange.${key}`)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDay.periodSlots[key].length === 0 ? (
                                        <span className="font-sans text-xs italic text-stone-400 py-1">
                                            No slots added yet
                                        </span>
                                    ) : (
                                        selectedDay.periodSlots[key].map((time) => {
                                            const badge = getPeriodSlotBadge(
                                                key,
                                                time,
                                                selectedDay.periodSlots[key],
                                            );
                                            return (
                                                <span
                                                    key={time}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-stone-800 shadow-2xs"
                                                >
                                                    <span className="flex flex-col leading-tight">
                                                        <span>{time}</span>
                                                        {badge === 'open' && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                                                                {t('schedule.slotOpen') || 'Open'}
                                                            </span>
                                                        )}
                                                        {badge === 'closed' && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600">
                                                                {t('schedule.slotClosed') ||
                                                                    'Close'}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSlot(key, time)}
                                                        className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-rose-600 transition-colors"
                                                        aria-label={
                                                            t('schedule.removeSlot') ||
                                                            'Remove time slot'
                                                        }
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </span>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="space-y-1.5 pt-1">
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
                                            className="max-w-40 rounded-xl border-stone-200/80 bg-white px-3.5 py-2 font-sans text-xs focus:ring-2 focus:ring-stone-100"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => addSlot(key)}
                                            className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider shadow-2xs active:scale-98 transition-all"
                                        >
                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                            {t('schedule.addSlot') || 'Add Slot'}
                                        </Button>
                                    </div>
                                    {slotErrors[key] ? (
                                        <p className="font-sans text-xs font-medium text-rose-600">
                                            {slotErrors[key]}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Day-offs Section */}
            <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 md:p-8 shadow-2xs backdrop-blur-xs space-y-6">
                <div>
                    <h2 className="font-display text-lg font-bold text-stone-900">
                        {t('schedule.dayOffs') || 'Special Day-offs & Holidays'}
                    </h2>
                    <p className="mt-0.5 font-sans text-xs text-stone-500">
                        {t('schedule.dayOffsHint') ||
                            'Set specific closed days or custom holiday closures for the entire salon'}
                    </p>
                </div>

                <div className="space-y-2">
                    {form.dayOffs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-stone-200/80 bg-stone-50/40 p-6 text-center">
                            <p className="font-sans text-xs italic text-stone-400">
                                {t('schedule.dayOffsEmpty') || 'No special day-offs scheduled'}
                            </p>
                        </div>
                    ) : (
                        form.dayOffs.map((off) => (
                            <div
                                key={dayOffDisplayId(off)}
                                className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 transition-all"
                            >
                                <div>
                                    <p className="font-sans text-xs font-bold text-stone-900">
                                        {off.date}
                                    </p>
                                    <p className="mt-0.5 font-sans text-[11px] font-medium text-stone-500">
                                        {t(`schedule.dayOffScope.${off.scope}`)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeDayOff(off.id)}
                                    className="rounded-xl p-2 text-stone-400 hover:bg-white hover:text-rose-600 hover:shadow-2xs transition-all"
                                    aria-label="Remove day off"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex flex-wrap items-end gap-3 pt-2">
                    <div className="flex flex-col gap-1">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('schedule.dayOffDate') || 'Date'}
                        </label>
                        <Input
                            type="date"
                            value={newDayOff.date}
                            onChange={(e) => setNewDayOff((s) => ({ ...s, date: e.target.value }))}
                            className="rounded-xl border-stone-200/80 bg-stone-50/70 px-3.5 py-2 font-sans text-xs text-stone-800"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('schedule.dayOffScopeLabel') || 'Scope'}
                        </label>
                        <select
                            value={newDayOff.scope}
                            onChange={(e) =>
                                setNewDayOff((s) => ({
                                    ...s,
                                    scope: e.target.value as DayOffScope,
                                }))
                            }
                            className="rounded-xl border border-stone-200/80 bg-stone-50/70 px-3.5 py-2 font-sans text-xs text-stone-800 outline-hidden transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
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
                        onClick={addDayOff}
                        className="rounded-full bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider shadow-xs active:scale-98 transition-all"
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        {t('schedule.addDayOff') || 'Add Day Off'}
                    </Button>
                </div>
            </section>
        </div>
    );
}
