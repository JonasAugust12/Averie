'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Info, Star } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { FadeIn, LandingBubbles } from '@components/landing';
import {
    landingBody,
    landingBleedWhite,
    landingEyebrow,
    landingInteractive,
    landingStaticText,
    landingTitle,
} from '@components/landing/styles';
import type { ServiceCategoryWithServicesDto } from '@services/service-catalog.service';
import { formatUsd } from '@utils/format.util';
import { resolveLucideIconWithFallback } from '@utils/lucide-icon.util';
import { cn } from '@utils/cn.util';

type FilterGroup = 'all' | 'hands-feet' | 'gel-dip' | 'enhancements' | 'skincare' | 'addons';

function getFilterGroup(slug: string): FilterGroup {
    switch (slug) {
        case 'signature':
        case 'dessert':
        case 'me-time':
        case 'gentlemen':
        case 'little-diva':
            return 'hands-feet';
        case 'gel-polish':
        case 'dip':
            return 'gel-dip';
        case 'acrylic':
        case 'builder':
            return 'enhancements';
        case 'waxing':
        case 'facials':
            return 'skincare';
        case 'add-ons':
            return 'addons';
        default:
            return 'all';
    }
}

interface LandingPriceListProps {
    categories: ServiceCategoryWithServicesDto[];
}

