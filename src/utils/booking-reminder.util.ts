import { getSalonLocalDateTime } from '@utils/booking-schedule.util';
import { minuteOf } from '@utils/schedule.util';

export function bookingStartToUtc(isoDate: string, time: string): Date {
    const targetMinutes = minuteOf(time);
    const dayStart = new Date(`${isoDate}T00:00:00.000Z`).getTime();

    for (let offsetMin = -12 * 60; offsetMin <= 36 * 60; offsetMin += 1) {
        const candidate = new Date(dayStart + offsetMin * 60_000);
        const local = getSalonLocalDateTime(candidate);
        if (local.isoDate === isoDate && local.minutes === targetMinutes) {
            return candidate;
        }
    }

    throw new Error(`Unable to resolve salon-local start for ${isoDate} ${time}`);
}

export function getReminderWindow(now = new Date()) {
    const minAheadMs = 45 * 60 * 1000;
    const maxAheadMs = 135 * 60 * 1000;

    return {
        windowStart: new Date(now.getTime() + minAheadMs),
        windowEnd: new Date(now.getTime() + maxAheadMs),
    };
}

export function isBookingInReminderWindow(
    isoDate: string,
    time: string,
    now = new Date(),
): boolean {
    const { windowStart, windowEnd } = getReminderWindow(now);
    const startUtc = bookingStartToUtc(isoDate, time);
    return startUtc >= windowStart && startUtc <= windowEnd;
}
