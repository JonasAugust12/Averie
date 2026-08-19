'use client';

import { useMemo, useState } from 'react';
import { Calendar, Clock, Plus, X, CheckCircle2, PhoneCall, UserCheck } from 'lucide-react';
import { useScheduleSettings } from '@services/schedule.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { getAvailableSlotsForDate, getPeriodForTime } from '@utils/schedule.util';
import { formatDisplayDate } from '@utils/format.util';
import { formatUserName, getUserColor, getUserInitials, staffColorAlpha } from '@utils/staff.util';
import { cn } from '@utils/cn.util';
import { usePreventScroll } from '@hooks/usePreventScroll';
import type { UserDto } from '@typings/salon-user.type';
import type { BookingListItemDto } from '@typings/booking.type';

interface StaffDaySlotsModalProps {
    date: string;
    staff: UserDto;
    bookings: BookingListItemDto[];
    onClose: () => void;
    onSelectBooking?: (booking: BookingListItemDto) => void;
    onBookSlot?: (date: string, time?: string) => void;
}

type PeriodFilter = 'all' | 'morning' | 'afternoon' | 'evening';

export function StaffDaySlotsModal({
    date,
    staff,
    bookings,
    onClose,
    onSelectBooking,
    onBookSlot,
}: StaffDaySlotsModalProps) {
    const t = useAdminTranslations();
    const { data: settings } = useScheduleSettings();
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
    usePreventScroll(true);

    const staffColor = getUserColor(staff);
    const displayName = formatUserName(staff);
    const initials = getUserInitials(staff);

    // Compute slots for this staff on this date
    const allSlots = useMemo(() => {
        if (!settings) return [];
        const dayBookings = bookings
            .filter((b) => b.date === date && b.status !== 'cancelled')
            .map((b) => ({
                date: b.date,
                time: b.time,
                status: b.status as 'upcoming' | 'cancelled',
                staffPreference: (b.staffPreference ?? 'specific') as 'any' | 'specific',
                staffId: b.staffId ?? undefined,
                totalEstimatedMinutes: b.totalEstimatedMinutes ?? 30,
            }));

        return getAvailableSlotsForDate(date, settings, dayBookings, {
            staffPreference: 'specific',
            staffId: staff.id,
        });
    }, [date, settings, bookings, staff.id]);

    const filteredSlots = useMemo(() => {
        if (periodFilter === 'all') return allSlots;
        return allSlots.filter((slot) => getPeriodForTime(slot.time) === periodFilter);
    }, [allSlots, periodFilter]);

    const stats = useMemo(() => {
        const free = allSlots.filter((s) => s.available).length;
        const booked = allSlots.filter((s) => s.lockReason === 'booked').length;
        const inProgress = allSlots.filter((s) => s.lockReason === 'in_progress').length;
        const closed = allSlots.filter((s) => s.lockReason === 'too_soon').length;
        return { total: allSlots.length, free, booked, inProgress, closed };
    }, [allSlots]);

    // Map time to booking details if booked
    const timeToBookingMap = useMemo(() => {
        const map = new Map<string, BookingListItemDto>();
        for (const b of bookings) {
            if (b.date === date && b.status !== 'cancelled') {
                map.set(b.time, b);
            }
        }
        return map;
    }, [bookings, date]);

    return (
        <div
            className="fixed inset-0 z-50 lg:absolute lg:inset-0 lg:z-40 flex items-end sm:items-center justify-center bg-stone-900/45 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="animate-in slide-in-from-bottom-6 sm:zoom-in-95 relative flex max-h-[92vh] lg:max-h-[calc(100vh-8rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-4xl sm:rounded-3xl border bg-white shadow-2xl duration-200"
                style={{ borderColor: staffColorAlpha(staffColor, 40) }}
            >
                {/* Accent Top Bar */}
                <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: staffColor }} />

                {/* Header */}
                <div
                    className="flex shrink-0 items-center justify-between border-b p-4 sm:p-5"
                    style={{
                        backgroundColor: staffColorAlpha(staffColor, 6),
                        borderColor: staffColorAlpha(staffColor, 15),
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-sm font-black text-white shadow-sm"
                            style={{ backgroundColor: staffColor }}
                        >
                            {initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-display text-base sm:text-lg font-bold text-stone-900">
                                    {displayName}
                                </h3>
                                <span
                                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0"
                                    style={{
                                        backgroundColor: staffColorAlpha(staffColor, 14),
                                        borderColor: staffColorAlpha(staffColor, 30),
                                        color: staffColor,
                                    }}
                                >
                                    <UserCheck className="size-3" />
                                    {(staff.specialties[0] ??
                                        t('schedule.daySlotsModal.staffTitle')) ||
                                        'Staff Schedule'}
                                </span>
                            </div>
                            <p className="mt-0.5 font-sans text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-stone-500 shrink-0" />
                                <span className="truncate">{formatDisplayDate(date)}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto self-start sm:self-center rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Quick Stats Summary */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50/80 p-3 sm:p-4 border-b border-stone-100 text-center font-sans text-xs shrink-0">
                    <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/90 p-2 sm:p-2.5 text-emerald-950">
                        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                            {t('schedule.daySlotsModal.freeSlots') || 'Free'}
                        </p>
                        <p className="font-display text-base sm:text-lg font-black text-emerald-900 mt-0.5">
                            {stats.free} / {stats.total}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-stone-200/90 bg-stone-100/90 p-2 sm:p-2.5 text-stone-900">
                        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-stone-600">
                            {t('schedule.daySlotsModal.bookedSlots') || 'Booked'}
                        </p>
                        <p className="font-display text-base sm:text-lg font-black text-stone-900 mt-0.5">
                            {stats.booked}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 p-2 sm:p-2.5 text-amber-950">
                        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                            {t('schedule.daySlotsModal.inProgressSlots') || 'Serving'}
                        </p>
                        <p className="font-display text-base sm:text-lg font-black text-amber-900 mt-0.5">
                            {stats.inProgress}
                        </p>
                    </div>
                </div>

                {/* Period Filter Tabs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-b border-stone-100 px-4 sm:px-5 py-2.5 bg-white shrink-0">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        {(['all', 'morning', 'afternoon', 'evening'] as const).map((period) => {
                            const labels = {
                                all: t('schedule.daySlotsModal.allPeriods') || 'All Day',
                                morning: t('schedule.periods.morning') || 'Morning',
                                afternoon: t('schedule.periods.afternoon') || 'Afternoon',
                                evening: t('schedule.periods.evening') || 'Evening',
                            };
                            const isActive = periodFilter === period;
                            return (
                                <button
                                    key={period}
                                    type="button"
                                    onClick={() => setPeriodFilter(period)}
                                    className={cn(
                                        'rounded-xl px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0',
                                        isActive
                                            ? 'bg-stone-900 text-white shadow-2xs'
                                            : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200/70',
                                    )}
                                >
                                    {labels[period]}
                                </button>
                            );
                        })}
                    </div>

                    {onBookSlot ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onBookSlot(date);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 sm:py-1.5 font-sans text-xs font-bold text-white shadow-2xs hover:bg-emerald-800 active:scale-98 transition-all cursor-pointer min-h-10 sm:min-h-0"
                        >
                            <Plus className="size-3.5" />
                            <span>{t('schedule.daySlotsModal.quickBook') || 'Quick Book'}</span>
                        </button>
                    ) : null}
                </div>

                {/* Slots Grid */}
                <div className="p-4 sm:p-5 flex-1 overflow-y-auto min-h-48">
                    {filteredSlots.length === 0 ? (
                        <div className="py-12 text-center text-stone-400 font-sans text-xs font-medium">
                            {t('booking.time.noSlots') ||
                                'No time slots available for the selected period.'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                            {filteredSlots.map((slot) => {
                                const booking = timeToBookingMap.get(slot.time);

                                // Free / Available Slot
                                if (slot.available) {
                                    return (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            onClick={() => {
                                                if (onBookSlot) {
                                                    onClose();
                                                    onBookSlot(date, slot.time);
                                                }
                                            }}
                                            className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-200/80 bg-emerald-50/50 p-2.5 sm:p-3 text-center transition-all hover:bg-emerald-100/80 hover:border-emerald-300 hover:scale-102 active:scale-98 cursor-pointer shadow-3xs min-h-16"
                                        >
                                            <span className="font-sans text-xs sm:text-sm font-black text-emerald-900 flex items-center gap-1">
                                                <Clock className="size-3.5 text-emerald-600 shrink-0" />
                                                <span>{slot.time}</span>
                                            </span>
                                            <span className="mt-1 inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                                                <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                                                <span>
                                                    {t('schedule.daySlotsModal.freeSlots') ||
                                                        'Free'}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                }

                                // Booked Slot
                                if (slot.lockReason === 'booked') {
                                    return (
                                        <div
                                            key={slot.id}
                                            onClick={() => {
                                                if (booking && onSelectBooking) {
                                                    onClose();
                                                    onSelectBooking(booking);
                                                }
                                            }}
                                            className={cn(
                                                'relative flex flex-col items-center justify-center rounded-2xl border border-stone-300 bg-stone-800 p-2.5 sm:p-3 text-center text-white shadow-2xs overflow-hidden select-none min-h-16',
                                                booking &&
                                                    onSelectBooking &&
                                                    'cursor-pointer hover:bg-stone-900 hover:scale-101 transition-all',
                                            )}
                                        >
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                                <div className="w-[150%] -rotate-20 py-0.5 text-center font-sans text-[8px] font-black uppercase tracking-widest bg-stone-700/90 text-white shadow-xs">
                                                    {t('schedule.daySlotsModal.bookedSlots') ||
                                                        'Booked'}
                                                </div>
                                            </div>
                                            <span className="font-sans text-xs sm:text-sm font-bold opacity-30">
                                                {slot.time}
                                            </span>
                                            {booking ? (
                                                <span className="mt-1 truncate max-w-full font-sans text-[10px] font-semibold text-stone-300 relative z-10">
                                                    {booking.customer.firstName}{' '}
                                                    {booking.customer.lastName}
                                                </span>
                                            ) : null}
                                        </div>
                                    );
                                }

                                // In Progress / Serving Slot
                                if (slot.lockReason === 'in_progress') {
                                    return (
                                        <div
                                            key={slot.id}
                                            className="relative flex flex-col items-center justify-center rounded-2xl border border-amber-300 bg-amber-700 p-2.5 sm:p-3 text-center text-white shadow-2xs overflow-hidden select-none min-h-16"
                                        >
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                                <div className="w-[150%] -rotate-20 py-0.5 text-center font-sans text-[8px] font-black uppercase tracking-widest bg-amber-600/95 text-white shadow-xs">
                                                    {t('schedule.daySlotsModal.inProgressSlots') ||
                                                        'Serving'}
                                                </div>
                                            </div>
                                            <span className="font-sans text-xs sm:text-sm font-bold opacity-30">
                                                {slot.time}
                                            </span>
                                        </div>
                                    );
                                }

                                // Unavailable or Closed Slot
                                return (
                                    <div
                                        key={slot.id}
                                        className="relative flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 p-2.5 sm:p-3 text-center text-stone-400 opacity-60 overflow-hidden select-none min-h-16"
                                    >
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                            <div className="w-[150%] -rotate-20 py-0.5 text-center font-sans text-[8px] font-black uppercase tracking-widest bg-stone-400/90 text-white shadow-xs">
                                                {t('schedule.daySlotsModal.closedSlots') ||
                                                    'Closed'}
                                            </div>
                                        </div>
                                        <span className="font-sans text-xs sm:text-sm font-bold opacity-30">
                                            {slot.time}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Info / Tip */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/90 px-4 sm:px-5 py-3 font-sans text-xs text-stone-600 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <PhoneCall className="size-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-[11px] sm:text-xs">
                            {t('schedule.daySlotsModal.quickBookTip') ||
                                'Click a green slot to instantly create an appointment for a walk-in or call-in client.'}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-stone-200 bg-white px-4 py-2 sm:py-1.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100 cursor-pointer shadow-3xs text-center"
                    >
                        {t('close') || 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
}
