import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    cancelBookingAction,
    createBookingAction,
    restoreBookingAction,
} from '@actions/booking.action';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import { toastApiError } from '@utils/toast.util';
import type { ApiResponse } from '@typings/api.type';
import type { BookingListItemDto, PaginatedBookingsDto, TimeSlotDto } from '@typings/booking.type';
import { useAppMutation } from '@hooks/useAppMutation';
import type { BookingsListQuery, CreateBookingInput } from '@validations/booking.schema';

export function useBookings(filters: BookingsListQuery) {
    return useQuery({
        queryKey: ['bookings', filters],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<PaginatedBookingsDto>>('/api/bookings', {
                params: filters,
            });
            return unwrapApiResponse(res.data);
        },
    });
}

export function useBooking(id: string) {
    return useQuery({
        queryKey: ['bookings', id],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<BookingListItemDto>>(`/api/bookings/${id}`);
            return unwrapApiResponse(res.data);
        },
        enabled: Boolean(id),
    });
}

export function useBookingByReference(reference: string) {
    return useQuery({
        queryKey: ['bookings', 'by-reference', reference],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<BookingListItemDto>>(
                '/api/bookings/by-reference',
                { params: { reference } },
            );
            return unwrapApiResponse(res.data);
        },
        enabled: Boolean(reference),
    });
}

export function useAvailableSlots(date: string | null, serviceIds: string[]) {
    return useQuery({
        queryKey: ['bookings', 'slots', date, serviceIds],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<{ date: string; slots: TimeSlotDto[] }>>(
                '/api/bookings/slots',
                {
                    params: {
                        date,
                        serviceIds: serviceIds.join(','),
                    },
                },
            );
            return unwrapApiResponse(res.data).slots;
        },
        enabled: Boolean(date) && serviceIds.length > 0,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: async (input: CreateBookingInput) =>
            unwrapApiResponse(await createBookingAction(input)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: toastApiError,
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await cancelBookingAction(id)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: toastApiError,
    });
}

export function useRestoreBooking() {
    const queryClient = useQueryClient();
    return useAppMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await restoreBookingAction(id)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: toastApiError,
    });
}
