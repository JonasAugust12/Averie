import { z } from 'zod';
import {
    promotionSettingsExample,
    updatePromotionSettingsInputExample,
} from '@openapi/examples/promotion.examples';

export const promotionSettingsDtoSchema = z.object({
    enabled: z.boolean().describe('Master switch: promotion can appear on the landing page'),
    title: z.string(),
    description: z.string(),
    startDate: z
        .string()
        .nullable()
        .describe('Optional YYYY-MM-DD start bound; null = no start limit'),
    endDate: z.string().nullable().describe('Optional YYYY-MM-DD end bound; null = no end limit'),
    hideAfterExpiry: z
        .boolean()
        .describe('When true (default), landing hides the section after endDate passes'),
    showBeforeStartDate: z
        .boolean()
        .describe(
            'When true (default), landing shows before startDate (announce early). When false, only between start and end dates',
        ),
    imageUrl: z.string().nullable(),
    imagePublicId: z.string().nullable(),
    imageWidth: z.number().nullable(),
    imageHeight: z.number().nullable(),
});

export const updatePromotionSettingsInputSchema = z.object({
    enabled: z.boolean(),
    title: z.string().max(120),
    description: z.string().max(500),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    hideAfterExpiry: z.boolean(),
    showBeforeStartDate: z.boolean(),
});

export const promotionSettingsApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: promotionSettingsDtoSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: promotionSettingsExample }] });

export const updatePromotionSettingsActionResponseSchema = z
    .object({
        status: z.number().int(),
        message: z.string(),
        data: promotionSettingsDtoSchema,
    })
    .meta({
        examples: [
            {
                status: 200,
                message: 'Promotion settings updated',
                data: promotionSettingsExample,
            },
        ],
    });

export { updatePromotionSettingsInputExample };
