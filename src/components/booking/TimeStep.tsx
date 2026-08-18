'use client';

import { useEffect, useMemo } from 'react';
import { Moon, Sun, Sunset } from 'lucide-react';
import { useAvailableSlots } from '@services/booking.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { TimeStepSkeleton } from '@components/skeletons';
import {
    getPeriodForTime,
    getWeekdayFromDate,
    mergeBookingDisplaySlots,
} from '@utils/schedule.util';
import { cn } from '@utils/cn.util';

export function TimeStep() {
    const t = useBookingTranslations();
    const { date, time, serviceIds, staffPreference, staffId, setTime, setStep } =
        useBookingStore();
    const { data: slots, isLoading } = useAvailableSlots(
        date,
        serviceIds,
        staffPreference,
        staffId,
    );

    const weekday = date ? getWeekdayFromDate(date) : 1;

    const periods = useMemo(() => {
        const displaySlots = mergeBookingDisplaySlots(slots ?? [], weekday);
        return [
            {
                key: 'morning' as const,
                icon: Sun,
                items: displaySlots.filter((s) => getPeriodForTime(s.time) === 'morning'),
            },
            {
                key: 'afternoon' as const,
                icon: Sunset,
                items: displaySlots.filter((s) => getPeriodForTime(s.time) === 'afternoon'),
            },
            {
                key: 'evening' as const,
                icon: Moon,
                items: displaySlots.filter((s) => getPeriodForTime(s.time) === 'evening'),
            },
        ];
    }, [slots, weekday]);

    useEffect(() => {
        if (!time || !slots) return;
        const selected = slots.find((s) => s.time === time);
        if (!selected?.available) setTime(null);
    }, [slots, time, setTime]);

    if (isLoading) {
        return <TimeStepSkeleton />;
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
                                if (slot.isClosedDisplay) {
                                    return (
                                        <div
                                            key={slot.id}
                                            aria-disabled
                                            className="cursor-not-allowed rounded-xl border-2 border-stone-200 bg-stone-50/60 px-4 py-3 font-sans text-base font-bold text-stone-400 opacity-55 select-none"
                                        >
                                            <span className="block">{slot.time}</span>
                                            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-red-600">
                                                {t('periods.closed')}
                                            </span>
                                        </div>
                                    );
                                }

                                if (!slot.available) {
                                    const label =
                                        slot.lockReason === 'booked'
                                            ? t('periods.booked')
                                            : t('periods.unavailable');
                                    return (
                                        <div
                                            key={slot.id}
                                            aria-disabled
                                            className="cursor-not-allowed rounded-xl border-2 border-stone-200 bg-stone-50/60 px-4 py-3 font-sans text-base font-bold text-stone-400 opacity-55 select-none"
                                        >
                                            <span className="block">{slot.time}</span>
                                            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                                                {label}
                                            </span>
                                        </div>
                                    );
                                }

                                const selected = time === slot.time;
                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => setTime(slot.time)}
                                        className={cn(
                                            'cursor-pointer rounded-xl border-2 px-4 py-3 font-sans text-base font-bold transition-all duration-200 hover:shadow-md hover:scale-103',
                                            selected
                                                ? 'border-primary bg-primary text-neutral shadow-md scale-103'
                                                : 'border-stone-300 bg-white/70 text-primary hover:border-secondary-400 hover:bg-white/90',
                                        )}
                                    >
                                        <span className="block">{slot.time}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            ))}

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
