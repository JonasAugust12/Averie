'use client';

import { Loader2, Moon, Sun, Sunset } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatDisplayDate } from '@utils/format.util';
import { getPeriodForTime } from '@utils/schedule.util';
import { cn } from '@utils/cn.util';
import type { TimeSlot } from '@typings/salon.type';

interface BookingTimeStepProps {
    slots: TimeSlot[] | undefined;
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

    const available = (slots ?? []).filter((s) => s.available);
    const timePeriods = [
        {
            key: 'morning',
            label: tBook('periods.morning'),
            icon: Sun,
            items: available.filter((s) => getPeriodForTime(s.time) === 'morning'),
        },
        {
            key: 'afternoon',
            label: tBook('periods.afternoon'),
            icon: Sunset,
            items: available.filter((s) => getPeriodForTime(s.time) === 'afternoon'),
        },
        {
            key: 'evening',
            label: tBook('periods.evening'),
            icon: Moon,
            items: available.filter((s) => getPeriodForTime(s.time) === 'evening'),
        },
    ];

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
                <div className="flex items-center justify-center py-12 text-stone-400">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>{tAdmin('booking.time.loading')}</span>
                </div>
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
                                        {period.items.map((s) => {
                                            const isSelected = selectedTime === s.time;
                                            return (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => onSelectTime(s.time)}
                                                    className={cn(
                                                        'py-2.5 px-3 rounded-xl font-sans text-xs font-bold transition-all border text-center cursor-pointer',
                                                        isSelected
                                                            ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-105'
                                                            : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50',
                                                    )}
                                                >
                                                    {s.time}
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
