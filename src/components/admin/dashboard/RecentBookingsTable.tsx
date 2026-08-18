'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock, Info, User } from 'lucide-react';
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
        <section className="rounded-2xl border border-stone-200/70 bg-white/90 p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xs">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-stone-100 shadow-sm">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-stone-900 md:text-xl">
                            {t('overview.schedule')}
                        </h3>
                        <p className="mt-0.5 font-sans text-xs font-medium text-stone-500">
                            {t('overview.recentBookingsSubtitle')}
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-1.5 font-sans text-xs font-bold text-stone-800 transition-all hover:bg-stone-900 hover:text-white hover:border-stone-900"
                >
                    <span>{t('overview.recentBookingsViewAll')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-12 font-sans text-xs text-stone-400">
                    <CalendarDays className="mb-2 h-7 w-7 text-stone-300" />
                    <span>{t('overview.recentBookingsEmpty')}</span>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-hidden rounded-xl border border-stone-200/60 bg-white shadow-2xs">
                        <table className="w-full font-sans text-sm">
                            <thead className="border-b border-stone-200/70 bg-stone-50/70 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        {t('overview.time')}
                                    </th>
                                    <th className="px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        {t('overview.client')}
                                    </th>
                                    <th className="px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        {t('overview.service')}
                                    </th>
                                    <th className="px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        {t('overview.technician')}
                                    </th>
                                    <th className="px-4 py-3 text-center font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        {t('overview.status')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
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
                                            className="transition-colors hover:bg-stone-50/70"
                                        >
                                            <td className="px-4 py-3.5">
                                                <span className="font-mono text-xs font-bold text-stone-900">
                                                    {b.time}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-sans text-[13.5px] font-bold text-stone-900">
                                                    {b.customer.firstName} {b.customer.lastName}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="font-sans text-xs font-medium text-stone-600">
                                                    {serviceName || '—'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="font-sans text-xs font-medium text-stone-600">
                                                    {tech}
                                                </span>
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

                    {/* Mobile Card List */}
                    <div className="space-y-3 md:hidden">
                        {recent.map((b) => {
                            const serviceName = b.services.map((s) => s.name).join(', ');
                            const tech = b.staff
                                ? formatUserName(b.staff)
                                : b.staffPreference === 'any'
                                  ? t('overview.anyTechnician')
                                  : '—';
                            return (
                                <div
                                    key={b.id}
                                    className="rounded-xl border border-stone-200/70 bg-white p-3.5 shadow-2xs space-y-2.5"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-sans text-sm font-bold text-stone-900">
                                            {b.customer.firstName} {b.customer.lastName}
                                        </p>
                                        <BookingStatusBadge
                                            status={b.status}
                                            label={t(`status.${b.status}`)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                                        <span className="flex items-center gap-1 font-mono text-stone-800 font-semibold">
                                            <Clock className="h-3.5 w-3.5 text-stone-400" />
                                            {b.time}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 truncate">
                                            <User className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                            <span className="truncate">{tech}</span>
                                        </span>
                                    </div>
                                    <p className="font-sans text-xs text-stone-600 font-normal line-clamp-1 border-t border-stone-100 pt-2">
                                        {serviceName || '—'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-stone-200/70 bg-stone-50/70 p-3 text-xs">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                <p className="font-sans font-medium leading-relaxed text-stone-600">
                    {t('overview.ownerQuickTip')}
                </p>
            </div>
        </section>
    );
}
