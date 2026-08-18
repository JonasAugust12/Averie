import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    removePromotionImageAction,
    updatePromotionSettingsAction,
    uploadPromotionImageAction,
} from '@actions/promotion-settings.action';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import { toastApiError } from '@utils/toast.util';
import type { ApiResponse } from '@typings/api.type';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';
import { useAppMutation } from '@hooks/useAppMutation';
import type { UpdatePromotionSettingsInput } from '@validations/promotion-settings.schema';

export function usePromotionSettings(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['salon', 'promotion-settings'],
        queryFn: async () => {
            const res =
                await apiClient.get<ApiResponse<PromotionSettingsDto>>('/api/settings/promotion');
            return unwrapApiResponse(res.data);
        },
        enabled: options?.enabled ?? true,
    });
}

export function useUpdatePromotionSettings() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (input: UpdatePromotionSettingsInput) =>
            unwrapApiResponse(await updatePromotionSettingsAction(input)),
        onSuccess: async (data) => {
            qc.setQueryData(['salon', 'promotion-settings'], data);
            await qc.invalidateQueries({ queryKey: ['salon', 'promotion-settings'] });
        },
        onError: toastApiError,
    });
}

export function useUploadPromotionImage() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (formData: FormData) =>
            unwrapApiResponse(await uploadPromotionImageAction(formData)),
        onSuccess: async (data) => {
            qc.setQueryData(['salon', 'promotion-settings'], data);
            await qc.invalidateQueries({ queryKey: ['salon', 'promotion-settings'] });
        },
        onError: toastApiError,
    });
}

export function useRemovePromotionImage() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async () => unwrapApiResponse(await removePromotionImageAction()),
        onSuccess: async (data) => {
            qc.setQueryData(['salon', 'promotion-settings'], data);
            await qc.invalidateQueries({ queryKey: ['salon', 'promotion-settings'] });
        },
        onError: toastApiError,
    });
}
