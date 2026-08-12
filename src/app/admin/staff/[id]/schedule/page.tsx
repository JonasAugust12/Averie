'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CalendarDays, Loader2, Users } from 'lucide-react';
import { useAllSalonStaff, useSalonBookings, useAllSalonServices } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { EmptyState } from '@components/ui';
import { StaffCalendar } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings/BookingStatCard';
import { BookingStatusBadge } from '@components/admin/BookingStatusBadge';
import { buildStaffBookingsCalendarEvents, parseSalonTime } from '@utils/staff-calendar.util';
import { formatUsd } from '@utils/format.util';
import type { SalonBooking } from '@typings/salon.type';

export default function StaffSchedulePage() {
    const t = useAdminTranslations();
    const params = useParams<{ id: string }>();
    const { data: staffList, isLoading: staffLoading } = useAllSalonStaff();
    const { data: bookings, isLoading: bookingsLoading } = useSalonBookings();
    const { data: services, isLoading: servicesLoading } = useAllSalonServices();
    const [selectedBooking, setSelectedBooking] = useState<SalonBooking | null>(null);

    const member = staffList?.find((s) => s.id === params.id);

    const staffBookings = useMemo(
        () =>
            (bookings ?? []).filter(
                (b) =>
                    b.staffId === params.id && b.status !== 'rejected' && b.status !== 'cancelled',
            ),
        [bookings, params.id],
    );

    const calendarEvents = useMemo(() => {
        if (!services) return [];
        return buildStaffBookingsCalendarEvents(bookings ?? [], services, params.id);
    }, [bookings, services, params.id]);

    const upcomingBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [...staffBookings]
            .filter((b) => parseSalonTime(b.date, b.time) >= today)
            .sort(
                (a, b) =>
                    parseSalonTime(a.date, a.time).getTime() -
                    parseSalonTime(b.date, b.time).getTime(),
            )
            .slice(0, 6);
    }, [staffBookings]);

    const serviceMap = useMemo(
        () => new Map((services ?? []).map((s) => [s.id, s.name])),
        [services],
    );

    const isLoading = staffLoading || bookingsLoading || servicesLoading;

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    if (!member) {
        return <EmptyState title={t('staff.notFound')} />;
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/staff"
                    className="font-sans text-sm text-stone-500 transition-colors hover:text-stone-800"
                >
                    ← {t('staff.title')}
                </Link>
                <div className="mt-3 flex items-center gap-4">
                    <span
                        className="flex h-14 w-14 items-center justify-center rounded-full font-sans text-base font-semibold text-white shadow-sm"
                        style={{ backgroundColor: member.color ?? '#78716c' }}
                    >
                        {member.initials}
                    </span>
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
                            {member.name}
                        </h1>
                        <p className="font-sans text-sm text-stone-500">{member.role}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <BookingStatCard
                    label={t('staff.statsBookings')}
                    count={staffBookings.length}
                    icon={CalendarDays}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('staff.statsUpcoming')}
                    count={upcomingBookings.length}
                    icon={Users}
                    variant="pending"
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <StaffCalendar events={calendarEvents} onBookingClick={setSelectedBooking} />

                <aside className="flex flex-col rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                    <div className="border-b border-stone-100 px-5 py-4">
                        <h2 className="font-display text-lg font-semibold text-stone-900">
                            {t('staff.upcomingTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-400">
                            {t('staff.upcomingSubtitle')}
                        </p>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto p-4">
                        {upcomingBookings.length === 0 ? (
                            <p className="py-8 text-center font-sans text-sm text-stone-400">
                                {t('staff.upcomingEmpty')}
                            </p>
                        ) : (
                            upcomingBookings.map((booking) => {
                                const serviceName =
                                    serviceMap.get(booking.serviceId) ?? booking.serviceId;
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
                                                    {serviceName}
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
                                <dd className="font-medium text-stone-800">
                                    {serviceMap.get(selectedBooking.serviceId) ??
                                        selectedBooking.serviceId}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-stone-400">{t('staff.detailTime')}</dt>
                                <dd className="font-medium text-stone-800">
                                    {selectedBooking.date} · {selectedBooking.time}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-stone-400">{t('staff.detailPrice')}</dt>
                                <dd className="font-medium text-stone-800">
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
