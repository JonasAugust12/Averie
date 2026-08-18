import { getSalonLocalDateTime } from '@utils/booking-schedule.util';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';

export function normalizePromotionDate(value: string | null | undefined): string | null {
    if (!value || value.trim() === '') return null;
    return value.trim();
}

export function isPromotionVisible(
    promotion: Pick<PromotionSettingsDto, 'enabled' | 'startDate' | 'endDate' | 'hideAfterExpiry'>,
    now = new Date(),
): boolean {
    if (!promotion.enabled) return false;

    const today = getSalonLocalDateTime(now).isoDate;
    const startDate = normalizePromotionDate(promotion.startDate);
    const endDate = normalizePromotionDate(promotion.endDate);
    const hideAfterExpiry = promotion.hideAfterExpiry ?? true;

    if (startDate && today < startDate) return false;
    if (hideAfterExpiry && endDate && today > endDate) return false;

    return true;
}

export function shouldRenderPromotionSection(
    promotion: Pick<
        PromotionSettingsDto,
        'enabled' | 'startDate' | 'endDate' | 'imageUrl' | 'visible'
    >,
): boolean {
    return promotion.visible && Boolean(promotion.imageUrl);
}
