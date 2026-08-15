import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createServiceCategorySchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    sortOrder: z.number().int().min(0).optional(),
});

export const updateServiceCategorySchema = z
    .object({
        name: z.string().trim().min(1).max(100).optional(),
        sortOrder: z.number().int().min(0).optional(),
    })
    .refine((data) => data.name !== undefined || data.sortOrder !== undefined, {
        message: 'At least one field is required',
    });

export const serviceCategoryIdSchema = z.object({
    id: objectIdSchema,
});

export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>;
