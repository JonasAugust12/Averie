import { minuteOf } from '@utils/schedule.util';
import type { SlotLockReason } from '@typings/booking.type';

export const BOOKING_MIN_ADVANCE_HOURS = 1;
export const BOOKING_MAX_DAYS_AHEAD = 15;
export const SALON_TIMEZONE = process.env.SALON_TIMEZONE ?? 'Asia/Ho_Chi_Minh';

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

type ScheduleBooking = {
    date: string;
    time: string;
    status: 'upcoming' | 'cancelled';
    staffPreference?: 'any' | 'specific';
    staffId?: string;
};

export function isSlotBookedForPreference(
    time: string,
    dayBookings: ScheduleBooking[],
    staffPreference: 'any' | 'specific',
    staffId?: string | null,
): boolean {
    const atTime = dayBookings.filter((b) => b.time === time);
    if (atTime.length === 0) return false;

    if (staffPreference === 'any') {
        return atTime.length > 0;
    }

    return atTime.some(
        (b) => b.staffPreference === 'any' || (b.staffId && staffId && b.staffId === staffId),
    );
}
