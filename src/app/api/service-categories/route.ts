import { connectToDatabase } from '@libs/mongodb';
import { serializeServiceCategory, serializeService } from '@mappers';
import { ServiceCategory } from '@models/service-category.model';
import { Service } from '@models/service.model';
import { apiError, apiSuccess } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @response serviceCategoriesApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/service-categories:
 *   get:
 *     tags: [Catalog]
 *     summary: List service categories with services
 */
export async function GET() {
    try {
        await connectToDatabase();
        const categories = await ServiceCategory.find().sort({ sortOrder: 1, name: 1 }).lean();
        const services = await Service.find({ visible: true }).lean();

        const data = categories.map((category) => ({
            ...serializeServiceCategory(category),
            services: services
                .filter((s) => String(s.categoryId) === String(category._id))
                .map(serializeService),
        }));

        return apiSuccess(data, 'OK');
    } catch (error) {
        console.error('[GET /api/service-categories]', error);
        return apiError('Failed to fetch categories', 500);
    }
}
