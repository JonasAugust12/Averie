import { getAvailableSlotsForDateServer } from '@libs/schedule.server';
import { bookingSlotsQuerySchema } from '@validations/booking.schema';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @queryParams bookingSlotsQuerySchema
 * @response bookingSlotsApiResponseSchema
 * @responseSet common
 * @openapi
 * /api/bookings/slots:
 *   get:
 *     tags: [Booking]
 *     summary: Available time slots for a date
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = bookingSlotsQuerySchema.safeParse({
            date: searchParams.get('date'),
            serviceIds: searchParams.get('serviceIds'),
        });

        if (!parsed.success) {
            return apiError(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
        }

        const slots = await getAvailableSlotsForDateServer(parsed.data.date);
        return apiSuccess({ date: parsed.data.date, slots }, 'OK');
    } catch (error) {
        console.error('[GET /api/bookings/slots]', error);
        return apiError('Failed to fetch slots', 500);
    }
}
