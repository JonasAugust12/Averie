import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import type { ApiResponse } from '@typings/api.type';
import type { AdminKpiDto } from '@typings/admin-kpi.type';
import type { DashboardPeriodInput } from '@validations/admin.schema';

export function useAdminKpis(period: DashboardPeriodInput = 'all') {
    return useQuery({
        queryKey: ['salon', 'kpis', period],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<AdminKpiDto>>('/api/admin/kpis', {
                params: { period },
            });
            return unwrapApiResponse(res.data);
        },
    });
}
