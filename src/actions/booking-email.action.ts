'use server';

import mongoose from 'mongoose';
import { requireAdmin } from '@guard/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { connectToDatabase } from '@libs/mongodb';
import { Booking } from '@models/booking.model';
import { sendBookingEmailToRecipient } from '@server/email.server';
import type { ApiResponse } from '@typings/api.type';
import { buildBookingEmailContextFromLean } from '@utils/booking-email.util';
import {
    sendBookingEmailSchema,
    type SendBookingEmailInput,
} from '@validations/booking-email.schema';

export async function sendBookingEmailAction(
    input: SendBookingEmailInput,
): Promise<ApiResponse<null>> {
    const authError = await requireAdmin<null>();
    if (authError) return authError;

    const parsed = parseActionInput(sendBookingEmailSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<null>(parsed.message, parsed.status);
    }

    if (!mongoose.Types.ObjectId.isValid(parsed.data.bookingId)) {
        return apiErrorResult<null>('Invalid booking id', 400);
    }

    try {
        await connectToDatabase();
        const booking = await Booking.findById(parsed.data.bookingId).lean();
        if (!booking) {
            return apiErrorResult<null>('Booking not found', 404);
        }

        const emailContext = await buildBookingEmailContextFromLean(booking);
        const sent = await sendBookingEmailToRecipient({
            to: parsed.data.to,
            template: parsed.data.template,
            booking: emailContext,
        });

        if (!sent) {
            return apiErrorResult<null>('Failed to send email', 502);
        }

        return apiSuccessResult(null, 'Email sent');
    } catch (error) {
        console.error('[sendBookingEmailAction]', error);
        return apiErrorResult<null>('Failed to send email', 500);
    }
}
