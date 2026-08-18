import { z } from 'zod';

export const dashboardPeriodSchema = z.enum(['today', 'week', 'month', 'year', 'all']);

export const adminKpisQuerySchema = z.object({
    period: dashboardPeriodSchema.default('all'),
});

export type DashboardPeriodInput = z.infer<typeof dashboardPeriodSchema>;
export type AdminKpisQuery = z.infer<typeof adminKpisQuerySchema>;
