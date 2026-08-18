import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@guard/auth-guard';
import { enrichBookingListItems, loadStaffServiceMaps } from '@server/booking-enrich.server';
import { Booking } from '@models/booking.model';
import { bookingsListQuerySchema } from '@validations/booking.schema';
import { apiError, apiSuccess } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @queryParams bookingsListQuerySchema
 * @response bookingsListApiResponseSchema
 * @responseSet common
 * @auth sessionCookie
 * @openapi
 * /api/bookings:
 *   get:
 *     tags: [Admin]
 *     summary: Paginated bookings list (admin)
 */
export async function GET(request: Request) {
    const authError = await requireAdmin();
    if (authError) {
        return apiError(authError.message, authError.status);
    }

    try {
        const { searchParams } = new URL(request.url);
        const parsed = bookingsListQuerySchema.safeParse({
            page: searchParams.get('page') ?? undefined,
            limit: searchParams.get('limit') ?? undefined,
            status: searchParams.get('status') ?? undefined,
            date: searchParams.get('date') ?? undefined,
            dateFrom: searchParams.get('dateFrom') ?? undefined,
            dateTo: searchParams.get('dateTo') ?? undefined,
            search: searchParams.get('search') ?? undefined,
        });

        if (!parsed.success) {
            return apiError(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
        }

        const { page, limit, status, date, dateFrom, dateTo, search } = parsed.data;
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;
        if (date) {
            filter.date = date;
        } else if (dateFrom || dateTo) {
            const dateFilter: Record<string, string> = {};
            if (dateFrom) dateFilter.$gte = dateFrom;
            if (dateTo) dateFilter.$lte = dateTo;
            filter.date = dateFilter;
        }
        if (search) {
            filter.$or = [
                { reference: { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } },
                { 'customer.firstName': { $regex: search, $options: 'i' } },
                { 'customer.lastName': { $regex: search, $options: 'i' } },
            ];
        }

        await connectToDatabase();
        const skip = (page - 1) * limit;
        const query = Booking.find(filter).skip(skip).limit(limit);
        if (dateFrom || dateTo) {
            query.sort({ date: 1, time: 1 });
        } else {
            query.sort({ createdAt: -1 });
        }
        const [items, total] = await Promise.all([query.lean(), Booking.countDocuments(filter)]);

        const maps = await loadStaffServiceMaps();

        return apiSuccess(
            {
                items: enrichBookingListItems(items, maps),
                total,
                page,
                limit,
            },
            'OK',
        );
    } catch (error) {
        console.error('[GET /api/bookings]', error);
        return apiError('Failed to fetch bookings', 500);
    }
}
