import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@guard/auth-guard';
import { Booking } from '@models/booking.model';
import { User } from '@models/user.model';
import type { AdminKpiDto } from '@typings/admin-kpi.type';
import { adminKpisQuerySchema } from '@validations/admin.schema';
import { getDashboardPeriodRange, type DashboardPeriod } from '@utils/dashboard-period.util';
import { apiError, apiSuccess } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildDateFilter(range: { dateFrom?: string; dateTo?: string }) {
    if (range.dateFrom && range.dateTo) {
        if (range.dateFrom === range.dateTo) {
            return { date: range.dateFrom };
        }
        return { date: { $gte: range.dateFrom, $lte: range.dateTo } };
    }
    return {};
}

function periodHints(
    period: DashboardPeriod,
): Pick<AdminKpiDto, 'appointmentsDelta' | 'pendingHint' | 'revenueHint' | 'activeTechsHint'> {
    switch (period) {
        case 'today':
            return {
                appointmentsDelta: 'Scheduled for today',
                pendingHint: 'Upcoming today',
                revenueHint: 'Projected for today',
                activeTechsHint: 'Assigned today',
            };
        case 'week':
            return {
                appointmentsDelta: 'This week',
                pendingHint: 'Upcoming this week',
                revenueHint: 'This week (non-cancelled)',
                activeTechsHint: 'With bookings this week',
            };
        case 'month':
            return {
                appointmentsDelta: 'This month',
                pendingHint: 'Upcoming this month',
                revenueHint: 'This month (non-cancelled)',
                activeTechsHint: 'With bookings this month',
            };
        case 'year':
            return {
                appointmentsDelta: 'This year',
                pendingHint: 'Upcoming this year',
                revenueHint: 'This year (non-cancelled)',
                activeTechsHint: 'With bookings this year',
            };
        case 'all':
        default:
            return {
                appointmentsDelta: 'All time',
                pendingHint: 'All upcoming',
                revenueHint: 'All time (non-cancelled)',
                activeTechsHint: 'Visible active staff',
            };
    }
}

/**
 * @queryParams adminKpisQuerySchema
 * @response adminKpisApiResponseSchema
 * @responseSet common
 * @auth sessionCookie
 * @openapi
 * /api/admin/kpis:
 *   get:
 *     tags: [Admin]
 *     summary: Dashboard KPI metrics
 */
export async function GET(request: Request) {
    const authError = await requireAdmin();
    if (authError) {
        return apiError(authError.message, authError.status);
    }

    try {
        const { searchParams } = new URL(request.url);
        const parsed = adminKpisQuerySchema.safeParse({
            period: searchParams.get('period') ?? undefined,
        });

        if (!parsed.success) {
            return apiError(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
        }

        const { period } = parsed.data;
        const range = getDashboardPeriodRange(period);
        const dateFilter = buildDateFilter(range);
        const activeFilter = { status: { $ne: 'cancelled' as const }, ...dateFilter };
        const upcomingFilter = { status: 'upcoming' as const, ...dateFilter };

        await connectToDatabase();

        const [appointments, pending, revenueAgg, staffAgg, visibleStaff] = await Promise.all([
            Booking.countDocuments(activeFilter),
            Booking.countDocuments(upcomingFilter),
            Booking.aggregate([
                { $match: activeFilter },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            ]),
            Booking.aggregate([
                {
                    $match: {
                        ...upcomingFilter,
                        staffPreference: 'specific',
                        staffId: { $exists: true, $ne: null },
                    },
                },
                { $group: { _id: '$staffId' } },
                { $count: 'total' },
            ]),
            User.countDocuments({ role: 'staff', isActive: true, visible: true }),
        ]);

        const revenue = revenueAgg[0]?.total ?? 0;
        const staffWithBookings = staffAgg[0]?.total ?? 0;
        const activeTechs = staffWithBookings > 0 ? staffWithBookings : visibleStaff;

        const hints = periodHints(period);

        const data: AdminKpiDto = {
            appointments,
            appointmentsDelta: hints.appointmentsDelta,
            pending,
            pendingHint: hints.pendingHint,
            revenue,
            revenueHint: hints.revenueHint,
            activeTechs,
            activeTechsHint: hints.activeTechsHint,
        };

        return apiSuccess(data, 'OK');
    } catch (error) {
        console.error('[GET /api/admin/kpis]', error);
        return apiError('Failed to fetch KPIs', 500);
    }
}
