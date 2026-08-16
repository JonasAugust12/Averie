import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { requireStaffSelfOrAdmin } from '@libs/auth-guard';
import { serializeBooking } from '@mappers';
import { Booking } from '@models/booking.model';
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
export async function GET(_request: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError('Invalid staff id', 400);
        }

        const authError = await requireStaffSelfOrAdmin(id);
        if (authError) {
            return apiError(authError.message, authError.status);
        }

        await connectToDatabase();
        const bookings = await Booking.find({
            status: 'upcoming',
            $or: [{ staffId: id }, { staffPreference: 'any' }],
        })
            .sort({ date: 1, time: 1 })
            .lean();

        return apiSuccess(bookings.map(serializeBooking), 'OK');
    } catch (error) {
        console.error('[GET /api/staff/[id]/bookings]', error);
        return apiError('Failed to fetch staff bookings', 500);
    }
}
