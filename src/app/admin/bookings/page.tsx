'use client';

import { useMemo, useState } from 'react';
import { Calendar, RotateCcw } from 'lucide-react';
import { useBookings, useCancelBooking, useRestoreBooking } from '@services/booking.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { BookingsTableSkeleton } from '@components/skeletons';
import { useUIStore } from '@stores/ui.store';
import type { BookingStatus } from '@typings/salon-common.type';
import type { BookingListItemDto } from '@typings/booking.type';
import { formatUserName } from '@utils/staff.util';
import { BookingStatCard, BookingFilters, BookingTableRow } from '@components/admin/bookings';

export default function AdminBookingsPage() {
    const t = useAdminTranslations();
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
    const [dateFilter, setDateFilter] = useState('');
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const limit = 8;

    const listFilters = {
        page,
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
        date: dateFilter || undefined,
        search: query.trim() || undefined,
    };

    const { data, isLoading } = useBookings(listFilters);
    const { showConfirm, hideConfirm } = useUIStore();
    const cancelBooking = useCancelBooking();
    const restoreBooking = useRestoreBooking();

    const bookingItems = data?.items;
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const stats = useMemo(() => {
        const items = bookingItems ?? [];
        return {
            upcoming: items.filter((b) => b.status === 'upcoming').length,
            cancelled: items.filter((b) => b.status === 'cancelled').length,
            total,
        };
    }, [bookingItems, total]);

    const bookings = bookingItems ?? [];

    const handleUpdateStatus = (
        booking: BookingListItemDto,
        newStatus: BookingStatus,
        e: React.MouseEvent,
    ) => {
        e.stopPropagation();
        const isCancelling = newStatus === 'cancelled';
        showConfirm({
            title: isCancelling
                ? t('bookings.actions.cancelConfirmTitle') || 'Hủy lịch hẹn'
                : t('bookings.actions.restoreConfirmTitle') || 'Khôi phục lịch hẹn',
            message: isCancelling
                ? t('bookings.actions.cancelConfirmMsg') ||
                  `Bạn có chắc muốn hủy lịch #${booking.reference}? Khách hàng sẽ được thông báo.`
                : t('bookings.actions.restoreConfirmMsg') ||
                  `Khôi phục lịch #${booking.reference} về trạng thái "Sắp tới"?`,
            confirmText: isCancelling
                ? t('bookings.actions.confirmCancel') || 'Xác nhận hủy'
                : t('bookings.actions.confirmRestore') || 'Khôi phục',
            cancelText: t('bookings.actions.cancelNo') || 'Không',
            type: isCancelling ? 'danger' : 'info',
            onConfirm: () => {
                const mutation = isCancelling ? cancelBooking : restoreBooking;
                mutation.mutate(booking.id, { onSuccess: () => hideConfirm() });
            },
        });
    };

    if (isLoading) {
        return <BookingsTableSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                    {t('bookings.title')}
                </h1>
                <p className="mt-1 font-sans text-sm text-stone-500">{t('bookings.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <BookingStatCard
                    label={t('bookings.stats.upcoming')}
                    count={stats.upcoming}
                    icon={Calendar}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('bookings.stats.cancelled')}
                    count={stats.cancelled}
                    icon={RotateCcw}
                    variant="cancelled"
                />
            </div>

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

            <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-180 border-collapse font-sans text-sm text-left">
                        <thead className="border-b border-neutral-100 bg-stone-50/60 text-stone-600 font-bold">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    {t('bookings.table.ref')}
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    {t('bookings.table.client')}
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    {t('bookings.table.service')}
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    {t('bookings.table.time')}
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    {t('bookings.table.price')}
                                </th>
                                <th className="px-6 py-4 font-semibold text-center">
                                    {t('bookings.table.status')}
                                </th>
                                <th className="px-6 py-4 font-semibold text-center">
                                    {t('bookings.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
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
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {total === 0 && (
                    <div className="text-center py-16">
                        <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-stone-700">
                            {t('bookings.notFound')}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">{t('bookings.emptyState')}</p>
                    </div>
                )}
            </div>

            {total > 0 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-neutral-100 shadow-sm">
                    <div className="text-xs font-semibold text-stone-500">
                        {t('bookings.table.show')}{' '}
                        <span className="font-bold text-stone-800">
                            {Math.min(total, (page - 1) * limit + 1)}
                        </span>{' '}
                        -{' '}
                        <span className="font-bold text-stone-800">
                            {Math.min(total, page * limit)}
                        </span>{' '}
                        {t('bookings.table.of')}{' '}
                        <span className="font-bold text-stone-700">{total}</span>{' '}
                        {t('bookings.table.bookingsUnit')}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="h-9 px-3 rounded-lg border-stone-200 disabled:opacity-40"
                        >
                            {t('bookings.table.prev')}
                        </Button>
                        <div className="flex items-center px-2 text-xs font-semibold text-stone-700">
                            {page} / {totalPages}
                        </div>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="h-9 px-3 rounded-lg border-stone-200 disabled:opacity-40"
                        >
                            {t('bookings.table.next')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
