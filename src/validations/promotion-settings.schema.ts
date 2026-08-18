import { z } from 'zod';

const optionalDateSchema = z
    .union([
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
        z.literal(''),
        z.null(),
    ])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : value));

export const updatePromotionSettingsSchema = z
    .object({
        enabled: z.boolean(),
        title: z.string().trim().max(120),
        description: z.string().trim().max(500),
        startDate: optionalDateSchema,
        endDate: optionalDateSchema,
        hideAfterExpiry: z.boolean().default(true),
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.endDate) return true;
            return data.startDate <= data.endDate;
        },
        { message: 'Start date must be on or before end date', path: ['endDate'] },
    );

export type UpdatePromotionSettingsInput = z.infer<typeof updatePromotionSettingsSchema>;

export const PROMOTION_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const PROMOTION_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
