import { addDaysIso, getSalonLocalDateTime } from '@utils/booking-schedule.util';

const DEFAULT_SEND_AFTER_HOUR = 21;

function parseSendAfterHour(): number {
    const raw = process.env.BOOKING_REMINDER_SEND_AFTER_HOUR?.trim();
    if (!raw) return DEFAULT_SEND_AFTER_HOUR;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 23) return DEFAULT_SEND_AFTER_HOUR;
    return parsed;
}

/** Salon-local calendar date for the day after `now`. */
export function getSalonTomorrowIsoDate(now = new Date()): string {
    const { isoDate: today } = getSalonLocalDateTime(now);
    return addDaysIso(today, 1);
}

/** True when salon-local clock is at or after the configured evening send hour (default 21:00). */
export function isReminderSendTime(now = new Date()): boolean {
    const { minutes } = getSalonLocalDateTime(now);
    const hour = Math.floor(minutes / 60);
    return hour >= parseSendAfterHour();
}

/**
 * True when the booking should receive an automatic night-before reminder:
 * appointment date is tomorrow (salon timezone) and current time is in the evening send window.
 */
export function isBookingDueNightBeforeReminder(isoDate: string, now = new Date()): boolean {
    if (!isReminderSendTime(now)) {
        return false;
    }
    return isoDate === getSalonTomorrowIsoDate(now);
}
