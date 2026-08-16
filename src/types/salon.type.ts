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
    phone?: string;
    email?: string;
    specialties?: string[];
    joinDate?: string;
    color?: string;
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface SalonBooking {
    id: string;
    reference: string;
    serviceId: string;
    serviceIds?: string[];
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
    createdAt?: string;
}

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

export type DayPeriod = 'morning' | 'afternoon' | 'evening';

export type DayOffScope = 'full' | DayPeriod;

export interface PeriodSlots {
    morning: string[];
    afternoon: string[];
    evening: string[];
}

export interface DayOffEntry {
    id: string;
    date: string;
    scope: DayOffScope;
}

/** Per-weekday schedule (weekday 0 = Sun … 6 = Sat). */
export interface WeekdaySchedule {
    weekday: number;
    isOpen: boolean;
    periodSlots: PeriodSlots;
}

export interface ScheduleSettings {
    /** One entry per weekday (0–6). */
    weekdaySchedules: WeekdaySchedule[];
    dayOffs: DayOffEntry[];
    allowStaffSelection: boolean;
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
