'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatDisplayDate } from '@utils/format.util';
import { isDateFullyClosed } from '@utils/schedule.util';
import { cn } from '@utils/cn.util';
import type { ScheduleSettingsDto } from '@typings/schedule-settings.type';

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

interface BookingDateStepProps {
    selectedDate: string;
    monthCursor: Date;
    settings: ScheduleSettingsDto | undefined;
    onSelectDate: (iso: string) => void;
    onMonthChange: (d: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function BookingDateStep({
    selectedDate,
    monthCursor,
    settings,
    onSelectDate,
    onMonthChange,
}: BookingDateStepProps) {
    const tAdmin = useAdminTranslations();

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    // Build calendar grid
    const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1, 12, 0, 0, 0);
    const startPad = first.getDay();
    const daysInMonth = new Date(
        monthCursor.getFullYear(),
        monthCursor.getMonth() + 1,
        0,
    ).getDate();

    const calendarCells: Array<{ iso: string; day: number; disabled: boolean } | null> = [];
    for (let i = 0; i < startPad; i++) calendarCells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day, 12, 0, 0, 0);
        const iso = isoDate(d);
        const past = d < today;
        const closed = settings ? isDateFullyClosed(iso, settings) : false;
        calendarCells.push({ iso, day, disabled: past || closed });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-5 lg:max-w-lg">
            {/* Quick date pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[0, 1, 2, 3, 4].map((offset) => {
                    const d = new Date();
                    d.setDate(d.getDate() + offset);
                    const iso = isoDate(d);
                    const isSelected = selectedDate === iso;
                    const label =
                        offset === 0
                            ? tAdmin('booking.date.today')
                            : offset === 1
                              ? tAdmin('booking.date.tomorrow')
                              : d.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'numeric',
                                    day: 'numeric',
                                });
                    return (
                        <button
                            key={iso}
                            type="button"
                            onClick={() => onSelectDate(iso)}
                            className={cn(
                                'px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer',
                                isSelected
                                    ? 'bg-stone-900 text-white shadow-sm'
                                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100',
                            )}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={() =>
                            onMonthChange(
                                new Date(
                                    monthCursor.getFullYear(),
                                    monthCursor.getMonth() - 1,
                                    1,
                                    12,
                                ),
                            )
                        }
                        className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <h3 className="font-display text-base font-bold text-stone-900">
                        {monthCursor.toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h3>
                    <button
                        type="button"
                        onClick={() =>
                            onMonthChange(
                                new Date(
                                    monthCursor.getFullYear(),
                                    monthCursor.getMonth() + 1,
                                    1,
                                    12,
                                ),
                            )
                        }
                        className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs font-bold text-stone-400 uppercase mb-2">
                    {WEEKDAYS.map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((cell, idx) => {
                        if (!cell) return <div key={`pad-${idx}`} className="aspect-square" />;
                        const isSelected = selectedDate === cell.iso;
                        return (
                            <button
                                key={cell.iso}
                                type="button"
                                disabled={cell.disabled}
                                onClick={() => onSelectDate(cell.iso)}
                                className={cn(
                                    'aspect-square rounded-full font-sans text-sm font-bold transition-all flex items-center justify-center',
                                    cell.disabled
                                        ? 'text-stone-300 cursor-not-allowed line-through'
                                        : isSelected
                                          ? 'bg-stone-900 text-white shadow-md font-black scale-105'
                                          : 'text-stone-800 hover:bg-stone-100 cursor-pointer',
                                )}
                            >
                                {cell.day}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="text-center font-sans text-sm font-semibold text-stone-600">
                {tAdmin('booking.date.selectedDate')}{' '}
                <span className="font-bold text-stone-950">{formatDisplayDate(selectedDate)}</span>
            </div>
        </div>
    );
}
