'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Award, ArrowLeft, CalendarDays, Mail, Phone, Sparkles, Users } from 'lucide-react';
import { useAllStaff, useStaffBookings } from '@services/staff.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { EmptyState } from '@components/ui';
import { StaffCalendar } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings';
import { BookingStatusBadge } from '@components/admin/bookings';
import { StaffSchedulePageSkeleton } from '@components/skeletons';
import {
    buildStaffBookingsCalendarEvents,
    getDefaultCalendarRange,
    parseSalonTime,
    type CalendarDateRange,
} from '@utils/staff-calendar.util';
import { formatUsd } from '@utils/format.util';
import { formatUserName, getUserColor, getUserInitials, staffColorAlpha } from '@utils/staff.util';
import type { BookingListItemDto } from '@typings/booking.type';

export default function StaffSchedulePage() {
    const t = useAdminTranslations();
    const params = useParams<{ id: string }>();
    const [range, setRange] = useState<CalendarDateRange>(() => getDefaultCalendarRange());
    const handleRangeChange = useCallback((next: CalendarDateRange) => {
        setRange((prev) =>
            prev.dateFrom === next.dateFrom && prev.dateTo === next.dateTo ? prev : next,
        );
    }, []);

    const { data: staffList, isLoading: staffLoading } = useAllStaff();
    const {
        data: staffBookings,
        isLoading: bookingsLoading,
        isFetching: bookingsFetching,
    } = useStaffBookings(params.id, range);
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

    const isLoading = (staffLoading && !staffList) || (bookingsLoading && !staffBookings);

    if (isLoading) {
        return <StaffSchedulePageSkeleton />;
    }

    if (!member) {
        return <EmptyState title={t('staff.notFound')} />;
    }

    const staffColor = getUserColor(member);
    const displayName = formatUserName(member);
    const initials = getUserInitials(member);
    const role = member.specialties[0] ?? t('staffPortal.defaultRole');

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/staff"
                    className="-ml-1.5 inline-flex items-center gap-2 rounded-lg px-1.5 py-2 font-sans text-base font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                >
                    <ArrowLeft className="h-5 w-5 shrink-0" />
                    {t('staff.title')}
                </Link>

                <div
                    className="relative mt-4 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm sm:p-5"
                    style={{
                        borderColor: staffColorAlpha(staffColor, 45),
                        background: `linear-gradient(135deg, ${staffColorAlpha(staffColor, 18)} 0%, #ffffff 55%, #ffffff 100%)`,
                    }}
                >
                    <div
                        className="absolute inset-x-0 top-0 h-1"
                        style={{ backgroundColor: staffColor }}
                    />
                    <div className="pointer-events-none absolute right-0 top-0 translate-x-1/3 -translate-y-1/4 opacity-[0.12]">
                        <Sparkles className="h-28 w-28" style={{ color: staffColor }} />
                    </div>

                    <div className="flex items-center gap-4">
                        <span
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-sans text-base font-black text-white shadow-md sm:h-16 sm:w-16 sm:text-lg"
                            style={{
                                backgroundColor: staffColor,
                                boxShadow: `0 8px 20px ${staffColorAlpha(staffColor, 45)}`,
                            }}
                        >
                            {initials}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                                    {displayName}
                                </h1>
                                <span
                                    className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase sm:text-[11px]"
                                    style={{
                                        backgroundColor: staffColorAlpha(staffColor, 22),
                                        borderColor: staffColorAlpha(staffColor, 40),
                                        color: staffColor,
                                    }}
                                >
                                    <Award className="h-3 w-3" />
                                    {role}
                                </span>
                            </div>
                            <p className="mt-1.5 flex flex-wrap items-center gap-1 font-sans text-sm text-stone-500">
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                <span>{member.phone}</span>
                                <span className="text-stone-300">·</span>
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{member.email}</span>
                            </p>
                            {member.specialties.length > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {member.specialties.map((spec) => (
                                        <span
                                            key={spec}
                                            className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                                            style={{
                                                backgroundColor: staffColorAlpha(staffColor, 18),
                                                borderColor: staffColorAlpha(staffColor, 38),
                                                color: staffColor,
                                            }}
                                        >
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <BookingStatCard
                    label={t('staff.statsBookings')}
                    count={bookings.filter((b) => b.status !== 'cancelled').length}
                    icon={CalendarDays}
                    variant="confirmed"
                    accentColor={staffColor}
                />
                <BookingStatCard
                    label={t('staff.statsUpcoming')}
                    count={upcomingBookings.length}
                    icon={Users}
                    variant="confirmed"
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <StaffCalendar
                    events={calendarEvents}
                    onBookingClick={setSelectedBooking}
                    onRangeChange={handleRangeChange}
                    isLoadingEvents={bookingsFetching}
                    accentColor={staffColor}
                />

                <aside
                    className="flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm"
                    style={{ borderColor: staffColorAlpha(staffColor, 40) }}
                >
                    <div
                        className="border-b border-stone-100 px-5 py-4"
                        style={{ backgroundColor: staffColorAlpha(staffColor, 14) }}
                    >
                        <h2 className="font-display text-lg font-semibold text-stone-900">
                            {t('staff.upcomingTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
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
                                const serviceName = booking.services.map((s) => s.name).join(', ');
                                const [timePart, ampm] = [
                                    booking.time.split(' ')[0],
                                    booking.time.split(' ')[1],
                                ];
                                return (
                                    <button
                                        key={booking.id}
                                        type="button"
                                        onClick={() => setSelectedBooking(booking)}
                                        className="flex w-full items-start gap-3 rounded-xl border border-stone-100 bg-stone-50/40 p-3 text-left transition-colors hover:border-stone-200 hover:bg-stone-50"
                                    >
                                        <div
                                            className="min-w-13 shrink-0 rounded-xl px-2.5 py-2 text-center"
                                            style={{
                                                backgroundColor: staffColorAlpha(staffColor, 24),
                                            }}
                                        >
                                            <p
                                                className="font-sans text-[11px] font-black leading-none sm:text-sm"
                                                style={{ color: staffColor }}
                                            >
                                                {timePart}
                                            </p>
                                            {ampm ? (
                                                <p
                                                    className="mt-0.5 font-sans text-[9px] font-bold"
                                                    style={{
                                                        color: staffColorAlpha(staffColor, 85),
                                                    }}
                                                >
                                                    {ampm}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 flex-1">
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
                                                {booking.date}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>
            </div>

            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/20 p-4 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
                >
                    <div
                        className="animate-in zoom-in-95 w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 shadow-2xl duration-200"
                        style={{ borderColor: staffColorAlpha(staffColor, 45) }}
                    >
                        <div
                            className="-mx-6 -mt-6 mb-2 h-1 rounded-t-2xl"
                            style={{ backgroundColor: staffColor }}
                        />
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
                                <dd className="font-medium" style={{ color: staffColor }}>
                                    {formatUsd(selectedBooking.totalPrice)}
                                </dd>
                            </div>
                        </dl>
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/bookings/${selectedBooking.id}`}
                                className="font-sans text-sm font-semibold underline-offset-2 hover:underline"
                                style={{ color: staffColor }}
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
