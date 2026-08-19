'use client';

import { useMemo } from 'react';
import { Moon, Sun, Sunset } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { AdminBookingTimeStepSkeleton } from '@components/skeletons';
import { formatDisplayDate } from '@utils/format.util';
import {
    getPeriodForTime,
    getWeekdayFromDate,
    mergeBookingDisplaySlots,
} from '@utils/schedule.util';
import { cn } from '@utils/cn.util';
import type { TimeSlotDto } from '@typings/booking.type';

interface BookingTimeStepProps {
    slots: TimeSlotDto[] | undefined;
    isLoading: boolean;
    selectedDate: string;
    selectedTime: string;
    onSelectTime: (t: string) => void;
    onChangeDate: () => void;
}

export function BookingTimeStep({
    slots,
    isLoading,
    selectedDate,
    selectedTime,
    onSelectTime,
    onChangeDate,
}: BookingTimeStepProps) {
    const tBook = useBookingTranslations();
    const tAdmin = useAdminTranslations();

    const weekday = getWeekdayFromDate(selectedDate);

    const displaySlots = useMemo(() => {
        return mergeBookingDisplaySlots(slots ?? [], weekday);
    }, [slots, weekday]);

    const firstOpenSlotTime = useMemo(() => {
        return displaySlots.find((s) => !s.isClosedDisplay && s.available)?.time ?? null;
    }, [displaySlots]);

    const timePeriods = useMemo(() => {
        return [
            {
                key: 'morning' as const,
                label: tBook('periods.morning'),
                icon: Sun,
                items: displaySlots.filter((s) => getPeriodForTime(s.time) === 'morning'),
            },
            {
                key: 'afternoon' as const,
                label: tBook('periods.afternoon'),
                icon: Sunset,
                items: displaySlots.filter((s) => getPeriodForTime(s.time) === 'afternoon'),
            },
            {
                key: 'evening' as const,
                label: tBook('periods.evening'),
                icon: Moon,
                items: displaySlots.filter((s) => getPeriodForTime(s.time) === 'evening'),
            },
        ];
    }, [displaySlots, tBook]);

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <p className="font-sans text-sm font-semibold text-stone-600">
                    {tAdmin('booking.time.availableFor')}{' '}
                    <span className="font-bold text-stone-950">
                        {formatDisplayDate(selectedDate)}
                    </span>
                </p>
                <button
                    type="button"
                    onClick={onChangeDate}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 underline underline-offset-2 uppercase tracking-wider"
                >
                    {tAdmin('booking.time.changeDate')}
                </button>
            </div>

            {isLoading ? (
                <AdminBookingTimeStepSkeleton />
            ) : (
                <div className="space-y-5">
                    {timePeriods.map((period) => {
                        const Icon = period.icon;
                        return (
                            <div key={period.key} className="space-y-2.5">
                                <h4 className="flex items-center gap-2 font-display text-sm font-bold text-stone-900 uppercase tracking-wider">
                                    <Icon className="h-4 w-4 text-stone-500" />
                                    {period.label}
                                </h4>
                                {period.items.length === 0 ? (
                                    <p className="font-sans text-xs text-stone-400 italic">
                                        {tAdmin('booking.time.noSlots')}
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                        {period.items.map((slot) => {
                                            if (slot.isClosedDisplay) {
                                                return (
                                                    <div
                                                        key={slot.id}
                                                        aria-disabled
                                                        className="relative flex h-11 sm:h-12 cursor-not-allowed items-center justify-center rounded-xl border border-stone-200 bg-stone-50/60 px-2 font-sans text-xs font-bold text-stone-400 opacity-55 select-none overflow-hidden"
                                                    >
                                                        {/* Diagonal Closed Ribbon */}
                                                        <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 overflow-hidden">
                                                            <div className="absolute -right-3 top-1 w-10 rotate-45 bg-rose-600/90 py-px text-center text-[5.5px] font-bold uppercase tracking-wider text-white shadow-2xs">
                                                                {tBook('periods.closed')}
                                                            </div>
                                                        </div>
                                                        <span className="leading-none">
                                                            {slot.time}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            if (!slot.available) {
                                                const label =
                                                    slot.lockReason === 'booked'
                                                        ? tBook('periods.booked')
                                                        : tBook('periods.unavailable');
                                                return (
                                                    <div
                                                        key={slot.id}
                                                        aria-disabled
                                                        className="relative flex h-11 sm:h-12 cursor-not-allowed items-center justify-center rounded-xl border border-stone-200 bg-stone-50/60 px-2 font-sans text-xs font-bold text-stone-400 opacity-55 select-none overflow-hidden"
                                                    >
                                                        {/* Diagonal Booked/Unavailable Ribbon */}
                                                        <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 overflow-hidden">
                                                            <div className="absolute -right-3 top-1 w-10 rotate-45 bg-stone-300/90 py-px text-center text-[5.5px] font-semibold uppercase tracking-wider text-stone-700 shadow-2xs">
                                                                {label}
                                                            </div>
                                                        </div>
                                                        <span className="leading-none">
                                                            {slot.time}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            const isSelected = selectedTime === slot.time;
                                            const isOpenSlot = slot.time === firstOpenSlotTime;

                                            return (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    onClick={() => onSelectTime(slot.time)}
                                                    className={cn(
                                                        'group relative flex h-11 sm:h-12 cursor-pointer items-center justify-center rounded-xl border px-2 font-sans text-xs font-bold transition-all overflow-hidden',
                                                        isSelected
                                                            ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-103'
                                                            : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50',
                                                    )}
                                                >
                                                    {/* Diagonal Ribbon */}
                                                    {isSelected ? (
                                                        <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 overflow-hidden">
                                                            <div className="absolute -right-3 top-1 w-10 rotate-45 bg-white/20 py-px text-center text-[6px] font-bold text-white shadow-2xs">
                                                                ✓
                                                            </div>
                                                        </div>
                                                    ) : isOpenSlot ? (
                                                        <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 overflow-hidden">
                                                            <div className="absolute -right-3 top-1 w-10 rotate-45 bg-emerald-600 py-px text-center text-[6px] font-bold uppercase tracking-wider text-white shadow-2xs">
                                                                {tBook('periods.open')}
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                    <span className="leading-none">
                                                        {slot.time}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
