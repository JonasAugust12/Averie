import { z } from 'zod';
import { lucideIconNameSchema } from '@validations/lucide-icon.schema';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const categorySlugSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Slug is required')
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case');

export const createServiceCategorySchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    slug: categorySlugSchema,
    sortOrder: z.number().int().min(0).optional(),
    icon: lucideIconNameSchema.optional(),
    subtitle: z.string().trim().max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    note: z.string().trim().max(500).optional(),
    featured: z.boolean().optional(),
});

export const updateServiceCategorySchema = z
    .object({
        name: z.string().trim().min(1).max(100).optional(),
        sortOrder: z.number().int().min(0).optional(),
        icon: lucideIconNameSchema.nullable().optional(),
        subtitle: z.string().trim().max(200).optional(),
        description: z.string().trim().max(2000).optional(),
        note: z.string().trim().max(500).optional(),
        featured: z.boolean().optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.sortOrder !== undefined ||
            data.icon !== undefined ||
            data.subtitle !== undefined ||
            data.description !== undefined ||
            data.note !== undefined ||
            data.featured !== undefined,
        {
            message: 'At least one field is required',
        },
    );

export const serviceCategoryIdSchema = z.object({
    id: objectIdSchema,
});

export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>;
