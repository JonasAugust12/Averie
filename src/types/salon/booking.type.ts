import type { BookingStatus, StaffPreference } from '@typings/salon/common.type';

export interface BookingCustomerDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    note?: string;
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
    cancelledAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TimeSlotDto {
    id: string;
    time: string;
    available: boolean;
}

export interface PaginatedBookingsDto {
    items: BookingDto[];
    total: number;
    page: number;
    limit: number;
}
