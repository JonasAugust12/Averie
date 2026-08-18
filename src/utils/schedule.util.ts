import type { DayOffScope, DayPeriod } from '@typings/salon-common.type';
import type { BookingListItemDto, TimeSlotDto } from '@typings/booking.type';
import { isSlotBookedForPreference, isSlotTooSoon } from '@utils/booking-schedule.util';
import type { SlotLockReason } from '@typings/booking.type';
import type {
    PeriodSlotsDto,
    ScheduleSettingsDto,
    WeekdayScheduleDto,
} from '@typings/schedule-settings.type';

type PeriodSlots = PeriodSlotsDto;
type WeekdaySchedule = WeekdayScheduleDto;
/** Subset used by slot/availability helpers (id/updatedAt not required). */
type ScheduleSettings = Pick<
    ScheduleSettingsDto,
    'weekdaySchedules' | 'dayOffs' | 'allowStaffSelection'
>;
type SalonBooking = Pick<
    BookingListItemDto,
    'date' | 'time' | 'status' | 'staffId' | 'staffPreference'
>;
type TimeSlot = TimeSlotDto;

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Mon → Sun tab order in admin UI. */
export const WEEKDAY_ORDER_MON_SUN = [1, 2, 3, 4, 5, 6, 0] as const;

export function emptyPeriodSlots(): PeriodSlots {
    return { morning: [], afternoon: [], evening: [] };
}

const MORNING_WEEKDAY: PeriodSlots['morning'] = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
];

const AFTERNOON_STANDARD: PeriodSlots['afternoon'] = [
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
];

/** Sunday closes 5pm — last bookable slot 4:00 PM. */
const AFTERNOON_SUNDAY: PeriodSlots['afternoon'] = [
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
];

const EVENING_WEEKDAY: PeriodSlots['evening'] = ['05:00 PM', '05:30 PM', '06:00 PM'];

/** Saturday closes 6pm — last bookable slot 5:00 PM. */
const EVENING_SATURDAY: PeriodSlots['evening'] = ['05:00 PM'];

const MORNING_SUNDAY: PeriodSlots['morning'] = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];

/** @deprecated Use defaultWeekdaySchedules(). Kept for legacy migration. */
export function defaultPeriodSlots(): PeriodSlots {
    return {
        morning: [...MORNING_WEEKDAY],
        afternoon: [...AFTERNOON_STANDARD],
        evening: [...EVENING_WEEKDAY],
    };
}

export function defaultWeekdaySchedules(): WeekdaySchedule[] {
    return [0, 1, 2, 3, 4, 5, 6].map((weekday) => {
        if (weekday === 0) {
            return {
                weekday,
                isOpen: true,
                periodSlots: {
                    morning: [...MORNING_SUNDAY],
                    afternoon: [...AFTERNOON_SUNDAY],
                    evening: [],
                },
            };
        }
        if (weekday === 6) {
            return {
                weekday,
                isOpen: true,
                periodSlots: {
                    morning: [...MORNING_WEEKDAY],
                    afternoon: [...AFTERNOON_STANDARD],
                    evening: [...EVENING_SATURDAY],
                },
            };
        }
        return {
            weekday,
            isOpen: true,
            periodSlots: {
                morning: [...MORNING_WEEKDAY],
                afternoon: [...AFTERNOON_STANDARD],
                evening: [...EVENING_WEEKDAY],
            },
        };
    });
}

export function normalizeWeekdaySchedules(
    weekdaySchedules: WeekdaySchedule[] | undefined,
    legacy?: { workingWeekdays?: number[]; periodSlots?: PeriodSlots },
): WeekdaySchedule[] {
    if (weekdaySchedules?.length === 7) {
        return [...weekdaySchedules].sort((a, b) => a.weekday - b.weekday);
    }

    const legacySlots = legacy?.periodSlots ?? defaultPeriodSlots();
    const legacyWorking = legacy?.workingWeekdays ?? [1, 2, 3, 4, 5, 6, 0];

    return [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
        weekday,
        isOpen: legacyWorking.includes(weekday),
        periodSlots: legacyWorking.includes(weekday)
            ? structuredClone(legacySlots)
            : emptyPeriodSlots(),
    }));
}

