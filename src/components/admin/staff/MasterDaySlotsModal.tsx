'use client';

import { useMemo, useState } from 'react';
import { Calendar, Clock, Plus, X, PhoneCall, Users, Sparkles, ChevronRight } from 'lucide-react';
import { useScheduleSettings } from '@services/schedule.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import {
    getAllConfiguredSlotsForWeekday,
    getAvailableSlotsForDate,
    getOffPeriodsForDate,
    getPeriodForTime,
    getWeekdayFromDate,
} from '@utils/schedule.util';
import { isSlotTooSoon } from '@utils/booking-schedule.util';
import { formatDisplayDate } from '@utils/format.util';
import { formatUserName, getUserColor, getUserInitials, staffColorAlpha } from '@utils/staff.util';
import { cn } from '@utils/cn.util';
import { usePreventScroll } from '@hooks/usePreventScroll';
import type { UserDto } from '@typings/salon-user.type';
import type { BookingListItemDto } from '@typings/booking.type';

interface MasterDaySlotsModalProps {
    date: string;
    staffList: UserDto[];
    bookings: BookingListItemDto[];
    onClose: () => void;
    onSelectBooking?: (booking: BookingListItemDto) => void;
    onBookSlot?: (date: string, time?: string, staffId?: string) => void;
}

type PeriodFilter = 'all' | 'morning' | 'afternoon' | 'evening';

