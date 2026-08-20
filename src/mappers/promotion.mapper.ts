import type { PromotionSettingsDto } from '@typings/promotion-settings.type';
import { normalizePromotionDate } from '@utils/promotion.util';

type PromotionDoc = {
    enabled?: boolean;
    title?: string;
    description?: string;
    startDate?: string | null;
    endDate?: string | null;
    hideAfterExpiry?: boolean;
    showBeforeStartDate?: boolean;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    imageWidth?: number | null;
    imageHeight?: number | null;
    color?: string | null;
};

function optimizePromotionImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
    if (url.includes('/upload/c_limit')) return url;
    return url.replace('/upload/', '/upload/c_limit,w_1200/');
}

export function serializePromotionSettings(
    promotion: PromotionDoc | undefined | null,
): PromotionSettingsDto {
    const dto: PromotionSettingsDto = {
        enabled: promotion?.enabled ?? false,
        title: promotion?.title ?? '',
        description: promotion?.description ?? '',
        startDate: normalizePromotionDate(promotion?.startDate ?? null),
        endDate: normalizePromotionDate(promotion?.endDate ?? null),
        hideAfterExpiry: promotion?.hideAfterExpiry ?? true,
        showBeforeStartDate: promotion?.showBeforeStartDate ?? true,
        imageUrl: optimizePromotionImageUrl(promotion?.imageUrl ?? null),
        imagePublicId: promotion?.imagePublicId ?? null,
        imageWidth: promotion?.imageWidth ?? null,
        imageHeight: promotion?.imageHeight ?? null,
        color: promotion?.color ?? null,
    };

    return dto;
}

export const PROMOTION_COLOR_FALLBACK = '#b91c1c';

/**
 * Returns the configured promotion color, or the default red fallback.
 */
export function resolvePromotionColor(color: string | null | undefined): string {
    if (color && /^#[0-9a-fA-F]{6}$/.test(color)) return color;
    return PROMOTION_COLOR_FALLBACK;
}
