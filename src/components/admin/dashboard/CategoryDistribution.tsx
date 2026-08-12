'use client';

import React, { useState } from 'react';
import { Sparkles, Info } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { SalonBooking, SalonService } from '@typings/salon.type';

interface CategoryDistributionProps {
    bookings: SalonBooking[] | undefined;
    services: SalonService[] | undefined;
}

export function CategoryDistribution({ bookings = [], services = [] }: CategoryDistributionProps) {
    const t = useAdminTranslations();
    const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);

    // Dynamic category mappings
    const categoryNames: Record<string, string> = {
        'manicure-pedicure': 'Làm Móng Tay & Chân',
        'gel-polish': 'Sơn Gel',
        'nail-enhancements': 'Đắp Móng Giả & Nối',
        'add-ons': 'Vẽ Nghệ Thuật & Charm',
        waxing: 'Waxing & Wax Lông',
        facials: 'Chăm Sóc Da Mặt',
    };

    const categoryColors: Record<string, string> = {
        'manicure-pedicure': '#D4C5B9',
        'gel-polish': '#C8B195',
        'nail-enhancements': '#A08E75',
        'add-ons': '#5F87C1',
        waxing: '#E4DFDA',
        facials: '#D8A47F',
    };

    // Calculate distributions dynamically
    const categoryTotals: Record<string, number> = {};
    let totalBookingsCount = 0;

    bookings.forEach((b) => {
        const service = services.find((s) => s.id === b.serviceId);
        const catId = service?.categoryId || 'manicure-pedicure';
        categoryTotals[catId] = (categoryTotals[catId] || 0) + 1;
        totalBookingsCount++;
    });

    // Populate categories data
    const categoriesData = Object.keys(categoryNames)
        .map((catId) => {
            const count = categoryTotals[catId] || 0;
            const percentage =
                totalBookingsCount > 0 ? Math.round((count / totalBookingsCount) * 100) : 0;
            return {
                name: categoryNames[catId],
                count,
                percentage,
                color: categoryColors[catId],
            };
        })
        .sort((a, b) => b.count - a.count);

    return (
        <div className="h-full rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md backdrop-blur-md transition-all flex flex-col">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-display text-lg text-neutral-900 font-semibold">
                        {t('overview.categoryChartTitle')}
                    </h3>
                    <p className="font-sans text-xs text-neutral-700 font-bold">
                        {t('overview.categoryChartSubtitle')}
                    </p>
                </div>
            </div>

            {/* Chart Container Bar */}
            <div className="space-y-4 pt-2">
                {categoriesData.map((cat, idx) => (
                    <div
                        key={idx}
                        className="space-y-1.5"
                        onMouseEnter={() => setHoveredBarIdx(idx)}
                        onMouseLeave={() => setHoveredBarIdx(null)}
                    >
                        <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-neutral-900 font-bold truncate">{cat.name}</span>
                            <span className="text-neutral-700 font-semibold flex gap-2">
                                <span>
                                    {cat.count} {t('overview.countBookings')}
                                </span>
                                <span className="text-neutral-950 font-bold">
                                    {cat.percentage}%
                                </span>
                            </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${cat.percentage || 1}%`,
                                    backgroundColor: cat.color,
                                    boxShadow:
                                        hoveredBarIdx === idx ? '0 0 8px rgba(0,0,0,0.1)' : 'none',
                                    opacity: cat.count === 0 ? 0.3 : 1,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Small tip widget */}
            <div className="mt-auto rounded-xl bg-primary/5 p-3 flex gap-2.5 items-start text-xs border border-primary/10">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-neutral-805 leading-relaxed font-sans font-bold">
                    {t('overview.categoryDistributionTip')}
                </p>
            </div>
        </div>
    );
}
