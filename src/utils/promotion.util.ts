import { getSalonLocalDateTime } from '@utils/booking-schedule.util';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';

export function normalizePromotionDate(value: string | null | undefined): string | null {
    if (!value || value.trim() === '') return null;
    return value.trim();
}

type PromotionVisibilityInput = Pick<
    PromotionSettingsDto,
    'enabled' | 'startDate' | 'endDate' | 'hideAfterExpiry' | 'showBeforeStartDate'
>;

export function isPromotionVisible(promotion: PromotionVisibilityInput, now = new Date()): boolean {
    if (!promotion.enabled) return false;

    const today = getSalonLocalDateTime(now).isoDate;
    const startDate = normalizePromotionDate(promotion.startDate);
    const endDate = normalizePromotionDate(promotion.endDate);
    const hideAfterExpiry = promotion.hideAfterExpiry ?? true;
    const showBeforeStartDate = promotion.showBeforeStartDate ?? true;

    if (!showBeforeStartDate && startDate && today < startDate) return false;
    if (hideAfterExpiry && endDate && today > endDate) return false;

    return true;
}

export function shouldRenderPromotionSection(
    promotion: Pick<PromotionSettingsDto, keyof PromotionVisibilityInput | 'imageUrl'>,
): boolean {
    return isPromotionVisible(promotion) && Boolean(promotion.imageUrl);
}

export function formatPromotionDate(iso: string, locale: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    if (!year || !month || !day) return iso;

    return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(year, month - 1, day));
}
