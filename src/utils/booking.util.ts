import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { Booking, type BookingDocument } from '@models/booking.model';
import { Service } from '@models/service.model';
import { User } from '@models/user.model';
import {
    getSlotBookedLockReason,
    MAX_SLOT_WAIT_TOLERANCE_MINUTES,
} from '@utils/booking-schedule.util';
import { minuteOf } from '@utils/schedule.util';
import { bookingForScheduleUtil } from '@mappers/booking.mapper';
import {
    buildFlexiblePhoneRegex,
    extractPhoneDigits,
    normalizeBookingLookupQuery,
    phoneDigitVariants,
    phoneDigitsMatch,
} from '@utils/phone.util';

type BookingLean = BookingDocument & { _id: mongoose.Types.ObjectId; createdAt?: Date };

export async function computeBookingTotals(serviceIds: string[]) {
    await connectToDatabase();
    const services = await Service.find({
        _id: { $in: serviceIds },
        visible: true,
    }).lean();

    if (services.length !== serviceIds.length) {
        throw new Error('One or more services are invalid or not visible');
    }

    const totalEstimatedMinutes = services.reduce((sum, s) => sum + s.estimatedMinutes, 0);
    const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

    return { services, totalEstimatedMinutes, totalPrice };
}

export async function hasSlotConflict(
    date: string,
    time: string,
    staffPreference: 'any' | 'specific',
    staffId?: string,
    totalEstimatedMinutes?: number,
): Promise<boolean> {
    await connectToDatabase();

    // 'any' preference: salon assigns staff internally — never a conflict.
    if (staffPreference === 'any') return false;

    if (!staffId || !mongoose.Types.ObjectId.isValid(staffId)) {
        console.warn('[hasSlotConflict] Invalid staffId, blocking:', staffId);
        return true;
    }

    const rawBookings = await Booking.find({ date, status: 'upcoming' })
        .select('date time status staffId staffPreference totalEstimatedMinutes')
        .lean();

    const dayBookings = rawBookings.map(bookingForScheduleUtil);

    // Check 1: does an existing booking block the requested slot?
    const lockReason = getSlotBookedLockReason(time, dayBookings, staffPreference, staffId);
    if (lockReason) {
        return true;
    }

    // Check 2: forward-spillover — new booking duration overlaps a future existing booking
    if (totalEstimatedMinutes) {
        const slotMin = minuteOf(time);
        const slotEnd = slotMin + totalEstimatedMinutes;

        for (const b of dayBookings) {
            if (b.status === 'cancelled') continue;
            const isSameStaff = b.staffPreference === 'specific' && b.staffId === staffId;
            if (!isSameStaff) continue;

            const bStart = minuteOf(b.time);
            if (bStart > slotMin && slotEnd > bStart) {
                const forwardSpillover = slotEnd - bStart;
                if (forwardSpillover > MAX_SLOT_WAIT_TOLERANCE_MINUTES) {
                    return true;
                }
            }
        }
    }

    return false;
}

export async function generateBookingReference(date: string): Promise<string> {
    await connectToDatabase();
    const day = date.replace(/-/g, '');

    // Generate a unique 4-character alphanumeric reference suffix (e.g. AV-20260820-K8P2)
    // with MongoDB collision checks to prevent duplicate key index errors.
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    for (let attempt = 0; attempt < 10; attempt++) {
        let suffix = '';
        for (let i = 0; i < 4; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }
        const ref = `AV-${day}-${suffix}`;
        const exists = await Booking.exists({ reference: ref });
        if (!exists) {
            return ref;
        }
    }

    // Fallback: timestamp-backed 6-character code
    const fallbackSuffix = Date.now().toString(36).slice(-4).toUpperCase();
    return `AV-${day}-${fallbackSuffix}`;
}

export async function validateStaffForBooking(staffId: string) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
        throw new Error('Invalid staff id');
    }

    const staff = await User.findOne({
        _id: staffId,
        role: 'staff',
        visible: true,
        isActive: true,
    }).lean();

    if (!staff) {
        throw new Error('Staff not available');
    }

    return staff;
}

export function isDuplicateKeyError(error: unknown): boolean {
    return (
        error instanceof mongoose.mongo.MongoServerError &&
        (error as mongoose.mongo.MongoServerError).code === 11000
    );
}

export function getDuplicateKeyPattern(error: unknown): Record<string, unknown> | null {
    if (
        error instanceof mongoose.mongo.MongoServerError &&
        (error as mongoose.mongo.MongoServerError).code === 11000
    ) {
        return (error as { keyPattern?: Record<string, unknown> }).keyPattern ?? null;
    }
    return null;
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pickBestBookingMatch(bookings: BookingLean[]): BookingLean | null {
    if (bookings.length === 0) return null;
    if (bookings.length === 1) return bookings[0];

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = bookings
        .filter((booking) => booking.status === 'upcoming' && booking.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    if (upcoming.length > 0) return upcoming[0];

    return [...bookings].sort(
        (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    )[0];
}

/** Public lookup by booking reference (AV-…) or customer phone (any common format). */
export async function findBookingByLookupQuery(rawQuery: string): Promise<BookingLean | null> {
    await connectToDatabase();

    const query = normalizeBookingLookupQuery(rawQuery);
    if (!query) return null;

    if (/^AV-/i.test(query)) {
        const byReference = await Booking.findOne({
            reference: { $regex: new RegExp(`^${escapeRegex(query)}$`, 'i') },
        }).lean<BookingLean>();
        if (byReference) return byReference;
    }

    const digits = extractPhoneDigits(query);
    if (digits.length < 7) return null;

    const variants = phoneDigitVariants(digits);
    const regexes = variants.map((variant) => buildFlexiblePhoneRegex(variant));

    const candidates = await Booking.find({
        $or: regexes.map((regex) => ({ 'customer.phone': regex })),
    }).lean<BookingLean[]>();

    const matched = candidates.filter((booking) => phoneDigitsMatch(booking.customer.phone, query));

    return pickBestBookingMatch(matched);
}
