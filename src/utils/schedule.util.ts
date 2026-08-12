import type {
    DayOffScope,
    DayPeriod,
    PeriodSlots,
    SalonBooking,
    ScheduleSettings,
    TimeSlot,
} from '@typings/salon.type';

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

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
    const weekday = new Date(`${date}T12:00:00`).getDay();
    if (!settings.workingWeekdays.includes(weekday)) return true;
    return settings.dayOffs.some((off) => off.date === date && off.scope === 'full');
}

export function getOffPeriodsForDate(date: string, settings: ScheduleSettings): DayPeriod[] {
    return settings.dayOffs
        .filter((off) => off.date === date && off.scope !== 'full')
        .map((off) => off.scope as DayPeriod);
}

export function getAllConfiguredSlots(settings: ScheduleSettings): TimeSlot[] {
    const periods: DayPeriod[] = ['morning', 'afternoon', 'evening'];
    return periods.flatMap((period) =>
        settings.periodSlots[period].map((time, index) => ({
            id: `${period}-${index}-${time.replace(/\s/g, '')}`,
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
        bookings
            .filter((b) => b.date === date && b.status !== 'cancelled' && b.status !== 'rejected')
            .map((b) => b.time),
    );

    return getAllConfiguredSlots(settings)
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

export function defaultPeriodSlots(): PeriodSlots {
    return {
        morning: [
            '07:30 AM',
            '07:45 AM',
            '08:00 AM',
            '08:30 AM',
            '09:00 AM',
            '09:30 AM',
            '10:00 AM',
            '10:30 AM',
            '11:00 AM',
            '11:30 AM',
        ],
        afternoon: [
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
        ],
        evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'],
    };
}

export const DAY_OFF_SCOPE_OPTIONS: DayOffScope[] = ['full', 'morning', 'afternoon', 'evening'];
