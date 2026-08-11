import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    mockBookings,
    mockKpis,
    mockScheduleSettings,
    mockServices,
    mockShifts,
    mockSlots,
    mockStaff,
    upsertMockBooking,
    updateMockService,
} from '@/mocks/salon/data';
import type { SalonBooking, SalonService } from '@typings/salon.type';

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

export function useSalonServices() {
    return useQuery({
        queryKey: ['salon', 'services'],
        queryFn: async () => {
            await delay();
            return mockServices.filter((s) => s.active);
        },
    });
}

export function useSalonStaff() {
    return useQuery({
        queryKey: ['salon', 'staff'],
        queryFn: async () => {
            await delay();
            return mockStaff.filter((s) => s.active);
        },
    });
}

export function useSalonSlots() {
    return useQuery({
        queryKey: ['salon', 'slots'],
        queryFn: async () => {
            await delay();
            return mockSlots;
        },
    });
}

export function useSalonBookings() {
    return useQuery({
        queryKey: ['salon', 'bookings'],
        queryFn: async () => {
            await delay();
            return mockBookings;
        },
    });
}

export function useSalonBooking(id: string) {
    return useQuery({
        queryKey: ['salon', 'bookings', id],
        queryFn: async () => {
            await delay();
            return mockBookings.find((b) => b.id === id) ?? null;
        },
        enabled: Boolean(id),
    });
}

export function useSalonKpis() {
    return useQuery({
        queryKey: ['salon', 'kpis'],
        queryFn: async () => {
            await delay();
            return mockKpis;
        },
    });
}

export function useScheduleSettings() {
    return useQuery({
        queryKey: ['salon', 'schedule-settings'],
        queryFn: async () => {
            await delay();
            return mockScheduleSettings;
        },
    });
}

export function useStaffShifts() {
    return useQuery({
        queryKey: ['salon', 'shifts'],
        queryFn: async () => {
            await delay();
            return mockShifts;
        },
    });
}

export function useSaveMockBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (booking: SalonBooking) => {
            await delay(250);
            return upsertMockBooking(booking);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'bookings'] });
        },
    });
}

export function useSaveMockService() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (service: SalonService) => {
            await delay(200);
            return updateMockService(service);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'services'] });
        },
    });
}
