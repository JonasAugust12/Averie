import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';

export const createServiceSchema = z.object({
    categoryId: objectIdSchema,
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().default(''),
    price: z.number().min(0, 'Price must be >= 0'),
    estimatedMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
    visible: z.boolean().optional(),
});

export const updateServiceSchema = z
    .object({
        categoryId: objectIdSchema.optional(),
        name: z.string().trim().min(1).optional(),
        description: z.string().trim().optional(),
        price: z.number().min(0).optional(),
        estimatedMinutes: z.number().int().min(1).optional(),
        visible: z.boolean().optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: 'At least one field is required',
    });

export const serviceIdSchema = z.object({
    id: objectIdSchema,
});

export const toggleServiceVisibilitySchema = z.object({
    visible: z.boolean(),
});

export const servicesListQuerySchema = z.object({
    all: z.enum(['true', 'false']).optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