export function LandingPriceList({ categories }: LandingPriceListProps) {
    const t = useSalonTranslations();
    const [activeFilter, setActiveFilter] = useState<FilterGroup>('all');

    const filterGroupsCount = useMemo(() => {
        return categories.reduce(
            (acc, category) => {
                const group = getFilterGroup(category.slug);
                acc[group] = (acc[group] || 0) + 1;
                return acc;
            },
            {} as Record<FilterGroup, number>,
        );
    }, [categories]);

    const filters: { id: FilterGroup; label: string; count: number }[] = [
        { id: 'all', label: t('landing.priceList.filters.all'), count: categories.length },
        {
            id: 'hands-feet',
            label: t('landing.priceList.filters.handsFeet'),
            count: filterGroupsCount['hands-feet'] || 0,
        },
        {
            id: 'gel-dip',
            label: t('landing.priceList.filters.gelDip'),
            count: filterGroupsCount['gel-dip'] || 0,
        },
        {
            id: 'enhancements',
            label: t('landing.priceList.filters.enhancements'),
            count: filterGroupsCount.enhancements || 0,
        },
        {
            id: 'skincare',
            label: t('landing.priceList.filters.skincare'),
            count: filterGroupsCount.skincare || 0,
        },
        {
            id: 'addons',
            label: t('landing.priceList.filters.addons'),
            count: filterGroupsCount.addons || 0,
        },
    ];

    const visibleCategories = useMemo(() => {
        if (activeFilter === 'all') return categories;
        return categories.filter((category) => getFilterGroup(category.slug) === activeFilter);
    }, [categories, activeFilter]);

    return (
        <section
            id="pricing"
            className={cn('relative isolate py-14 sm:py-20 md:py-28', landingBleedWhite)}
            aria-labelledby="pricing-title"
        >
            <LandingBubbles variant="services" />

            <FadeIn className="relative z-10 mb-8 text-center sm:mb-10 md:mb-14">
                <div className={landingEyebrow}>
                    <Star className="size-3.5 text-nude" aria-hidden="true" />
                    <span>{t('landing.priceList.eyebrow')}</span>
                </div>
                <h2 id="pricing-title" className={`mt-3.5 ${landingTitle}`}>
                    {t('landing.priceList.title')}
                </h2>
                <p className={`mx-auto mt-3.5 max-w-xl ${landingBody}`}>
                    {t('landing.priceList.subtitle')}
                </p>
            </FadeIn>

            <FadeIn delay={0.1} className="relative z-10 mb-8 sm:mb-10">
                <nav
                    aria-label={t('landing.priceList.filterAria')}
                    className="-mx-4 flex overflow-x-auto px-4 py-1.5 scrollbar-none snap-x sm:mx-0 sm:justify-center sm:px-0"
                >
                    <ul
                        className="flex shrink-0 items-center gap-2 sm:flex-wrap sm:justify-center"
                        role="tablist"
                    >
                        {filters.map((filter) => {
                            const isActive = activeFilter === filter.id;
                            return (
                                <li key={filter.id} role="presentation" className="snap-start">
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={cn(
                                            'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none active:scale-95 touch-manipulation',
                                            isActive
                                                ? 'bg-primary text-cream border-primary shadow-xs'
                                                : 'bg-white/80 text-secondary-700 border-stone-200/80 hover:border-nude/40 hover:bg-stone-50/90 hover:text-secondary-900',
                                        )}
                                    >
                                        <span>{filter.label}</span>
                                        <span
                                            className={cn(
                                                'inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                                                isActive
                                                    ? 'bg-white/20 text-cream'
                                                    : 'bg-stone-100 text-muted',
                                            )}
                                        >
                                            {filter.count}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </FadeIn>

            <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3 transition-all duration-300">
                {visibleCategories.map((category, index) => {
                    const Icon = resolveLucideIconWithFallback(category.icon);
                    const isFeatured = category.featured;

                    return (
                        <FadeIn key={category.id} delay={0.05 * (index % 6)} className="h-full">
                            <article
                                className={cn(
                                    'relative flex h-full flex-col rounded-3xl border bg-white/95 p-5 shadow-[0_12px_32px_-8px_rgba(58,48,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(58,48,39,0.12)] hover:border-nude/40 lg:rounded-4xl lg:p-6 group',
                                    isFeatured
                                        ? 'border-nude/35 bg-linear-to-b from-white via-white to-secondary-50/30 shadow-[0_16px_36px_-8px_rgba(148,90,66,0.1)]'
                                        : 'border-stone-200/80',
                                )}
                            >
                                {isFeatured ? (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full border border-nude/30 bg-nude/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-nude uppercase backdrop-blur-xs">
                                        <Star
                                            className="size-3 text-nude animate-pulse"
                                            aria-hidden="true"
                                        />
                                        <span className={landingStaticText}>
                                            {t('landing.priceList.popular')}
                                        </span>
                                    </div>
                                ) : null}

                                <header className="mb-4 flex flex-col border-b border-stone-200/70 pb-4 pr-12">
                                    <div className="flex items-start gap-3.5">
                                        <div
                                            className={cn(
                                                'flex size-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 group-hover:bg-nude group-hover:text-cream group-hover:border-nude group-hover:shadow-md',
                                                isFeatured
                                                    ? 'border-nude/30 bg-nude/15 text-nude shadow-xs'
                                                    : 'border-stone-200/80 bg-stone-100/80 text-secondary-700',
                                            )}
                                            aria-hidden="true"
                                        >
                                            <Icon className="size-5" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <h3
                                                className={`font-display text-lg font-semibold leading-tight text-secondary-900 group-hover:text-nude transition-colors sm:text-xl ${landingStaticText}`}
                                            >
                                                {category.name}
                                            </h3>
                                            {category.subtitle ? (
                                                <p
                                                    className={`mt-1 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-muted ${landingStaticText}`}
                                                >
                                                    {category.subtitle}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    {category.description ? (
                                        <p
                                            className={`mt-3 font-sans text-xs leading-relaxed text-secondary-600/90 border-l-2 border-nude/40 pl-2.5 italic transition-all duration-300 group-hover:text-secondary-800 ${landingStaticText}`}
                                        >
                                            {category.description}
                                        </p>
                                    ) : null}
                                </header>

                                <ul className="flex flex-1 flex-col gap-2.5" role="list">
                                    {category.services.map((item) => (
                                        <li
                                            key={item.id}
                                            className="group/item flex flex-col rounded-xl px-2.5 py-2 -mx-2.5 transition-all duration-200 hover:bg-stone-100/80 hover:shadow-2xs"
                                        >
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span
                                                    className={`shrink font-sans text-sm leading-snug font-semibold text-third group-hover/item:text-secondary-900 transition-colors sm:text-[15px] ${landingStaticText}`}
                                                >
                                                    {item.name}
                                                </span>
                                                <span
                                                    className="min-w-3 flex-1 border-b border-dotted border-stone-300/70 group-hover/item:border-nude/50 transition-colors"
                                                    aria-hidden="true"
                                                />
                                                <span
                                                    className={`shrink-0 font-sans text-sm font-semibold tabular-nums text-nude bg-nude/8 px-2.5 py-0.5 rounded-lg border border-nude/12 group-hover/item:bg-nude group-hover/item:text-cream group-hover/item:border-nude transition-all duration-200 sm:text-[15px] ${landingStaticText}`}
                                                >
                                                    {item.price === 0
                                                        ? t('landing.priceList.free')
                                                        : formatUsd(item.price)}
                                                </span>
                                            </div>
                                            {item.description ? (
                                                <p
                                                    className={`mt-1 font-sans text-[11px] leading-normal text-muted transition-all duration-200 group-hover/item:text-secondary-700 ${landingStaticText}`}
                                                >
                                                    {item.description}
                                                </p>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>

                                {category.note ? (
                                    <footer className="mt-4 flex items-start gap-2 rounded-2xl border border-nude/20 bg-nude/5 p-3 text-xs leading-relaxed text-secondary-800 italic">
                                        <Info
                                            className="mt-0.5 size-3.5 shrink-0 text-nude"
                                            aria-hidden="true"
                                        />
                                        <span className={landingStaticText}>{category.note}</span>
                                    </footer>
                                ) : null}
                            </article>
                        </FadeIn>
                    );
                })}
            </div>

            <FadeIn delay={0.2} className="relative z-10 mt-12 sm:mt-16">
                <div className="luxury-frame overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-r from-cream via-white to-secondary-50/40 p-6 text-center shadow-[0_16px_36px_-8px_rgba(58,48,39,0.08)] sm:p-8 md:flex md:items-center md:justify-between md:text-left lg:rounded-4xl">
                    <div className="max-w-xl">
                        <span
                            className={`inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-nude ${landingStaticText}`}
                        >
                            <Calendar className="size-3.5 text-nude" aria-hidden="true" />
                            {t('landing.priceList.ctaEyebrow')}
                        </span>
                        <h3
                            className={`mt-1.5 font-display text-xl font-semibold text-secondary-900 sm:text-2xl ${landingStaticText}`}
                        >
                            {t('landing.priceList.ctaTitle')}
                        </h3>
                        <p
                            className={`mt-1 font-sans text-sm text-body leading-relaxed ${landingStaticText}`}
                        >
                            {t('landing.priceList.ctaBody')}
                        </p>
                    </div>
                    <div className="mt-6 shrink-0 md:mt-0">
                        <Link
                            href="/book"
                            className={`inline-flex items-center justify-center gap-2.5 rounded-full border border-third bg-third px-7 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-cream shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-primary-800 hover:shadow-lg active:scale-95 ${landingInteractive}`}
                        >
                            <span>{t('landing.priceList.ctaButton')}</span>
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}
