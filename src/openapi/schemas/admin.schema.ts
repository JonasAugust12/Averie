import { z } from 'zod';
import { adminKpiExample } from '@openapi/examples/admin.examples';

export const adminKpiDtoSchema = z.object({
    appointments: z.number().int(),
    appointmentsDelta: z.string(),
    pending: z.number().int(),
    pendingHint: z.string(),
    revenue: z.number(),
    revenueHint: z.string(),
    activeTechs: z.number().int(),
    activeTechsHint: z.string(),
});

export const adminKpisApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: adminKpiDtoSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: adminKpiExample }] });
