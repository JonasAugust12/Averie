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

                <div className="mb-2 grid grid-cols-7 gap-1 text-center font-sans text-xs tracking-wide text-muted uppercase">
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
                                    'relative aspect-square cursor-pointer rounded-full font-sans text-sm transition-colors',
                                    cell.disabled &&
                                        'cursor-not-allowed text-muted/40 line-through',
                                    !cell.disabled && !selected && 'text-primary hover:bg-tertiary',
                                    selected && 'bg-primary text-neutral shadow-md',
                                )}
                            >
                                {cell.day}
                            </button>
                        );
                    })}
                </div>

                <p className="mt-4 font-sans text-xs text-muted">{t('closedDay')}</p>
            </div>

            <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 bg-background/95 py-4 backdrop-blur-sm">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="cursor-pointer border-b border-transparent font-sans text-xs tracking-widest text-primary uppercase transition-colors hover:border-primary"
                >
                    {t('back')}
                </button>
                <p className="font-sans text-sm text-muted">
                    {t('selected')}{' '}
                    <span className="text-primary">{date ? formatDisplayDate(date) : '—'}</span>
                </p>
                <Button
                    className="rounded-none tracking-widest uppercase"
                    disabled={!date}
                    onClick={() => setStep(4)}
                >
                    {t('continue')}
                </Button>
            </div>
        </div>
    );
}
