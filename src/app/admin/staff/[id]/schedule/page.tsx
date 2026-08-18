'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CalendarDays, Users } from 'lucide-react';
import { useAllStaff, useStaffBookings } from '@services/staff.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { EmptyState } from '@components/ui';
import { StaffCalendar } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings';
import { BookingStatusBadge } from '@components/admin/bookings';
import { StaffCalendarSkeleton } from '@components/skeletons';
import { buildStaffBookingsCalendarEvents, parseSalonTime } from '@utils/staff-calendar.util';
import { formatUsd } from '@utils/format.util';
import { formatUserName, getUserColor, getUserInitials } from '@utils/staff.util';
import type { BookingListItemDto } from '@typings/booking.type';

export default function StaffSchedulePage() {
    const t = useAdminTranslations();
    const params = useParams<{ id: string }>();
    const { data: staffList, isLoading: staffLoading } = useAllStaff();
    const { data: staffBookings, isLoading: bookingsLoading } = useStaffBookings(params.id);
    const [selectedBooking, setSelectedBooking] = useState<BookingListItemDto | null>(null);

    const member = staffList?.find((s) => s.id === params.id);
    const bookingItems = staffBookings;

    const calendarEvents = useMemo(() => {
        if (!member) return [];
        return buildStaffBookingsCalendarEvents(
            bookingItems ?? [],
            params.id,
            getUserColor(member),
        );
    }, [bookingItems, params.id, member]);

    const upcomingBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [...(bookingItems ?? [])]
            .filter((b) => b.status !== 'cancelled' && parseSalonTime(b.date, b.time) >= today)
            .sort(
                (a, b) =>
                    parseSalonTime(a.date, a.time).getTime() -
                    parseSalonTime(b.date, b.time).getTime(),
            )
            .slice(0, 6);
    }, [bookingItems]);

    const bookings = bookingItems ?? [];

    const isLoading = staffLoading || bookingsLoading;

    if (isLoading) {
        return <StaffCalendarSkeleton />;
    }

    if (!member) {
        return <EmptyState title={t('staff.notFound')} />;
    }

    const displayName = formatUserName(member);
    const initials = getUserInitials(member);
    const role = member.specialties[0] ?? 'Technician';

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
                        style={{ backgroundColor: getUserColor(member) }}
                    >
                        {initials}
                    </span>
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
                            {displayName}
                        </h1>
                        <p className="font-sans text-sm text-stone-500">{role}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <BookingStatCard
                    label={t('staff.statsBookings')}
                    count={bookings.filter((b) => b.status !== 'cancelled').length}
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
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto p-4">
                        {upcomingBookings.length === 0 ? (
                            <p className="py-8 text-center font-sans text-sm text-stone-400">
                                {t('staff.upcomingEmpty')}
                            </p>
                        ) : (
                            upcomingBookings.map((booking) => {
                                const serviceName = booking.services.map((s) => s.name).join(', ');
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
                                    {selectedBooking.services.map((s) => s.name).join(', ')}
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
                                    {formatUsd(selectedBooking.totalPrice)}
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
