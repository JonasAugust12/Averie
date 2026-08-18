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
        <div className="flex h-full flex-col rounded-2xl border border-stone-200/50 bg-white p-5 shadow-xs">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-display text-lg font-semibold text-stone-900 md:text-[19px]">
                        {t('overview.categoryChartTitle')}
                    </h3>
                    <p className="mt-0.5 font-sans text-[13px] font-medium text-stone-500">
                        {t('overview.categoryChartSubtitle')}
                    </p>
                </div>
            </div>

            {!hasData ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-12 font-sans text-sm text-stone-500">
                    {t('overview.categoryNoData')}
                </div>
            ) : (
                <div className="space-y-4 pt-2">
                    {categoriesData.map((cat, idx) => (
                        <div
                            key={cat.id}
                            className="space-y-1.5"
                            onMouseEnter={() => setHoveredBarIdx(idx)}
                            onMouseLeave={() => setHoveredBarIdx(null)}
                        >
                            <div className="flex items-center justify-between text-[13px] font-semibold">
                                <span className="truncate font-medium text-stone-800">
                                    {cat.name}
                                </span>
                                <span className="flex gap-2 font-medium text-stone-500">
                                    <span>
                                        {cat.count} {t('overview.countBookings')}
                                    </span>
                                    <span className="font-semibold text-stone-900">
                                        {cat.percentage}%
                                    </span>
                                </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${Math.max(cat.percentage, 1)}%`,
                                        backgroundColor: cat.color,
                                        boxShadow:
                                            hoveredBarIdx === idx
                                                ? '0 0 8px rgba(0,0,0,0.1)'
                                                : 'none',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto flex items-start gap-2.5 rounded-xl border border-primary-200/30 bg-primary-50/20 p-3 text-[12.5px]">
                <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-600/90" />
                <p className="font-sans font-medium leading-relaxed text-primary-900">
                    {t('overview.categoryDistributionTip')}
                </p>
            </div>
        </div>
    );
}
