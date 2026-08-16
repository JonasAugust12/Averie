import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';
import { staffUserExample } from '@openapi/examples/user.examples';

export const staffProfileDtoSchema = z.object({
    color: z.string().optional(),
    initials: z.string().max(4).optional(),
});

export const userDtoSchema = z.object({
    id: objectIdSchema,
    email: z.string().email(),
    role: z.enum(['admin', 'staff']),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    note: z.string().optional(),
    specialties: z.array(z.string()),
    visible: z.boolean(),
    isActive: z.boolean(),
    staffProfile: staffProfileDtoSchema.optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const staffListApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: z.array(userDtoSchema),
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: [staffUserExample] }] });
