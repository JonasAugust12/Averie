import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import type { ApiResponse } from '@typings/api.type';
import type { HealthData } from '@typings/health.type';

/** GET `/api/health` — reads via Route Handler + unified ApiResponse. */
export function useHealthCheck() {
    return useQuery<HealthData, Error>({
        queryKey: ['health'],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<HealthData>>('/api/health');
            return unwrapApiResponse(response.data);
        },
        retry: 1,
        staleTime: 1000 * 30,
    });
}
