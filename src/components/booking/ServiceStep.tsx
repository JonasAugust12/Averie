'use client';

import { Check, Clock, Loader2 } from 'lucide-react';
import { useSalonServices } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { formatUsd } from '@utils/format.util';
import { SERVICE_CATEGORIES } from '@/mocks/salon/data';
import { cn } from '@utils/cn.util';

export function ServiceStep() {
    const t = useBookingTranslations();
    const { serviceId, setServiceId, setStep } = useBookingStore();
    const { data: services, isLoading } = useSalonServices();

    const grouped = SERVICE_CATEGORIES.map((cat) => ({
        ...cat,
        label: t(cat.labelKey),
        items: (services ?? []).filter((s) => s.categoryId === cat.id),
    })).filter((g) => g.items.length > 0);

    if (isLoading) {
        return (
            <p className="flex items-center gap-2 font-sans text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
            </p>
        );
    }

    return (
        <div className="space-y-10">
            {grouped.map((group) => (
                <section key={group.id}>
                    <h2 className="mb-4 font-display text-xl text-primary">{group.label}</h2>
                    <ul className="space-y-3">
                        {group.items.map((svc) => {
                            const selected = serviceId === svc.id;
                            return (
                                <li key={svc.id}>
                                    <button
                                        type="button"
                                        onClick={() => setServiceId(svc.id)}
                                        className={cn(
                                            'group w-full cursor-pointer rounded-lg border p-5 text-left transition-colors md:p-6',
                                            selected
                                                ? 'border-primary bg-tertiary/60'
                                                : 'border-border/70 bg-neutral hover:border-secondary-400',
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-sans text-base text-primary transition-colors group-hover:text-secondary-700">
                                                        {svc.name}
                                                    </p>
                                                    {selected ? (
                                                        <Check
                                                            className="h-4 w-4 shrink-0 text-primary"
                                                            aria-hidden
                                                        />
                                                    ) : null}
                                                </div>
                                                <p className="mt-1 font-sans text-sm text-muted">
                                                    {svc.description}
                                                </p>
                                                <p className="mt-3 flex items-center gap-1.5 font-sans text-xs tracking-wide text-muted uppercase">
                                                    <Clock className="h-3.5 w-3.5" aria-hidden />
                                                    {t('duration', { min: svc.durationMin })}
                                                </p>
                                            </div>
                                            <p className="shrink-0 font-display text-lg text-primary">
                                                {formatUsd(svc.price)}
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}

            <div className="sticky bottom-0 -mx-4 border-t border-border/50 bg-background/95 px-4 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                <Button
                    className="w-full rounded-sm tracking-widest uppercase sm:w-auto"
                    disabled={!serviceId}
                    onClick={() => setStep(2)}
                >
                    {t('cta.toEmployee')}
                </Button>
            </div>
        </div>
    );
}
