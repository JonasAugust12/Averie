import type { BookingListItemDto } from '@typings/booking.type';
import type { BookingStatus } from '@typings/salon-common.type';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor } from '@utils/staff.util';

const STATUS_COLORS: Record<BookingStatus, string> = {
    upcoming: '#10b981',
    cancelled: '#ef4444',
};

export function parseSalonTime(date: string, time: string): Date {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return new Date(`${date}T09:00:00`);

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return new Date(
        `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`,
    );
}

export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60_000);
}

export interface BookingCalendarEvent {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    extendedProps: Record<string, unknown>;
}

function bookingServiceNames(booking: BookingListItemDto): string {
    return booking.services.map((s) => s.name).join(', ') || '—';
}

function bookingStaffLabel(
    booking: BookingListItemDto,
    staffList?: UserDto[],
    anyStaffLabel = 'Any',
): string {
    if (booking.staff) {
        return formatUserName(booking.staff);
    }
    if (booking.staffPreference === 'any') {
        return anyStaffLabel;
    }
    const match = staffList?.find((s) => s.id === booking.staffId);
    return match ? formatUserName(match) : anyStaffLabel;
}

export function bookingToCalendarEvent(
    booking: BookingListItemDto,
    serviceName: string,
    subtitle: string,
    staffColor?: string,
): BookingCalendarEvent {
    const start = parseSalonTime(booking.date, booking.time);
    const end = addMinutes(start, booking.totalEstimatedMinutes);
    const color = staffColor || STATUS_COLORS[booking.status];

    return {
        id: `booking-${booking.id}`,
        title: `${subtitle} · ${serviceName}`,
        start,
        end,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        extendedProps: {
            type: 'booking',
            booking,
            serviceName,
            customerName: subtitle,
            status: booking.status,
        },
    };
}

function activeBookings(bookings: BookingListItemDto[]) {
    return bookings.filter((b) => b.status !== 'cancelled');
}

export function buildAllBookingsCalendarEvents(
    bookings: BookingListItemDto[],
    staffList: UserDto[],
    anyStaffLabel = 'Any',
    promotionColor?: string,
): BookingCalendarEvent[] {
    const staffColorMap = new Map(staffList.map((s) => [s.id, getUserColor(s)]));

    return activeBookings(bookings).map((b) => {
        const customerName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
        const serviceName = bookingServiceNames(b);
        const staffName = bookingStaffLabel(b, staffList, anyStaffLabel);

        let staffColor: string | undefined;
        if (b.staffPreference === 'specific' && b.staffId) {
            staffColor = staffColorMap.get(b.staffId);
        } else if (b.staffPreference === 'any' && b.status === 'upcoming' && promotionColor) {
            // Use the configured promotion color for flexible bookings during promo periods
            staffColor = promotionColor;
        }

        return bookingToCalendarEvent(b, serviceName, `${customerName} (${staffName})`, staffColor);
    });
}

export function buildStaffBookingsCalendarEvents(
    bookings: BookingListItemDto[],
    staffId: string,
    staffColor?: string,
): BookingCalendarEvent[] {
    const staffBookings = activeBookings(bookings).filter((b) => b.staffId === staffId);

    return staffBookings.map((b) => {
        const customerName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
        const serviceName = bookingServiceNames(b);
        return bookingToCalendarEvent(b, serviceName, customerName, staffColor);
    });
}

export { deriveInitials } from '@utils/staff.util';

export const STAFF_COLOR_OPTIONS = [
    '#b91c1c',
    '#dc2626',
    '#ef4444',
    '#f43f5e',
    '#e11d48',
    '#be123c',
    '#9f1239',
    '#db2777',
    '#ec4899',
    '#f472b6',
    '#d946ef',
    '#c084fc',
    '#a855f7',
    '#8b5cf6',
    '#7c3aed',
    '#6366f1',
    '#4f46e5',
    '#3b82f6',
    '#2563eb',
    '#1d4ed8',
    '#0ea5e9',
    '#06b6d4',
    '#0891b2',
    '#0d9488',
    '#10b981',
    '#059669',
    '#16a34a',
    '#65a30d',
    '#84cc16',
    '#eab308',
    '#f59e0b',
    '#d97706',
    '#ea580c',
    '#c0957f',
    '#78716c',
] as const;

export function normalizeStaffHex(color?: string): string {
    const raw = (color ?? '').trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.slice(1).toLowerCase()}`;
    if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
        const r = raw[1];
        const g = raw[2];
        const b = raw[3];
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return STAFF_COLOR_OPTIONS[0];
}

export function isStaffPresetColor(color?: string): boolean {
    const hex = normalizeStaffHex(color);
    return STAFF_COLOR_OPTIONS.some((option) => option.toLowerCase() === hex);
}

export const STAFF_ROLE_OPTIONS = [
    'Lead Nail Artist',
    'Senior Esthetician',
    'Nail Technician',
    'Waxing Specialist',
    'Spa Therapist',
    'Receptionist',
] as const;

/** @deprecated Use BookingCalendarEvent */
export type StaffCalendarEvent = BookingCalendarEvent;

export interface CalendarDateRange {
    dateFrom: string;
    dateTo: string;
}

export function formatIsoDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/** FullCalendar `end` is exclusive — convert to inclusive dateTo. */
export function calendarRangeFromFullCalendar(start: Date, end: Date): CalendarDateRange {
    const endInclusive = new Date(end);
    endInclusive.setDate(endInclusive.getDate() - 1);
    return {
        dateFrom: formatIsoDateLocal(start),
        dateTo: formatIsoDateLocal(endInclusive),
    };
}

export function getDefaultCalendarRange(): CalendarDateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        dateFrom: formatIsoDateLocal(start),
        dateTo: formatIsoDateLocal(end),
    };
}
