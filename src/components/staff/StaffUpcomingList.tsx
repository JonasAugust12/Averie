'use client';

import { ArrowLeft, Clock } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin/bookings';
import type { BookingListItemDto } from '@typings/booking.type';
import { staffColorAlpha } from '@utils/staff.util';

interface StaffUpcomingListProps {
    bookings: BookingListItemDto[];
    staffColor: string;
    onBack: () => void;
}

export function StaffUpcomingList({ bookings, staffColor, onBack }: StaffUpcomingListProps) {
    const t = useAdminTranslations();

    return (
        <div className="rounded-3xl border border-stone-200/80 bg-white/95 shadow-2xs backdrop-blur-xs overflow-hidden">
            <div className="border-b border-stone-100/90 bg-stone-50/80 px-5 py-4 flex items-center justify-between">
                <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-stone-950 leading-tight">
                        {t('staff.upcomingTitle') || 'Upcoming Appointments'}
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs text-stone-500 mt-0.5">
                        {t('staff.upcomingSubtitle') || 'Next bookings assigned to you'}
                    </p>
                </div>
                <span className="rounded-full bg-stone-200/80 px-3 py-1 font-sans text-xs font-bold text-stone-700 shrink-0">
                    {bookings.length}
                </span>
            </div>

            <div className="p-4 sm:p-5 space-y-2.5">
                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Clock className="h-10 w-10 text-stone-300 mb-2.5" />
                        <p className="font-sans text-sm font-semibold text-stone-400">
                            {t('staff.upcomingEmpty') || 'No upcoming appointments scheduled'}
                        </p>
                    </div>
                ) : (
                    bookings.map((b) => {
                        const serviceName = b.services.map((s) => s.name).join(', ');
                        const clientName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
                        const [timePart, ampm] = [b.time.split(' ')[0], b.time.split(' ')[1]];

                        return (
                            <div
                                key={b.id}
                                className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border border-stone-100/90 bg-stone-50/50 hover:bg-stone-50/90 transition-colors shadow-2xs"
                            >
                                <div
                                    className="shrink-0 rounded-xl px-3 py-2 text-center min-w-14 shadow-2xs"
                                    style={{ backgroundColor: staffColorAlpha(staffColor, 24) }}
                                >
                                    <p
                                        className="font-sans text-xs sm:text-sm font-black leading-none"
                                        style={{ color: staffColor }}
                                    >
                                        {timePart}
                                    </p>
                                    {ampm && (
                                        <p
                                            className="font-sans text-[10px] font-bold mt-0.5"
                                            style={{ color: staffColorAlpha(staffColor, 85) }}
                                        >
                                            {ampm}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-1.5 mb-1">
                                        <h4 className="font-sans text-sm sm:text-base font-bold text-stone-900 leading-tight truncate">
                                            {clientName}
                                        </h4>
                                        <BookingStatusBadge
                                            status={b.status}
                                            label={t(`status.${b.status}`) || b.status}
                                        />
                                    </div>
                                    <p className="font-sans text-xs sm:text-sm text-stone-500 truncate">
                                        {serviceName}
                                        <span className="mx-1 text-stone-300">·</span>
                                        <span className="font-semibold text-stone-700">
                                            {b.totalEstimatedMinutes}m
                                        </span>
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="flex justify-center py-4 border-t border-stone-100/80">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:text-stone-950 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> {t('staffPortal.backButton') || 'Sign Out'}
                </button>
            </div>
        </div>
    );
}
