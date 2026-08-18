'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Award,
    ArrowLeft,
    CalendarDays,
    Mail,
    Phone,
    Sparkles,
    Users,
    X,
    ChevronRight,
} from 'lucide-react';
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
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Header and Hero Profile */}
            <div className="space-y-4">
                <Link
                    href="/admin/staff"
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-sans text-xs font-bold uppercase tracking-wider text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-900 active:scale-98"
                >
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    <span>{t('staff.title')}</span>
                </Link>

                <div
                    className="relative overflow-hidden rounded-3xl border bg-white p-5 shadow-2xs sm:p-6.5 transition-all"
                    style={{
                        borderColor: staffColorAlpha(staffColor, 40),
                        background: `linear-gradient(135deg, ${staffColorAlpha(staffColor, 14)} 0%, #ffffff 50%, #ffffff 100%)`,
                    }}
                >
                    <div
                        className="absolute inset-x-0 top-0 h-1"
                        style={{ backgroundColor: staffColor }}
                    />
                    <div className="pointer-events-none absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-[0.08]">
                        <Sparkles className="h-36 w-36" style={{ color: staffColor }} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div
                            className="flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-2xl font-display text-xl sm:text-2xl font-black text-white shadow-md ring-4 ring-white/80"
                            style={{
                                backgroundColor: staffColor,
                                boxShadow: `0 8px 24px ${staffColorAlpha(staffColor, 40)}`,
                            }}
                        >
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                                    {displayName}
                                </h1>
                                <span
                                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider shadow-3xs"
                                    style={{
                                        backgroundColor: staffColorAlpha(staffColor, 16),
                                        borderColor: staffColorAlpha(staffColor, 35),
                                        color: staffColor,
                                    }}
                                >
                                    <Award className="h-3 w-3" />
                                    {role}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-sans text-xs sm:text-sm text-stone-500 font-medium">
                                <span className="inline-flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                                    <span>{member.phone}</span>
                                </span>
                                <span className="hidden sm:inline text-stone-300">·</span>
                                <span className="inline-flex items-center gap-1.5 truncate">
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                                    <span className="truncate">{member.email}</span>
                                </span>
                            </div>
                            {member.specialties.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {member.specialties.map((spec) => (
                                        <span
                                            key={spec}
                                            className="rounded-xl border px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-white/90 border-stone-200/80 shadow-3xs"
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

            {/* Stat Cards */}
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

            {/* Calendar & Upcoming Grid */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <StaffCalendar
                    events={calendarEvents}
                    onBookingClick={setSelectedBooking}
                    onRangeChange={handleRangeChange}
                    isLoadingEvents={bookingsFetching}
                    accentColor={staffColor}
                />

                <aside
                    className="flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xs"
                    style={{ borderColor: staffColorAlpha(staffColor, 35) }}
                >
                    <div
                        className="border-b border-stone-100 px-5 py-4"
                        style={{ backgroundColor: staffColorAlpha(staffColor, 10) }}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-lg font-bold text-stone-900">
                                {t('staff.upcomingTitle')}
                            </h2>
                            <span className="inline-flex items-center justify-center rounded-full bg-stone-900 px-2 py-0.5 text-[11px] font-bold text-white shadow-3xs">
                                {upcomingBookings.length}
                            </span>
                        </div>
                        <p className="mt-0.5 font-sans text-xs text-stone-500 font-medium">
                            {t('staff.upcomingSubtitle')}
                        </p>
                    </div>

                    <div className="flex-1 space-y-2.5 overflow-y-auto p-4 sm:p-5 max-h-130">
                        {upcomingBookings.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="font-sans text-sm font-medium text-stone-400">
                                    {t('staff.upcomingEmpty')}
                                </p>
                            </div>
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
                                        className="group flex w-full items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50/50 p-3.5 text-left transition-all hover:border-stone-200 hover:bg-stone-50/90 hover:shadow-3xs active:scale-98 cursor-pointer"
                                    >
                                        <div
                                            className="min-w-13 shrink-0 rounded-xl px-2.5 py-2 text-center shadow-3xs border border-white/60"
                                            style={{
                                                backgroundColor: staffColorAlpha(staffColor, 20),
                                            }}
                                        >
                                            <p
                                                className="font-sans text-xs font-black leading-none sm:text-sm"
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
                                                    <p className="truncate font-sans text-sm font-bold text-stone-800 group-hover:text-stone-950 transition-colors">
                                                        {booking.customer.firstName}{' '}
                                                        {booking.customer.lastName}
                                                    </p>
                                                    <p className="mt-0.5 truncate font-sans text-xs font-medium text-stone-500">
                                                        {serviceName}
                                                    </p>
                                                </div>
                                                <BookingStatusBadge
                                                    status={booking.status}
                                                    label={t(`status.${booking.status}`)}
                                                />
                                            </div>
                                            <div className="mt-2.5 flex items-center justify-between font-sans text-[11px] font-medium text-stone-400">
                                                <span>{booking.date}</span>
                                                <span
                                                    className="font-semibold"
                                                    style={{ color: staffColor }}
                                                >
                                                    {formatUsd(booking.totalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>
            </div>

            {/* Selected Booking Quick View Modal */}
            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
                >
                    <div
                        className="animate-in zoom-in-95 w-full max-w-md space-y-5 rounded-3xl border bg-white p-6 sm:p-7 shadow-2xl duration-200"
                        style={{ borderColor: staffColorAlpha(staffColor, 45) }}
                    >
                        <div
                            className="-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-4 h-1.5 rounded-t-3xl"
                            style={{ backgroundColor: staffColor }}
                        />
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <span className="font-mono text-xs font-bold text-stone-400 uppercase tracking-wider">
                                    {t('staff.bookingReference') || 'Booking Ref'}
                                </span>
                                <h3 className="font-display text-xl font-bold text-stone-900">
                                    {selectedBooking.reference}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookingStatusBadge
                                    status={selectedBooking.status}
                                    label={t(`status.${selectedBooking.status}`)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setSelectedBooking(null)}
                                    className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors cursor-pointer"
                                    aria-label={t('close') || 'Close'}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-4">
                            <dl className="space-y-3 font-sans text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-stone-500 font-medium">
                                        {t('staff.detailCustomer') || 'Customer'}
                                    </dt>
                                    <dd className="font-bold text-stone-900 text-right">
                                        {selectedBooking.customer.firstName}{' '}
                                        {selectedBooking.customer.lastName}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-stone-500 font-medium">
                                        {t('staff.detailService')}
                                    </dt>
                                    <dd className="font-bold text-stone-800 text-right">
                                        {selectedBooking.services.map((s) => s.name).join(', ')}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-stone-500 font-medium">
                                        {t('staff.detailTime')}
                                    </dt>
                                    <dd className="font-semibold text-stone-800 text-right">
                                        {selectedBooking.date} · {selectedBooking.time}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4 border-t border-stone-200/60 pt-2.5">
                                    <dt className="text-stone-500 font-medium">
                                        {t('staff.detailPrice')}
                                    </dt>
                                    <dd
                                        className="font-bold text-base"
                                        style={{ color: staffColor }}
                                    >
                                        {formatUsd(selectedBooking.totalPrice)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedBooking(null)}
                                className="rounded-xl border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 active:scale-98 transition-all cursor-pointer shadow-3xs"
                            >
                                {t('close') || 'Close'}
                            </button>
                            <Link
                                href={`/admin/bookings/${selectedBooking.id}`}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-3xs hover:bg-stone-800 active:scale-98 transition-all"
                            >
                                <span>{t('staff.viewBookingDetail')}</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
