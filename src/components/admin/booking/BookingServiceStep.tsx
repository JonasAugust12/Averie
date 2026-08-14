'use client';

import { Check, Clock, Loader2, Scissors, Search } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatUsd } from '@utils/format.util';
import { SERVICE_CATEGORIES } from '@/mocks/salon/data';
import { cn } from '@utils/cn.util';
import type { SalonService } from '@typings/salon.type';

interface BookingServiceStepProps {
    services: SalonService[] | undefined;
    isLoading: boolean;
    serviceIds: string[];
    searchQuery: string;
    selectedCategory: string;
    filteredServices: SalonService[];
    onToggleService: (id: string) => void;
    onSearchChange: (q: string) => void;
    onCategoryChange: (cat: string) => void;
}

export function BookingServiceStep({
    services,
    isLoading,
    serviceIds,
    searchQuery,
    selectedCategory,
    filteredServices,
    onToggleService,
    onSearchChange,
    onCategoryChange,
}: BookingServiceStepProps) {
    const tBook = useBookingTranslations();
    const tAdmin = useAdminTranslations();

    return (
        <div className="space-y-5">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder={tAdmin('booking.service.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-800 outline-none shadow-xs"
                    />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                        type="button"
                        onClick={() => onCategoryChange('all')}
                        className={cn(
                            'px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer',
                            selectedCategory === 'all'
                                ? 'bg-stone-900 text-white'
                                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100',
                        )}
                    >
                        {tAdmin('booking.service.allLabel')} ({services?.length ?? 0})
                    </button>
                    {SERVICE_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onCategoryChange(cat.id)}
                            className={cn(
                                'px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer',
                                selectedCategory === cat.id
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100',
                            )}
                        >
                            {tBook(cat.labelKey) || cat.id}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16 text-stone-400">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="font-sans text-sm font-semibold">
                        {tAdmin('booking.service.loading')}
                    </span>
                </div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80">
                    <Scissors className="h-10 w-10 text-stone-300 mx-auto mb-2" />
                    <p className="font-sans text-sm font-semibold text-stone-600">
                        {tAdmin('booking.service.notFound')}
                    </p>
                    <p className="font-sans text-xs text-stone-400 mt-1">
                        {tAdmin('booking.service.notFoundHint')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredServices.map((svc) => {
                        const isSelected = serviceIds.includes(svc.id);
                        return (
                            <div
                                key={svc.id}
                                onClick={() => onToggleService(svc.id)}
                                className={cn(
                                    'flex items-start justify-between gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none',
                                    isSelected
                                        ? 'border-stone-900 bg-stone-900/5 shadow-sm'
                                        : 'border-stone-200/80 bg-white hover:border-stone-400 hover:shadow-xs',
                                )}
                            >
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <div
                                        className={cn(
                                            'mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                                            isSelected
                                                ? 'border-stone-900 bg-stone-900 text-white'
                                                : 'border-stone-300 bg-white',
                                        )}
                                    >
                                        {isSelected && (
                                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-display text-base font-bold text-stone-900 leading-snug">
                                            {svc.name}
                                        </h4>
                                        <p className="font-sans text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                                            {svc.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                                                <Clock className="h-3 w-3 text-stone-400" />
                                                {svc.durationMin} min
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="font-display text-lg font-black text-stone-950">
                                        {formatUsd(svc.price)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
