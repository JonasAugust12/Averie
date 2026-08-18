import type { PromotionSettingsDto } from '@typings/promotion-settings.type';
import { isPromotionVisible, normalizePromotionDate } from '@utils/promotion.util';

type PromotionDoc = {
    enabled?: boolean;
    title?: string;
    description?: string;
    startDate?: string | null;
    endDate?: string | null;
    hideAfterExpiry?: boolean;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    imageWidth?: number | null;
    imageHeight?: number | null;
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
        imageUrl: optimizePromotionImageUrl(promotion?.imageUrl ?? null),
        imagePublicId: promotion?.imagePublicId ?? null,
        imageWidth: promotion?.imageWidth ?? null,
        imageHeight: promotion?.imageHeight ?? null,
        visible: false,
    };

    dto.visible = isPromotionVisible(dto);
    return dto;
}
