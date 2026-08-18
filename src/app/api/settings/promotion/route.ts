import { getPromotionSettingsDto } from '@server/promotion.server';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @response promotionSettingsApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/settings/promotion:
 *   get:
 *     tags: [Settings]
 *     summary: Get salon promotion settings
 *     description: |
 *       Public read of salon_settings.promotion. Landing renders the section when
 *       `enabled` is true, `imageUrl` is set, and date rules pass (`showBeforeStartDate`,
 *       `hideAfterExpiry`, optional start/end dates). Computed `visible` is not returned.
 */
export async function GET() {
    try {
        const settings = await getPromotionSettingsDto();
        return apiSuccess(settings, 'OK');
    } catch (error) {
        console.error('[GET /api/settings/promotion]', error);
        return apiError('Failed to fetch promotion settings', 500);
    }
}
