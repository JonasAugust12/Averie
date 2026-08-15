import { connectToDatabase } from '@libs/mongodb';
import { serializeService } from '@mappers';
import { Service } from '@models/service.model';
import { apiError, apiSuccess } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @response servicesApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/services:
 *   get:
 *     tags: [Catalog]
 *     summary: List visible services
 */
export async function GET() {
    try {
        await connectToDatabase();
        const services = await Service.find({ visible: true }).sort({ name: 1 }).lean();
        return apiSuccess(services.map(serializeService), 'OK');
    } catch (error) {
        console.error('[GET /api/services]', error);
        return apiError('Failed to fetch services', 500);
    }
}
