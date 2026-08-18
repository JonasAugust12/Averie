import { z } from 'zod';
import {
    promotionSettingsExample,
    updatePromotionSettingsInputExample,
} from '@openapi/examples/promotion.examples';

export const promotionSettingsDtoSchema = z.object({
    enabled: z.boolean(),
    title: z.string(),
    description: z.string(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    hideAfterExpiry: z.boolean(),
    imageUrl: z.string().nullable(),
    imagePublicId: z.string().nullable(),
    imageWidth: z.number().nullable(),
    imageHeight: z.number().nullable(),
    visible: z.boolean(),
});

export const updatePromotionSettingsInputSchema = z.object({
    enabled: z.boolean(),
    title: z.string().max(120),
    description: z.string().max(500),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    hideAfterExpiry: z.boolean(),
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
