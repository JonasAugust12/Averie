import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import type { ApiResponse } from '@typings/api.type';
import type { AdminKpiDto } from '@typings/admin-kpi.type';

export function useAdminKpis() {
    return useQuery({
        queryKey: ['salon', 'kpis'],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<AdminKpiDto>>('/api/admin/kpis');
            return unwrapApiResponse(res.data);
        },
    });
}