export function MasterDaySlotsModal({
    date,
    staffList,
    bookings,
    onClose,
    onSelectBooking,
    onBookSlot,
}: MasterDaySlotsModalProps) {
    const t = useAdminTranslations();
    const { data: settings } = useScheduleSettings();
    const [selectedStaffId, setSelectedStaffId] = useState<string | 'all' | 'any'>('all');
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
    usePreventScroll(true);

    // Only active visible staff
    const activeStaffList = useMemo(() => {
        return staffList.filter((s) => s.visible !== false);
    }, [staffList]);

    // Group 'any' bookings on this date by time slot
    const anyBookingsByTime = useMemo(() => {
        const map = new Map<string, BookingListItemDto[]>();
        for (const b of bookings) {
            if (b.date === date && b.status !== 'cancelled') {
                if (b.staffPreference === 'any' || !b.staffId) {
                    const list = map.get(b.time) ?? [];
                    list.push(b);
                    map.set(b.time, list);
                }
            }
        }
        return map;
    }, [bookings, date]);

    // Total count of 'any' bookings on this date
    const totalAnyBookingsCount = useMemo(() => {
        let count = 0;
        anyBookingsByTime.forEach((list) => {
            count += list.length;
        });
        return count;
    }, [anyBookingsByTime]);

    // Compute slots for Any Specialist (flexible) for this date
    // Slots with 'any' bookings are marked as 'booked', other open slots remain free.
    const anySlots = useMemo(() => {
        if (!settings) return [];
        const offPeriods = getOffPeriodsForDate(date, settings);
        const weekday = getWeekdayFromDate(date);
        const now = new Date();

        return getAllConfiguredSlotsForWeekday(settings, weekday)
            .filter((slot) => !offPeriods.includes(getPeriodForTime(slot.time)))
            .map((slot) => {
                const bookedList = anyBookingsByTime.get(slot.time);
                let available = true;
                let lockReason: 'booked' | 'too_soon' | undefined;

                if (bookedList && bookedList.length > 0) {
                    available = false;
                    lockReason = 'booked';
                } else if (isSlotTooSoon(date, slot.time, now)) {
                    available = false;
                    lockReason = 'too_soon';
                }

                return {
                    ...slot,
                    available,
                    ...(lockReason ? { lockReason } : {}),
                };
            });
    }, [date, settings, anyBookingsByTime]);

    // Compute slots per specific staff for this date
    // ONLY bookings assigned specifically to this staff member will lock their slots.
    const staffSlotsMap = useMemo(() => {
        if (!settings) return new Map<string, ReturnType<typeof getAvailableSlotsForDate>>();

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

        const map = new Map<string, ReturnType<typeof getAvailableSlotsForDate>>();
        for (const staff of activeStaffList) {
            const slots = getAvailableSlotsForDate(date, settings, dayBookings, {
                staffPreference: 'specific',
                staffId: staff.id,
            });
            map.set(staff.id, slots);
        }
        return map;
    }, [date, settings, bookings, activeStaffList]);

    // Aggregate summary stats for the active view / filter
    const activeViewStats = useMemo(() => {
        if (selectedStaffId === 'any') {
            const total = anySlots.length;
            const free = anySlots.filter((s) => s.available).length;
            return {
                totalSlots: total,
                freeSlots: free,
                booked: totalAnyBookingsCount,
                inProgress: 0,
                activeStaffCount: activeStaffList.length,
            };
        }

        if (selectedStaffId !== 'all') {
            const slots = staffSlotsMap.get(selectedStaffId) ?? [];
            const free = slots.filter((s) => s.available).length;
            const booked = slots.filter((s) => s.lockReason === 'booked').length;
            const inProgress = slots.filter((s) => s.lockReason === 'in_progress').length;
            return {
                totalSlots: slots.length,
                freeSlots: free,
                booked,
                inProgress,
                activeStaffCount: activeStaffList.length,
            };
        }

        // 'all' view: aggregate across all staff
        let totalSlotsCount = 0;
        let freeSlotsCount = 0;
        let inProgressCount = 0;

        staffSlotsMap.forEach((slots) => {
            totalSlotsCount += slots.length;
            freeSlotsCount += slots.filter((s) => s.available).length;
            inProgressCount += slots.filter((s) => s.lockReason === 'in_progress').length;
        });

        // Add 'any' bookings to the overall salon booked tally
        const allDayBookingsCount = bookings.filter(
            (b) => b.date === date && b.status !== 'cancelled',
        ).length;

        return {
            totalSlots: totalSlotsCount,
            freeSlots: freeSlotsCount,
            booked: allDayBookingsCount,
            inProgress: inProgressCount,
            activeStaffCount: activeStaffList.length,
        };
    }, [
        selectedStaffId,
        anySlots,
        totalAnyBookingsCount,
        staffSlotsMap,
        activeStaffList.length,
        bookings,
        date,
    ]);

    // Map time to booking details for quick click-to-view for specific staff
    const timeAndStaffToBookingMap = useMemo(() => {
        const map = new Map<string, BookingListItemDto>();
        for (const b of bookings) {
            if (b.date === date && b.status !== 'cancelled') {
                if (b.staffId && b.staffPreference === 'specific') {
                    map.set(`${b.staffId}_${b.time}`, b);
                }
            }
        }
        return map;
    }, [bookings, date]);

    // Filter staff list based on active tab selection
    const displayedStaffList = useMemo(() => {
        if (selectedStaffId === 'all') return activeStaffList;
        if (selectedStaffId === 'any') return [];
        return activeStaffList.filter((s) => s.id === selectedStaffId);
    }, [activeStaffList, selectedStaffId]);

    const renderAnySpecialistCard = () => {
        const rawSlots = anySlots;
        const filteredSlots =
            periodFilter === 'all'
                ? rawSlots
                : rawSlots.filter((slot) => getPeriodForTime(slot.time) === periodFilter);

        const freeCount = rawSlots.filter((s) => s.available).length;

        return (
            <div
                key="any-specialist"
                className="rounded-2xl border border-amber-300/80 bg-amber-50/20 p-4 transition-all shadow-3xs"
            >
                {/* Any Specialist Header */}
                <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-amber-200/60">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-600 font-display text-xs font-black text-white shadow-sm">
                            <Sparkles className="size-4 text-white" />
                        </div>
                        <div>
                            <h4 className="font-display text-sm font-bold text-stone-900 flex items-center gap-2">
                                <span>
                                    {t('schedule.daySlotsModal.anyStaff') || 'Any Specialist'}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.2 text-[9px] font-bold text-amber-800 uppercase">
                                    {t('booking.staff.autoAssign') || 'Flexible / Auto'}
                                </span>
                            </h4>
                            <p className="text-[11px] font-sans text-stone-500">
                                <span className="text-emerald-700 font-bold">{freeCount}</span>{' '}
                                {t('schedule.daySlotsModal.freeSlots') || 'Free'} •{' '}
                                <span className="text-stone-900 font-bold">
                                    {totalAnyBookingsCount}
                                </span>{' '}
                                {t('schedule.daySlotsModal.bookedSlots') || 'Booked'}
                            </p>
                        </div>
                    </div>

                    {onBookSlot ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onBookSlot(date, undefined, undefined);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 font-sans text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                            <span>
                                {t('schedule.daySlotsModal.bookFor', {
                                    name: t('schedule.daySlotsModal.anyStaff') || 'Any Specialist',
                                }) || 'Book for Any Specialist'}
                            </span>
                            <ChevronRight className="size-3 text-emerald-600" />
                        </button>
                    ) : null}
                </div>

                {/* Time Slots Grid for Any Specialist */}
                {filteredSlots.length === 0 ? (
                    <div className="py-6 text-center text-stone-400 font-sans text-xs">
                        {t('booking.time.noSlots') || 'No time slots available'}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {filteredSlots.map((slot) => {
                            const bookingsAtTime = anyBookingsByTime.get(slot.time) ?? [];
                            const primaryBooking = bookingsAtTime[0];

                            // Free Slot
                            if (slot.available) {
                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => {
                                            if (onBookSlot) {
                                                onClose();
                                                onBookSlot(date, slot.time, undefined);
                                            }
                                        }}
                                        className="group relative flex flex-col items-center justify-center rounded-xl border border-emerald-300/80 bg-emerald-50/70 p-2 text-center transition-all hover:bg-emerald-100 hover:border-emerald-400 hover:scale-102 active:scale-98 cursor-pointer shadow-3xs min-h-14"
                                    >
                                        <span className="font-sans text-xs font-black text-emerald-950 flex items-center gap-1">
                                            <Clock className="size-3 text-emerald-600 shrink-0" />
                                            <span>{slot.time}</span>
                                        </span>
                                        <span className="mt-0.5 text-[9px] font-extrabold uppercase text-emerald-700">
                                            {t('schedule.daySlotsModal.freeSlots') || 'Free'}
                                        </span>
                                    </button>
                                );
                            }

                            // Booked Slot (Shows customer name)
                            if (slot.lockReason === 'booked') {
                                const customerLabel =
                                    bookingsAtTime.length > 1
                                        ? `${bookingsAtTime.length} Bookings`
                                        : primaryBooking
                                          ? `${primaryBooking.customer.firstName} ${primaryBooking.customer.lastName}`.trim()
                                          : 'Booked';

                                return (
                                    <div
                                        key={slot.id}
                                        onClick={() => {
                                            if (primaryBooking && onSelectBooking) {
                                                onClose();
                                                onSelectBooking(primaryBooking);
                                            }
                                        }}
                                        className={cn(
                                            'relative flex flex-col items-center justify-center rounded-xl border border-stone-400 bg-stone-800 p-2 text-center text-white shadow-2xs overflow-hidden select-none min-h-14',
                                            primaryBooking &&
                                                onSelectBooking &&
                                                'cursor-pointer hover:bg-stone-900 transition-all',
                                        )}
                                    >
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                            <div className="w-[160%] -rotate-20 py-0.5 text-center font-sans text-[7px] font-black uppercase tracking-widest bg-stone-700/90 text-white">
                                                {t('schedule.daySlotsModal.bookedSlots') ||
                                                    'Booked'}
                                            </div>
                                        </div>
                                        <span className="font-sans text-xs font-bold opacity-30">
                                            {slot.time}
                                        </span>
                                        <span className="mt-0.5 truncate max-w-full font-sans text-[9px] font-semibold text-stone-300 relative z-10 px-1">
                                            {customerLabel}
                                        </span>
                                    </div>
                                );
                            }

                            // Closed Slot
                            return (
                                <div
                                    key={slot.id}
                                    className="relative flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-100 p-2 text-center text-stone-400 opacity-60 overflow-hidden select-none min-h-14"
                                >
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                        <div className="w-[160%] -rotate-20 py-0.5 text-center font-sans text-[7px] font-black uppercase tracking-widest bg-stone-400/90 text-white">
                                            {t('schedule.daySlotsModal.closedSlots') || 'Closed'}
                                        </div>
                                    </div>
                                    <span className="font-sans text-xs font-bold opacity-30">
                                        {slot.time}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderStaffCard = (staff: UserDto) => {
        const staffColor = getUserColor(staff);
        const displayName = formatUserName(staff);
        const initials = getUserInitials(staff);
        const rawSlots = staffSlotsMap.get(staff.id) ?? [];

        const filteredSlots =
            periodFilter === 'all'
                ? rawSlots
                : rawSlots.filter((slot) => getPeriodForTime(slot.time) === periodFilter);

        const freeCount = rawSlots.filter((s) => s.available).length;
        const bookedCount = rawSlots.filter((s) => s.lockReason === 'booked').length;

        return (
            <div
                key={staff.id}
                className="rounded-2xl border bg-stone-50/50 p-4 transition-all"
                style={{ borderColor: staffColorAlpha(staffColor, 30) }}
            >
                {/* Staff Header */}
                <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-stone-200/60">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-xs font-black text-white shadow-sm"
                            style={{ backgroundColor: staffColor }}
                        >
                            {initials}
                        </div>
                        <div>
                            <h4 className="font-display text-sm font-bold text-stone-900 flex items-center gap-2">
                                <span>{displayName}</span>
                                <span
                                    className="inline-flex items-center rounded-full px-2 py-0.2 text-[9px] font-bold uppercase"
                                    style={{
                                        backgroundColor: staffColorAlpha(staffColor, 15),
                                        color: staffColor,
                                    }}
                                >
                                    {staff.specialties[0] ?? 'Technician'}
                                </span>
                            </h4>
                            <p className="text-[11px] font-sans text-stone-500">
                                <span className="text-emerald-700 font-bold">{freeCount}</span>{' '}
                                {t('schedule.daySlotsModal.freeSlots') || 'Free'} •{' '}
                                <span className="text-stone-900 font-bold">{bookedCount}</span>{' '}
                                {t('schedule.daySlotsModal.bookedSlots') || 'Booked'}
                            </p>
                        </div>
                    </div>

                    {onBookSlot ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onBookSlot(date, undefined, staff.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 font-sans text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                            <span>
                                {t('schedule.daySlotsModal.bookFor', {
                                    name: displayName.split(' ')[0],
                                }) || `Book for ${displayName.split(' ')[0]}`}
                            </span>
                            <ChevronRight className="size-3 text-emerald-600" />
                        </button>
                    ) : null}
                </div>

                {/* Time Slots Grid for this staff */}
                {filteredSlots.length === 0 ? (
                    <div className="py-6 text-center text-stone-400 font-sans text-xs">
                        {t('booking.time.noSlots') || 'No time slots available'}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {filteredSlots.map((slot) => {
                            const bookingKey = `${staff.id}_${slot.time}`;
                            const booking = timeAndStaffToBookingMap.get(bookingKey);

                            // Free / Available Slot
                            if (slot.available) {
                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => {
                                            if (onBookSlot) {
                                                onClose();
                                                onBookSlot(date, slot.time, staff.id);
                                            }
                                        }}
                                        className="group relative flex flex-col items-center justify-center rounded-xl border border-emerald-300/80 bg-emerald-50/70 p-2 text-center transition-all hover:bg-emerald-100 hover:border-emerald-400 hover:scale-102 active:scale-98 cursor-pointer shadow-3xs min-h-14"
                                    >
                                        <span className="font-sans text-xs font-black text-emerald-950 flex items-center gap-1">
                                            <Clock className="size-3 text-emerald-600 shrink-0" />
                                            <span>{slot.time}</span>
                                        </span>
                                        <span className="mt-0.5 text-[9px] font-extrabold uppercase text-emerald-700">
                                            {t('schedule.daySlotsModal.freeSlots') || 'Free'}
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
                                            'relative flex flex-col items-center justify-center rounded-xl border border-stone-400 bg-stone-800 p-2 text-center text-white shadow-2xs overflow-hidden select-none min-h-14',
                                            booking &&
                                                onSelectBooking &&
                                                'cursor-pointer hover:bg-stone-900 transition-all',
                                        )}
                                    >
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                            <div className="w-[160%] -rotate-20 py-0.5 text-center font-sans text-[7px] font-black uppercase tracking-widest bg-stone-700/90 text-white">
                                                {t('schedule.daySlotsModal.bookedSlots') ||
                                                    'Booked'}
                                            </div>
                                        </div>
                                        <span className="font-sans text-xs font-bold opacity-30">
                                            {slot.time}
                                        </span>
                                        {booking ? (
                                            <span className="mt-0.5 truncate max-w-full font-sans text-[9px] font-semibold text-stone-300 relative z-10 px-1">
                                                {booking.customer.firstName}{' '}
                                                {booking.customer.lastName}
                                            </span>
                                        ) : null}
                                    </div>
                                );
                            }

                            // Serving Slot
                            if (slot.lockReason === 'in_progress') {
                                return (
                                    <div
                                        key={slot.id}
                                        className="relative flex flex-col items-center justify-center rounded-xl border border-amber-300 bg-amber-700 p-2 text-center text-white shadow-2xs overflow-hidden select-none min-h-14"
                                    >
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                            <div className="w-[160%] -rotate-20 py-0.5 text-center font-sans text-[7px] font-black uppercase tracking-widest bg-amber-600/95 text-white">
                                                {t('schedule.daySlotsModal.inProgressSlots') ||
                                                    'Serving'}
                                            </div>
                                        </div>
                                        <span className="font-sans text-xs font-bold opacity-30">
                                            {slot.time}
                                        </span>
                                    </div>
                                );
                            }

                            // Closed Slot
                            return (
                                <div
                                    key={slot.id}
                                    className="relative flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-100 p-2 text-center text-stone-400 opacity-60 overflow-hidden select-none min-h-14"
                                >
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                        <div className="w-[160%] -rotate-20 py-0.5 text-center font-sans text-[7px] font-black uppercase tracking-widest bg-stone-400/90 text-white">
                                            {t('schedule.daySlotsModal.closedSlots') || 'Closed'}
                                        </div>
                                    </div>
                                    <span className="font-sans text-xs font-bold opacity-30">
                                        {slot.time}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 lg:absolute lg:inset-0 lg:z-40 flex items-end sm:items-center justify-center bg-stone-900/45 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="animate-in slide-in-from-bottom-6 sm:zoom-in-95 relative flex max-h-[92vh] lg:max-h-[calc(100vh-8rem)] w-full max-w-4xl flex-col overflow-hidden rounded-t-4xl sm:rounded-3xl border border-stone-200 bg-white shadow-2xl duration-200">
                {/* Header Banner */}
                <div className="flex shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 bg-linear-to-r from-stone-900 via-stone-800 to-stone-900 p-4 sm:p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-display font-black shadow-inner">
                            <Users className="size-6 text-amber-300" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-display text-base sm:text-xl font-bold text-white truncate">
                                    {t('schedule.daySlotsModal.masterTitle') ||
                                        'Master Daily Availability'}
                                </h3>
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-200 uppercase tracking-wider shrink-0">
                                    {activeViewStats.activeStaffCount}{' '}
                                    {t('nav.employees') || 'Staff'}
                                </span>
                            </div>
                            <p className="mt-0.5 font-sans text-xs font-medium text-stone-300 flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-amber-400 shrink-0" />
                                <span className="truncate">{formatDisplayDate(date)}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto self-start sm:self-center rounded-xl p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Quick Salon Summary KPI Bar */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 sm:p-4 border-b border-stone-100 text-center font-sans text-xs shrink-0">
                    <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/90 p-2 sm:p-2.5 text-emerald-950">
                        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                            {t('schedule.daySlotsModal.freeSlots') || 'Free'}
                        </p>
                        <p className="font-display text-base sm:text-lg font-black text-emerald-900 mt-0.5">
                            {activeViewStats.freeSlots}{' '}
                            <span className="text-xs font-normal text-emerald-700">
                                / {activeViewStats.totalSlots}
                            </span>
                        </p>
                    </div>
                    <div className="rounded-2xl border border-stone-200/90 bg-stone-100/90 p-2 sm:p-2.5 text-stone-900">
                        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-stone-600">
                            {t('schedule.daySlotsModal.bookedSlots') || 'Booked'}
                        </p>
                        <p className="font-display text-base sm:text-lg font-black text-stone-900 mt-0.5">
                            {activeViewStats.booked}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 p-2 sm:p-2.5 text-amber-950">
                        <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                            {t('schedule.daySlotsModal.inProgressSlots') || 'Serving'}
                        </p>
                        <p className="font-display text-base sm:text-lg font-black text-amber-900 mt-0.5">
                            {activeViewStats.inProgress}
                        </p>
                    </div>
                </div>

                {/* Staff Selector Tabs + Period Filter */}
                <div className="flex flex-col gap-2.5 border-b border-stone-100 px-4 sm:px-5 py-3 bg-white shrink-0">
                    {/* Horizontal Scrollable Staff Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                        <button
                            type="button"
                            onClick={() => setSelectedStaffId('all')}
                            className={cn(
                                'flex items-center gap-1.5 rounded-2xl px-3.5 py-1.5 font-sans text-xs font-bold transition-all cursor-pointer shrink-0 border min-h-9',
                                selectedStaffId === 'all'
                                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                    : 'bg-stone-100/80 text-stone-700 border-stone-200/80 hover:bg-stone-200/70',
                            )}
                        >
                            <Users className="size-3.5" />
                            <span>{t('schedule.daySlotsModal.allStaff') || 'All Staff'}</span>
                            <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                                {activeStaffList.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedStaffId('any')}
                            className={cn(
                                'flex items-center gap-1.5 rounded-2xl px-3.5 py-1.5 font-sans text-xs font-bold transition-all cursor-pointer shrink-0 border min-h-9',
                                selectedStaffId === 'any'
                                    ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                                    : 'bg-amber-50/80 text-amber-900 border-amber-200/80 hover:bg-amber-100/80',
                            )}
                        >
                            <Sparkles className="size-3.5 text-amber-500" />
                            <span>{t('schedule.daySlotsModal.anyStaff') || 'Any Specialist'}</span>
                            <span
                                className={cn(
                                    'ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold',
                                    selectedStaffId === 'any'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-amber-200/60 text-amber-900',
                                )}
                            >
                                {anySlots.filter((s) => s.available).length}
                            </span>
                        </button>

                        {activeStaffList.map((staff) => {
                            const isSelected = selectedStaffId === staff.id;
                            const staffColor = getUserColor(staff);
                            const slots = staffSlotsMap.get(staff.id) ?? [];
                            const freeCount = slots.filter((s) => s.available).length;

                            return (
                                <button
                                    key={staff.id}
                                    type="button"
                                    onClick={() => setSelectedStaffId(staff.id)}
                                    className={cn(
                                        'flex items-center gap-2 rounded-2xl px-3 py-1.5 font-sans text-xs font-bold transition-all cursor-pointer shrink-0 border min-h-9',
                                        isSelected
                                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50',
                                    )}
                                >
                                    <span
                                        className="h-2.5 w-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: staffColor }}
                                    />
                                    <span className="truncate max-w-28">
                                        {formatUserName(staff)}
                                    </span>
                                    <span
                                        className="rounded-full px-1.5 py-0.2 text-[10px] font-extrabold"
                                        style={{
                                            backgroundColor: staffColorAlpha(
                                                staffColor,
                                                isSelected ? 30 : 15,
                                            ),
                                            color: isSelected ? '#ffffff' : staffColor,
                                        }}
                                    >
                                        {freeCount}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Period Filter + Action */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                                            'rounded-xl px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0',
                                            isActive
                                                ? 'bg-amber-600 text-white shadow-2xs'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70',
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
                                    onBookSlot(
                                        date,
                                        undefined,
                                        selectedStaffId === 'all' || selectedStaffId === 'any'
                                            ? undefined
                                            : selectedStaffId,
                                    );
                                }}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-1.5 font-sans text-xs font-bold text-white shadow-2xs hover:bg-emerald-800 active:scale-98 transition-all cursor-pointer shrink-0"
                            >
                                <Plus className="size-3.5" />
                                <span>{t('schedule.daySlotsModal.quickBook') || 'Quick Book'}</span>
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Main Content Grid: Displayed Staff & Any Cards */}
                <div className="p-4 sm:p-5 flex-1 overflow-y-auto min-h-64 space-y-6">
                    {selectedStaffId === 'any' ? (
                        renderAnySpecialistCard()
                    ) : selectedStaffId === 'all' ? (
                        <>
                            {renderAnySpecialistCard()}
                            {displayedStaffList.map((staff) => renderStaffCard(staff))}
                        </>
                    ) : displayedStaffList.length === 0 ? (
                        <div className="py-16 text-center text-stone-400 font-sans text-xs font-medium">
                            {t('schedule.daySlotsModal.noActiveStaff') ||
                                'No active technicians scheduled on this date.'}
                        </div>
                    ) : (
                        displayedStaffList.map((staff) => renderStaffCard(staff))
                    )}
                </div>

                {/* Footer Tip */}
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
