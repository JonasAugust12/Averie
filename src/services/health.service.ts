import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@libs/api-client';
import type { HealthResponse } from '@typings/todo.type';

export function useHealthCheck() {
    return useQuery<HealthResponse, Error>({
        queryKey: ['health'],
        queryFn: async () => {
            const response = await apiClient.get<HealthResponse>('/api/health');
            return response.data;
        },
        retry: 1,
        staleTime: 1000 * 30,
    });
}
