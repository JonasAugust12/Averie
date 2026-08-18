import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { enrichBookingListItem, loadStaffServiceMaps } from '@server/booking-enrich.server';
import { requireAdmin } from '@guard/auth-guard';
import { Booking } from '@models/booking.model';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * @pathParams bookingIdSchema
 * @response bookingDetailApiResponseSchema
 * @responseSet common
 * @auth sessionCookie
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Booking detail (admin)
 */
export async function GET(_request: Request, context: RouteContext) {
    const authError = await requireAdmin();
    if (authError) {
        return apiError(authError.message, authError.status);
    }

    try {
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError('Invalid booking id', 400);
        }

        await connectToDatabase();
        const booking = await Booking.findById(id).lean();
        if (!booking) {
            return apiError('Booking not found', 404);
        }

        const maps = await loadStaffServiceMaps();

        return apiSuccess(enrichBookingListItem(booking, maps), 'OK');
    } catch (error) {
        console.error('[GET /api/bookings/[id]]', error);
        return apiError('Failed to fetch booking', 500);
    }
}
