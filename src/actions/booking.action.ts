'use server';

import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import {
    computeBookingTotals,
    generateBookingReference,
    hasSlotConflict,
    isDuplicateKeyError,
    validateStaffForBooking,
} from '@utils/booking.util';
import { requireAdmin } from '@libs/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializeBooking } from '@mappers';
import { getAvailableSlotsForDateServer } from '@libs/schedule.server';
import { Booking } from '@models/booking.model';
import type { ApiResponse } from '@typings/api.type';
import type { BookingDto } from '@typings/salon/booking.type';
import {
    bookingIdSchema,
    createBookingSchema,
    type CreateBookingInput,
} from '@validations/booking.schema';

export async function createBookingAction(
    input: CreateBookingInput,
): Promise<ApiResponse<BookingDto>> {
    const parsed = parseActionInput(createBookingSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<BookingDto>(parsed.message, parsed.status);
    }

    const data = parsed.data;

    try {
        if (data.staffPreference === 'specific' && data.staffId) {
            await validateStaffForBooking(data.staffId);
        }

        const slots = await getAvailableSlotsForDateServer(data.date);
        const slot = slots.find((s) => s.time === data.time);
        if (!slot?.available) {
            return apiErrorResult<BookingDto>('Selected time slot is not available', 409);
        }

        if (await hasSlotConflict(data.date, data.time)) {
            return apiErrorResult<BookingDto>('Selected time slot is already booked', 409);
        }

        const { totalEstimatedMinutes, totalPrice } = await computeBookingTotals(data.serviceIds);
        const reference = await generateBookingReference(data.date);

        await connectToDatabase();
        const created = await Booking.create({
            reference,
            serviceIds: data.serviceIds,
            staffPreference: data.staffPreference,
            staffId: data.staffPreference === 'specific' ? data.staffId : undefined,
            date: data.date,
            time: data.time,
            totalEstimatedMinutes,
            totalPrice,
            customer: {
                firstName: data.customer.firstName,
                lastName: data.customer.lastName,
                phone: data.customer.phone,
                email: data.customer.email || undefined,
                note: data.customer.note,
            },
            status: 'upcoming',
        });

        return apiSuccessResult(serializeBooking(created.toObject()), 'Booking created', 201);
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            return apiErrorResult<BookingDto>('Selected time slot is already booked', 409);
        }
        console.error('[createBookingAction]', error);
        const message = error instanceof Error ? error.message : 'Failed to create booking';
        if (message.includes('services')) {
            return apiErrorResult<BookingDto>(message, 400);
        }
        if (message.includes('Staff')) {
            return apiErrorResult<BookingDto>(message, 400);
        }
        return apiErrorResult<BookingDto>('Failed to create booking', 500);
    }
}

export async function cancelBookingAction(id: string): Promise<ApiResponse<BookingDto>> {
    const authError = await requireAdmin<BookingDto>();
    if (authError) return authError;

    const idParsed = parseActionInput(bookingIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult<BookingDto>(idParsed.message, idParsed.status);
    }

    if (!mongoose.Types.ObjectId.isValid(idParsed.data.id)) {
        return apiErrorResult<BookingDto>('Invalid booking id', 400);
    }

    try {
        await connectToDatabase();
        const updated = await Booking.findByIdAndUpdate(
            idParsed.data.id,
            { status: 'cancelled', cancelledAt: new Date() },
            { new: true },
        ).lean();

        if (!updated) {
            return apiErrorResult<BookingDto>('Booking not found', 404);
        }

        return apiSuccessResult(serializeBooking(updated), 'Booking cancelled');
    } catch (error) {
        console.error('[cancelBookingAction]', error);
        return apiErrorResult<BookingDto>('Failed to cancel booking', 500);
    }
}

export async function restoreBookingAction(id: string): Promise<ApiResponse<BookingDto>> {
    const authError = await requireAdmin<BookingDto>();
    if (authError) return authError;

    const idParsed = parseActionInput(bookingIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult<BookingDto>(idParsed.message, idParsed.status);
    }

    if (!mongoose.Types.ObjectId.isValid(idParsed.data.id)) {
        return apiErrorResult<BookingDto>('Invalid booking id', 400);
    }

    try {
        await connectToDatabase();
        const booking = await Booking.findById(idParsed.data.id).lean();
        if (!booking) {
            return apiErrorResult<BookingDto>('Booking not found', 404);
        }

        const conflict = await hasSlotConflict(booking.date, booking.time);
        if (conflict) {
            return apiErrorResult<BookingDto>('Time slot is no longer available', 409);
        }

        const updated = await Booking.findByIdAndUpdate(
            idParsed.data.id,
            { status: 'upcoming', $unset: { cancelledAt: 1 } },
            { new: true },
        ).lean();

        if (!updated) {
            return apiErrorResult<BookingDto>('Booking not found', 404);
        }

        return apiSuccessResult(serializeBooking(updated), 'Booking restored');
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            return apiErrorResult<BookingDto>('Time slot is no longer available', 409);
        }
        console.error('[restoreBookingAction]', error);
        return apiErrorResult<BookingDto>('Failed to restore booking', 500);
    }
}
