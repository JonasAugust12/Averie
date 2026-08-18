'use client';

import { Fragment } from 'react';
import { CalendarX, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
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
                    'group hover:bg-neutral-50/70 transition-all duration-200 cursor-pointer',
                    isExpanded && 'bg-neutral-50/90',
                )}
            >
                {/* Ref */}
                <td className="px-6 py-4.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-neutral-400" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        <span className="font-mono font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded border border-neutral-200 transition-colors text-xs">
                            {b.reference}
                        </span>
                    </div>
                </td>

                {/* Client */}
                <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">
                            {b.customer.firstName} {b.customer.lastName}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium mt-0.5">
                            {b.customer.phone}
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-1 font-medium italic">
                            {t('bookings.table.placed')}: {formatPlacedDate(b.createdAt)}
                        </span>
                    </div>
                </td>

                {/* Service & Staff */}
                <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                        <span className="text-neutral-800 font-medium">{serviceName ?? '—'}</span>
                        {staffName && (
                            <span className="text-xs text-neutral-500 font-normal">
                                KTV: {staffName}
                            </span>
                        )}
                    </div>
                </td>

                {/* Time */}
                <td className="px-6 py-4.5">
                    <div className="flex flex-col text-neutral-800">
                        <span className="font-semibold">{formatDisplayDate(b.date)}</span>
                        <span className="text-xs text-neutral-500">{b.time}</span>
                    </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4.5 text-right whitespace-nowrap font-bold text-neutral-900">
                    {formatUsd(b.totalPrice)}
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4.5 text-center whitespace-nowrap align-middle">
                    <BookingStatusBadge status={b.status} label={t(`status.${b.status}`)} />
                </td>

                {/* Actions */}
                <td className="px-6 py-4.5 text-center whitespace-nowrap">
                    <div
                        className="flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {b.status === 'upcoming' && (
                            <button
                                onClick={(e) => onUpdateStatus(b, 'cancelled', e)}
                                className="border border-red-200 bg-red-50/50 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out h-9 rounded-lg px-4 flex items-center gap-1.5 text-xs font-semibold text-red-700 shadow-xs"
                                title={t('bookings.actions.cancelTitle')}
                            >
                                <CalendarX className="h-4 w-4" strokeWidth={2} />
                                {t('bookings.actions.cancel')}
                            </button>
                        )}

                        {b.status === 'cancelled' && (
                            <button
                                onClick={(e) => onUpdateStatus(b, 'upcoming', e)}
                                className="border border-stone-200 bg-stone-50/50 hover:bg-stone-100 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out h-9 rounded-lg px-4 flex items-center gap-1.5 text-xs font-semibold text-stone-700 shadow-xs"
                                title={t('bookings.actions.restoreTitle')}
                            >
                                <RotateCcw className="h-3.5 w-3.5 text-stone-605" />
                                {t('bookings.actions.restore') || 'Restore'}
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Inline expandable ticket card */}
            {isExpanded && (
                <tr className="bg-neutral-50/60 hover:bg-neutral-50/60">
                    <td colSpan={7} className="px-6 py-4 border-t border-neutral-100">
                        <div
                            className="w-full animate-in slide-in-from-top-2 duration-200"
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
