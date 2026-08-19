'use client';

import { useEffect, useMemo } from 'react';
import { Clock, Moon, Phone, Sun, Sunset } from 'lucide-react';
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

    const displaySlots = useMemo(() => {
        return mergeBookingDisplaySlots(slots ?? [], weekday);
    }, [slots, weekday]);

    const firstOpenSlotTime = useMemo(() => {
        return displaySlots.find((s) => !s.isClosedDisplay && s.available)?.time ?? null;
    }, [displaySlots]);

    const periods = useMemo(() => {
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
    }, [displaySlots]);

    useEffect(() => {
        if (!time || !slots) return;
        const selected = slots.find((s) => s.time === time);
        if (!selected?.available) setTime(null);
    }, [slots, time, setTime]);

    if (isLoading) {
        return <TimeStepSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* Notice banner: Online booking closes 1h before closing + Hotline */}
            <div className="flex items-start gap-3 rounded-2xl border border-stone-200/80 bg-white/85 p-4 shadow-xs backdrop-blur-xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-primary border border-secondary-200">
                    <Clock className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-stone-600">
                        {t('periods.closingNotice', { hotline: '' })}{' '}
                        <a
                            href="tel:781-923-1955"
                            className="font-bold text-primary underline underline-offset-2 hover:text-stone-900 transition-colors inline-flex items-center gap-1"
                        >
                            <Phone className="size-3 inline" />
                            781-923-1955
                        </a>
                    </p>
                </div>
            </div>

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
                                            className="relative flex h-13 sm:h-14 cursor-not-allowed items-center justify-center rounded-2xl border-2 border-stone-200 bg-stone-50/60 px-3 font-sans text-stone-400 opacity-55 select-none overflow-hidden"
                                        >
                                            {/* Diagonal Closed Ribbon */}
                                            <div className="pointer-events-none absolute top-0 right-0 h-10 w-10 overflow-hidden">
                                                <div className="absolute -right-3.5 top-1.5 w-13 rotate-45 bg-rose-600/90 py-0.5 text-center text-[6.5px] font-bold uppercase tracking-wider text-white shadow-2xs">
                                                    {t('periods.closed')}
                                                </div>
                                            </div>
                                            <span className="text-sm sm:text-base font-bold leading-none">
                                                {slot.time}
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
                                            className="relative flex h-13 sm:h-14 cursor-not-allowed items-center justify-center rounded-2xl border-2 border-stone-200 bg-stone-50/60 px-3 font-sans text-stone-400 opacity-55 select-none overflow-hidden"
                                        >
                                            {/* Diagonal Booked/Unavailable Ribbon */}
                                            <div className="pointer-events-none absolute top-0 right-0 h-10 w-10 overflow-hidden">
                                                <div className="absolute -right-3.5 top-1.5 w-13 rotate-45 bg-stone-300/90 py-0.5 text-center text-[6.5px] font-semibold uppercase tracking-wider text-stone-700 shadow-2xs">
                                                    {label}
                                                </div>
                                            </div>
                                            <span className="text-sm sm:text-base font-bold leading-none">
                                                {slot.time}
                                            </span>
                                        </div>
                                    );
                                }

                                const isSelected = time === slot.time;
                                const isOpenSlot = slot.time === firstOpenSlotTime;

                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => setTime(slot.time)}
                                        className={cn(
                                            'group relative flex h-13 sm:h-14 cursor-pointer items-center justify-center rounded-2xl border-2 px-3 font-sans transition-all duration-200 overflow-hidden hover:shadow-md hover:scale-102 active:scale-98',
                                            isSelected
                                                ? 'border-primary bg-primary text-neutral shadow-md scale-102'
                                                : 'border-stone-300 bg-white/70 text-primary hover:border-secondary-400 hover:bg-white/90',
                                        )}
                                    >
                                        {/* Diagonal Ribbon: Selected or Open */}
                                        {isSelected ? (
                                            <div className="pointer-events-none absolute top-0 right-0 h-10 w-10 overflow-hidden">
                                                <div className="absolute -right-3.5 top-1.5 w-13 rotate-45 bg-white/25 py-0.5 text-center text-[7.5px] font-black uppercase tracking-wider text-neutral shadow-2xs">
                                                    ✓
                                                </div>
                                            </div>
                                        ) : isOpenSlot ? (
                                            <div className="pointer-events-none absolute top-0 right-0 h-10 w-10 overflow-hidden">
                                                <div className="absolute -right-3.5 top-1.5 w-13 rotate-45 bg-emerald-600 py-0.5 text-center text-[7.5px] font-black uppercase tracking-wider text-white shadow-2xs">
                                                    {t('periods.open')}
                                                </div>
                                            </div>
                                        ) : null}

                                        <span className="text-sm sm:text-base font-bold leading-none">
                                            {slot.time}
                                        </span>
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
