import { getAvailableSlotsForDateServer, isPublicBookingEnabled } from '@server/schedule.server';
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
            staffPreference: searchParams.get('staffPreference') ?? undefined,
            staffId: searchParams.get('staffId') ?? undefined,
        });

        if (!parsed.success) {
            return apiError(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
        }

        if (!(await isPublicBookingEnabled())) {
            return apiError('Online booking is temporarily unavailable', 403);
        }

        const { date, staffPreference, staffId } = parsed.data;
        const slots = await getAvailableSlotsForDateServer(date, {
            staffPreference,
            staffId,
        });
        return apiSuccess({ date, slots }, 'OK');
    } catch (error) {
        console.error('[GET /api/bookings/slots]', error);
        return apiError('Failed to fetch slots', 500);
    }
}
