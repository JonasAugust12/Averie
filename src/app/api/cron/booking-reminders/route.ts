import { runBookingReminderBatch } from '@server/booking-reminder-batch.server';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(request: Request) {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret) return false;
    const auth = request.headers.get('authorization');
    return auth === `Bearer ${secret}`;
}

/**
 * Vercel Cron — sends night-before booking reminder emails (Hobby: once daily).
 * Schedule `0 3 * * *` UTC ≈ 10 PM US Eastern the evening before the appointment day.
 * Requires `Authorization: Bearer ${CRON_SECRET}` (not a public endpoint).
 * @response bookingReminderBatchApiResponseSchema
 * @responseSet common
 * @add 401:apiErrorResponseSchema
 * @openapi
 * /api/cron/booking-reminders:
 *   get:
 *     tags: [Cron]
 *     summary: Process booking reminder email batch
 */
export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return apiError('Unauthorized', 401);
    }

    try {
        const result = await runBookingReminderBatch();
        return apiSuccess(result, 'Reminder batch complete');
    } catch (error) {
        console.error('[cron/booking-reminders]', error);
        return apiError('Failed to process reminders', 500);
    }
}
