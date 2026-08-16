'use client';

import { useMemo } from 'react';
import { Loader2, Moon, Sun, Sunset } from 'lucide-react';
import { useAvailableSlots, useScheduleSettings } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import {
    getPeriodForTime,
    getWeekdayFromDate,
    isCloseTimeSlot,
    isOpenTimeSlot,
} from '@utils/schedule.util';
import { cn } from '@utils/cn.util';

export function TimeStep() {
    const t = useBookingTranslations();
    const { date, time, setTime, setStep } = useBookingStore();
    const { data: slots, isLoading } = useAvailableSlots(date);
    const { data: settings } = useScheduleSettings();

    const weekday = date ? getWeekdayFromDate(date) : 1;

    const periods = useMemo(() => {
        const available = (slots ?? []).filter((s) => s.available);
        return [
            {
                key: 'morning' as const,
                icon: Sun,
                items: available.filter((s) => getPeriodForTime(s.time) === 'morning'),
            },
            {
                key: 'afternoon' as const,
                icon: Sunset,
                items: available.filter((s) => getPeriodForTime(s.time) === 'afternoon'),
            },
            {
                key: 'evening' as const,
                icon: Moon,
                items: available.filter((s) => getPeriodForTime(s.time) === 'evening'),
            },
        ];
    }, [slots]);

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 font-sans text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="tracking-widest uppercase text-xs">Loading…</span>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {periods.map(({ key, icon: Icon, items: periodItems }) => (
                <section key={key} className="animate-fade-in-up">
                    <h2 className="mb-4 flex items-center gap-2.5 font-display text-xl font-bold text-primary tracking-wide">
                        <Icon className="h-4.5 w-4.5 text-stone-600" aria-hidden />
                        {t(`periods.${key}`)}
                    </h2>
                    {periodItems.length === 0 ? (
                        <p className="font-sans text-base text-stone-500 font-medium italic">
                            {key === 'evening'
                                ? t('periods.eveningUnavailable')
                                : t('periods.empty')}
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {periodItems.map((slot) => {
                                const selected = time === slot.time;
                                const isOpenTime =
                                    settings && isOpenTimeSlot(slot.time, settings, weekday);
                                const isCloseTime =
                                    settings && isCloseTimeSlot(slot.time, settings, weekday);
                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => setTime(slot.time)}
                                        className={cn(
                                            'cursor-pointer rounded-xl border-2 px-4 py-3 font-sans text-base font-bold transition-all duration-200 hover:shadow-md hover:scale-103',
                                            selected
                                                ? 'border-primary bg-primary text-neutral shadow-md scale-103'
                                                : isCloseTime
                                                  ? 'border-stone-200 bg-stone-50/70 text-stone-500 opacity-60 hover:border-stone-300 hover:bg-stone-50/90 hover:opacity-80'
                                                  : 'border-stone-300 bg-white/70 text-primary hover:border-secondary-400 hover:bg-white/90',
                                        )}
                                    >
                                        <span className="block">{slot.time}</span>
                                        {isOpenTime && (
                                            <span
                                                className={cn(
                                                    'mt-1 block text-[10px] font-semibold uppercase tracking-wider',
                                                    selected ? 'text-neutral/80' : 'text-stone-500',
                                                )}
                                            >
                                                {t('periods.openTime')}
                                            </span>
                                        )}
                                        {isCloseTime && (
                                            <span
                                                className={cn(
                                                    'mt-1 block text-[10px] font-semibold uppercase tracking-wider',
                                                    selected ? 'text-neutral/70' : 'text-stone-400',
                                                )}
                                            >
                                                {t('periods.closeTime')}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            ))}

            {/* Mobile-Fixed & Desktop-Static Bottom Action Bar */}
            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:pt-2 sm:shadow-none sm:backdrop-blur-none">
                <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 sm:justify-start">
                    <Button
                        variant="outlined"
                        className="rounded-full py-2.5 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm tracking-widest uppercase active:scale-95 transition-all duration-200"
                        onClick={() => setStep(3)}
                    >
                        ← {t('back')}
                    </Button>
                    <Button
                        className="rounded-full py-2.5 sm:py-3 px-8 sm:px-10 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all duration-200"
                        disabled={!time}
                        onClick={() => setStep(5)}
                    >
                        {t('continue')} →
                    </Button>
                </div>
            </div>
        </div>
    );
}
