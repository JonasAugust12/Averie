'use client';

import { useMemo } from 'react';
import { User, Phone, Mail, Scissors } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import Image from 'next/image';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import type { BookingListItemDto } from '@typings/booking.type';

// Micro Barcode Component
function BarCode({ code }: { code: string }) {
    const bits = useMemo(() => {
        let h = 0;
        for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
        return Array.from({ length: 95 }, (_, i) => ((h >> (i % 31)) & 1) === 1);
    }, [code]);

    const width = 180;
    const height = 45;
    const barW = Math.floor(width / bits.length);
    const offsetX = (width - bits.length * barW) / 2;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            aria-label={`Barcode ${code}`}
            className="select-none mx-auto opacity-75"
        >
            <rect x="0" y="0" width={width} height={height} fill="#FCFAF6" />
            <g transform={`translate(${offsetX}, 0)`}>
                {bits.map((isThick, i) => (
                    <rect
                        key={i}
                        x={i * barW}
                        y={2}
                        width={isThick ? Math.max(1, barW) : Math.max(1, Math.floor(barW * 0.6))}
                        height={height - 4}
                        fill="#2E2A27"
                    />
                ))}
            </g>
        </svg>
    );
}

interface BookingTicketCardProps {
    booking: BookingListItemDto;
    serviceName: string | undefined;
    staffName: string | undefined;
}

export function BookingTicketCard({ booking, serviceName, staffName }: BookingTicketCardProps) {
    const t = useAdminTranslations();

    // Placed Date formatter
    const formatPlacedDate = (createdAtStr?: string) => {
        if (!createdAtStr) return '—';
        try {
            const d = new Date(createdAtStr);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch {
            return createdAtStr;
        }
    };

    return (
        <div className="w-full bg-[#FCFAF6] border border-[#EAE4D9]/95 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row pb-4 md:pb-0">
            {/* Left strip vertical logo header */}
            <div className="w-full md:w-20 bg-[#221F1C] flex items-center justify-center py-4 px-3.5 md:py-0 border-b md:border-b-0 md:border-r border-[#EAE4D9]/20 self-stretch shrink-0">
                <Image
                    src="/icons/logo_round.png"
                    alt="Averie Logo"
                    width={48}
                    height={48}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover opacity-95 hover:opacity-100 transition-opacity shadow-sm"
                />
            </div>

            {/* Body columns layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 relative">
                {/* Left ticket segment */}
                <div className="md:col-span-8 p-5 md:ml-2 flex flex-col justify-between">
                    {/* Ticket Header & Brand */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0ECE4] pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#221F1C] flex items-center justify-center text-white">
                                <Scissors className="w-3.5 h-3.5 text-amber-200" />
                            </div>
                            <div>
                                <span className="font-serif text-xs uppercase tracking-wider text-amber-800 font-bold block">
                                    Averie Salon
                                </span>
                                <span className="text-[10px] text-stone-500 font-medium leading-none block mt-0.5">
                                    Premium Nailcare Experience
                                </span>
                            </div>
                        </div>
                        <div className="text-stone-500 text-[11px] font-semibold">
                            {t('bookings.detailCard.placedAt')}{' '}
                            <span className="text-stone-850 font-bold ml-0.5">
                                {formatPlacedDate(booking.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Client information card */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3 font-sans text-xs">
                            <div>
                                <span className="text-stone-400 font-medium block uppercase tracking-wider text-[9px]">
                                    {t('bookings.detailCard.customerInfo')}
                                </span>
                                <span className="font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-stone-450" />
                                    {booking.customer.firstName} {booking.customer.lastName}
                                </span>
                            </div>
                            <div>
                                <span className="text-stone-400 font-medium block uppercase tracking-wider text-[9px]">
                                    {t('bookings.detailCard.phone')}
                                </span>
                                <span className="font-semibold text-stone-850 tracking-wide mt-0.5 flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-stone-450" />
                                    {booking.customer.phone}
                                </span>
                            </div>
                            {booking.customer.email && (
                                <div>
                                    <span className="text-stone-400 font-medium block uppercase tracking-wider text-[9px]">
                                        {t('bookings.detailCard.email')}
                                    </span>
                                    <span className="text-stone-850 break-all mt-0.5 flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-stone-450" />
                                        {booking.customer.email}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Note content */}
                        <div className="flex flex-col justify-start">
                            <span className="text-stone-400 font-medium block uppercase tracking-wider text-[9px] mb-1">
                                {t('bookings.detailCard.notes')}
                            </span>
                            <div className="flex-1 p-2.5 bg-[#FAF9F5] border border-[#EFEBE4] rounded-lg text-stone-605 italic text-[11px] min-h-16 flex items-center justify-center text-center">
                                {booking.customer.note || t('bookings.detailCard.noNotes')}
                            </div>
                        </div>
                    </div>

                    {/* Tear away dotted line for mobile */}
                    <div className="h-0.5 mt-4 w-full opacity-70 [background:repeating-linear-gradient(to_right,#EAE4D9_0_8px,transparent_8px_10px)] block md:hidden" />
                </div>

                {/* Vertical ticket tear separator */}
                <div className="hidden md:block md:col-span-1 relative">
                    <div className="relative h-full w-4.5 mx-auto pointer-events-none">
                        <div
                            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5
                                         [background:repeating-linear-gradient(to_bottom,#EAE4D9_0_6px,transparent_6px_14px)] opacity-80"
                        />
                        {/* Punch holes ticket look */}
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-[#EAE4D9]/80" />
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-[#EAE4D9]/80" />
                    </div>
                </div>

                {/* Right ticket stub segment */}
                <div className="md:col-span-3 p-5 flex flex-col items-center justify-between text-center border-l md:border-l-0 border-[#F0ECE4] md:pl-2">
                    <div className="w-full space-y-3">
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block">
                                {serviceName || 'Treatment'}
                            </span>
                            <span className="text-xs text-stone-500 font-medium block mt-0.5">
                                {staffName || t('bookings.detailCard.anyStaff')} (
                                {booking.totalEstimatedMinutes} {t('bookings.detailCard.minsUnit')})
                            </span>
                        </div>

                        <div className="bg-[#FAF9F5] border border-[#EFEBE4] py-2 px-1.5 rounded-lg">
                            <span className="text-stone-400 font-semibold block uppercase tracking-wider text-[8px]">
                                {t('bookings.detailCard.time')}
                            </span>
                            <span className="text-stone-850 font-bold block text-xs mt-0.5">
                                {formatDisplayDate(booking.date)} | {booking.time}
                            </span>
                        </div>

                        <div>
                            <span className="text-stone-400 font-medium block uppercase tracking-wider text-[8px]">
                                {t('bookings.detailCard.totalPrice')}
                            </span>
                            <span className="text-stone-900 font-serif text-lg font-bold block leading-tight">
                                {formatUsd(booking.totalPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Barcode drawing */}
                    <div className="mt-4 w-full">
                        <BarCode code={booking.reference} />
                        <span className="text-[9px] font-mono text-stone-400 block tracking-widest mt-1">
                            {booking.reference}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
