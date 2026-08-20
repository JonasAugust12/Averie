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
import { usePromotionSettings } from '@services/promotion.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { MasterDaySlotsModal, StaffCalendar } from '@components/admin/staff';
import { AdminNewBookingModal } from '@components/admin/bookings/AdminNewBookingModal';
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
import { resolvePromotionColor } from '@mappers/promotion.mapper';
import { isPromotionVisible } from '@utils/promotion.util';
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
    const [selectedDateForSlots, setSelectedDateForSlots] = useState<string | null>(null);
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
    const [initialBookingState, setInitialBookingState] = useState<{
        date?: string;
        time?: string;
        staffId?: string;
    }>({});

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
    const { data: promotion } = usePromotionSettings();
    const [selectedBooking, setSelectedBooking] = useState<BookingListItemDto | null>(null);

    const bookingItems = bookingsData?.items;

    const calendarEvents = useMemo(() => {
        if (!staff) return [];
        const activePromo = promotion && isPromotionVisible(promotion) ? promotion : null;
        const promoColor = activePromo ? resolvePromotionColor(activePromo.color) : undefined;
        return buildAllBookingsCalendarEvents(
            bookingItems ?? [],
            staff,
            t('overview.anyTechnician') || 'Any',
            promoColor,
        );
    }, [bookingItems, staff, t, promotion]);

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
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 backdrop-blur-xs p-6 sm:p-8 shadow-xs">
                <div className="pointer-events-none absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-[0.03]">
                    <Sparkles className="h-48 w-48 text-stone-900" />
                </div>

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-2xs">
                            <CalendarDays className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                                {t('schedule.title')}
                            </h1>
                            <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500">
                                {t('schedule.subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={isRefreshing || bookingsFetching}
                            onClick={handleRefresh}
                            className="gap-2 rounded-xl border-stone-200/80 bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-3xs hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all"
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
                                className="gap-2 rounded-xl border-stone-200/80 bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-3xs hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all"
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

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <StaffCalendar
                    events={calendarEvents}
                    onBookingClick={setSelectedBooking}
                    onDateClick={(dateStr) => setSelectedDateForSlots(dateStr)}
                    staffList={staff}
                    onRangeChange={handleRangeChange}
                    isLoadingEvents={bookingsFetching}
                />

                <aside className="flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 backdrop-blur-xs shadow-xs">
                    <div className="border-b border-stone-200/70 bg-stone-50/60 px-5 py-4 sm:px-6 sm:py-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-display text-lg sm:text-xl font-bold text-stone-900">
                                    {t('schedule.upcomingTitle')}
                                </h2>
                                <p className="mt-0.5 font-sans text-xs text-stone-500">
                                    {t('schedule.upcomingSubtitle')}
                                </p>
                            </div>
                            <span className="rounded-xl bg-stone-900 px-2.5 py-1 font-sans text-xs font-bold text-white shadow-3xs">
                                {upcomingBookings.length}
                            </span>
                        </div>
                    </div>

                    <div className="max-h-160 flex-1 space-y-2.5 overflow-y-auto p-4 sm:p-5">
                        {upcomingBookings.length === 0 ? (
                            <div className="space-y-2 py-16 text-center">
                                <CalendarDays className="mx-auto h-10 w-10 text-stone-300" />
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
                                    : t('overview.anyTechnician') || 'Any';
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
                                        className="group flex w-full items-start gap-3 rounded-2xl border border-stone-200/70 bg-stone-50/50 p-3.5 text-left transition-all duration-200 hover:border-stone-300 hover:bg-white hover:shadow-2xs active:scale-[0.99] cursor-pointer"
                                    >
                                        <div
                                            className="min-w-13 shrink-0 rounded-xl px-2.5 py-2 text-center shadow-3xs"
                                            style={{
                                                backgroundColor: staffColorAlpha(accent, 18),
                                            }}
                                        >
                                            <p
                                                className="font-sans text-xs sm:text-sm font-bold leading-none"
                                                style={{ color: accent }}
                                            >
                                                {timePart}
                                            </p>
                                            {ampm ? (
                                                <p
                                                    className="mt-0.5 font-sans text-[10px] font-bold"
                                                    style={{
                                                        color: staffColorAlpha(accent, 90),
                                                    }}
                                                >
                                                    {ampm}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="truncate font-sans text-sm font-bold text-stone-900">
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
                                            <div className="mt-2.5 flex items-center justify-between gap-2">
                                                <p className="font-sans text-xs font-semibold text-stone-400">
                                                    {booking.date}
                                                </p>
                                                <span
                                                    className="inline-flex max-w-36 items-center gap-1.5 truncate rounded-lg border px-2 py-0.5 font-sans text-[10px] font-bold text-stone-700 shadow-3xs"
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

            {/* Master Daily Slots Availability Modal */}
            {selectedDateForSlots && staff && (
                <MasterDaySlotsModal
                    date={selectedDateForSlots}
                    staffList={staff}
                    bookings={bookingItems ?? []}
                    onClose={() => setSelectedDateForSlots(null)}
                    onSelectBooking={(b) => setSelectedBooking(b)}
                    onBookSlot={(dateStr, timeStr, staffIdStr) => {
                        setInitialBookingState({
                            date: dateStr,
                            time: timeStr,
                            staffId: staffIdStr,
                        });
                        setIsNewBookingOpen(true);
                    }}
                />
            )}

            {/* Quick Admin Booking Modal */}
            <AdminNewBookingModal
                isOpen={isNewBookingOpen}
                onClose={() => {
                    setIsNewBookingOpen(false);
                    setInitialBookingState({});
                }}
                onSuccess={() => {
                    refetch();
                }}
                initialDate={initialBookingState.date}
                initialTime={initialBookingState.time}
                initialStaffId={initialBookingState.staffId}
            />

            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
                >
                    <div
                        className="animate-in zoom-in-95 relative w-full max-w-md space-y-4 rounded-3xl border bg-white p-6 sm:p-7 shadow-xl duration-200"
                        style={{ borderColor: staffColorAlpha(selectedAccent, 45) }}
                    >
                        <div
                            className="-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-4 h-1.5 rounded-t-3xl"
                            style={{ backgroundColor: selectedAccent }}
                        />

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400">
                                    {selectedBooking.reference}
                                </p>
                                <h3 className="mt-0.5 font-display text-xl font-bold text-stone-900">
                                    {selectedBooking.customer.firstName}{' '}
                                    {selectedBooking.customer.lastName}
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
                                        {t('staff.detailService')}
                                    </dt>
                                    <dd className="font-bold text-stone-800 text-right">
                                        {selectedBooking.services.map((s) => s.name).join(', ')}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-stone-500 font-medium">
                                        {t('overview.technician')}
                                    </dt>
                                    <dd className="font-semibold text-stone-800 text-right">
                                        {selectedBooking.staff
                                            ? formatUserName(selectedBooking.staff)
                                            : t('overview.anyTechnician') || 'Any'}
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
                                        style={{ color: selectedAccent }}
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
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
