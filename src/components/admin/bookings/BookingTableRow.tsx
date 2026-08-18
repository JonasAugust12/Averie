'use client';

import { Fragment } from 'react';
import { CalendarX, RotateCcw, ChevronDown } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge, BookingTicketCard } from '@components/admin/bookings';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import { cn } from '@utils/cn.util';
import type { BookingStatus } from '@typings/salon-common.type';
import type { BookingListItemDto } from '@typings/booking.type';

interface BookingTableRowProps {
    booking: BookingListItemDto;
    serviceName?: string;
    staffName?: string;
    isExpanded: boolean;
    onToggle: () => void;
    onUpdateStatus: (
        booking: BookingListItemDto,
        status: BookingStatus,
        e: React.MouseEvent,
    ) => void;
}

/** Format createdAt as dd/MM/yyyy HH:mm */
function formatPlacedDate(createdAtStr?: string): string {
    if (!createdAtStr) return '—';
    try {
        const d = new Date(createdAtStr);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
        return createdAtStr;
    }
}

export function BookingTableRow({
    booking: b,
    serviceName,
    staffName,
    isExpanded,
    onToggle,
    onUpdateStatus,
}: BookingTableRowProps) {
    const t = useAdminTranslations();

    return (
        <Fragment>
            <tr
                onClick={onToggle}
                className={cn(
                    'group transition-colors duration-200 cursor-pointer select-none',
                    isExpanded
                        ? 'bg-stone-100/70 border-b-0'
                        : 'hover:bg-stone-50/80 border-b border-stone-100 last:border-b-0',
                )}
            >
                {/* Ref */}
                <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-lg border border-stone-200/80 bg-stone-50 text-stone-500 transition-transform duration-200',
                                isExpanded && 'rotate-180 bg-stone-200 text-stone-800',
                            )}
                        >
                            <ChevronDown className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2 py-1 rounded-md border border-stone-200/80 transition-colors">
                            {b.reference}
                        </span>
                    </div>
                </td>

                {/* Client */}
                <td className="px-5 py-4">
                    <div className="flex flex-col">
                        <span className="font-sans text-sm font-bold text-stone-900 leading-tight">
                            {b.customer.firstName} {b.customer.lastName}
                        </span>
                        <span className="font-sans text-xs text-stone-500 font-medium mt-0.5">
                            {b.customer.phone}
                        </span>
                        <span className="font-sans text-[10px] text-stone-400 mt-1 font-medium tracking-tight">
                            {t('bookings.table.placed')}: {formatPlacedDate(b.createdAt)}
                        </span>
                    </div>
                </td>

                {/* Service & Staff */}
                <td className="px-5 py-4">
                    <div className="flex flex-col">
                        <span className="font-sans text-sm font-semibold text-stone-800 leading-tight">
                            {serviceName ?? '—'}
                        </span>
                        {staffName && (
                            <span className="font-sans text-xs text-stone-500 mt-0.5">
                                KTV: <span className="font-medium text-stone-700">{staffName}</span>
                            </span>
                        )}
                    </div>
                </td>

                {/* Time */}
                <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="font-sans text-xs font-bold text-stone-900">
                            {formatDisplayDate(b.date)}
                        </span>
                        <span className="font-sans text-xs font-semibold text-stone-500 mt-0.5">
                            {b.time}
                        </span>
                    </div>
                </td>

                {/* Price */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                    <span className="font-display text-sm font-black text-stone-950">
                        {formatUsd(b.totalPrice)}
                    </span>
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4 text-center whitespace-nowrap align-middle">
                    <BookingStatusBadge status={b.status} label={t(`status.${b.status}`)} />
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-center whitespace-nowrap">
                    <div
                        className="flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {b.status === 'upcoming' && (
                            <button
                                onClick={(e) => onUpdateStatus(b, 'cancelled', e)}
                                className="border border-rose-200/90 bg-rose-50/70 hover:bg-rose-100 hover:border-rose-300 active:scale-95 transition-all duration-200 h-8 rounded-xl px-3 flex items-center gap-1.5 font-sans text-xs font-bold text-rose-700 shadow-3xs cursor-pointer"
                                title={t('bookings.actions.cancelTitle')}
                            >
                                <CalendarX className="h-3.5 w-3.5" strokeWidth={2} />
                                {t('bookings.actions.cancel')}
                            </button>
                        )}

                        {b.status === 'cancelled' && (
                            <button
                                onClick={(e) => onUpdateStatus(b, 'upcoming', e)}
                                className="border border-stone-200/90 bg-stone-100/70 hover:bg-stone-200 hover:border-stone-300 active:scale-95 transition-all duration-200 h-8 rounded-xl px-3 flex items-center gap-1.5 font-sans text-xs font-bold text-stone-700 shadow-3xs cursor-pointer"
                                title={t('bookings.actions.restoreTitle')}
                            >
                                <RotateCcw className="h-3.5 w-3.5 text-stone-600" />
                                {t('bookings.actions.restore') || 'Restore'}
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Inline expandable ticket card */}
            {isExpanded && (
                <tr className="bg-stone-50/70">
                    <td
                        colSpan={7}
                        className="px-4 py-4 sm:px-6 sm:py-5 border-t border-b border-stone-200/70"
                    >
                        <div
                            className="w-full animate-in fade-in slide-in-from-top-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <BookingTicketCard
                                booking={b}
                                serviceName={serviceName}
                                staffName={staffName}
                            />
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    );
}
