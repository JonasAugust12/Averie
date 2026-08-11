'use client';

import { useMemo } from 'react';
import { Loader2, Moon, Sun, Sunset } from 'lucide-react';
import { useSalonSlots } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';

function hourOf(time: string): number {
    const [h] = time.split(':').map(Number);
    return h ?? 0;
}

export function TimeStep() {
    const t = useBookingTranslations();
    const { time, setTime, setStep } = useBookingStore();
    const { data: slots, isLoading } = useSalonSlots();

    const periods = useMemo(() => {
        const available = (slots ?? []).filter((s) => s.available);
        return [
            {
                key: 'morning' as const,
                icon: Sun,
                items: available.filter((s) => hourOf(s.time) < 12),
            },
            {
                key: 'afternoon' as const,
                icon: Sunset,
                items: available.filter((s) => {
                    const h = hourOf(s.time);
                    return h >= 12 && h < 17;
                }),
            },
            {
                key: 'evening' as const,
                icon: Moon,
                items: available.filter((s) => hourOf(s.time) >= 17),
            },
        ];
    }, [slots]);

    if (isLoading) {
        return (
            <p className="flex items-center gap-2 font-sans text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
            </p>
        );
    }

    return (
        <div className="space-y-8">
            {periods.map(({ key, icon: Icon, items }) => (
                <section key={key}>
                    <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-primary">
                        <Icon className="h-4 w-4 text-muted" aria-hidden />
                        {t(`periods.${key}`)}
                    </h2>
                    {items.length === 0 ? (
                        <p className="font-sans text-sm text-muted italic">{t('periods.empty')}</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                            {items.map((slot) => {
                                const selected = time === slot.time;
                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => setTime(slot.time)}
                                        className={cn(
                                            'cursor-pointer rounded-sm border px-3 py-3 font-sans text-sm transition-colors',
                                            selected
                                                ? 'border-primary bg-primary text-neutral'
                                                : 'border-border/70 bg-neutral text-primary hover:border-secondary-400',
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
                    className="tracking-widest uppercase"
                    onClick={() => setStep(3)}
                >
                    {t('back')}
                </Button>
                <Button
                    className="tracking-widest uppercase"
                    disabled={!time}
                    onClick={() => setStep(5)}
                >
                    {t('continue')}
                </Button>
            </div>
        </div>
    );
}
