'use client';

import { useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    Mail,
    Plus,
    RefreshCw,
    RotateCcw,
    CalendarX,
    ChevronDown,
    Clock,
    User,
} from 'lucide-react';
import { useBookings, useCancelBooking, useRestoreBooking } from '@services/booking.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { BookingsTableSkeleton } from '@components/skeletons';
import { useUIStore } from '@stores/ui.store';
import type { BookingDisplayStatus, BookingStatus } from '@typings/salon-common.type';
import type { BookingListItemDto } from '@typings/booking.type';
import { formatUserName } from '@utils/staff.util';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import { cn } from '@utils/cn.util';
import {
    BookingStatCard,
    BookingFilters,
    BookingTableRow,
    BookingStatusBadge,
    BookingTicketCard,
    AdminNewBookingModal,
    SendBookingEmailModal,
} from '@components/admin/bookings';
import { toastSuccess } from '@utils/toast.util';

export default function AdminBookingsPage() {
    const t = useAdminTranslations();
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | BookingDisplayStatus>('all');
    const [dateFilter, setDateFilter] = useState('');
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
    const [emailBooking, setEmailBooking] = useState<BookingListItemDto | null>(null);
    const limit = 8;

    const listFilters = {
        page,
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
        date: dateFilter || undefined,
        search: query.trim() || undefined,
    };

    const { data, isLoading, refetch } = useBookings(listFilters);
    const { showConfirm, hideConfirm } = useUIStore();
    const cancelBooking = useCancelBooking();
    const restoreBooking = useRestoreBooking();

    const bookingItems = data?.items;
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const stats = data?.stats ?? { total: 0, upcoming: 0, completed: 0, cancelled: 0 };

    const bookings = bookingItems ?? [];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
        } catch (error) {
            console.error('Failed to refresh bookings:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleSendEmail = (booking: BookingListItemDto, e: React.MouseEvent) => {
        e.stopPropagation();
        setEmailBooking(booking);
    };

    const handleUpdateStatus = (
        booking: BookingListItemDto,
        newStatus: BookingStatus,
        e: React.MouseEvent,
    ) => {
        e.stopPropagation();
        const isCancelling = newStatus === 'cancelled';
        showConfirm({
            title: isCancelling
                ? t('bookings.actions.cancelConfirmTitle')
                : t('bookings.actions.restoreConfirmTitle'),
            message: isCancelling
                ? t('bookings.actions.cancelConfirmMsg', { reference: booking.reference })
                : t('bookings.actions.restoreConfirmMsg', { reference: booking.reference }),
            confirmText: isCancelling
                ? t('bookings.actions.confirmCancel')
                : t('bookings.actions.confirmRestore'),
            cancelText: t('bookings.actions.cancelNo'),
            type: isCancelling ? 'danger' : 'info',
            onConfirm: () => {
                const mutation = isCancelling ? cancelBooking : restoreBooking;
                mutation.mutate(booking.id, {
                    onSuccess: () => {
                        toastSuccess(
                            isCancelling
                                ? t('toasts.bookingCancelled')
                                : t('toasts.bookingRestored'),
                        );
                        hideConfirm();
                    },
                });
            },
        });
    };

    if (isLoading) {
        return <BookingsTableSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                        {t('bookings.title')}
                    </h1>
                    <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500 font-medium">
                        {t('bookings.subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={isRefreshing || isLoading}
                        onClick={handleRefresh}
                        className="group gap-2 border-stone-200/90 bg-white/90 px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 hover:text-stone-900 rounded-xl cursor-pointer"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 text-stone-500 ${isRefreshing ? 'animate-spin' : 'transition-transform duration-300 group-hover:rotate-45'}`}
                        />
                        <span>
                            {isRefreshing
                                ? t('overview.buttonRefreshing')
                                : t('overview.buttonRefresh')}
                        </span>
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsNewBookingOpen(true)}
                        className="gap-2 bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        <span>{t('newBooking') || 'New Booking'}</span>
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <BookingStatCard
                    label={t('bookings.stats.upcoming')}
                    count={stats.upcoming}
                    icon={Calendar}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('bookings.stats.completed')}
                    count={stats.completed}
                    icon={CheckCircle2}
                    variant="completed"
                />
                <BookingStatCard
                    label={t('bookings.stats.cancelled')}
                    count={stats.cancelled}
                    icon={RotateCcw}
                    variant="cancelled"
                />
            </div>

            {/* Filters */}
            <BookingFilters
                query={query}
                onQueryChange={setQuery}
                dateFilter={dateFilter}
                onDateChange={setDateFilter}
                statusFilter={statusFilter}
                onStatusChange={(v) => {
                    setStatusFilter(v);
                    setExpandedId(null);
                }}
                stats={stats}
                onFilterChange={() => setPage(1)}
            />

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-2xs backdrop-blur-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-sans text-sm text-left">
                        <thead className="border-b border-stone-200/80 bg-stone-50/70 text-stone-500 font-bold uppercase text-[11px] tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5 font-bold">{t('bookings.table.ref')}</th>
                                <th className="px-5 py-3.5 font-bold">
                                    {t('bookings.table.client')}
                                </th>
                                <th className="px-5 py-3.5 font-bold">
                                    {t('bookings.table.service')}
                                </th>
                                <th className="px-5 py-3.5 font-bold">
                                    {t('bookings.table.time')}
                                </th>
                                <th className="px-5 py-3.5 font-bold text-right">
                                    {t('bookings.table.price')}
                                </th>
                                <th className="px-5 py-3.5 font-bold text-center">
                                    {t('bookings.table.status')}
                                </th>
                                <th className="px-5 py-3.5 font-bold text-center">
                                    {t('bookings.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {bookings.map((b) => {
                                const serviceName = b.services.map((s) => s.name).join(', ');
                                const staffName = b.staff
                                    ? formatUserName(b.staff)
                                    : t('bookings.detailCard.anyStaff');
                                return (
                                    <BookingTableRow
                                        key={b.id}
                                        booking={b}
                                        serviceName={serviceName}
                                        staffName={staffName}
                                        isExpanded={expandedId === b.id}
                                        onToggle={() =>
                                            setExpandedId(expandedId === b.id ? null : b.id)
                                        }
                                        onUpdateStatus={handleUpdateStatus}
                                        onSendEmail={handleSendEmail}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {total === 0 && (
                    <div className="text-center py-16 px-4">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-3.5">
                            <Calendar className="h-7 w-7" />
                        </div>
                        <p className="font-display text-base font-bold text-stone-900">
                            {t('bookings.notFound')}
                        </p>
                        <p className="mt-1 font-sans text-xs text-stone-500 max-w-sm mx-auto">
                            {t('bookings.emptyState')}
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3.5">
                {bookings.map((b) => {
                    const serviceName = b.services.map((s) => s.name).join(', ');
                    const staffName = b.staff
                        ? formatUserName(b.staff)
                        : t('bookings.detailCard.anyStaff');
                    const isExpanded = expandedId === b.id;

                    return (
                        <div
                            key={b.id}
                            className="rounded-2xl border border-stone-200/80 bg-white/95 p-4 shadow-2xs space-y-3"
                        >
                            {/* Card Top Row */}
                            <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                                <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200/80">
                                    {b.reference}
                                </span>
                                <BookingStatusBadge
                                    status={b.displayStatus}
                                    label={t(`status.${b.displayStatus}`)}
                                />
                            </div>

                            {/* Client & Service */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-sm font-bold text-stone-900">
                                        {b.customer.firstName} {b.customer.lastName}
                                    </span>
                                    <span className="font-display text-sm font-black text-stone-950">
                                        {formatUsd(b.totalPrice)}
                                    </span>
                                </div>
                                <p className="font-sans text-xs text-stone-500 font-medium">
                                    {b.customer.phone}
                                </p>
                            </div>

                            {/* Details meta */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100 font-medium">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-stone-400" />
                                    <span>
                                        {formatDisplayDate(b.date)} @ {b.time}
                                    </span>
                                </div>
                                {staffName && (
                                    <div className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5 text-stone-400" />
                                        <span>{staffName}</span>
                                    </div>
                                )}
                                <div className="w-full text-stone-700 font-semibold truncate pt-0.5">
                                    {serviceName}
                                </div>
                            </div>

                            {/* Actions + Details toggle */}
                            <div className="flex items-center justify-between pt-1">
                                <button
                                    type="button"
                                    onClick={() => setExpandedId(isExpanded ? null : b.id)}
                                    className="inline-flex items-center gap-1 font-sans text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                                >
                                    <span>{isExpanded ? 'Hide Ticket' : 'View Ticket'}</span>
                                    <ChevronDown
                                        className={cn(
                                            'h-3.5 w-3.5 transition-transform duration-200',
                                            isExpanded && 'rotate-180',
                                        )}
                                    />
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => handleSendEmail(b, e)}
                                        className="border border-stone-200/90 bg-[#F5EFEA]/80 hover:bg-[#F5EFEA] active:scale-95 transition-all duration-200 h-8 rounded-xl px-3 flex items-center gap-1.5 font-sans text-xs font-bold text-stone-800 shadow-3xs cursor-pointer"
                                        title={t('bookings.sendEmail.button')}
                                    >
                                        <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                                        {t('bookings.sendEmail.button')}
                                    </button>
                                    {b.status === 'upcoming' && (
                                        <button
                                            onClick={(e) => handleUpdateStatus(b, 'cancelled', e)}
                                            className="border border-rose-200/90 bg-rose-50/70 hover:bg-rose-100 active:scale-95 transition-all duration-200 h-8 rounded-xl px-3 flex items-center gap-1.5 font-sans text-xs font-bold text-rose-700 shadow-3xs cursor-pointer"
                                            title={t('bookings.actions.cancelTitle')}
                                        >
                                            <CalendarX className="h-3.5 w-3.5" strokeWidth={2} />
                                            {t('bookings.actions.cancel')}
                                        </button>
                                    )}

                                    {b.status === 'cancelled' && (
                                        <button
                                            onClick={(e) => handleUpdateStatus(b, 'upcoming', e)}
                                            className="border border-stone-200/90 bg-stone-100/70 hover:bg-stone-200 active:scale-95 transition-all duration-200 h-8 rounded-xl px-3 flex items-center gap-1.5 font-sans text-xs font-bold text-stone-700 shadow-3xs cursor-pointer"
                                            title={t('bookings.actions.restoreTitle')}
                                        >
                                            <RotateCcw className="h-3.5 w-3.5 text-stone-600" />
                                            {t('bookings.actions.restore') || 'Restore'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Inline Ticket on Mobile */}
                            {isExpanded && (
                                <div className="pt-2">
                                    <BookingTicketCard
                                        booking={b}
                                        serviceName={serviceName}
                                        staffName={staffName}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {total === 0 && (
                    <div className="text-center py-12 px-4 rounded-2xl border border-stone-200/80 bg-white/90">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-3">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <p className="font-display text-base font-bold text-stone-900">
                            {t('bookings.notFound')}
                        </p>
                        <p className="mt-1 font-sans text-xs text-stone-500 max-w-xs mx-auto">
                            {t('bookings.emptyState')}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Bar */}
            {total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/90 backdrop-blur-xs px-5 py-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                    <div className="font-sans text-xs font-semibold text-stone-500">
                        {t('bookings.table.show')}{' '}
                        <span className="font-bold text-stone-900">
                            {Math.min(total, (page - 1) * limit + 1)}
                        </span>{' '}
                        -{' '}
                        <span className="font-bold text-stone-900">
                            {Math.min(total, page * limit)}
                        </span>{' '}
                        {t('bookings.table.of')}{' '}
                        <span className="font-bold text-stone-900">{total}</span>{' '}
                        {t('bookings.table.bookingsUnit')}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="h-8 px-3 rounded-xl border-stone-200/90 text-stone-700 hover:bg-stone-50 disabled:opacity-40 text-xs font-bold cursor-pointer"
                        >
                            {t('bookings.table.prev')}
                        </Button>
                        <div className="flex items-center px-2.5 py-1 rounded-lg bg-stone-100/70 font-sans text-xs font-bold text-stone-800">
                            {page} / {totalPages}
                        </div>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="h-8 px-3 rounded-xl border-stone-200/90 text-stone-700 hover:bg-stone-50 disabled:opacity-40 text-xs font-bold cursor-pointer"
                        >
                            {t('bookings.table.next')}
                        </Button>
                    </div>
                </div>
            )}

            {/* Admin New Booking Modal */}
            <AdminNewBookingModal
                isOpen={isNewBookingOpen}
                onClose={() => setIsNewBookingOpen(false)}
            />

            {emailBooking ? (
                <SendBookingEmailModal
                    booking={emailBooking}
                    isOpen
                    onClose={() => setEmailBooking(null)}
                />
            ) : null}
        </div>
    );
}
