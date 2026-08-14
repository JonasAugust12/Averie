'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, Loader2, Users, ArrowRight } from 'lucide-react';
import { useSalonBookings, useAllSalonServices, useAllSalonStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { StaffCalendar } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings';
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
            .filter((b) => b.status !== 'cancelled' && parseSalonTime(b.date, b.time) >= today)
            .sort(
                (a, b) =>
                    parseSalonTime(a.date, a.time).getTime() -
                    parseSalonTime(b.date, b.time).getTime(),
            )
            .slice(0, 10);
    }, [bookings]);

    const stats = useMemo(() => {
        const list = bookings ?? [];
        return {
            total: list.filter((b) => b.status !== 'cancelled').length,
            upcoming: list.filter((b) => b.status === 'upcoming').length,
            cancelled: list.filter((b) => b.status === 'cancelled').length,
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
            {/* Header */}
            <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                    {t('schedule.title')}
                </h1>
                <p className="mt-1 font-sans text-sm sm:text-base text-stone-500">
                    {t('schedule.subtitle') ||
                        'Quản lý lịch hẹn & lịch làm việc của nhân viên salon'}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <BookingStatCard
                    label={t('schedule.statsTotal')}
                    count={stats.total}
                    icon={CalendarDays}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('bookings.stats.upcoming')}
                    count={stats.upcoming}
                    icon={Users}
                    variant="pending"
                />
                <BookingStatCard
                    label={t('bookings.stats.cancelled')}
                    count={stats.cancelled}
                    icon={Clock}
                    variant="cancelled"
                />
            </div>

            {/* Main Calendar & Sidebar Grid */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <StaffCalendar
                    events={calendarEvents}
                    onBookingClick={setSelectedBooking}
                    staffList={staff}
                />

                {/* Sidebar: Upcoming Bookings */}
                <aside className="flex flex-col rounded-2xl border border-stone-200/80 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-stone-100 bg-stone-50/60 px-5 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-lg font-bold text-stone-900">
                                {t('schedule.upcomingTitle') || 'Lịch hẹn sắp tới'}
                            </h2>
                            <span className="rounded-full bg-stone-200/80 px-2.5 py-0.5 font-sans text-xs font-bold text-stone-700">
                                {upcomingBookings.length}
                            </span>
                        </div>
                        <p className="mt-1 font-sans text-xs font-medium text-stone-500">
                            {t('schedule.upcomingSubtitle') ||
                                'Nhấp vào một lịch hẹn để xem chi tiết'}
                        </p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-160">
                        {upcomingBookings.length === 0 ? (
                            <div className="py-12 text-center font-sans text-stone-400 space-y-2">
                                <CalendarDays className="mx-auto h-8 w-8 text-stone-300" />
                                <p className="text-sm font-semibold text-stone-500">
                                    {t('schedule.upcomingEmpty') || 'Khái có lịch hẹn nào sắp tới'}
                                </p>
                            </div>
                        ) : (
                            upcomingBookings.map((booking) => {
                                const serviceName =
                                    serviceMap.get(booking.serviceId) ?? booking.serviceId;
                                const staffName =
                                    booking.staffId === 'any'
                                        ? t('overview.anyTechnician') || 'KTV Ngẫu nhiên'
                                        : (staffMap.get(booking.staffId) ?? '—');
                                return (
                                    <button
                                        key={booking.id}
                                        type="button"
                                        onClick={() => setSelectedBooking(booking)}
                                        className="group w-full rounded-xl border border-stone-200/70 bg-stone-50/40 p-4 text-left transition-all duration-200 hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-sans text-base font-bold text-stone-800 group-hover:text-stone-900">
                                                    {booking.customer.firstName}{' '}
                                                    {booking.customer.lastName}
                                                </p>
                                                <p className="mt-0.5 truncate font-sans text-xs font-semibold text-stone-600">
                                                    {serviceName}
                                                </p>
                                            </div>
                                            <BookingStatusBadge
                                                status={booking.status}
                                                label={t(`status.${booking.status}`)}
                                            />
                                        </div>

                                        <div className="mt-3 flex items-center justify-between border-t border-stone-200/50 pt-2.5 font-sans text-xs font-medium text-stone-500">
                                            <span className="flex items-center gap-1 text-stone-600">
                                                <Clock className="h-3.5 w-3.5 text-stone-400" />
                                                {booking.date} · {booking.time}
                                            </span>
                                            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-stone-600">
                                                {staffName}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>
            </div>

            {/* Selected Booking Modal */}
            {selectedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs"
                    onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
                >
                    <div className="animate-in zoom-in-95 w-full max-w-lg space-y-5 rounded-3xl border border-stone-100 bg-white p-6 shadow-2xl duration-200">
                        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                            <div>
                                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-400">
                                    {selectedBooking.reference}
                                </span>
                                <h3 className="font-display text-xl font-bold text-stone-900 mt-0.5">
                                    {selectedBooking.customer.firstName}{' '}
                                    {selectedBooking.customer.lastName}
                                </h3>
                                <p className="font-sans text-xs text-stone-500 mt-0.5">
                                    {selectedBooking.customer.phone} ·{' '}
                                    {selectedBooking.customer.email}
                                </p>
                            </div>
                            <BookingStatusBadge
                                status={selectedBooking.status}
                                label={t(`status.${selectedBooking.status}`)}
                            />
                        </div>

                        <dl className="space-y-3 font-sans text-sm">
                            <div className="flex justify-between items-center bg-stone-50/70 rounded-xl p-3 border border-stone-100">
                                <dt className="text-stone-500 font-medium">
                                    {t('staff.detailService') || 'Dịch vụ'}
                                </dt>
                                <dd className="text-right font-bold text-stone-800">
                                    {serviceMap.get(selectedBooking.serviceId) ??
                                        selectedBooking.serviceId}
                                </dd>
                            </div>
                            <div className="flex justify-between items-center bg-stone-50/70 rounded-xl p-3 border border-stone-100">
                                <dt className="text-stone-500 font-medium">
                                    {t('overview.technician') || 'Nhân viên thực hiện'}
                                </dt>
                                <dd className="text-right font-bold text-stone-800">
                                    {selectedBooking.staffId === 'any'
                                        ? t('overview.anyTechnician') || 'KTV Ngẫu nhiên'
                                        : (staffMap.get(selectedBooking.staffId) ?? '—')}
                                </dd>
                            </div>
                            <div className="flex justify-between items-center bg-stone-50/70 rounded-xl p-3 border border-stone-100">
                                <dt className="text-stone-500 font-medium">
                                    {t('staff.detailTime') || 'Thời gian hẹn'}
                                </dt>
                                <dd className="text-right font-bold text-stone-800">
                                    {selectedBooking.date} · {selectedBooking.time}
                                </dd>
                            </div>
                            <div className="flex justify-between items-center bg-stone-50/70 rounded-xl p-3 border border-stone-100">
                                <dt className="text-stone-500 font-medium">
                                    {t('staff.detailPrice') || 'Giá dịch vụ'}
                                </dt>
                                <dd className="text-right font-bold text-stone-900 text-base">
                                    {formatUsd(selectedBooking.price)}
                                </dd>
                            </div>
                        </dl>

                        <div className="flex justify-between items-center pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedBooking(null)}
                                className="font-sans text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                            >
                                {t('staff.cancel') || 'Đóng'}
                            </button>
                            <Link
                                href={`/admin/bookings/${selectedBooking.id}`}
                                className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2.5 font-sans text-xs font-bold text-white shadow-sm hover:bg-stone-800 transition-all hover:scale-103 cursor-pointer"
                            >
                                <span>{t('staff.viewBookingDetail') || 'Xem chi tiết đơn'}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
