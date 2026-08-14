'use client';

import { useState } from 'react';
import {
    Check,
    ChevronDown,
    Clock,
    Loader2,
    Sparkles,
    Flower2,
    Gem,
    Star,
    Feather,
    Smile,
} from 'lucide-react';
import { useSalonServices } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { formatUsd } from '@utils/format.util';
import { SERVICE_CATEGORIES } from '@/mocks/salon/data';
import { cn } from '@utils/cn.util';

/** Icon + gradient colour per category (warm neutrals for quiet luxury) */
const CAT_META: Record<string, { icon: React.ElementType; gradient: string; accent: string }> = {
    'manicure-pedicure': {
        icon: Sparkles,
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    'gel-polish': {
        icon: Star,
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    'nail-enhancements': {
        icon: Gem,
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    'add-ons': {
        icon: Feather,
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    waxing: {
        icon: Flower2,
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
    facials: {
        icon: Smile,
        gradient: 'from-secondary-50 to-tertiary-100/50',
        accent: 'text-primary/75',
    },
};

export function ServiceStep() {
    const t = useBookingTranslations();
    const { serviceIds, toggleServiceId } = useBookingStore();
    const { data: services, isLoading } = useSalonServices();

    const [openCats, setOpenCats] = useState<Record<string, boolean>>(
        Object.fromEntries(SERVICE_CATEGORIES.map((c) => [c.id, true])),
    );

    const grouped = SERVICE_CATEGORIES.map((cat) => ({
        ...cat,
        label: t(cat.labelKey),
        items: (services ?? []).filter((s) => s.categoryId === cat.id),
        meta: CAT_META[cat.id] ?? {
            icon: Sparkles,
            gradient: 'from-neutral-50 to-stone-50',
            accent: 'text-stone-400',
        },
    })).filter((g) => g.items.length > 0);

    function toggleCat(id: string) {
        setOpenCats((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 py-12 font-sans text-base text-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading services…</span>
            </div>
        );
    }

    const totalSelected = serviceIds.length;

    return (
        <div className="space-y-4">
            {/* Intro */}
            <p className="font-sans text-[17px] text-stone-700 font-medium leading-relaxed">
                Choose one or more services — we will tailor your appointment to your complete
                selection.
            </p>

            {/* Selection indicator */}
            {totalSelected > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 font-sans text-base font-medium text-primary">
                    <Check className="h-4 w-4" />
                    {totalSelected} service{totalSelected > 1 ? 's' : ''} selected
                </div>
            )}

            {/* Category accordion sections */}
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
                        {/* Category header — gradient + icon */}
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
                                {/* Category icon */}
                                <span
                                    className={cn(
                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm',
                                        accent,
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </span>
                                {/* Serif display label */}
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

                        {/* Collapsible service list */}
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
                                                    {/* Large accessible checkbox */}
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

                                                    {/* Content */}
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
                                                            {/* Price — large and display serif */}
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
                                                                min: svc.durationMin,
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
