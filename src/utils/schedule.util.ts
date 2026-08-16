import type {
    DayOffScope,
    DayPeriod,
    PeriodSlots,
    SalonBooking,
    ScheduleSettings,
    TimeSlot,
    WeekdaySchedule,
} from '@typings/salon.type';

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

const EVENING_WEEKDAY: PeriodSlots['evening'] = ['05:00 PM', '05:30 PM', '06:00 PM'];

const EVENING_SATURDAY: PeriodSlots['evening'] = ['05:00 PM', '05:30 PM'];

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
                    afternoon: [...AFTERNOON_STANDARD],
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
): TimeSlot[] {
    if (isDateFullyClosed(date, settings)) return [];

    const offPeriods = getOffPeriodsForDate(date, settings);
    const bookedTimes = new Set(
        bookings.filter((b) => b.date === date && b.status !== 'cancelled').map((b) => b.time),
    );

    const weekday = getWeekdayFromDate(date);

    return getAllConfiguredSlotsForWeekday(settings, weekday)
        .filter((slot) => !offPeriods.includes(getPeriodForTime(slot.time)))
        .map((slot) => ({
            ...slot,
            available: !bookedTimes.has(slot.time),
        }));
}

export function sortTimes(times: string[]): string[] {
    return [...times].sort((a, b) => {
        const ha = hourOf(a) * 60 + (parseInt(a.match(/:(\d{2})/)?.[1] ?? '0', 10) || 0);
        const hb = hourOf(b) * 60 + (parseInt(b.match(/:(\d{2})/)?.[1] ?? '0', 10) || 0);
        return ha - hb;
    });
}

export const DAY_OFF_SCOPE_OPTIONS: DayOffScope[] = ['full', 'morning', 'afternoon', 'evening'];
