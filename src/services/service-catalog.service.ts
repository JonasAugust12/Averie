import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createServiceAction,
    deleteServiceAction,
    toggleServiceVisibilityAction,
    updateServiceAction,
} from '@actions/service.action';
import {
    createServiceCategoryAction,
    deleteServiceCategoryAction,
    updateServiceCategoryAction,
} from '@actions/service-category.action';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import { toastApiError } from '@utils/toast.util';
import type { ApiResponse } from '@typings/api.type';
import type { ServiceCategoryDto } from '@typings/service-category.type';
import type { ServiceDto } from '@typings/service.type';
import type {
    CreateServiceCategoryInput,
    UpdateServiceCategoryInput,
} from '@validations/service-category.schema';
import { useAppMutation } from '@hooks/useAppMutation';

import type { CreateServiceInput, UpdateServiceInput } from '@validations/service.schema';

export type ServiceCategoryWithServicesDto = ServiceCategoryDto & {
    services: ServiceDto[];
};

export function useServiceCategories() {
    return useQuery({
        queryKey: ['salon', 'categories'],
        queryFn: async () => {
            const res =
                await apiClient.get<ApiResponse<ServiceCategoryWithServicesDto[]>>(
                    '/api/service-categories',
                );
            return unwrapApiResponse(res.data);
        },
    });
}

export function useServices() {
    return useQuery({
        queryKey: ['salon', 'services'],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<ServiceDto[]>>('/api/services');
            return unwrapApiResponse(res.data);
        },
    });
}

/** Admin: returns all services including hidden when session is admin */
export function useAllServices() {
    return useQuery({
        queryKey: ['salon', 'services', 'all'],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<ServiceDto[]>>('/api/services', {
                params: { all: 'true' },
            });
            return unwrapApiResponse(res.data);
        },
    });
}

export function useCreateServiceCategory() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (input: CreateServiceCategoryInput) =>
            unwrapApiResponse(await createServiceCategoryAction(input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'categories'] });
        },
        onError: toastApiError,
    });
}

export function useUpdateServiceCategory() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateServiceCategoryInput }) =>
            unwrapApiResponse(await updateServiceCategoryAction(id, input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'categories'] });
        },
        onError: toastApiError,
    });
}

export function useDeleteServiceCategory() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await deleteServiceCategoryAction(id)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'categories'] });
            await qc.invalidateQueries({ queryKey: ['salon', 'services'] });
        },
        onError: toastApiError,
    });
}

export function useCreateService() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (input: CreateServiceInput) =>
            unwrapApiResponse(await createServiceAction(input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'services'] });
            await qc.invalidateQueries({ queryKey: ['salon', 'categories'] });
        },
        onError: toastApiError,
    });
}

export function useUpdateService() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateServiceInput }) =>
            unwrapApiResponse(await updateServiceAction(id, input)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'services'] });
            await qc.invalidateQueries({ queryKey: ['salon', 'categories'] });
        },
        onError: toastApiError,
    });
}

export function useDeleteService() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await deleteServiceAction(id)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'services'] });
            await qc.invalidateQueries({ queryKey: ['salon', 'categories'] });
        },
        onError: toastApiError,
    });
}

export function useToggleServiceVisibility() {
    const qc = useQueryClient();
    return useAppMutation({
        mutationFn: async ({ id, visible }: { id: string; visible: boolean }) =>
            unwrapApiResponse(await toggleServiceVisibilityAction(id, visible)),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['salon', 'services'] });
            await qc.invalidateQueries({ queryKey: ['salon', 'categories'] });
        },
        onError: toastApiError,
    });
}
