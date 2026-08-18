import type { BookingListItemDto } from '@typings/booking.type';
import type { DashboardPeriod } from '@utils/dashboard-period.util';

export interface RevenueChartLabels {
    todayHours: string[];
    weekDays: string[];
    monthWeeks: string[];
    quarters: string[];
}

export interface RevenueChartSeries {
    labels: string[];
    currentData: number[];
    previousData: number[];
}

const TODAY_BUCKET_MINUTES = [9 * 60, 11 * 60, 13 * 60, 15 * 60, 17 * 60, 19 * 60];

function parseTimeToMinutes(time: string): number {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return 12 * 60;
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minute;
}

function isCountableBooking(booking: BookingListItemDto): boolean {
    return booking.status !== 'cancelled';
}

function bookingRevenue(booking: BookingListItemDto): number {
    return isCountableBooking(booking) ? (booking.totalPrice ?? 0) : 0;
}

function bucketTodayIndex(minutes: number): number {
    for (let i = 0; i < TODAY_BUCKET_MINUTES.length; i++) {
        const start = i === 0 ? 0 : TODAY_BUCKET_MINUTES[i - 1];
        const end = TODAY_BUCKET_MINUTES[i];
        if (minutes <= end && minutes > start - 60) return i;
    }
    return TODAY_BUCKET_MINUTES.length - 1;
}

function dayOfWeekIndex(isoDate: string): number {
    const d = new Date(`${isoDate}T12:00:00`);
    const jsDay = d.getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
}

function weekOfMonthIndex(isoDate: string): number {
    const day = parseInt(isoDate.slice(8, 10), 10);
    return Math.min(Math.floor((day - 1) / 7), 3);
}

function quarterIndex(isoDate: string): number {
    const month = parseInt(isoDate.slice(5, 7), 10);
    return Math.floor((month - 1) / 3);
}

function sumBucketRevenue(
    bookings: BookingListItemDto[],
    bucketCount: number,
    resolver: (b: BookingListItemDto) => number,
): number[] {
    const totals = Array.from({ length: bucketCount }, () => 0);
    for (const booking of bookings) {
        if (!isCountableBooking(booking)) continue;
        const idx = resolver(booking);
        if (idx >= 0 && idx < bucketCount) {
            totals[idx] += bookingRevenue(booking);
        }
    }
    return totals;
}

export function buildRevenueChartSeries(
    period: DashboardPeriod,
    currentBookings: BookingListItemDto[],
    previousBookings: BookingListItemDto[],
    labels: RevenueChartLabels,
): RevenueChartSeries {
    if (period === 'today') {
        const bucketCount = labels.todayHours.length;
        return {
            labels: labels.todayHours,
            currentData: sumBucketRevenue(currentBookings, bucketCount, (b) =>
                bucketTodayIndex(parseTimeToMinutes(b.time)),
            ),
            previousData: sumBucketRevenue(previousBookings, bucketCount, (b) =>
                bucketTodayIndex(parseTimeToMinutes(b.time)),
            ),
        };
    }

    if (period === 'week') {
        const bucketCount = labels.weekDays.length;
        return {
            labels: labels.weekDays,
            currentData: sumBucketRevenue(currentBookings, bucketCount, (b) =>
                dayOfWeekIndex(b.date),
            ),
            previousData: sumBucketRevenue(previousBookings, bucketCount, (b) =>
                dayOfWeekIndex(b.date),
            ),
        };
    }

    if (period === 'month') {
        const bucketCount = labels.monthWeeks.length;
        return {
            labels: labels.monthWeeks,
            currentData: sumBucketRevenue(currentBookings, bucketCount, (b) =>
                weekOfMonthIndex(b.date),
            ),
            previousData: sumBucketRevenue(previousBookings, bucketCount, (b) =>
                weekOfMonthIndex(b.date),
            ),
        };
    }

    const bucketCount = labels.quarters.length;
    return {
        labels: labels.quarters,
        currentData: sumBucketRevenue(currentBookings, bucketCount, (b) => quarterIndex(b.date)),
        previousData: sumBucketRevenue(previousBookings, bucketCount, (b) => quarterIndex(b.date)),
    };
}

export function sortBookingsRecentFirst(bookings: BookingListItemDto[]): BookingListItemDto[] {
    return [...bookings].sort((a, b) => {
        const dateCmp = b.date.localeCompare(a.date);
        if (dateCmp !== 0) return dateCmp;
        return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
    });
}

export const CATEGORY_CHART_COLORS = [
    '#D4C5B9',
    '#C8B195',
    '#A08E75',
    '#5F87C1',
    '#E4DFDA',
    '#D8A47F',
    '#94A3B8',
    '#F59E0B',
];
