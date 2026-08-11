export type ServiceCategoryId =
    'manicure-pedicure' | 'gel-polish' | 'nail-enhancements' | 'add-ons' | 'waxing' | 'facials';

export interface SalonService {
    id: string;
    categoryId: ServiceCategoryId;
    name: string;
    description: string;
    price: number;
    durationMin: number;
    active: boolean;
}

export interface SalonStaff {
    id: string;
    name: string;
    role: string;
    active: boolean;
    initials: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface SalonBooking {
    id: string;
    reference: string;
    serviceId: string;
    staffId: string | 'any';
    date: string;
    time: string;
    durationMin: number;
    price: number;
    customer: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
        note?: string;
    };
    status: BookingStatus;
}

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

export interface ScheduleSettings {
    openTime: string;
    closeTime: string;
    intervalMin: number;
    closedWeekdays: number[];
    daysOff: string[];
}

export interface AdminKpi {
    appointments: number;
    appointmentsDelta: string;
    pending: number;
    pendingHint: string;
    revenue: number;
    revenueHint: string;
    activeTechs: number;
    activeTechsHint: string;
}

export interface StaffShift {
    id: string;
    staffId: string;
    day: string;
    start: string;
    end: string;
}
