'use client';

import { useMemo, useState } from 'react';
import { Calendar, Clock, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import {
    useSalonBookings,
    useSalonServices,
    useSalonStaff,
    useSaveMockBooking,
} from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common/Button';
import { usePagination } from '@hooks/usePagination';
import type { SalonBooking, BookingStatus } from '@typings/salon.type';
import { BookingStatCard } from '@components/admin/bookings/BookingStatCard';
import { BookingFilters } from '@components/admin/bookings/BookingFilters';
import { BookingTableRow } from '@components/admin/bookings/BookingTableRow';

export default function AdminBookingsPage() {
    const t = useAdminTranslations();
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
    const [dateFilter, setDateFilter] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { data: bookings, isLoading } = useSalonBookings();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();
    const { mutate: saveBooking } = useSaveMockBooking();

    const stats = useMemo(() => {
        const list = bookings ?? [];
        return {
            pending: list.filter((b) => b.status === 'pending').length,
            confirmed: list.filter((b) => b.status === 'confirmed').length,
            rejected: list.filter((b) => b.status === 'rejected').length,
            cancelled: list.filter((b) => b.status === 'cancelled').length,
            total: list.length,
        };
    }, [bookings]);

    const handleUpdateStatus = (
        booking: SalonBooking,
        newStatus: BookingStatus,
        e: React.MouseEvent,
    ) => {
        e.stopPropagation();
        saveBooking({ ...booking, status: newStatus });
    };

    const filtered = useMemo(() => {
        let list = bookings ?? [];
        if (statusFilter !== 'all') list = list.filter((b) => b.status === statusFilter);
        if (dateFilter) list = list.filter((b) => b.date === dateFilter);
        const q = query.trim().toLowerCase();
        if (q) {
            list = list.filter((b) => {
                const name = `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase();
                return (
                    name.includes(q) ||
                    b.customer.phone.toLowerCase().includes(q) ||
                    b.reference.toLowerCase().includes(q)
                );
            });
        }
        return list;
    }, [bookings, statusFilter, dateFilter, query]);

    const {
        currentPage,
        itemsPerPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        canGoNext,
        canGoPrev,
    } = usePagination({ totalItems: filtered.length, initialItemsPerPage: 8 });

    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage, itemsPerPage]);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                    {t('bookings.title')}
                </h1>
                <p className="mt-1 font-sans text-sm text-stone-500">{t('bookings.subtitle')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <BookingStatCard
                    label={t('bookings.stats.pending')}
                    count={stats.pending}
                    icon={Clock}
                    variant="pending"
                />
                <BookingStatCard
                    label={t('bookings.stats.confirmed')}
                    count={stats.confirmed}
                    icon={Calendar}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('bookings.stats.rejected')}
                    count={stats.rejected}
                    icon={Trash2}
                    variant="rejected"
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
                onFilterChange={() => goToPage(1)}
            />

            {/* Table */}
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
                            {paginatedBookings.map((b) => {
                                const svc = services?.find((s) => s.id === b.serviceId);
                                const tech =
                                    b.staffId === 'any'
                                        ? t('bookings.detailCard.anyStaff')
                                        : staff?.find((s) => s.id === b.staffId)?.name;
                                return (
                                    <BookingTableRow
                                        key={b.id}
                                        booking={b}
                                        serviceName={svc?.name}
                                        staffName={tech ?? undefined}
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

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-stone-700">
                            {t('bookings.notFound')}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">{t('bookings.emptyState')}</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-neutral-100 shadow-sm">
                    <div className="text-xs font-semibold text-stone-500">
                        {t('bookings.table.show')}{' '}
                        <span className="font-bold text-stone-800">
                            {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}
                        </span>{' '}
                        -{' '}
                        <span className="font-bold text-stone-800">
                            {Math.min(filtered.length, currentPage * itemsPerPage)}
                        </span>{' '}
                        {t('bookings.table.of')}{' '}
                        <span className="font-bold text-stone-700">{filtered.length}</span>{' '}
                        {t('bookings.table.bookingsUnit')}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={!canGoPrev}
                            onClick={prevPage}
                            className="h-9 px-3 rounded-lg border-stone-200 disabled:opacity-40"
                        >
                            {t('bookings.table.prev')}
                        </Button>
                        <div className="flex items-center px-2 text-xs font-semibold text-stone-700">
                            {currentPage} / {totalPages}
                        </div>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={!canGoNext}
                            onClick={nextPage}
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
