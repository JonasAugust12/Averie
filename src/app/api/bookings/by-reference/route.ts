import { enrichBookingListItem, loadStaffServiceMaps } from '@server/booking-enrich.server';
import { findBookingByLookupQuery } from '@utils/booking.util';
import { bookingReferenceQuerySchema } from '@validations/booking.schema';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @queryParams bookingReferenceQuerySchema
 * @response bookingByReferenceApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/bookings/by-reference:
 *   get:
 *     tags: [Booking]
 *     summary: Lookup booking by reference or phone
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = bookingReferenceQuerySchema.safeParse({
            reference: searchParams.get('reference'),
        });

        if (!parsed.success) {
            return apiError(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
        }

        const booking = await findBookingByLookupQuery(parsed.data.reference);

        if (!booking) {
            return apiError('Booking not found', 404);
        }

        const maps = await loadStaffServiceMaps();

        return apiSuccess(enrichBookingListItem(booking, maps), 'OK');
    } catch (error) {
        console.error('[GET /api/bookings/by-reference]', error);
        return apiError('Failed to fetch booking', 500);
    }
}
