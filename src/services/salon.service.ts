import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    mockBookings,
    mockKpis,
    mockScheduleSettings,
    mockServices,
    mockStaff,
    upsertMockBooking,
    updateMockService,
    deleteMockService,
    updateMockStaff,
    deleteMockStaff,
    updateMockScheduleSettings,
} from '@/mocks/salon/data';
import { getAvailableSlotsForDate } from '@utils/schedule.util';
import type { SalonBooking, SalonService, SalonStaff, ScheduleSettings } from '@typings/salon.type';

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

/** Admin-only: returns ALL services, including inactive ones */
export function useAllSalonServices() {
    return useQuery({
        queryKey: ['salon', 'services', 'all'],
        queryFn: async () => {
            await delay();
            return [...mockServices];
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

/** Admin-only: returns ALL staff, including inactive ones */
export function useAllSalonStaff() {
    return useQuery({
        queryKey: ['salon', 'staff', 'all'],
        queryFn: async () => {
            await delay();
            return [...mockStaff];
        },
    });
}

export function useAvailableSlots(date: string | null) {
    return useQuery({
        queryKey: ['salon', 'slots', date],
        queryFn: async () => {
            await delay();
            if (!date) return [];
            return getAvailableSlotsForDate(date, mockScheduleSettings, mockBookings);
        },
        enabled: Boolean(date),
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
            return { ...mockScheduleSettings };
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
            await qc.invalidateQueries({ queryKey: ['salon', 'slots'] });
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

export function useDeleteMockService() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await delay(150);
            deleteMockService(id);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'services'] });
        },
    });
}

export function useSaveMockStaff() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (staff: SalonStaff) => {
            await delay(200);
            return updateMockStaff(staff);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'staff'] });
        },
    });
}

export function useDeleteMockStaff() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await delay(150);
            deleteMockStaff(id);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'staff'] });
        },
    });
}

export function useSaveScheduleSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (settings: ScheduleSettings) => {
            await delay(200);
            return updateMockScheduleSettings(settings);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'schedule-settings'] });
            await qc.invalidateQueries({ queryKey: ['salon', 'slots'] });
        },
    });
}
