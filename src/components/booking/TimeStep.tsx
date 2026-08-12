'use client';

import { useMemo } from 'react';
import { Loader2, Moon, Sun, Sunset } from 'lucide-react';
import { useAvailableSlots } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { getPeriodForTime } from '@utils/schedule.util';
import { cn } from '@utils/cn.util';

export function TimeStep() {
    const t = useBookingTranslations();
    const { date, time, setTime, setStep } = useBookingStore();
    const { data: slots, isLoading } = useAvailableSlots(date);

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
                    <h2 className="mb-4 flex items-center gap-2.5 font-display text-lg text-primary tracking-wide">
                        <Icon className="h-4 w-4 text-muted" aria-hidden />
                        {t(`periods.${key}`)}
                    </h2>
                    {periodItems.length === 0 ? (
                        <p className="font-sans text-sm text-muted italic">{t('periods.empty')}</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {periodItems.map((slot) => {
                                const selected = time === slot.time;
                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => setTime(slot.time)}
                                        className={cn(
                                            'cursor-pointer rounded-xl border px-4 py-4 font-sans text-base font-medium transition-all duration-250 hover:shadow-sm',
                                            selected
                                                ? 'border-primary bg-primary text-neutral shadow-sm'
                                                : 'border-border/70 bg-white/70 text-primary hover:border-secondary-400 hover:bg-white/90',
                                        )}
                                    >
                                        {slot.time}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
                <Button
                    variant="outlined"
                    className="rounded-full py-3 px-8 text-base tracking-widest uppercase"
                    onClick={() => setStep(3)}
                >
                    {t('back')}
                </Button>
                <Button
                    className="rounded-full py-3 px-10 text-base tracking-widest uppercase shadow-sm"
                    disabled={!time}
                    onClick={() => setStep(5)}
                >
                    {t('continue')}
                </Button>
            </div>
        </div>
    );
}
