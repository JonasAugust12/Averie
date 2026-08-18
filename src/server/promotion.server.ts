import { getSalonSettingsDocument } from '@server/schedule.server';
import { serializePromotionSettings } from '@mappers/promotion.mapper';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';

export async function getPromotionSettingsDto(): Promise<PromotionSettingsDto> {
    const settings = await getSalonSettingsDocument();
    return serializePromotionSettings(settings.promotion);
}
