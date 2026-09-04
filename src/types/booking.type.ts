import type {
    BookingDisplayStatus,
    BookingStatus,
    StaffPreference,
} from '@typings/salon-common.type';

export interface BookingCustomerDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    note?: string;
}

export interface BookingEmailNotificationsDto {
    confirmationSentAt?: string;
    reminderSentAt?: string;
}

export interface BookingSmsNotificationsDto {
    confirmationSentAt?: string;
}

export interface BookingDto {
    id: string;
    reference: string;
    serviceIds: string[];
    staffPreference: StaffPreference;
    staffId?: string;
    date: string;
    time: string;
    totalEstimatedMinutes: number;
    totalPrice: number;
    customer: BookingCustomerDto;
    status: BookingStatus;
    displayStatus: BookingDisplayStatus;
    emailNotifications?: BookingEmailNotificationsDto;
    smsNotifications?: BookingSmsNotificationsDto;
    cancelledAt?: string;
    createdAt: string;
    updatedAt: string;
}

export type SlotLockReason = 'booked' | 'too_soon' | 'in_progress';

export interface TimeSlotDto {
    id: string;
    time: string;
    available: boolean;
    lockReason?: SlotLockReason;
}

export interface BookingStaffSummaryDto {
    id: string;
    firstName: string;
    lastName: string;
}

export interface BookingServiceSummaryDto {
    id: string;
    name: string;
    estimatedMinutes: number;
}

export interface BookingListItemDto extends BookingDto {
    staff: BookingStaffSummaryDto | null;
    services: BookingServiceSummaryDto[];
}

export interface BookingListStatsDto {
    total: number;
    upcoming: number;
    cancelled: number;
    completed: number;
}

export type StaffServiceMaps = {
    staffById: Map<string, BookingStaffSummaryDto>;
    serviceById: Map<string, BookingServiceSummaryDto>;
};

export interface PaginatedBookingsDto {
    items: BookingListItemDto[];
    total: number;
    page: number;
    limit: number;
    stats: BookingListStatsDto;
}
