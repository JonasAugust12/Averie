import { useQuery, useQueryClient } from '@tanstack/react-query';
import { updateScheduleSettingsAction } from '@actions/schedule-settings.action';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import { toastApiError } from '@utils/toast.util';
import type { ApiResponse } from '@typings/api.type';
import type { ScheduleSettingsDto } from '@typings/schedule-settings.type';
import { useAppMutation } from '@hooks/useAppMutation';
import type { UpdateScheduleSettingsInput } from '@validations/schedule-settings.schema';

export function useScheduleSettings(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['salon', 'schedule-settings'],
        queryFn: async () => {
            const res =
                await apiClient.get<ApiResponse<ScheduleSettingsDto>>('/api/settings/schedule');
            return unwrapApiResponse(res.data);
        },
        enabled: options?.enabled ?? true,
    });
}

export function useUpdateScheduleSettings() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (input: UpdateScheduleSettingsInput) =>
            unwrapApiResponse(await updateScheduleSettingsAction(input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'schedule-settings'] });
            await qc.invalidateQueries({ queryKey: ['bookings', 'slots'] });
        },
        onError: toastApiError,
    });
}
