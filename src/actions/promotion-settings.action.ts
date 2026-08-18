'use server';

import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@guard/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializePromotionSettings } from '@mappers/promotion.mapper';
import { deleteCloudinaryImage, uploadPromotionImage } from '@libs/cloudinary.server';
import { getSalonSettingsDocument } from '@server/schedule.server';
import { SalonSettings } from '@models/salon-settings.model';
import type { ApiResponse } from '@typings/api.type';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';
import {
    PROMOTION_IMAGE_MAX_BYTES,
    PROMOTION_IMAGE_MIME_TYPES,
    updatePromotionSettingsSchema,
    type UpdatePromotionSettingsInput,
} from '@validations/promotion-settings.schema';

function promotionUpdatePayload(input: UpdatePromotionSettingsInput) {
    return {
        'promotion.enabled': input.enabled,
        'promotion.title': input.title,
        'promotion.description': input.description,
        'promotion.startDate': input.startDate ?? null,
        'promotion.endDate': input.endDate ?? null,
        'promotion.hideAfterExpiry': input.hideAfterExpiry,
    };
}

async function loadPromotionDto(): Promise<ApiResponse<PromotionSettingsDto>> {
    await connectToDatabase();
    const existing = await getSalonSettingsDocument();
    const updated = await SalonSettings.findById(existing._id).lean();
    if (!updated) {
        return apiErrorResult<PromotionSettingsDto>('Settings not found', 404);
    }
    return apiSuccessResult(
        serializePromotionSettings(updated.promotion),
        'Promotion settings updated',
    );
}

export async function updatePromotionSettingsAction(
    input: UpdatePromotionSettingsInput,
): Promise<ApiResponse<PromotionSettingsDto>> {
    const authError = await requireAdmin<PromotionSettingsDto>();
    if (authError) return authError;

    const parsed = parseActionInput(updatePromotionSettingsSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<PromotionSettingsDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const existing = await getSalonSettingsDocument();
        await SalonSettings.findByIdAndUpdate(existing._id, {
            $set: promotionUpdatePayload(parsed.data),
        });
        return loadPromotionDto();
    } catch (error) {
        console.error('[updatePromotionSettingsAction]', error);
        return apiErrorResult<PromotionSettingsDto>('Failed to update promotion settings', 500);
    }
}

function validatePromotionImage(file: File): string | null {
    if (
        !PROMOTION_IMAGE_MIME_TYPES.includes(
            file.type as (typeof PROMOTION_IMAGE_MIME_TYPES)[number],
        )
    ) {
        return 'Image must be JPEG, PNG, or WebP';
    }
    if (file.size > PROMOTION_IMAGE_MAX_BYTES) {
        return 'Image must be 5 MB or smaller';
    }
    return null;
}

export async function uploadPromotionImageAction(
    formData: FormData,
): Promise<ApiResponse<PromotionSettingsDto>> {
    const authError = await requireAdmin<PromotionSettingsDto>();
    if (authError) return authError;

    const file = formData.get('file');
    if (!(file instanceof File)) {
        return apiErrorResult<PromotionSettingsDto>('No image file provided', 400);
    }

    const validationError = validatePromotionImage(file);
    if (validationError) {
        return apiErrorResult<PromotionSettingsDto>(validationError, 400);
    }

    try {
        await connectToDatabase();
        const existing = await getSalonSettingsDocument();
        const oldPublicId = existing.promotion?.imagePublicId ?? null;
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploaded = await uploadPromotionImage(buffer);

        await SalonSettings.findByIdAndUpdate(existing._id, {
            $set: {
                'promotion.imageUrl': uploaded.url,
                'promotion.imagePublicId': uploaded.publicId,
                'promotion.imageWidth': uploaded.width ?? null,
                'promotion.imageHeight': uploaded.height ?? null,
            },
        });

        if (oldPublicId && oldPublicId !== uploaded.publicId) {
            try {
                await deleteCloudinaryImage(oldPublicId);
            } catch (deleteError) {
                console.error('[uploadPromotionImageAction] delete old image failed', deleteError);
            }
        }

        return loadPromotionDto();
    } catch (error) {
        console.error('[uploadPromotionImageAction]', error);
        return apiErrorResult<PromotionSettingsDto>('Failed to upload promotion image', 500);
    }
}

export async function removePromotionImageAction(): Promise<ApiResponse<PromotionSettingsDto>> {
    const authError = await requireAdmin<PromotionSettingsDto>();
    if (authError) return authError;

    try {
        await connectToDatabase();
        const existing = await getSalonSettingsDocument();
        const oldPublicId = existing.promotion?.imagePublicId ?? null;

        await SalonSettings.findByIdAndUpdate(existing._id, {
            $set: {
                'promotion.imageUrl': null,
                'promotion.imagePublicId': null,
                'promotion.imageWidth': null,
                'promotion.imageHeight': null,
            },
        });

        if (oldPublicId) {
            try {
                await deleteCloudinaryImage(oldPublicId);
            } catch (deleteError) {
                console.error('[removePromotionImageAction] delete image failed', deleteError);
            }
        }

        return loadPromotionDto();
    } catch (error) {
        console.error('[removePromotionImageAction]', error);
        return apiErrorResult<PromotionSettingsDto>('Failed to remove promotion image', 500);
    }
}
