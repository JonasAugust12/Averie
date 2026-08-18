import { getScheduleSettingsDto } from '@server/schedule.server';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @response scheduleSettingsApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/settings/schedule:
 *   get:
 *     tags: [Settings]
 *     summary: Get salon schedule settings
 */
export async function GET() {
    try {
        const settings = await getScheduleSettingsDto();
        return apiSuccess(settings, 'OK');
    } catch (error) {
        console.error('[GET /api/settings/schedule]', error);
        return apiError('Failed to fetch schedule settings', 500);
    }
}
