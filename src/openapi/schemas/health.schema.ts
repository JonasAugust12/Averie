import { z } from 'zod';
import { healthDataExample } from '@openapi/examples/health.examples';

export const healthDataSchema = z.object({
    health: z.enum(['ok', 'degraded', 'error']),
    mongo: z.string(),
    timestamp: z.string(),
});

export const healthApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: healthDataSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: healthDataExample }] });
