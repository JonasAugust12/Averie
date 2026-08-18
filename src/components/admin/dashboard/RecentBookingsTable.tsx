'use client';

import Link from 'next/link';
import { Loader2, Info } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin/bookings';
import type { BookingListItemDto } from '@typings/booking.type';
import { formatUserName } from '@utils/staff.util';

interface RecentBookingsTableProps {
    bookings: BookingListItemDto[] | undefined;
    isLoading: boolean;
}

export function RecentBookingsTable({ bookings, isLoading }: RecentBookingsTableProps) {
    const t = useAdminTranslations();
    const recent = bookings?.slice(0, 5) ?? [];

    return (
        <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-6 shadow-md backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h3 className="font-display text-[20px] text-stone-900 font-semibold">
                        {t('overview.schedule')}
                    </h3>
                    <p className="font-sans text-[13.5px] text-stone-500 mt-0.5 font-medium">
                        {t('overview.recentBookingsSubtitle')}
                    </p>
                </div>
                <Link
                    href="/admin/bookings"
                    className="font-sans text-sm text-neutral-955 font-bold transition-colors hover:text-primary underline underline-offset-4"
                >
                    {t('overview.recentBookingsViewAll')}
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted" />
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-stone-200/60 bg-white shadow-xs">
                        <table className="w-full min-w-160 font-sans text-sm">
                            <thead className="border-b border-stone-200/65 bg-stone-50/50 text-left text-neutral-700 font-bold">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-[13px] text-stone-600">
                                        {t('overview.time')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-[13px] text-stone-600">
                                        {t('overview.client')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-[13px] text-stone-600">
                                        {t('overview.service')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-[13px] text-stone-600">
                                        {t('overview.technician')}
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-[13px] text-stone-600 text-center">
                                        {t('overview.status')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white">
                                {recent.map((b) => {
                                    const serviceName = b.services.map((s) => s.name).join(', ');
                                    const tech = b.staff
                                        ? formatUserName(b.staff)
                                        : b.staffPreference === 'any'
                                          ? t('overview.anyTechnician')
                                          : '—';
                                    return (
                                        <tr
                                            key={b.id}
                                            className="hover:bg-tertiary/20 transition-colors"
                                        >
                                            <td className="px-4 py-3.5 font-semibold text-primary-800">
                                                {b.time}
                                            </td>
                                            <td className="px-4 py-3.5 font-bold text-primary-900">
                                                {b.customer.firstName} {b.customer.lastName}
                                            </td>
                                            <td className="px-4 py-3.5 text-stone-700 font-medium">
                                                {serviceName || '—'}
                                            </td>
                                            <td className="px-4 py-3.5 text-stone-600 font-medium">
                                                {tech}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <div className="flex justify-center">
                                                    <BookingStatusBadge
                                                        status={b.status}
                                                        label={t(`status.${b.status}`)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary-200/30 bg-primary-50/50 p-3 text-xs text-primary-800 font-sans shadow-2xs">
                        <Info className="h-4.5 w-4.5 text-primary-600/90 shrink-0 mt-0.5" />
                        <p className="font-semibold leading-relaxed">
                            {t('overview.ownerQuickTip')}
                        </p>
                    </div>
                </>
            )}
        </section>
    );
}
