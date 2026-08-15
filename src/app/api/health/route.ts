import { connectToDatabase, getMongoReadyState } from '@libs/mongodb';
import { apiError, apiSuccess } from '../_lib/http';
import type { HealthData } from '@typings/health.type';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET health — example read-only Route Handler.
 * @response healthApiResponseSchema
 * @responseSet common
 * @add 503:apiErrorResponseSchema
 * @openapi
 */
export async function GET() {
    try {
        await connectToDatabase();
        const mongo = getMongoReadyState();

        const data: HealthData = {
            health: mongo === 'connected' ? 'ok' : 'degraded',
            mongo,
            timestamp: new Date().toISOString(),
        };

        return apiSuccess(data, 'OK');
    } catch (error) {
        console.error('[GET /api/health]', error);
        return apiError('Service unavailable', 503);
    }
}
