'use client';

import { CalendarDays, Search, X } from 'lucide-react';
import { Input } from '@components/ui';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import type { BookingDisplayStatus } from '@typings/salon-common.type';

interface BookingStats {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
}

interface BookingFiltersProps {
    query: string;
    onQueryChange: (v: string) => void;
    dateFilter: string;
    onDateChange: (v: string) => void;
    statusFilter: 'all' | BookingDisplayStatus;
    onStatusChange: (v: 'all' | BookingDisplayStatus) => void;
    stats: BookingStats;
    onFilterChange?: () => void; // called on any change (to reset page)
}

export function BookingFilters({
    query,
    onQueryChange,
    dateFilter,
    onDateChange,
    statusFilter,
    onStatusChange,
    stats,
    onFilterChange,
}: BookingFiltersProps) {
    const t = useAdminTranslations();

    const statusTabs: { key: 'all' | BookingDisplayStatus; count: number }[] = [
        { key: 'all', count: stats.total },
        { key: 'upcoming', count: stats.upcoming },
        { key: 'completed', count: stats.completed },
        { key: 'cancelled', count: stats.cancelled },
    ];

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-stone-200/80 bg-white/90 p-4 sm:p-5 shadow-2xs backdrop-blur-xs">
            {/* Left: search + date */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center flex-1 max-w-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Input
                        placeholder={t('bookings.search')}
                        value={query}
                        onChange={(e) => {
                            onQueryChange(e.target.value);
                            onFilterChange?.();
                        }}
                        className="pl-10 h-10 bg-stone-50/80 text-stone-900 border-stone-200/90 rounded-xl placeholder:text-stone-400 focus:bg-white text-xs sm:text-sm font-medium shadow-3xs"
                    />
                </div>

                <div className="flex items-center gap-2 h-10 bg-stone-50/80 border border-stone-200/90 rounded-xl px-3 shadow-3xs">
                    <CalendarDays className="h-4 w-4 text-stone-400 shrink-0" />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => {
                            onDateChange(e.target.value);
                            onFilterChange?.();
                        }}
                        placeholder={t('bookings.dateFilterPlaceholder')}
                        className="bg-transparent border-0 font-sans text-xs font-semibold text-stone-800 focus:ring-0 focus:outline-none cursor-pointer p-0"
                        aria-label={t('bookings.dateFilterPlaceholder')}
                    />
                    {dateFilter && (
                        <button
                            onClick={() => {
                                onDateChange('');
                                onFilterChange?.();
                            }}
                            className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                            title={t('bookings.clearDateFilter')}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Right: status tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-stone-200/60 bg-stone-100/70 p-1.5">
                {statusTabs.map(({ key, count }) => {
                    const isSelected = statusFilter === key;
                    return (
                        <button
                            key={key}
                            onClick={() => {
                                onStatusChange(key);
                                onFilterChange?.();
                            }}
                            className={cn(
                                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-sans text-xs font-bold transition-all duration-200 cursor-pointer select-none',
                                isSelected
                                    ? 'bg-stone-900 text-white shadow-2xs'
                                    : 'text-stone-600 hover:bg-white/80 hover:text-stone-900',
                            )}
                        >
                            <span>
                                {key === 'all'
                                    ? t('bookings.allStatuses')
                                    : t(`bookings.stats.${key}`)}
                            </span>
                            <span
                                className={cn(
                                    'flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-none',
                                    isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-stone-200/80 text-stone-600',
                                )}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
