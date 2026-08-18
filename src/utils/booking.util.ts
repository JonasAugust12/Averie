import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { Booking, type BookingDocument } from '@models/booking.model';
import { Service } from '@models/service.model';
import { User } from '@models/user.model';
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
): Promise<boolean> {
    await connectToDatabase();

    if (staffPreference === 'any') {
        const existing = await Booking.findOne({ date, time, status: 'upcoming' }).lean();
        return Boolean(existing);
    }

    if (!staffId || !mongoose.Types.ObjectId.isValid(staffId)) {
        return true;
    }

    const existing = await Booking.findOne({
        date,
        time,
        status: 'upcoming',
        $or: [{ staffPreference: 'any' }, { staffId: new mongoose.Types.ObjectId(staffId) }],
    }).lean();

    return Boolean(existing);
}

export async function generateBookingReference(date: string): Promise<string> {
    await connectToDatabase();
    const day = date.replace(/-/g, '');
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    const count = await Booking.countDocuments({
        createdAt: { $gte: start, $lte: end },
    });

    const seq = String(count + 1).padStart(4, '0');
    return `AV-${day}-${seq}`;
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
