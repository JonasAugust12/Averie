import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { enrichBookingListItems, loadStaffServiceMaps } from '@server/booking-enrich.server';
import { requireStaffSelfOrAdmin } from '@guard/auth-guard';
import { Booking } from '@models/booking.model';
import { staffBookingsQuerySchema } from '@validations/booking.schema';
import { apiError, apiSuccess } from '../../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * @pathParams staffIdSchema
 * @response staffBookingsApiResponseSchema
 * @responseSet common
 * @auth sessionCookie
 * @openapi
 * /api/staff/{id}/bookings:
 *   get:
 *     tags: [Staff]
 *     summary: Staff calendar bookings
 */
export async function GET(request: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError('Invalid staff id', 400);
        }

        const authError = await requireStaffSelfOrAdmin(id);
        if (authError) {
            return apiError(authError.message, authError.status);
        }

        const { searchParams } = new URL(request.url);
        const parsed = staffBookingsQuerySchema.safeParse({
            dateFrom: searchParams.get('dateFrom') ?? undefined,
            dateTo: searchParams.get('dateTo') ?? undefined,
        });
        if (!parsed.success) {
            return apiError(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
        }

        const { dateFrom, dateTo } = parsed.data;
        const filter: Record<string, unknown> = {
            status: 'upcoming',
            $or: [{ staffId: id }, { staffPreference: 'any' }],
        };
        if (dateFrom || dateTo) {
            const dateFilter: Record<string, string> = {};
            if (dateFrom) dateFilter.$gte = dateFrom;
            if (dateTo) dateFilter.$lte = dateTo;
            filter.date = dateFilter;
        }

        await connectToDatabase();
        const bookings = await Booking.find(filter).sort({ date: 1, time: 1 }).lean();

        const maps = await loadStaffServiceMaps();

        return apiSuccess(enrichBookingListItems(bookings, maps), 'OK');
    } catch (error) {
        console.error('[GET /api/staff/[id]/bookings]', error);
        return apiError('Failed to fetch staff bookings', 500);
    }
}
