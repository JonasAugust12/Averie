'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { formatUsd } from '@utils/format.util';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { BookingListItemDto } from '@typings/booking.type';

interface PopularServicesProps {
    bookings: BookingListItemDto[];
}

export function PopularServices({ bookings }: PopularServicesProps) {
    const t = useAdminTranslations();

    const serviceStatsMap = new Map<
        string,
        { id: string; name: string; count: number; revenue: number }
    >();

    (bookings ?? []).forEach((b) => {
        if (b.status === 'cancelled') return;
        b.services.forEach((svc) => {
            const existing = serviceStatsMap.get(svc.id) ?? {
                id: svc.id,
                name: svc.name,
                count: 0,
                revenue: 0,
            };
            existing.count += 1;
            existing.revenue += b.totalPrice / Math.max(b.services.length, 1);
            serviceStatsMap.set(svc.id, existing);
        });
    });

    const computedServiceStats = [...serviceStatsMap.values()];

    if (computedServiceStats.length === 0) {
        return (
            <section className="flex h-full flex-col justify-between rounded-2xl border border-stone-200/70 bg-white/90 p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xs">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-700 shadow-sm">
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-stone-900 md:text-xl">
                            {t('overview.popularServicesTitle')}
                        </h3>
                        <p className="mt-0.5 font-sans text-xs font-medium text-stone-500">
                            {t('overview.popularServicesSubtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-12 font-sans text-xs text-stone-400">
                    <Star className="mb-2 h-7 w-7 text-stone-300" />
                    <span>{t('overview.servicesNoData')}</span>
                </div>
            </section>
        );
    }

    const popularList = [...computedServiceStats].sort((a, b) => b.count - a.count).slice(0, 4);

    return (
        <section className="flex h-full flex-col justify-between rounded-2xl border border-stone-200/70 bg-white/90 p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xs">
            <div>
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-700 shadow-sm">
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-stone-900 md:text-xl">
                            {t('overview.popularServicesTitle')}
                        </h3>
                        <p className="mt-0.5 font-sans text-xs font-medium text-stone-500">
                            {t('overview.popularServicesSubtitle')}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-stone-200/60 bg-white shadow-2xs">
                    <table className="w-full font-sans text-sm">
                        <thead className="border-b border-stone-200/70 bg-stone-50/70 text-left">
                            <tr>
                                <th className="px-3.5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('overview.servicesHeaderService')}
                                </th>
                                <th className="px-3.5 py-2.5 text-center font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('overview.servicesHeaderCount')}
                                </th>
                                <th className="px-3.5 py-2.5 text-right font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('overview.servicesHeaderRevenue')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {popularList.map((service) => (
                                <tr
                                    key={service.id}
                                    className="transition-colors hover:bg-stone-50/70"
                                >
                                    <td className="px-3.5 py-3">
                                        <p className="font-sans text-[13.5px] font-semibold text-stone-900">
                                            {service.name}
                                        </p>
                                    </td>
                                    <td className="px-3.5 py-3 text-center">
                                        <span className="inline-flex rounded-md bg-stone-100 px-2 py-0.5 font-sans text-xs font-medium text-stone-700">
                                            {service.count} {t('overview.countBookings')}
                                        </span>
                                    </td>
                                    <td className="px-3.5 py-3 text-right">
                                        <span className="font-sans text-[13.5px] font-bold text-stone-900">
                                            {formatUsd(service.revenue)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
