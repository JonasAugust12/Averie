'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin';
import type { SalonBooking, SalonService, SalonStaff } from '@typings/salon.type';

interface RecentBookingsTableProps {
    bookings: SalonBooking[] | undefined;
    isLoading: boolean;
    services: SalonService[] | undefined;
    staff: SalonStaff[] | undefined;
}

export function RecentBookingsTable({
    bookings,
    isLoading,
    services,
    staff,
}: RecentBookingsTableProps) {
    const t = useAdminTranslations();
    const today = bookings?.slice(0, 5) ?? [];

    return (
        <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-6 shadow-md backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h3 className="font-display text-lg text-neutral-900 font-semibold">
                        {t('overview.schedule')}
                    </h3>
                    <p className="font-sans text-xs text-neutral-700 mt-0.5 font-bold">
                        {t('overview.recentBookingsSubtitle')}
                    </p>
                </div>
                <Link
                    href="/admin/bookings"
                    className="font-sans text-sm text-neutral-950 font-bold transition-colors hover:text-primary underline underline-offset-4"
                >
                    {t('overview.recentBookingsViewAll')}
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted" />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-neutral-350 bg-neutral-50">
                    <table className="w-full min-w-160 font-sans text-sm">
                        <thead className="border-b border-neutral-350 bg-neutral-100 text-left text-neutral-800 font-bold">
                            <tr>
                                <th className="px-4 py-3.5 font-bold">{t('overview.time')}</th>
                                <th className="px-4 py-3.5 font-bold">{t('overview.client')}</th>
                                <th className="px-4 py-3.5 font-bold">{t('overview.service')}</th>
                                <th className="px-4 py-3.5 font-bold">
                                    {t('overview.technician')}
                                </th>
                                <th className="px-4 py-3.5 font-bold">{t('overview.status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-250">
                            {today.map((b) => {
                                const svc = services?.find((s) => s.id === b.serviceId);
                                const tech =
                                    b.staffId === 'any'
                                        ? t('overview.anyTechnician')
                                        : staff?.find((s) => s.id === b.staffId)?.name;
                                return (
                                    <tr
                                        key={b.id}
                                        className="hover:bg-neutral-100/50 transition-colors"
                                    >
                                        <td className="px-4 py-3.5 font-bold text-neutral-900">
                                            {b.time}
                                        </td>
                                        <td className="px-4 py-3.5 text-neutral-950 font-bold">
                                            {b.customer.firstName} {b.customer.lastName}
                                        </td>
                                        <td className="px-4 py-3.5 text-neutral-850 font-semibold">
                                            {svc?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-neutral-850 font-semibold">
                                            {tech ?? '—'}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <BookingStatusBadge
                                                status={b.status}
                                                label={t(`status.${b.status}`)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
