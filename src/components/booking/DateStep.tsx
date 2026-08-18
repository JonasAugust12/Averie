'use client';

import { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScheduleSettings } from '@services/schedule.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { DateStepSkeleton } from '@components/skeletons';
import { formatDisplayDate } from '@utils/format.util';
import { isDateFullyClosed } from '@utils/schedule.util';
import {
    BOOKING_MAX_DAYS_AHEAD,
    getSalonLocalDateTime,
    isBookingDateAllowed,
} from '@utils/booking-schedule.util';
import { cn } from '@utils/cn.util';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0);
}

export function DateStep() {
    const t = useBookingTranslations();
    const { date, setDate, setStep } = useBookingStore();
    const { data: settings, isLoading } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;
    const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

    const todayIso = useMemo(() => getSalonLocalDateTime().isoDate, []);

    const cells = useMemo(() => {
        const first = startOfMonth(cursor);
        const startPad = first.getDay();
        const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
        const list: Array<{
            iso: string;
            day: number;
            inMonth: boolean;
            disabled: boolean;
            isToday: boolean;
        } | null> = [];

        for (let i = 0; i < startPad; i++) list.push(null);

        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(cursor.getFullYear(), cursor.getMonth(), day, 12, 0, 0, 0);
            const iso = isoDate(d);
            const closed = settings ? isDateFullyClosed(iso, settings) : false;
            const disabled = !isBookingDateAllowed(iso) || closed;
            list.push({
                iso,
                day,
                inMonth: true,
                disabled,
                isToday: iso === todayIso,
            });
        }

        return list;
    }, [cursor, settings, todayIso]);

    if (isLoading) {
        return <DateStepSkeleton />;
    }

    const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full max-w-xl space-y-6">
            {/* Advance booking notice banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-secondary-200/80 bg-secondary-50/70 p-4 backdrop-blur-xs transition-all">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-200/80 text-primary">
                    <Calendar className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                            {t('advanceDaysPill') ||
                                `Booking Window: Next ${BOOKING_MAX_DAYS_AHEAD} Days`}
                        </span>
                    </div>
                    <p className="mt-1 font-sans text-xs sm:text-[13px] leading-relaxed text-stone-600">
                        {t('advanceBookingNotice', { days: BOOKING_MAX_DAYS_AHEAD }) ||
                            `Appointments can be booked up to ${BOOKING_MAX_DAYS_AHEAD} days in advance.`}{' '}
                        <span className="font-medium text-stone-700">
                            {t('sameDayNotice') ||
                                'Same-day bookings require at least 1 hour notice.'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Calendar card */}
            <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/85 p-5 sm:p-8 shadow-lg shadow-black/5 backdrop-blur-md">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() =>
                            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1, 12))
                        }
                        className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 shadow-2xs transition-all hover:border-primary hover:bg-white hover:text-primary active:scale-95"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-primary">
                        {monthLabel}
                    </h2>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() =>
                            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1, 12))
                        }
                        className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 shadow-2xs transition-all hover:border-primary hover:bg-white hover:text-primary active:scale-95"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="mb-3 grid grid-cols-7 gap-1 text-center font-sans text-xs sm:text-sm font-bold tracking-wider text-stone-500 uppercase">
                    {WEEKDAY_KEYS.map((key) => (
                        <span key={key} className="py-1">
                            {t(`weekdaysShort.${key}`) || key}
                        </span>
                    ))}
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {cells.map((cell, idx) => {
                        if (!cell) {
                            return <div key={`pad-${idx}`} className="aspect-square" />;
                        }
                        const selected = date === cell.iso;
                        return (
                            <button
                                key={cell.iso}
                                type="button"
                                disabled={cell.disabled}
                                onClick={() => setDate(cell.iso)}
                                className={cn(
                                    'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl font-sans text-sm sm:text-base font-bold transition-all duration-200',
                                    cell.disabled &&
                                        'cursor-not-allowed text-stone-300 line-through opacity-60',
                                    !cell.disabled &&
                                        !selected &&
                                        !cell.isToday &&
                                        'text-stone-800 bg-stone-50/50 hover:bg-secondary-100/60 hover:text-primary hover:scale-105 active:scale-95',
                                    !cell.disabled &&
                                        !selected &&
                                        cell.isToday &&
                                        'bg-primary/10 text-primary ring-1.5 ring-primary/30 hover:bg-primary/15 hover:scale-105 active:scale-95',
                                    selected &&
                                        'bg-primary text-neutral shadow-md shadow-primary/25 scale-105 ring-2 ring-primary ring-offset-2',
                                )}
                            >
                                <span>{cell.day}</span>
                                {cell.isToday && !cell.disabled && !selected ? (
                                    <span className="mt-0.5 font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-primary/80">
                                        {t('dateToday') || 'Today'}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>

                {/* Calendar Legend */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 border-t border-stone-200/60 pt-4 font-sans text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full bg-primary" />
                        <span className="font-medium">{t('legend.selected') || 'Selected'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full bg-primary/20 ring-1 ring-primary/50" />
                        <span className="font-medium">{t('legend.today') || 'Today'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full border border-stone-300 bg-stone-50" />
                        <span className="font-medium">{t('legend.available') || 'Available'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full bg-stone-200" />
                        <span className="font-medium line-through text-stone-400">
                            {t('legend.closed') || 'Closed'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-t sm:border-stone-200 sm:bg-background/95 sm:py-5 sm:backdrop-blur-sm sm:shadow-none">
                <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => setStep(allowStaffSelection ? 2 : 1)}
                        className="group inline-flex cursor-pointer items-center gap-1.5 sm:gap-3 rounded-full border border-stone-300 bg-background px-3.5 py-2 sm:px-4 sm:py-2 font-sans text-xs sm:text-sm font-semibold tracking-wider text-stone-700 uppercase transition-all hover:border-primary hover:text-primary hover:bg-tertiary/40 active:scale-95 duration-200 shadow-xs shrink-0"
                    >
                        <span className="flex size-5 items-center justify-center rounded-full bg-stone-100 group-hover:bg-primary/10">
                            ←
                        </span>
                        <span>{t('back') || 'Back'}</span>
                    </button>
                    <p className="font-sans text-xs sm:text-base text-stone-700 font-medium text-center truncate px-1">
                        <span className="hidden sm:inline">{t('selected') || 'Selected:'} </span>
                        <span className="font-bold text-primary">
                            {date ? formatDisplayDate(date) : '—'}
                        </span>
                    </p>
                    <Button
                        className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3.5 font-sans text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all duration-200 shrink-0"
                        disabled={!date}
                        onClick={() => setStep(4)}
                    >
                        {t('continue') || 'Continue'} →
                    </Button>
                </div>
            </div>
        </div>
    );
}
