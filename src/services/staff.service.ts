import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createStaffAction,
    deleteStaffAction,
    resetStaffPasswordAction,
    updateStaffAction,
} from '@actions/staff.action';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import { toastApiError, toastSuccess } from '@utils/toast.util';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { ApiResponse } from '@typings/api.type';
import type { BookingListItemDto } from '@typings/booking.type';
import type { UserDto } from '@typings/salon-user.type';
import { useAppMutation } from '@hooks/useAppMutation';
import type { CreateStaffInput, UpdateStaffInput } from '@validations/staff.schema';
import type { StaffBookingsQuery } from '@validations/booking.schema';
import type { CalendarDateRange } from '@utils/staff-calendar.util';

export function useStaff(visibleOnly = true) {
    return useQuery({
        queryKey: ['salon', 'staff', visibleOnly ? 'visible' : 'all'],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<UserDto[]>>('/api/staff', {
                params: visibleOnly ? { visible: 'true' } : undefined,
            });
            return unwrapApiResponse(res.data);
        },
    });
}

export function useAllStaff() {
    return useStaff(false);
}

export function useStaffBookings(staffId: string, range?: CalendarDateRange | StaffBookingsQuery) {
    return useQuery({
        queryKey: ['salon', 'staff', staffId, 'bookings', range],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<BookingListItemDto[]>>(
                `/api/staff/${staffId}/bookings`,
                {
                    params: range,
                },
            );
            return unwrapApiResponse(res.data);
        },
        enabled: Boolean(staffId),
    });
}

export function useCreateStaff() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (input: CreateStaffInput) =>
            unwrapApiResponse(await createStaffAction(input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'staff'] });
        },
        onError: toastApiError,
    });
}

export function useUpdateStaff() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateStaffInput }) =>
            unwrapApiResponse(await updateStaffAction(id, input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'staff'] });
        },
        onError: toastApiError,
    });
}

export function useDeleteStaff() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await deleteStaffAction(id)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'staff'] });
        },
        onError: toastApiError,
    });
}

export function useResetStaffPassword() {
    const t = useAdminTranslations();

    return useAppMutation({
        loadingMessage: t('settingsAccount.submitting'),
        mutationFn: async ({ id, password }: { id: string; password: string }) =>
            unwrapApiResponse(await resetStaffPasswordAction(id, password)),
        onSuccess: () => {
            toastSuccess(t('settingsAccount.resetStaffSuccess'));
        },
        onError: toastApiError,
    });
}
