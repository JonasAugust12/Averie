'use client';

import Link from 'next/link';
import { Info } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin/bookings';
import type { BookingListItemDto } from '@typings/booking.type';
import { formatUserName } from '@utils/staff.util';

interface RecentBookingsTableProps {
    bookings: BookingListItemDto[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
    const t = useAdminTranslations();
    const recent = bookings.slice(0, 5);

    return (
        <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-6 shadow-md backdrop-blur-md">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h3 className="font-display text-[20px] font-semibold text-stone-900">
                        {t('overview.schedule')}
                    </h3>
                    <p className="mt-0.5 font-sans text-[13.5px] font-medium text-stone-500">
                        {t('overview.recentBookingsSubtitle')}
                    </p>
                </div>
                <Link
                    href="/admin/bookings"
                    className="font-sans text-sm font-bold text-neutral-955 underline underline-offset-4 transition-colors hover:text-primary"
                >
                    {t('overview.recentBookingsViewAll')}
                </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200/60 bg-white shadow-xs">
                <table className="w-full min-w-160 font-sans text-sm">
                    <thead className="border-b border-stone-200/65 bg-stone-50/50 text-left font-bold text-neutral-700">
                        <tr>
                            <th className="px-4 py-3 text-[13px] font-semibold text-stone-600">
                                {t('overview.time')}
                            </th>
                            <th className="px-4 py-3 text-[13px] font-semibold text-stone-600">
                                {t('overview.client')}
                            </th>
                            <th className="px-4 py-3 text-[13px] font-semibold text-stone-600">
                                {t('overview.service')}
                            </th>
                            <th className="px-4 py-3 text-[13px] font-semibold text-stone-600">
                                {t('overview.technician')}
                            </th>
                            <th className="px-4 py-3 text-center text-[13px] font-semibold text-stone-600">
                                {t('overview.status')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                        {recent.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-10 text-center font-sans text-sm text-stone-500"
                                >
                                    {t('overview.recentBookingsEmpty')}
                                </td>
                            </tr>
                        ) : (
                            recent.map((b) => {
                                const serviceName = b.services.map((s) => s.name).join(', ');
                                const tech = b.staff
                                    ? formatUserName(b.staff)
                                    : b.staffPreference === 'any'
                                      ? t('overview.anyTechnician')
                                      : '—';
                                return (
                                    <tr
                                        key={b.id}
                                        className="transition-colors hover:bg-tertiary/20"
                                    >
                                        <td className="px-4 py-3.5 font-semibold text-primary-800">
                                            {b.time}
                                        </td>
                                        <td className="px-4 py-3.5 font-bold text-primary-900">
                                            {b.customer.firstName} {b.customer.lastName}
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-stone-700">
                                            {serviceName || '—'}
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-stone-600">
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
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary-200/30 bg-primary-50/50 p-3 text-xs font-sans shadow-2xs">
                <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-600/90" />
                <p className="font-semibold leading-relaxed text-primary-800">
                    {t('overview.ownerQuickTip')}
                </p>
            </div>
        </section>
    );
}
