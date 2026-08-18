import { connectToDatabase } from '@libs/mongodb';
import { getSessionUser } from '@guard/auth-guard';
import { serializeService } from '@mappers';
import { Service } from '@models/service.model';
import { apiError, apiSuccess } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @queryParams servicesListQuerySchema
 * @response servicesApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/services:
 *   get:
 *     tags: [Catalog]
 *     summary: List services (visible for public; all for admin)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const user = await getSessionUser();
        const isAdmin = user?.role === 'admin';
        const requestAll = searchParams.get('all') === 'true';

        await connectToDatabase();
        const filter = isAdmin && requestAll ? {} : { visible: true };
        const services = await Service.find(filter).sort({ name: 1 }).lean();
        return apiSuccess(services.map(serializeService), 'OK');
    } catch (error) {
        console.error('[GET /api/services]', error);
        return apiError('Failed to fetch services', 500);
    }
}
