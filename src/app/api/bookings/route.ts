import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@guard/auth-guard';
import { enrichBookingListItems, loadStaffServiceMaps } from '@server/booking-enrich.server';
import { Booking } from '@models/booking.model';
import type { BookingDocument } from '@models/booking.model';
import type { BookingDisplayStatus } from '@typings/salon-common.type';
import type { BookingListStatsDto } from '@typings/booking.type';
import { getBookingDisplayStatus } from '@utils/booking-schedule.util';
import { buildFlexiblePhoneRegex, extractPhoneDigits, phoneDigitVariants } from '@utils/phone.util';
import { bookingsListQuerySchema } from '@validations/booking.schema';
import { apiError, apiSuccess } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type BookingLeanDoc = BookingDocument & { createdAt?: Date; updatedAt?: Date };

function applyDisplayStatusFilter<
    T extends { status: 'upcoming' | 'cancelled'; date: string; time: string },
>(bookings: T[], status: BookingDisplayStatus | undefined): T[] {
    if (!status) return bookings;
    return bookings.filter((booking) => getBookingDisplayStatus(booking) === status);
}

function buildBookingStats(
    bookings: { status: 'upcoming' | 'cancelled'; date: string; time: string }[],
): BookingListStatsDto {
    return bookings.reduce<BookingListStatsDto>(
        (stats, booking) => {
            stats.total += 1;
            stats[getBookingDisplayStatus(booking)] += 1;
            return stats;
        },
        { total: 0, upcoming: 0, cancelled: 0, completed: 0 },
    );
}

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
        if (date) {
            filter.date = date;
        } else if (dateFrom || dateTo) {
            const dateFilter: Record<string, string> = {};
            if (dateFrom) dateFilter.$gte = dateFrom;
            if (dateTo) dateFilter.$lte = dateTo;
            filter.date = dateFilter;
        }
        if (search) {
            const trimmedSearch = search.trim();
            const digits = extractPhoneDigits(trimmedSearch);

            if (digits.length >= 7) {
                const variants = phoneDigitVariants(digits);
                const phoneRegexes = variants.map((variant) => buildFlexiblePhoneRegex(variant));
                filter.$or = [
                    { reference: { $regex: trimmedSearch, $options: 'i' } },
                    ...phoneRegexes.map((regex) => ({ 'customer.phone': regex })),
                    { 'customer.firstName': { $regex: trimmedSearch, $options: 'i' } },
                    { 'customer.lastName': { $regex: trimmedSearch, $options: 'i' } },
                ];
            } else {
                filter.$or = [
                    { reference: { $regex: trimmedSearch, $options: 'i' } },
                    { 'customer.phone': { $regex: trimmedSearch, $options: 'i' } },
                    { 'customer.firstName': { $regex: trimmedSearch, $options: 'i' } },
                    { 'customer.lastName': { $regex: trimmedSearch, $options: 'i' } },
                ];
            }
        }

        await connectToDatabase();
        const skip = (page - 1) * limit;
        const query = Booking.find(filter);
        if (dateFrom || dateTo) {
            query.sort({ date: 1, time: 1 });
        } else {
            query.sort({ createdAt: -1 });
        }
        const allMatching = (await query.lean()) as BookingLeanDoc[];
        const stats = buildBookingStats(allMatching);
        const filteredItems = applyDisplayStatusFilter(allMatching, status);
        const total = filteredItems.length;
        const items = filteredItems.slice(skip, skip + limit);

        const maps = await loadStaffServiceMaps();

        return apiSuccess(
            {
                items: enrichBookingListItems(items, maps),
                total,
                page,
                limit,
                stats,
            },
            'OK',
        );
    } catch (error) {
        console.error('[GET /api/bookings]', error);
        return apiError('Failed to fetch bookings', 500);
    }
}
