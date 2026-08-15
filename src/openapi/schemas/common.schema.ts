import { z } from 'zod';

export const apiErrorResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code'),
        message: z.string(),
        data: z.null(),
    })
    .meta({
        examples: [
            { status: 400, message: 'Validation failed', data: null },
            { status: 404, message: 'Booking not found', data: null },
        ],
    });
