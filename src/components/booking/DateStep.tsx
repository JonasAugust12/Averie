'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useScheduleSettings } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { formatDisplayDate } from '@utils/format.util';
import { isDateFullyClosed } from '@utils/schedule.util';
import { cn } from '@utils/cn.util';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

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

    const today = useMemo(() => {
        const now = new Date();
        now.setHours(12, 0, 0, 0);
        return now;
    }, []);

    const cells = useMemo(() => {
        const first = startOfMonth(cursor);
        const startPad = first.getDay();
        const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
        const list: Array<{
            iso: string;
            day: number;
            inMonth: boolean;
            disabled: boolean;
        } | null> = [];

        for (let i = 0; i < startPad; i++) list.push(null);

        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(cursor.getFullYear(), cursor.getMonth(), day, 12, 0, 0, 0);
            const iso = isoDate(d);
            const past = d < today;
            const closed = settings ? isDateFullyClosed(iso, settings) : false;
            list.push({ iso, day, inMonth: true, disabled: past || closed });
        }

        return list;
    }, [cursor, settings, today]);

    if (isLoading) {
        return (
            <p className="flex items-center gap-2 font-sans text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
            </p>
        );
    }

    const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full max-w-xl space-y-8">
            <div className="rounded-lg border border-border/60 bg-neutral p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() =>
                            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1, 12))
                        }
                        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/70 text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="font-display text-xl text-primary">{monthLabel}</h2>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() =>
                            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1, 12))
                        }
                        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/70 text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-3 grid grid-cols-7 gap-1 text-center font-sans text-sm font-semibold tracking-wide text-stone-600 uppercase">
                    {WEEKDAYS.map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
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
                                    'relative aspect-square cursor-pointer rounded-full font-sans text-base font-bold transition-all duration-200',
                                    cell.disabled &&
                                        'cursor-not-allowed text-stone-300 line-through',
                                    !cell.disabled &&
                                        !selected &&
                                        'text-primary hover:bg-tertiary hover:scale-105',
                                    selected &&
                                        'bg-primary text-neutral shadow-md scale-105 ring-2 ring-primary ring-offset-2',
                                )}
                            >
                                {cell.day}
                            </button>
                        );
                    })}
                </div>

                <p className="mt-5 font-sans text-sm font-medium text-stone-500">
                    {t('closedDay')}
                </p>
            </div>

            {/* Mobile-Fixed & Desktop-Static Bottom Action Bar */}
            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-t sm:border-stone-200 sm:bg-background/95 sm:py-5 sm:backdrop-blur-sm sm:shadow-none">
                <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => setStep(allowStaffSelection ? 2 : 1)}
                        className="group inline-flex cursor-pointer items-center gap-1.5 sm:gap-3 rounded-full border border-stone-300 bg-background px-3.5 py-2 sm:px-4 sm:py-2 font-sans text-xs sm:text-sm font-semibold tracking-wider text-stone-700 uppercase transition-all hover:border-primary hover:text-primary hover:bg-tertiary/40 active:scale-95 duration-200 shadow-xs shrink-0"
                    >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 group-hover:bg-primary/10">
                            ←
                        </span>
                        <span>{t('back')}</span>
                    </button>
                    <p className="font-sans text-xs sm:text-base text-stone-700 font-medium text-center truncate px-1">
                        <span className="hidden sm:inline">{t('selected')} </span>
                        <span className="font-bold text-primary">
                            {date ? formatDisplayDate(date) : '—'}
                        </span>
                    </p>
                    <Button
                        className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3.5 font-sans text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all duration-200 shrink-0"
                        disabled={!date}
                        onClick={() => setStep(4)}
                    >
                        {t('continue')} →
                    </Button>
                </div>
            </div>
        </div>
    );
}
