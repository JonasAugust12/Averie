'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, Clock, Gem, Search, Sparkles, X } from 'lucide-react';
import { useServiceCategories, useServices } from '@services/service-catalog.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { ServiceStepSkeleton } from '@components/skeletons';
import { formatUsd } from '@utils/format.util';
import { cn } from '@utils/cn.util';
import { resolveLucideIconWithFallback } from '@utils/lucide-icon.util';

const DEFAULT_CAT_STYLE = {
    gradient: 'from-secondary-50 to-tertiary-100/50',
    accent: 'text-primary/75',
};

export function ServiceStep() {
    const t = useBookingTranslations();
    const { serviceIds, toggleServiceId } = useBookingStore();
    const { data: services, isLoading: servicesLoading } = useServices();
    const { data: categories, isLoading: categoriesLoading } = useServiceCategories();

    const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

    const isLoading = servicesLoading || categoriesLoading;

    // Selected services calculation
    const selectedServices = useMemo(() => {
        return (services ?? []).filter((s) => serviceIds.includes(s.id));
    }, [services, serviceIds]);

    const totalSelected = selectedServices.length;
    const totalPrice = useMemo(() => {
        return selectedServices.reduce((sum, s) => sum + (s.price ?? 0), 0);
    }, [selectedServices]);
    const totalMinutes = useMemo(() => {
        return selectedServices.reduce((sum, s) => sum + (s.estimatedMinutes ?? 0), 0);
    }, [selectedServices]);

    // Grouping & filtering
    const grouped = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return (categories ?? [])
            .map((cat) => {
                let items = (services ?? []).filter((s) => s.categoryId === cat.id);

                if (query) {
                    items = items.filter(
                        (s) =>
                            s.name.toLowerCase().includes(query) ||
                            (s.description && s.description.toLowerCase().includes(query)),
                    );
                }

                return {
                    ...cat,
                    label: cat.name,
                    items,
                    meta: {
                        ...DEFAULT_CAT_STYLE,
                        icon: resolveLucideIconWithFallback(cat.icon, Sparkles),
                    },
                };
            })
            .filter((g) => {
                if (activeCategoryFilter !== 'all' && g.id !== activeCategoryFilter) {
                    return false;
                }
                return g.items.length > 0;
            });
    }, [categories, services, searchQuery, activeCategoryFilter]);

    function toggleCat(id: string) {
        setOpenCats((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    if (isLoading) {
        return <ServiceStepSkeleton />;
    }

    const isSearching = searchQuery.trim().length > 0;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Step Header & Reassurance */}
            <div className="rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-linear-to-br from-white/90 via-stone-50/70 to-stone-100/60 p-4 sm:p-6 md:p-7 shadow-xs backdrop-blur-sm relative overflow-hidden">
                {/* Ambient glow accent */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-primary01/10 blur-2xl" />

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50/80 px-3 py-1 font-sans text-xs font-semibold text-emerald-800 shadow-2xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>{t('step1Notice')}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <span className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-stone-900 text-white shadow-2xs">
                                <Gem className="size-3 sm:size-3.5 text-rose-300" />
                            </span>
                            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
                                {t('serviceStep.heading') || 'Select Services'}
                            </h2>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-normal max-w-xl">
                            {t('serviceStep.subtitle') ||
                                'Choose one or more tailored services — we will curate your appointment to your complete selection.'}
                        </p>
                    </div>

                    {/* Selected Summary Pill for Desktop/Tablet */}
                    {totalSelected > 0 ? (
                        <div className="hidden sm:inline-flex shrink-0 items-center gap-3 rounded-2xl border border-stone-900/15 bg-stone-900 px-4 py-2 text-white shadow-md transition-all">
                            <div className="flex size-6.5 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-xs shadow-xs">
                                <Check className="size-3.5 stroke-3" />
                            </div>
                            <div className="text-left font-sans">
                                <p className="text-xs font-semibold text-stone-100">
                                    {t('serviceStep.selectedCount', { count: totalSelected }) ||
                                        `${totalSelected} service${totalSelected > 1 ? 's' : ''} selected`}
                                </p>
                                <p className="text-[11px] text-stone-300 font-medium">
                                    {formatUsd(totalPrice)} • {totalMinutes} min
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Search Bar & Category Chips */}
                <div className="mt-3.5 sm:mt-5 space-y-2.5 pt-3 border-t border-stone-200/60">
                    {/* Search Input */}
                    <div className="relative flex items-center">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={
                                t('serviceStep.searchPlaceholder') ||
                                'Search services by name or description…'
                            }
                            className="w-full rounded-xl border border-stone-200/90 bg-white pl-9 pr-9 py-2 sm:py-2.5 font-sans text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800 shadow-2xs transition-all"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="size-3.5" />
                            </button>
                        ) : null}
                    </div>

                    {/* Category Filter Chips */}
                    {(categories ?? []).length > 1 && !isSearching && (
                        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar scroll-smooth -mx-1 px-1">
                            <button
                                type="button"
                                onClick={() => setActiveCategoryFilter('all')}
                                className={cn(
                                    'shrink-0 rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 font-sans text-[11px] sm:text-xs font-semibold transition-all',
                                    activeCategoryFilter === 'all'
                                        ? 'bg-stone-900 text-white shadow-xs'
                                        : 'border border-stone-200/80 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50',
                                )}
                            >
                                {t('serviceStep.allCategories') || 'All Categories'}
                            </button>
                            {(categories ?? []).map((cat) => {
                                const isFilterActive = activeCategoryFilter === cat.id;
                                const catSelectedCount = (services ?? []).filter(
                                    (s) => s.categoryId === cat.id && serviceIds.includes(s.id),
                                ).length;

                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveCategoryFilter(cat.id)}
                                        className={cn(
                                            'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 font-sans text-[11px] sm:text-xs font-semibold transition-all',
                                            isFilterActive
                                                ? 'bg-stone-900 text-white shadow-xs'
                                                : 'border border-stone-200/80 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50',
                                        )}
                                    >
                                        <span>{cat.name}</span>
                                        {catSelectedCount > 0 && (
                                            <span
                                                className={cn(
                                                    'flex size-3.5 sm:size-4 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold',
                                                    isFilterActive
                                                        ? 'bg-rose-500 text-white'
                                                        : 'bg-stone-900 text-white',
                                                )}
                                            >
                                                {catSelectedCount}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State when search returns nothing */}
            {grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-stone-200 bg-white/80 p-8 sm:p-10 text-center shadow-xs">
                    <div className="flex size-11 sm:size-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                        <Search className="size-5 sm:size-6" />
                    </div>
                    <p className="mt-3 font-display text-base sm:text-lg font-bold text-stone-800">
                        {t('serviceStep.noSearchResults', { query: searchQuery }) ||
                            `No services found matching "${searchQuery}"`}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery('');
                            setActiveCategoryFilter('all');
                        }}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-50 px-3.5 py-1.5 font-sans text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                        <X className="size-3.5" />
                        {t('serviceStep.clearSearch') || 'Clear search'}
                    </button>
                </div>
            ) : null}

            {/* Grouped Service Categories */}
            {grouped.map((group, gi) => {
                const isOpen = isSearching || openCats[group.id] !== false;
                const catSelectedCount = group.items.filter((s) =>
                    serviceIds.includes(s.id),
                ).length;
                const { icon: Icon, gradient, accent } = group.meta;

                return (
                    <section
                        key={group.id}
                        style={{ animationDelay: `${gi * 50}ms` }}
                        className="animate-fade-in-up overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300"
                    >
                        {/* Category Header Bar */}
                        <button
                            type="button"
                            onClick={() => toggleCat(group.id)}
                            className={cn(
                                'flex w-full cursor-pointer items-center justify-between bg-linear-to-r px-4 sm:px-6 py-3.5 sm:py-4.5 text-left transition-opacity hover:opacity-95',
                                gradient,
                            )}
                            aria-expanded={isOpen}
                        >
                            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                                <span
                                    className={cn(
                                        'flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white/90 border border-stone-200/60 shadow-xs',
                                        accent,
                                    )}
                                >
                                    <Icon className="size-4.5 sm:size-5" />
                                </span>
                                <div className="min-w-0">
                                    <h3 className="font-display text-lg sm:text-2xl font-bold text-stone-900 leading-tight truncate">
                                        {group.label}
                                    </h3>
                                    <p className="mt-0.5 font-sans text-[11px] sm:text-xs font-medium text-stone-500">
                                        {t('serviceStep.categoryServicesCount', {
                                            count: group.items.length,
                                        }) ||
                                            `${group.items.length} service${group.items.length !== 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                                {catSelectedCount > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-900 px-2.5 py-0.5 sm:px-3.5 sm:py-1 font-sans text-[11px] sm:text-xs font-bold text-white shadow-xs">
                                        <Check className="size-2.5 sm:size-3 text-rose-300 stroke-3" />
                                        {t('serviceStep.categorySelectedCount', {
                                            count: catSelectedCount,
                                        }) || `${catSelectedCount} selected`}
                                    </span>
                                )}
                                <div className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/80 border border-stone-200/60 text-stone-600 shadow-2xs">
                                    <ChevronDown
                                        className={cn(
                                            'size-3.5 sm:size-4 transition-transform duration-300',
                                            isOpen ? 'rotate-180' : 'rotate-0',
                                        )}
                                    />
                                </div>
                            </div>
                        </button>

                        {/* Service Items Accordion Body */}
                        <div
                            className={cn(
                                'overflow-hidden transition-all duration-300 ease-in-out',
                                isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0',
                            )}
                        >
                            <ul className="divide-y divide-stone-100 border-t border-stone-200/80">
                                {group.items.map((svc) => {
                                    const selected = serviceIds.includes(svc.id);
                                    return (
                                        <li key={svc.id}>
                                            <button
                                                type="button"
                                                onClick={() => toggleServiceId(svc.id)}
                                                className={cn(
                                                    'group w-full cursor-pointer px-4 sm:px-6 py-4 sm:py-5 text-left transition-all relative',
                                                    selected
                                                        ? 'bg-rose-50/25 border-l-4 border-stone-900'
                                                        : 'border-l-4 border-transparent hover:bg-stone-50/70',
                                                )}
                                            >
                                                <div className="flex items-start gap-3.5 sm:gap-5">
                                                    {/* Luxury Custom Checkbox */}
                                                    <div
                                                        className={cn(
                                                            'mt-0.5 flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-md sm:rounded-lg border-2 transition-all duration-300',
                                                            selected
                                                                ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                                                                : 'border-stone-300 bg-white group-hover:border-stone-500 shadow-2xs',
                                                        )}
                                                    >
                                                        {selected && (
                                                            <Check className="size-3.5 sm:size-4 stroke-3" />
                                                        )}
                                                    </div>

                                                    {/* Service Info */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <h4
                                                                    className={cn(
                                                                        'font-display text-base sm:text-xl font-bold leading-snug transition-colors',
                                                                        selected
                                                                            ? 'text-stone-950'
                                                                            : 'text-stone-900 group-hover:text-stone-950',
                                                                    )}
                                                                >
                                                                    {svc.name}
                                                                </h4>
                                                            </div>
                                                            <div className="shrink-0 text-right">
                                                                <p className="font-display text-lg sm:text-2xl font-bold text-stone-900 leading-none">
                                                                    {formatUsd(svc.price)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {svc.description ? (
                                                            <p className="mt-1 font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                                                {svc.description}
                                                            </p>
                                                        ) : null}

                                                        <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                            <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-stone-100/90 px-2.5 py-0.5 sm:px-3 sm:py-1 font-sans text-[11px] sm:text-xs font-semibold text-stone-700 shadow-2xs">
                                                                <Clock className="size-3 text-stone-500" />
                                                                <span>
                                                                    {t('duration', {
                                                                        min: svc.estimatedMinutes,
                                                                    })}
                                                                </span>
                                                            </div>

                                                            {selected ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/80 bg-rose-50 px-2 py-0.5 font-sans text-[10px] sm:text-[11px] font-bold text-rose-700 shadow-2xs">
                                                                    <Sparkles className="size-2.5 sm:size-3 text-rose-600" />
                                                                    {t('serviceStep.selectedTag') ||
                                                                        'Selected'}
                                                                </span>
                                                            ) : null}
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
