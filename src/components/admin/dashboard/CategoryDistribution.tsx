'use client';

import React, { useMemo, useState } from 'react';
import { Sparkles, Info } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { BookingListItemDto } from '@typings/booking.type';
import { useAllServices, useServiceCategories } from '@services/service-catalog.service';
import { CATEGORY_CHART_COLORS } from '@utils/dashboard-analytics.util';

interface CategoryDistributionProps {
    bookings: BookingListItemDto[];
}

export function CategoryDistribution({ bookings }: CategoryDistributionProps) {
    const t = useAdminTranslations();
    const { data: services } = useAllServices();
    const { data: categories } = useServiceCategories();
    const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);

    const categoriesData = useMemo(() => {
        const categoryTotals: Record<string, number> = {};
        let totalServiceSelections = 0;

        for (const booking of bookings) {
            if (booking.status === 'cancelled') continue;
            for (const serviceId of booking.serviceIds) {
                const service = services?.find((s) => s.id === serviceId);
                const catId = service?.categoryId;
                if (!catId) continue;
                categoryTotals[catId] = (categoryTotals[catId] || 0) + 1;
                totalServiceSelections += 1;
            }
        }

        const categoryNameById = new Map((categories ?? []).map((cat) => [cat.id, cat.name]));

        return Object.entries(categoryTotals)
            .map(([catId, count], index) => ({
                id: catId,
                name: categoryNameById.get(catId) ?? t('overview.categoryOthers'),
                count,
                percentage:
                    totalServiceSelections > 0
                        ? Math.round((count / totalServiceSelections) * 100)
                        : 0,
                color: CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length],
            }))
            .sort((a, b) => b.count - a.count);
    }, [bookings, services, categories, t]);

    const hasData = categoriesData.some((cat) => cat.count > 0);

    return (
        <div className="flex h-full flex-col justify-between rounded-2xl border border-stone-200/70 bg-white/90 p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xs">
            <div>
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-800/90 text-amber-50 shadow-sm shadow-amber-900/10">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-stone-900 md:text-xl">
                            {t('overview.categoryChartTitle')}
                        </h3>
                        <p className="mt-0.5 font-sans text-xs font-medium text-stone-500">
                            {t('overview.categoryChartSubtitle')}
                        </p>
                    </div>
                </div>

                {!hasData ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-12 font-sans text-xs text-stone-400">
                        <Sparkles className="mb-2 h-7 w-7 text-stone-300" />
                        <span>{t('overview.categoryNoData')}</span>
                    </div>
                ) : (
                    <div className="space-y-4 pt-1">
                        {categoriesData.map((cat, idx) => (
                            <div
                                key={cat.id}
                                className="group/item space-y-1.5 rounded-xl p-1.5 -mx-1.5 transition-colors hover:bg-stone-50/80"
                                onMouseEnter={() => setHoveredBarIdx(idx)}
                                onMouseLeave={() => setHoveredBarIdx(null)}
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="h-2 w-2 rounded-full shrink-0"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <span className="truncate font-semibold text-stone-800">
                                            {cat.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="font-medium text-stone-500 text-[11px]">
                                            {cat.count} {t('overview.countBookings')}
                                        </span>
                                        <span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-stone-900">
                                            {cat.percentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${Math.max(cat.percentage, 1)}%`,
                                            backgroundColor: cat.color,
                                            boxShadow:
                                                hoveredBarIdx === idx
                                                    ? '0 0 10px rgba(0,0,0,0.15)'
                                                    : 'none',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-stone-200/70 bg-stone-50/70 p-3 text-xs">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                <p className="font-sans font-medium leading-relaxed text-stone-600">
                    {t('overview.categoryDistributionTip')}
                </p>
            </div>
        </div>
    );
}
