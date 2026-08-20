import { minuteOf } from '@utils/schedule.util';
import type { BookingDisplayStatus, BookingStatus } from '@typings/salon-common.type';
import type { SlotLockReason } from '@typings/booking.type';

export const BOOKING_MIN_ADVANCE_HOURS = 1;
export const BOOKING_MAX_DAYS_AHEAD = 15;
export const SALON_TIMEZONE = process.env.SALON_TIMEZONE ?? 'America/New_York';
/** Maximum acceptable wait time (in minutes) for a customer if a previous appointment spills over into their slot. */
export const MAX_SLOT_WAIT_TOLERANCE_MINUTES = 20;

export type { SlotLockReason };

export function getSalonLocalDateTime(now = new Date()): { isoDate: string; minutes: number } {
    const isoDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: SALON_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: SALON_TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).formatToParts(now);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((p) => p.type === type)?.value ?? '';

    let hour = parseInt(get('hour'), 10);
    const minute = parseInt(get('minute'), 10);
    const dayPeriod = get('dayPeriod').toUpperCase();

    if (dayPeriod === 'PM' && hour !== 12) hour += 12;
    if (dayPeriod === 'AM' && hour === 12) hour = 0;

    return { isoDate, minutes: hour * 60 + minute };
}

export function addDaysIso(isoDate: string, days: number): string {
    const d = new Date(`${isoDate}T12:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

export function isBookingDateAllowed(date: string, now = new Date()): boolean {
    const { isoDate: today } = getSalonLocalDateTime(now);
    if (date < today) return false;
    return date <= addDaysIso(today, BOOKING_MAX_DAYS_AHEAD);
}

export function isSlotTooSoon(date: string, slotTime: string, now = new Date()): boolean {
    const { isoDate: today, minutes: nowMinutes } = getSalonLocalDateTime(now);
    if (date !== today) return false;
    const slotMinutes = minuteOf(slotTime);
    return slotMinutes < nowMinutes + BOOKING_MIN_ADVANCE_HOURS * 60;
}

export function validateBookingSchedule(input: { date: string; time: string }): string | null {
    if (!isBookingDateAllowed(input.date)) {
        return 'Selected date is not available for booking';
    }
    if (isSlotTooSoon(input.date, input.time)) {
        return 'Selected time must be at least 1 hour from now';
    }
    return null;
}

export function getBookingDisplayStatus(
    booking: { status: BookingStatus; date: string; time: string },
    now = new Date(),
): BookingDisplayStatus {
    if (booking.status === 'cancelled') return 'cancelled';

    const { isoDate: today, minutes: nowMinutes } = getSalonLocalDateTime(now);
    if (booking.date < today) return 'completed';
    if (booking.date > today) return 'upcoming';

    return minuteOf(booking.time) < nowMinutes ? 'completed' : 'upcoming';
}

type ScheduleBooking = {
    date: string;
    time: string;
    status: 'upcoming' | 'cancelled';
    staffPreference?: 'any' | 'specific';
    staffId?: string;
    /** total estimated minutes for the booking, used for duration-based blocking */
    totalEstimatedMinutes?: number;
};

export function getSlotBookedLockReason(
    time: string,
    dayBookings: ScheduleBooking[],
    staffPreference: 'any' | 'specific',
    staffId?: string | null,
): SlotLockReason | false {
    // 'any' preference: salon assigns staff internally — never block calendar slots for customer booking.
    if (staffPreference === 'any') return false;

    // 'specific' preference: block ONLY if the chosen staff has an overlapping booking specifically for them.
    if (!staffId) return false;
    const slotMin = minuteOf(time);

    for (const b of dayBookings) {
        if (b.status === 'cancelled') continue;

        // ONLY match bookings specifically assigned to this staff member
        const isSameStaff = b.staffPreference === 'specific' && b.staffId === staffId;
        if (!isSameStaff) continue;

        const bookingStart = minuteOf(b.time);
        const bookingEnd = bookingStart + (b.totalEstimatedMinutes ?? 30);

        if (slotMin === bookingStart) {
            return 'booked';
        }
        if (slotMin > bookingStart && slotMin < bookingEnd) {
            const waitMinutes = bookingEnd - slotMin;
            if (waitMinutes > MAX_SLOT_WAIT_TOLERANCE_MINUTES) {
                return 'in_progress';
            }
        }
    }

    return false;
}

export function isSlotBookedForPreference(
    time: string,
    dayBookings: ScheduleBooking[],
    staffPreference: 'any' | 'specific',
    staffId?: string | null,
): boolean {
    return Boolean(getSlotBookedLockReason(time, dayBookings, staffPreference, staffId));
}
