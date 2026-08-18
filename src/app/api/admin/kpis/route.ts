import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@guard/auth-guard';
import { Booking } from '@models/booking.model';
import { User } from '@models/user.model';
import type { AdminKpiDto } from '@typings/admin-kpi.type';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @response adminKpisApiResponseSchema
 * @responseSet common
 * @auth sessionCookie
 * @openapi
 * /api/admin/kpis:
 *   get:
 *     tags: [Admin]
 *     summary: Dashboard KPI metrics
 */
export async function GET() {
    const authError = await requireAdmin();
    if (authError) {
        return apiError(authError.message, authError.status);
    }

    try {
        await connectToDatabase();
        const today = new Date().toISOString().slice(0, 10);

        const [appointments, pending, revenueAgg, activeTechs] = await Promise.all([
            Booking.countDocuments({ date: today, status: 'upcoming' }),
            Booking.countDocuments({ status: 'upcoming' }),
            Booking.aggregate([
                { $match: { date: today, status: 'upcoming' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            ]),
            User.countDocuments({ role: 'staff', isActive: true, visible: true }),
        ]);

        const revenue = revenueAgg[0]?.total ?? 0;

        const data: AdminKpiDto = {
            appointments,
            appointmentsDelta: '',
            pending,
            pendingHint: 'Upcoming bookings',
            revenue,
            revenueHint: 'Projected for today',
            activeTechs,
            activeTechsHint: 'Visible active staff',
        };

        return apiSuccess(data, 'OK');
    } catch (error) {
        console.error('[GET /api/admin/kpis]', error);
        return apiError('Failed to fetch KPIs', 500);
    }
}
