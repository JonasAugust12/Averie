'use server';

import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import {
    computeBookingTotals,
    generateBookingReference,
    getDuplicateKeyPattern,
    hasSlotConflict,
    isDuplicateKeyError,
    validateStaffForBooking,
} from '@utils/booking.util';
import { validateBookingSchedule } from '@utils/booking-schedule.util';
import { requireAdmin } from '@guard/auth-guard';
import { auth } from '@libs/auth';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializeBooking } from '@mappers';
import { getAvailableSlotsForDateServer, isPublicBookingEnabled } from '@server/schedule.server';
import { sendBookingConfirmation } from '@server/email.server';
import { Booking } from '@models/booking.model';
import type { ApiResponse } from '@typings/api.type';
import type { BookingDto } from '@typings/booking.type';
import {
    bookingIdSchema,
    createBookingSchema,
    type CreateBookingInput,
} from '@validations/booking.schema';
import { buildBookingEmailContext } from '@utils/booking-email.util';

export async function createBookingAction(
    input: CreateBookingInput,
): Promise<ApiResponse<BookingDto>> {
    const parsed = parseActionInput(createBookingSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<BookingDto>(parsed.message, parsed.status);
    }

    const data = parsed.data;

    try {
        const session = await auth();
        const isAdmin = session?.user?.role === 'admin';

        if (!(await isPublicBookingEnabled()) && !isAdmin) {
            return apiErrorResult<BookingDto>('Online booking is temporarily unavailable', 403);
        }

        if (data.staffPreference === 'specific' && data.staffId) {
            await validateStaffForBooking(data.staffId);
        }

        const scheduleError = validateBookingSchedule({ date: data.date, time: data.time });
        if (scheduleError) {
            return apiErrorResult<BookingDto>(scheduleError, 400);
        }

        const slots = await getAvailableSlotsForDateServer(data.date, {
            staffPreference: data.staffPreference,
            staffId: data.staffId,
        });
        const slot = slots.find((s) => s.time === data.time);
        if (!slot?.available) {
            return apiErrorResult<BookingDto>('Selected time slot is not available', 409);
        }

        const { totalEstimatedMinutes, totalPrice } = await computeBookingTotals(data.serviceIds);

        if (
            await hasSlotConflict(
                data.date,
                data.time,
                data.staffPreference,
                data.staffId,
                totalEstimatedMinutes,
            )
        ) {
            return apiErrorResult<BookingDto>('Selected time slot is already booked', 409);
        }

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

        const dto = serializeBooking(created.toObject());

        if (data.customer.email) {
            try {
                const emailContext = await buildBookingEmailContext(created.toObject());
                const sent = await sendBookingConfirmation(data.customer.email, emailContext);
                if (sent) {
                    const sentAt = new Date();
                    await Booking.findByIdAndUpdate(created._id, {
                        'emailNotifications.confirmationSentAt': sentAt,
                    });
                    dto.emailNotifications = {
                        confirmationSentAt: sentAt.toISOString(),
                    };
                }
            } catch (emailError) {
                console.error('[createBookingAction] confirmation email failed', emailError);
            }
        }

        return apiSuccessResult(dto, 'Booking created', 201);
    } catch (error) {
        console.error('[createBookingAction catch]', error);
        if (isDuplicateKeyError(error)) {
            const pattern = getDuplicateKeyPattern(error);
            if (pattern && 'reference' in pattern) {
                console.warn('[createBookingAction] Reference collision, please retry:', pattern);
                return apiErrorResult<BookingDto>(
                    'Booking reference conflict, please try again',
                    409,
                );
            }
            return apiErrorResult<BookingDto>('Selected time slot is already booked', 409);
        }
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

        const conflict = await hasSlotConflict(
            booking.date,
            booking.time,
            booking.staffPreference,
            booking.staffId ? String(booking.staffId) : undefined,
        );
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
