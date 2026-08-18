'use client';

import { CalendarDays, Search, X } from 'lucide-react';
import { Input } from '@components/ui';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import type { BookingStatus } from '@typings/salon-common.type';

interface BookingStats {
    total: number;
    upcoming: number;
    cancelled: number;
}

interface BookingFiltersProps {
    query: string;
    onQueryChange: (v: string) => void;
    dateFilter: string;
    onDateChange: (v: string) => void;
    statusFilter: 'all' | BookingStatus;
    onStatusChange: (v: 'all' | BookingStatus) => void;
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

    const statusTabs: { key: 'all' | BookingStatus; count: number }[] = [
        { key: 'all', count: stats.total },
        { key: 'upcoming', count: stats.upcoming },
        { key: 'cancelled', count: stats.cancelled },
    ];

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-5 rounded-xl border border-neutral-100 shadow-sm">
            {/* Left: search + date */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 max-w-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        placeholder={t('bookings.search')}
                        value={query}
                        onChange={(e) => {
                            onQueryChange(e.target.value);
                            onFilterChange?.();
                        }}
                        className="pl-9 bg-neutral-50 text-neutral-900 border-neutral-200 placeholder:text-neutral-400 focus:bg-white"
                    />
                </div>

                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 shadow-2xs">
                    <CalendarDays className="h-4 w-4 text-neutral-400 shrink-0" />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => {
                            onDateChange(e.target.value);
                            onFilterChange?.();
                        }}
                        placeholder={t('bookings.dateFilterPlaceholder')}
                        className="bg-transparent border-0 font-sans text-xs font-semibold text-neutral-900 focus:ring-0 focus:outline-none cursor-pointer p-0"
                        aria-label={t('bookings.dateFilterPlaceholder')}
                    />
                    {dateFilter && (
                        <button
                            onClick={() => {
                                onDateChange('');
                                onFilterChange?.();
                            }}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors"
                            title={t('bookings.clearDateFilter')}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Right: status tabs */}
            <div className="flex flex-wrap gap-1 bg-neutral-100/60 p-1.5 rounded-xl border border-neutral-100">
                {statusTabs.map(({ key, count }) => (
                    <button
                        key={key}
                        onClick={() => {
                            onStatusChange(key);
                            onFilterChange?.();
                        }}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all duration-200',
                            statusFilter === key
                                ? 'bg-stone-800 text-white shadow-sm'
                                : 'text-stone-600 hover:bg-white/80',
                        )}
                    >
                        <span>
                            {key === 'all' ? t('bookings.allStatuses') : t(`bookings.stats.${key}`)}
                        </span>
                        <span
                            className={cn(
                                'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none',
                                statusFilter === key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-neutral-200 text-stone-600',
                            )}
                        >
                            {count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
