'use client';

import { ArrowLeft, Clock } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin';
import type { SalonBooking } from '@typings/salon.type';

interface StaffUpcomingListProps {
    bookings: SalonBooking[];
    serviceMap: Map<string, string>;
    staffColor: string;
    onBack: () => void;
}

export function StaffUpcomingList({
    bookings,
    serviceMap,
    staffColor,
    onBack,
}: StaffUpcomingListProps) {
    const t = useAdminTranslations();

    return (
        <div className="rounded-2xl border border-stone-200/80 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-stone-100 bg-stone-50/70 px-4 py-3 flex items-center justify-between">
                <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-stone-950 leading-tight">
                        {t('staff.upcomingTitle')}
                    </h3>
                    <p className="font-sans text-[10px] sm:text-xs text-stone-500 mt-0.5">
                        {t('staff.upcomingSubtitle')}
                    </p>
                </div>
                <span className="rounded-full bg-stone-200/70 px-2.5 py-0.5 font-sans text-xs font-bold text-stone-700 shrink-0">
                    {bookings.length}
                </span>
            </div>

            <div className="p-3 space-y-2">
                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Clock className="h-10 w-10 text-stone-200 mb-2.5" />
                        <p className="font-sans text-sm font-semibold text-stone-400">
                            {t('staff.upcomingEmpty')}
                        </p>
                    </div>
                ) : (
                    bookings.map((b) => {
                        const serviceName = serviceMap.get(b.serviceId) ?? b.serviceId;
                        const clientName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
                        const [timePart, ampm] = [b.time.split(' ')[0], b.time.split(' ')[1]];

                        return (
                            <div
                                key={b.id}
                                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-stone-100/80 bg-stone-50/40 active:bg-white hover:bg-white hover:border-stone-200 transition-all duration-200"
                            >
                                {/* Time bubble */}
                                <div
                                    className="shrink-0 rounded-xl px-2.5 py-2 text-center min-w-13"
                                    style={{ backgroundColor: `${staffColor}1a` }}
                                >
                                    <p
                                        className="font-sans text-[11px] sm:text-sm font-black leading-none"
                                        style={{ color: staffColor }}
                                    >
                                        {timePart}
                                    </p>
                                    {ampm && (
                                        <p
                                            className="font-sans text-[9px] font-bold mt-0.5"
                                            style={{ color: staffColor, opacity: 0.65 }}
                                        >
                                            {ampm}
                                        </p>
                                    )}
                                </div>

                                {/* Booking details */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-1 mb-1">
                                        <h4 className="font-sans text-sm sm:text-base font-bold text-stone-900 leading-tight truncate">
                                            {clientName}
                                        </h4>
                                        <BookingStatusBadge
                                            status={b.status}
                                            label={t(`status.${b.status}`)}
                                        />
                                    </div>
                                    <p className="font-sans text-[11px] sm:text-sm text-stone-500 truncate">
                                        {serviceName}
                                        <span className="mx-1 text-stone-300">·</span>
                                        <span className="font-semibold text-stone-600">
                                            {b.durationMin}m
                                        </span>
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="flex justify-center py-3">
                <button
                    onClick={onBack}
                    className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1.5 py-3 px-4"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> {t('staffPortal.backButton')}
                </button>
            </div>
        </div>
    );
}
