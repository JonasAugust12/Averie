import type { SalonBooking, SalonService, SalonStaff } from '@typings/salon.type';

const STATUS_COLORS: Record<SalonBooking['status'], string> = {
    upcoming: '#10b981',
    completed: '#78716c',
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

export function bookingToCalendarEvent(
    booking: SalonBooking,
    serviceName: string,
    subtitle: string,
    staffColor?: string,
): BookingCalendarEvent {
    const start = parseSalonTime(booking.date, booking.time);
    const end = addMinutes(start, booking.durationMin);
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

function activeBookings(bookings: SalonBooking[]) {
    return bookings.filter((b) => b.status !== 'cancelled');
}

export function buildAllBookingsCalendarEvents(
    bookings: SalonBooking[],
    services: SalonService[],
    staffList: SalonStaff[],
): BookingCalendarEvent[] {
    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const staffMap = new Map(staffList.map((s) => [s.id, s.name]));
    const staffColorMap = new Map(staffList.map((s) => [s.id, s.color]));

    return activeBookings(bookings).map((b) => {
        const customerName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
        const serviceName = serviceMap.get(b.serviceId) ?? b.serviceId;
        const staffName = b.staffId === 'any' ? 'Any' : (staffMap.get(b.staffId) ?? b.staffId);
        const staffColor = b.staffId === 'any' ? undefined : staffColorMap.get(b.staffId);
        return bookingToCalendarEvent(b, serviceName, `${customerName} (${staffName})`, staffColor);
    });
}

export function buildStaffBookingsCalendarEvents(
    bookings: SalonBooking[],
    services: SalonService[],
    staffId: string,
    staffColor?: string,
): BookingCalendarEvent[] {
    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const staffBookings = activeBookings(bookings).filter((b) => b.staffId === staffId);

    return staffBookings.map((b) => {
        const customerName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
        const serviceName = serviceMap.get(b.serviceId) ?? b.serviceId;
        return bookingToCalendarEvent(b, serviceName, customerName, staffColor);
    });
}

export function deriveInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export const STAFF_COLOR_OPTIONS = [
    '#78716c',
    '#44403c',
    '#c0957f',
    '#b45309',
    '#0ea5e9',
    '#2563eb',
    '#0891b2',
    '#0d9488',
    '#10b981',
    '#65a30d',
    '#f59e0b',
    '#ea580c',
    '#ef4444',
    '#e11d48',
    '#db2777',
    '#8b5cf6',
    '#6366f1',
    '#7c3aed',
    '#ec4899',
    '#14b8a6',
    '#1d4ed8',
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
