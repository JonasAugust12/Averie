'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, Loader2, Users } from 'lucide-react';
import { useSalonBookings, useAllSalonServices, useAllSalonStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { StaffCalendar } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings/BookingStatCard';
import { BookingStatusBadge } from '@components/admin/BookingStatusBadge';
import { buildAllBookingsCalendarEvents, parseSalonTime } from '@utils/staff-calendar.util';
import { formatUsd } from '@utils/format.util';
import type { SalonBooking } from '@typings/salon.type';

export default function AdminSchedulePage() {
    const t = useAdminTranslations();
    const { data: bookings, isLoading: bookingsLoading } = useSalonBookings();
    const { data: services, isLoading: servicesLoading } = useAllSalonServices();
    const { data: staff, isLoading: staffLoading } = useAllSalonStaff();
    const [selectedBooking, setSelectedBooking] = useState<SalonBooking | null>(null);

    const calendarEvents = useMemo(() => {
        if (!services || !staff) return [];
        return buildAllBookingsCalendarEvents(bookings ?? [], services, staff);
    }, [bookings, services, staff]);

    const upcomingBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [...(bookings ?? [])]
            .filter(
                (b) =>
                    b.status !== 'rejected' &&
                    b.status !== 'cancelled' &&
                    parseSalonTime(b.date, b.time) >= today,
            )
            .sort(
                (a, b) =>
                    parseSalonTime(a.date, a.time).getTime() -
                    parseSalonTime(b.date, b.time).getTime(),
            )
            .slice(0, 8);
    }, [bookings]);

    const stats = useMemo(() => {
        const list = bookings ?? [];
        return {
            total: list.filter((b) => b.status !== 'rejected' && b.status !== 'cancelled').length,
            pending: list.filter((b) => b.status === 'pending').length,
            confirmed: list.filter((b) => b.status === 'confirmed').length,
        };
    }, [bookings]);

    const serviceMap = useMemo(
        () => new Map((services ?? []).map((s) => [s.id, s.name])),
        [services],
    );
    const staffMap = useMemo(() => new Map((staff ?? []).map((s) => [s.id, s.name])), [staff]);

    const isLoading = bookingsLoading || servicesLoading || staffLoading;

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                    {t('schedule.title')}
                </h1>
                <p className="mt-1 font-sans text-sm text-stone-500">{t('schedule.subtitle')}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <BookingStatCard
                    label={t('schedule.statsTotal')}
                    count={stats.total}
                    icon={CalendarDays}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('schedule.statsConfirmed')}
                    count={stats.confirmed}
                    icon={Users}
                    variant="pending"
                />
                <BookingStatCard
                    label={t('schedule.statsPending')}
                    count={stats.pending}
                    icon={Clock}
                    variant="cancelled"
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <StaffCalendar events={calendarEvents} onBookingClick={setSelectedBooking} />

                <aside className="flex flex-col rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                    <div className="border-b border-stone-100 px-5 py-4">
                        <h2 className="font-display text-lg font-semibold text-stone-900">
                            {t('schedule.upcomingTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-400">
                            {t('schedule.upcomingSubtitle')}
                        </p>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto p-4">
                        {upcomingBookings.length === 0 ? (
                            <p className="py-8 text-center font-sans text-sm text-stone-400">
                                {t('schedule.upcomingEmpty')}
                            </p>
                        ) : (
                            upcomingBookings.map((booking) => {
                                const serviceName =
                                    serviceMap.get(booking.serviceId) ?? booking.serviceId;
                                const staffName =
                                    booking.staffId === 'any'
                                        ? t('overview.anyTechnician')
                                        : (staffMap.get(booking.staffId) ?? '—');
                                return (
                                    <button
                                        key={booking.id}
                                        type="button"
                                        onClick={() => setSelectedBooking(booking)}
                                        className="w-full rounded-xl border border-stone-100 bg-stone-50/50 p-3 text-left transition-colors hover:border-stone-200 hover:bg-stone-50"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate font-sans text-sm font-semibold text-stone-800">
                                                    {booking.customer.firstName}{' '}
                                                    {booking.customer.lastName}
                                                </p>
                                                <p className="mt-0.5 truncate font-sans text-xs text-stone-500">
                                                    {serviceName} · {staffName}
                                                </p>
                                            </div>
                                            <BookingStatusBadge
                                                status={booking.status}
                                                label={t(`status.${booking.status}`)}
                                            />
                                        </div>
                                        <p className="mt-2 font-sans text-[11px] font-medium text-stone-400">
                                            {booking.date} · {booking.time}
                                        </p>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>
            </div>

            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
                >
                    <div className="animate-in zoom-in-95 w-full max-w-md space-y-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xl duration-200">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-display text-lg font-semibold text-stone-900">
                                    {selectedBooking.reference}
                                </h3>
                                <p className="mt-1 font-sans text-sm text-stone-500">
                                    {selectedBooking.customer.firstName}{' '}
                                    {selectedBooking.customer.lastName}
                                </p>
                            </div>
                            <BookingStatusBadge
                                status={selectedBooking.status}
                                label={t(`status.${selectedBooking.status}`)}
                            />
                        </div>
                        <dl className="space-y-2 font-sans text-sm">
                            <div className="flex justify-between gap-4">
                                <dt className="text-stone-400">{t('staff.detailService')}</dt>
                                <dd className="text-right font-medium text-stone-800">
                                    {serviceMap.get(selectedBooking.serviceId) ??
                                        selectedBooking.serviceId}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-stone-400">{t('overview.technician')}</dt>
                                <dd className="text-right font-medium text-stone-800">
                                    {selectedBooking.staffId === 'any'
                                        ? t('overview.anyTechnician')
                                        : (staffMap.get(selectedBooking.staffId) ?? '—')}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-stone-400">{t('staff.detailTime')}</dt>
                                <dd className="text-right font-medium text-stone-800">
                                    {selectedBooking.date} · {selectedBooking.time}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-stone-400">{t('staff.detailPrice')}</dt>
                                <dd className="text-right font-medium text-stone-800">
                                    {formatUsd(selectedBooking.price)}
                                </dd>
                            </div>
                        </dl>
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/bookings/${selectedBooking.id}`}
                                className="font-sans text-sm font-semibold text-stone-600 underline-offset-2 hover:underline"
                            >
                                {t('staff.viewBookingDetail')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
