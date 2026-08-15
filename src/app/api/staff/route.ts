import { connectToDatabase } from '@libs/mongodb';
import { serializeUser } from '@mappers';
import { User } from '@models/user.model';
import { apiError, apiSuccess } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @queryParams staffListQuerySchema
 * @response staffListApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/staff:
 *   get:
 *     tags: [Catalog]
 *     summary: List staff for booking
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visibleOnly = searchParams.get('visible') === 'true';

        await connectToDatabase();
        const filter = {
            role: 'staff' as const,
            isActive: true,
            ...(visibleOnly ? { visible: true } : {}),
        };

        const staff = await User.find(filter).sort({ firstName: 1, lastName: 1 }).lean();
        return apiSuccess(staff.map(serializeUser), 'OK');
    } catch (error) {
        console.error('[GET /api/staff]', error);
        return apiError('Failed to fetch staff', 500);
    }
}