export function getWeekdaySchedule(
    settings: ScheduleSettings,
    weekday: number,
): WeekdaySchedule | undefined {
    return settings.weekdaySchedules.find((entry) => entry.weekday === weekday);
}

export function getWorkingWeekdays(settings: ScheduleSettings): number[] {
    return settings.weekdaySchedules.filter((entry) => entry.isOpen).map((entry) => entry.weekday);
}

export function minuteOf(time: string): number {
    const h = hourOf(time);
    const m = parseInt(time.match(/:(\d{2})/)?.[1] ?? '0', 10) || 0;
    return h * 60 + m;
}

export function getWeekdayFromDate(date: string): number {
    return new Date(`${date}T12:00:00`).getDay();
}

export function getAllSlotTimesForWeekday(settings: ScheduleSettings, weekday: number): string[] {
    const day = getWeekdaySchedule(settings, weekday);
    if (!day?.isOpen) return [];

    return sortTimes([
        ...day.periodSlots.morning,
        ...day.periodSlots.afternoon,
        ...day.periodSlots.evening,
    ]);
}

export function isOpenTimeSlot(time: string, settings: ScheduleSettings, weekday: number): boolean {
    const times = getAllSlotTimesForWeekday(settings, weekday);
    if (times.length === 0) return false;
    return minuteOf(time) === minuteOf(times[0]);
}

export function isCloseTimeSlot(
    time: string,
    settings: ScheduleSettings,
    weekday: number,
): boolean {
    const times = getAllSlotTimesForWeekday(settings, weekday);
    if (times.length === 0) return false;
    return minuteOf(time) === minuteOf(times[times.length - 1]);
}

export function hourOf(time: string): number {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) {
        const [h] = time.split(':').map(Number);
        return h ?? 0;
    }
    let hours = parseInt(match[1], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours;
}

