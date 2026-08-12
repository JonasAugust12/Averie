import type { SalonBooking, SalonService, SalonStaff } from '@typings/salon.type';

const STATUS_COLORS: Record<SalonBooking['status'], string> = {
    pending: '#f59e0b',
    confirmed: '#0ea5e9',
    rejected: '#ef4444',
    cancelled: '#94a3b8',
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
): BookingCalendarEvent {
    const start = parseSalonTime(booking.date, booking.time);
    const end = addMinutes(start, booking.durationMin);
    const color = STATUS_COLORS[booking.status];

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
    return bookings.filter((b) => b.status !== 'rejected' && b.status !== 'cancelled');
}

export function buildAllBookingsCalendarEvents(
    bookings: SalonBooking[],
    services: SalonService[],
    staffList: SalonStaff[],
): BookingCalendarEvent[] {
    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const staffMap = new Map(staffList.map((s) => [s.id, s.name]));

    return activeBookings(bookings).map((b) => {
        const customerName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
        const serviceName = serviceMap.get(b.serviceId) ?? b.serviceId;
        const staffName = b.staffId === 'any' ? 'Any' : (staffMap.get(b.staffId) ?? b.staffId);
        return bookingToCalendarEvent(b, serviceName, `${customerName} (${staffName})`);
    });
}

export function buildStaffBookingsCalendarEvents(
    bookings: SalonBooking[],
    services: SalonService[],
    staffId: string,
): BookingCalendarEvent[] {
    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const staffBookings = activeBookings(bookings).filter((b) => b.staffId === staffId);

    return staffBookings.map((b) => {
        const customerName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
        const serviceName = serviceMap.get(b.serviceId) ?? b.serviceId;
        return bookingToCalendarEvent(b, serviceName, customerName);
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
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
] as const;

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
