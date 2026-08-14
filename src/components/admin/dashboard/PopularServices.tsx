'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { formatUsd } from '@utils/format.util';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { SalonBooking, SalonService } from '@typings/salon.type';

interface PopularServicesProps {
    bookings: SalonBooking[] | undefined;
    services: SalonService[] | undefined;
}

export function PopularServices({ bookings, services }: PopularServicesProps) {
    const t = useAdminTranslations();
    if (!services || services.length === 0) {
        return (
            <div className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-md backdrop-blur-md text-center text-muted font-sans text-sm">
                {t('overview.servicesNoData')}
            </div>
        );
    }

    // Let's count booking metrics dynamically
    const computedServiceStats = services.map((s) => {
        const serviceBookings = bookings?.filter((b) => b.serviceId === s.id) ?? [];
        const count = serviceBookings.length;
        const totalRevenue = count * s.price;

        const categoryKeys: Record<string, string> = {
            'manicure-pedicure': 'categoryManicure',
            'gel-polish': 'categoryGel',
            'nail-enhancements': 'categoryEnhancements',
            'add-ons': 'categoryAddons',
            waxing: 'categoryWaxing',
            facials: 'categoryFacials',
        };
        const key = categoryKeys[s.categoryId];
        const categoryName = key ? t(`overview.${key}`) : t('overview.categoryOthers');

        return {
            id: s.id,
            name: s.name,
            category: categoryName,
            price: s.price,
            count,
            revenue: totalRevenue,
        };
    });

    // Sort by count descending, slice top 4
    const popularList = [...computedServiceStats].sort((a, b) => b.count - a.count).slice(0, 4);

    return (
        <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md backdrop-blur-md transition-all">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-700">
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg md:text-[19px] text-stone-900 font-semibold">
                            {t('overview.popularServicesTitle')}
                        </h3>
                        <p className="font-sans text-[13px] text-stone-500 font-medium mt-0.5">
                            {t('overview.popularServicesSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white shadow-xs">
                <table className="w-full font-sans text-sm">
                    <thead className="border-b border-stone-200/65 bg-stone-50/50 text-left text-neutral-700">
                        <tr>
                            <th className="px-3.5 py-2.5 font-semibold text-[12.5px] uppercase tracking-wider text-stone-600">
                                {t('overview.servicesHeaderService')}
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-[12.5px] uppercase tracking-wider text-center text-stone-600">
                                {t('overview.servicesHeaderCount')}
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-[12.5px] uppercase tracking-wider text-right text-stone-600">
                                {t('overview.servicesHeaderRevenue')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/45">
                        {popularList.map((service) => (
                            <tr key={service.id} className="hover:bg-tertiary/20 transition-colors">
                                <td className="px-3.5 py-2.5">
                                    <p className="font-semibold text-[14.5px] text-primary-900">
                                        {service.name}
                                    </p>
                                    <p className="text-[11.5px] text-stone-500 font-medium mt-0.5">
                                        {service.category}
                                    </p>
                                </td>
                                <td className="px-3.5 py-2.5 text-center font-medium text-[13.5px] text-stone-700">
                                    {service.count} {t('overview.countBookings')}
                                </td>
                                <td className="px-3.5 py-2.5 text-right font-semibold text-[13.5px] text-stone-800">
                                    {formatUsd(service.revenue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
