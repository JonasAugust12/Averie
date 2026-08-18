'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    CalendarDays,
    Clock,
    RefreshCw,
    Settings,
    Sparkles,
    Users,
    X,
} from 'lucide-react';
import { useBookings } from '@services/booking.service';
import { useAllStaff } from '@services/staff.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { StaffCalendar } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings';
import { BookingStatusBadge } from '@components/admin/bookings';
import { AdminScheduleSkeleton } from '@components/skeletons';
import {
    buildAllBookingsCalendarEvents,
    getDefaultCalendarRange,
    parseSalonTime,
    type CalendarDateRange,
} from '@utils/staff-calendar.util';
import { formatUsd } from '@utils/format.util';
import { formatUserName, getUserColor, staffColorAlpha } from '@utils/staff.util';
import type { BookingListItemDto } from '@typings/booking.type';
import type { UserDto } from '@typings/salon-user.type';

function resolveStaffMember(
    staffList: UserDto[] | undefined,
    booking: BookingListItemDto,
): UserDto | undefined {
    if (!staffList || !booking.staffId) return undefined;
    return staffList.find((member) => member.id === booking.staffId);
}

export default function AdminSchedulePage() {
    const t = useAdminTranslations();
    const [range, setRange] = useState<CalendarDateRange>(() => getDefaultCalendarRange());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRangeChange = useCallback((next: CalendarDateRange) => {
        setRange((prev) =>
            prev.dateFrom === next.dateFrom && prev.dateTo === next.dateTo ? prev : next,
        );
    }, []);

    const {
        data: bookingsData,
        isLoading: bookingsLoading,
        isFetching: bookingsFetching,
        refetch,
    } = useBookings({
        page: 1,
        limit: 500,
        dateFrom: range.dateFrom,
        dateTo: range.dateTo,
    });
    const { data: staff, isLoading: staffLoading } = useAllStaff();
    const [selectedBooking, setSelectedBooking] = useState<BookingListItemDto | null>(null);

    const bookingItems = bookingsData?.items;

    const calendarEvents = useMemo(() => {
        if (!staff) return [];
        return buildAllBookingsCalendarEvents(
            bookingItems ?? [],
            staff,
            t('overview.anyTechnician') || 'Any',
        );
    }, [bookingItems, staff, t]);

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
            .slice(0, 10);
    }, [bookingItems]);

    const stats = useMemo(() => {
        const items = bookingItems ?? [];
        return {
            total: items.filter((b) => b.status !== 'cancelled').length,
            upcoming: items.filter((b) => b.status === 'upcoming').length,
            cancelled: items.filter((b) => b.status === 'cancelled').length,
        };
    }, [bookingItems]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
        } catch (error) {
            console.error('Failed to refresh schedule:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const isLoading = (bookingsLoading && !bookingsData) || (staffLoading && !staff);

    if (isLoading) {
        return <AdminScheduleSkeleton />;
    }

    const selectedStaff = selectedBooking ? resolveStaffMember(staff, selectedBooking) : undefined;
    const selectedAccent = selectedStaff ? getUserColor(selectedStaff) : '#292524';

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-6">
                <div className="absolute inset-x-0 top-0 h-1 bg-stone-900" />
                <div className="pointer-events-none absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-[0.05]">
                    <Sparkles className="h-32 w-32 text-stone-900" />
                </div>

                <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-md sm:h-14 sm:w-14">
                            <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                                {t('schedule.title')}
                            </h1>
                            <p className="mt-1 max-w-xl font-sans text-sm text-stone-500 sm:text-base">
                                {t('schedule.subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={isRefreshing || bookingsFetching}
                            onClick={handleRefresh}
                            className="gap-2 border-stone-200 bg-white text-stone-700 shadow-sm hover:bg-stone-50"
                        >
                            <RefreshCw
                                className={`h-3.5 w-3.5 ${isRefreshing || bookingsFetching ? 'animate-spin' : ''}`}
                            />
                            {isRefreshing
                                ? t('overview.buttonRefreshing')
                                : t('overview.buttonRefresh')}
                        </Button>
                        <Link href="/admin/settings/schedule">
                            <Button
                                variant="outlined"
                                size="sm"
                                className="gap-2 border-stone-200 bg-white text-stone-700 shadow-sm hover:bg-stone-50"
                            >
                                <Settings className="h-3.5 w-3.5" />
                                {t('schedule.settings')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <BookingStatCard
                    label={t('schedule.statsTotal')}
                    count={stats.total}
                    icon={CalendarDays}
                    variant="confirmed"
                    accentColor="#292524"
                />
                <BookingStatCard
                    label={t('bookings.stats.upcoming')}
                    count={stats.upcoming}
                    icon={Users}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('bookings.stats.cancelled')}
                    count={stats.cancelled}
                    icon={Clock}
                    variant="cancelled"
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <StaffCalendar
                    events={calendarEvents}
                    onBookingClick={setSelectedBooking}
                    staffList={staff}
                    onRangeChange={handleRangeChange}
                    isLoadingEvents={bookingsFetching}
                />

                <aside className="flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm ring-1 ring-black/3">
                    <div className="border-b border-stone-100 bg-linear-to-r from-stone-50/90 to-white px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-display text-lg font-semibold text-stone-900">
                                    {t('schedule.upcomingTitle')}
                                </h2>
                                <p className="mt-0.5 font-sans text-xs text-stone-500">
                                    {t('schedule.upcomingSubtitle')}
                                </p>
                            </div>
                            <span className="rounded-full bg-stone-900 px-2.5 py-0.5 font-sans text-xs font-bold text-white">
                                {upcomingBookings.length}
                            </span>
                        </div>
                    </div>

                    <div className="max-h-160 flex-1 space-y-2 overflow-y-auto p-4">
                        {upcomingBookings.length === 0 ? (
                            <div className="space-y-2 py-12 text-center">
                                <CalendarDays className="mx-auto h-10 w-10 text-stone-200" />
                                <p className="font-sans text-sm font-semibold text-stone-500">
                                    {t('schedule.upcomingEmpty')}
                                </p>
                            </div>
                        ) : (
                            upcomingBookings.map((booking) => {
                                const serviceName = booking.services.map((s) => s.name).join(', ');
                                const staffMember = resolveStaffMember(staff, booking);
                                const staffName = booking.staff
                                    ? formatUserName(booking.staff)
                                    : t('overview.anyTechnician');
                                const accent = staffMember ? getUserColor(staffMember) : '#78716c';
                                const [timePart, ampm] = [
                                    booking.time.split(' ')[0],
                                    booking.time.split(' ')[1],
                                ];

                                return (
                                    <button
                                        key={booking.id}
                                        type="button"
                                        onClick={() => setSelectedBooking(booking)}
                                        className="group flex w-full items-start gap-3 rounded-xl border border-stone-100 bg-stone-50/40 p-3 text-left transition-all hover:border-stone-200 hover:bg-white hover:shadow-sm"
                                    >
                                        <div
                                            className="min-w-13 shrink-0 rounded-xl px-2.5 py-2 text-center"
                                            style={{
                                                backgroundColor: staffColorAlpha(accent, 24),
                                            }}
                                        >
                                            <p
                                                className="font-sans text-[11px] font-black leading-none sm:text-sm"
                                                style={{ color: accent }}
                                            >
                                                {timePart}
                                            </p>
                                            {ampm ? (
                                                <p
                                                    className="mt-0.5 font-sans text-[9px] font-bold"
                                                    style={{
                                                        color: staffColorAlpha(accent, 85),
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
                                            <div className="mt-2 flex items-center justify-between gap-2">
                                                <p className="font-sans text-[11px] font-medium text-stone-400">
                                                    {booking.date}
                                                </p>
                                                <span
                                                    className="inline-flex max-w-36 items-center gap-1.5 truncate rounded-full border px-2 py-0.5 font-sans text-[10px] font-bold text-stone-600"
                                                    style={{
                                                        backgroundColor: staffColorAlpha(
                                                            accent,
                                                            12,
                                                        ),
                                                        borderColor: staffColorAlpha(accent, 30),
                                                    }}
                                                >
                                                    <span
                                                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                                                        style={{ backgroundColor: accent }}
                                                    />
                                                    <span className="truncate">{staffName}</span>
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

            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/20 p-4 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
                >
                    <div
                        className="animate-in zoom-in-95 relative w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 shadow-2xl duration-200"
                        style={{ borderColor: staffColorAlpha(selectedAccent, 45) }}
                    >
                        <div
                            className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                            style={{ backgroundColor: selectedAccent }}
                        />

                        <button
                            type="button"
                            onClick={() => setSelectedBooking(null)}
                            className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                            aria-label={t('schedule.confirmCancelBtn')}
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="flex items-start justify-between gap-3 pr-8">
                            <div>
                                <p className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400">
                                    {selectedBooking.reference}
                                </p>
                                <h3 className="mt-1 font-display text-xl font-semibold text-stone-900">
                                    {selectedBooking.customer.firstName}{' '}
                                    {selectedBooking.customer.lastName}
                                </h3>
                            </div>
                            <BookingStatusBadge
                                status={selectedBooking.status}
                                label={t(`status.${selectedBooking.status}`)}
                            />
                        </div>

                        <dl className="space-y-2 font-sans text-sm">
                            {[
                                [
                                    t('staff.detailService'),
                                    selectedBooking.services.map((s) => s.name).join(', '),
                                ],
                                [
                                    t('overview.technician'),
                                    selectedBooking.staff
                                        ? formatUserName(selectedBooking.staff)
                                        : t('overview.anyTechnician'),
                                ],
                                [
                                    t('staff.detailTime'),
                                    `${selectedBooking.date} · ${selectedBooking.time}`,
                                ],
                                [t('staff.detailPrice'), formatUsd(selectedBooking.totalPrice)],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-stone-100 bg-stone-50/70 px-3 py-2.5"
                                >
                                    <dt className="text-stone-500">{label}</dt>
                                    <dd
                                        className="text-right font-semibold text-stone-800"
                                        style={
                                            label === t('staff.detailPrice')
                                                ? { color: selectedAccent }
                                                : undefined
                                        }
                                    >
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="flex justify-end pt-1">
                            <Link
                                href={`/admin/bookings/${selectedBooking.id}`}
                                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-sans text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                                style={{ backgroundColor: selectedAccent }}
                            >
                                {t('staff.viewBookingDetail')}
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
