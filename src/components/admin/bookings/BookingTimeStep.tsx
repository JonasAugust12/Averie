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

    const timePeriods = useMemo(() => {
        const displaySlots = mergeBookingDisplaySlots(slots ?? [], weekday);
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
    }, [slots, weekday, tBook]);

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
                                                        className="cursor-not-allowed rounded-xl border border-stone-200 bg-stone-50/60 py-2.5 px-3 font-sans text-xs font-bold text-stone-400 opacity-55 select-none text-center"
                                                    >
                                                        <span className="block">{slot.time}</span>
                                                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-red-600">
                                                            {tBook('periods.closed')}
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
                                                        className="cursor-not-allowed rounded-xl border border-stone-200 bg-stone-50/60 py-2.5 px-3 font-sans text-xs font-bold text-stone-400 opacity-55 select-none text-center"
                                                    >
                                                        <span className="block">{slot.time}</span>
                                                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                                                            {label}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            const isSelected = selectedTime === slot.time;
                                            return (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    onClick={() => onSelectTime(slot.time)}
                                                    className={cn(
                                                        'py-2.5 px-3 rounded-xl font-sans text-xs font-bold transition-all border text-center cursor-pointer',
                                                        isSelected
                                                            ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-105'
                                                            : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50',
                                                    )}
                                                >
                                                    {slot.time}
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
