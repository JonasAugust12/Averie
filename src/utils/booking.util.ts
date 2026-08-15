import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { Booking } from '@models/booking.model';
import { Service } from '@models/service.model';
import { User } from '@models/user.model';

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

export async function hasSlotConflict(date: string, time: string): Promise<boolean> {
    await connectToDatabase();
    const existing = await Booking.findOne({ date, time, status: 'upcoming' }).lean();
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