export function getPeriodForTime(time: string): DayPeriod {
    const h = hourOf(time);
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

export function normalizeTimeInput(raw: string): string {
    const trimmed = raw.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return trimmed;

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    let ampm = match[3]?.toUpperCase();

    if (!ampm) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
    } else {
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${String(displayHour).padStart(2, '0')}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    }

    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export function isDateFullyClosed(date: string, settings: ScheduleSettings): boolean {
    const weekday = getWeekdayFromDate(date);
    const day = getWeekdaySchedule(settings, weekday);
    if (!day?.isOpen) return true;
    return settings.dayOffs.some((off) => off.date === date && off.scope === 'full');
}

export function getOffPeriodsForDate(date: string, settings: ScheduleSettings): DayPeriod[] {
    return settings.dayOffs
        .filter((off) => off.date === date && off.scope !== 'full')
        .map((off) => off.scope as DayPeriod);
}

export function getAllConfiguredSlotsForWeekday(
    settings: ScheduleSettings,
    weekday: number,
): TimeSlot[] {
    const day = getWeekdaySchedule(settings, weekday);
    if (!day?.isOpen) return [];

    const periods: DayPeriod[] = ['morning', 'afternoon', 'evening'];
    return periods.flatMap((period) =>
        day.periodSlots[period].map((time, index) => ({
            id: `${weekday}-${period}-${index}-${time.replace(/\s/g, '')}`,
            time,
            available: true,
        })),
    );
}

export function getAvailableSlotsForDate(
    date: string,
    settings: ScheduleSettings,
    bookings: SalonBooking[],
    options?: {
        staffPreference?: 'any' | 'specific';
        staffId?: string | null;
        now?: Date;
    },
): TimeSlot[] {
    if (isDateFullyClosed(date, settings)) return [];

    const staffPreference = options?.staffPreference ?? 'any';
    const staffId = options?.staffId ?? null;
    const now = options?.now ?? new Date();
    const offPeriods = getOffPeriodsForDate(date, settings);
    const weekday = getWeekdayFromDate(date);
    const dayBookings = bookings.filter((b) => b.date === date && b.status !== 'cancelled');

    return getAllConfiguredSlotsForWeekday(settings, weekday)
        .filter((slot) => !offPeriods.includes(getPeriodForTime(slot.time)))
        .map((slot) => {
            let available = true;
            let lockReason: SlotLockReason | undefined;

            if (isSlotBookedForPreference(slot.time, dayBookings, staffPreference, staffId)) {
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
}

export function sortTimes(times: string[]): string[] {
    return [...times].sort((a, b) => {
        const ha = hourOf(a) * 60 + (parseInt(a.match(/:(\d{2})/)?.[1] ?? '0', 10) || 0);
        const hb = hourOf(b) * 60 + (parseInt(b.match(/:(\d{2})/)?.[1] ?? '0', 10) || 0);
        return ha - hb;
    });
}

/** Salon closing hour shown in booking UI — not bookable (Mon–Fri 7pm, Sat 6pm, Sun 5pm). */
export function getSalonClosedDisplayTime(weekday: number): string | null {
    if (weekday >= 1 && weekday <= 5) return '07:00 PM';
    if (weekday === 6) return '06:00 PM';
    if (weekday === 0) return '05:00 PM';
    return null;
}

export type BookingDisplaySlot = TimeSlot & { isClosedDisplay?: boolean };

/** Bookable slots plus dimmed closed / unavailable entries (UI only). */
export function mergeBookingDisplaySlots(slots: TimeSlot[], weekday: number): BookingDisplaySlot[] {
    const byTime = new Map<string, BookingDisplaySlot>();

    for (const slot of slots) {
        byTime.set(slot.time, { ...slot, isClosedDisplay: false });
    }

    const closedTime = getSalonClosedDisplayTime(weekday);
    if (closedTime && !byTime.has(closedTime)) {
        byTime.set(closedTime, {
            id: `closed-display-${weekday}-${closedTime.replace(/\s/g, '')}`,
            time: closedTime,
            available: false,
            isClosedDisplay: true,
        });
    }

    return sortTimes([...byTime.keys()]).map((time) => byTime.get(time)!);
}

export const DAY_OFF_SCOPE_OPTIONS: DayOffScope[] = ['full', 'morning', 'afternoon', 'evening'];

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

export function isValidObjectId(id: string): boolean {
    return OBJECT_ID_RE.test(id);
}

/** Stable client id when Mongo subdocument _id is missing (legacy seed data). */
export function dayOffDisplayId(off: { id?: string; date: string; scope: string }): string {
    if (off.id && off.id.length > 0) return off.id;
    return `local-${off.date}-${off.scope}`;
}

export function sanitizeDayOffsForSave(
    dayOffs: Array<{ id: string; date: string; scope: DayOffScope }>,
): Array<{ date: string; scope: DayOffScope; id?: string }> {
    return dayOffs.map(({ id, date, scope }) => ({
        date,
        scope,
        ...(isValidObjectId(id) ? { id } : {}),
    }));
}

export const PERIOD_SLOT_PLACEHOLDERS: Record<DayPeriod, string> = {
    morning: '09:00 AM',
    afternoon: '12:00 PM',
    evening: '05:00 PM',
};

/** Re-assign misplaced slot times to the correct period bucket. */
export function normalizePeriodSlots(slots: PeriodSlots): PeriodSlots {
    const merged = sortTimes([...slots.morning, ...slots.afternoon, ...slots.evening]);
    return {
        morning: merged.filter((time) => getPeriodForTime(time) === 'morning'),
        afternoon: merged.filter((time) => getPeriodForTime(time) === 'afternoon'),
        evening: merged.filter((time) => getPeriodForTime(time) === 'evening'),
    };
}

export function isTimeInPeriod(time: string, period: DayPeriod): boolean {
    return getPeriodForTime(time) === period;
}

export type PeriodSlotBadge = 'open' | 'closed';

export function getPeriodSlotBadge(
    period: DayPeriod,
    time: string,
    periodSlots: string[],
): PeriodSlotBadge | null {
    const sorted = sortTimes(periodSlots);
    if (sorted.length === 0) return null;
    if (period === 'morning' && sorted[0] === time) return 'open';
    if (period === 'evening' && sorted[sorted.length - 1] === time) return 'closed';
    return null;
}
