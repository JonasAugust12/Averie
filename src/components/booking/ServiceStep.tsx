'use client';

import { useState } from 'react';
import { Check, ChevronDown, Clock, Sparkles } from 'lucide-react';
import { useServiceCategories, useServices } from '@services/service-catalog.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { ServicesGridSkeleton } from '@components/skeletons';
import { formatUsd } from '@utils/format.util';
import { cn } from '@utils/cn.util';
import { resolveLucideIcon } from '@utils/lucide-icon.util';

/** Gradient colour per category (warm neutrals for quiet luxury) */
const CAT_META: Record<string, { gradient: string; accent: string }> = {
    'manicure-pedicure': {
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    'gel-polish': {
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    'nail-enhancements': {
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    'add-ons': {
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    waxing: {
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    facials: {
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
};

export function ServiceStep() {
    const t = useBookingTranslations();
    const { serviceIds, toggleServiceId } = useBookingStore();
    const { data: services, isLoading: servicesLoading } = useServices();
    const { data: categories, isLoading: categoriesLoading } = useServiceCategories();

    const [openCats, setOpenCats] = useState<Record<string, boolean>>({});

    const isLoading = servicesLoading || categoriesLoading;

    const grouped = (categories ?? [])
        .map((cat) => {
            const meta = CAT_META[cat.id] ?? {
                gradient: 'from-neutral-50 to-stone-50',
                accent: 'text-stone-400',
            };
            return {
                ...cat,
                label: cat.name,
                items: (services ?? []).filter((s) => s.categoryId === cat.id),
                meta: {
                    ...meta,
                    icon: resolveLucideIcon(cat.icon) ?? Sparkles,
                },
            };
        })
        .filter((g) => g.items.length > 0);

    function toggleCat(id: string) {
        setOpenCats((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    if (isLoading) {
        return <ServicesGridSkeleton />;
    }

    const totalSelected = serviceIds.length;

    return (
        <div className="space-y-4">
            <p className="font-sans text-[17px] text-stone-700 font-medium leading-relaxed">
                Choose one or more services — we will tailor your appointment to your complete
                selection.
            </p>

            {totalSelected > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 font-sans text-base font-medium text-primary">
                    <Check className="h-4 w-4" />
                    {totalSelected} service{totalSelected > 1 ? 's' : ''} selected
                </div>
            )}

            {grouped.map((group, gi) => {
                const isOpen = openCats[group.id] !== false;
                const catSelectedCount = group.items.filter((s) =>
                    serviceIds.includes(s.id),
                ).length;
                const { icon: Icon, gradient, accent } = group.meta;

                return (
                    <section
                        key={group.id}
                        style={{ animationDelay: `${gi * 60}ms` }}
                        className="animate-fade-in-up overflow-hidden rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm shadow-md shadow-black/5"
                    >
                        <button
                            type="button"
                            onClick={() => toggleCat(group.id)}
                            className={cn(
                                'flex w-full cursor-pointer items-center justify-between bg-linear-to-r px-5 py-5 text-left transition-opacity hover:opacity-90',
                                gradient,
                            )}
                            aria-expanded={isOpen}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm',
                                        accent,
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div>
                                    <h2 className="font-display text-2xl font-semibold text-primary leading-none">
                                        {group.label}
                                    </h2>
                                    <p className="mt-1 font-sans text-sm font-medium text-stone-600">
                                        {group.items.length} service
                                        {group.items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                {catSelectedCount > 0 && (
                                    <span className="rounded-full bg-primary px-3.5 py-1.5 font-sans text-sm font-bold text-neutral shadow-sm">
                                        {catSelectedCount} selected
                                    </span>
                                )}
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-5 w-5 text-muted transition-transform duration-300',
                                    isOpen ? 'rotate-180' : 'rotate-0',
                                )}
                            />
                        </button>

                        <div
                            className={cn(
                                'overflow-hidden transition-all duration-400 ease-in-out',
                                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
                            )}
                        >
                            <ul className="divide-y divide-border/30 border-t border-border/30">
                                {group.items.map((svc) => {
                                    const selected = serviceIds.includes(svc.id);
                                    return (
                                        <li key={svc.id}>
                                            <button
                                                type="button"
                                                onClick={() => toggleServiceId(svc.id)}
                                                className={cn(
                                                    'group w-full cursor-pointer px-5 py-5 text-left transition-all border-l-4',
                                                    selected
                                                        ? 'bg-primary/10 border-primary shadow-sm'
                                                        : 'border-transparent hover:bg-tertiary/20',
                                                )}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={cn(
                                                            'mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300',
                                                            selected
                                                                ? 'border-primary bg-primary text-neutral'
                                                                : 'border-stone-400 bg-white group-hover:border-secondary-500 shadow-sm',
                                                        )}
                                                    >
                                                        {selected && (
                                                            <Check
                                                                className="h-4.5 w-4.5"
                                                                strokeWidth={3.5}
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <p
                                                                className={cn(
                                                                    'font-display text-xl font-bold leading-snug transition-colors',
                                                                    selected
                                                                        ? 'text-primary'
                                                                        : 'text-primary/95 group-hover:text-primary',
                                                                )}
                                                            >
                                                                {svc.name}
                                                            </p>
                                                            <div className="shrink-0 text-right">
                                                                <p className="font-display text-2xl font-bold text-primary leading-none">
                                                                    {formatUsd(svc.price)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="mt-2 font-sans text-[15px] text-stone-700/90 leading-relaxed font-normal">
                                                            {svc.description}
                                                        </p>
                                                        <div className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-secondary-100/60 px-3.5 py-1.5 font-sans text-sm font-semibold text-primary/80 border border-primary/5">
                                                            <Clock className="h-4 w-4 text-primary/75" />
                                                            {t('duration', {
                                                                min: svc.estimatedMinutes,
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
