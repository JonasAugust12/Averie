import { connectToDatabase } from '@libs/mongodb';
import { Booking } from '@models/booking.model';
import { sendBookingReminder } from '@server/email.server';
import { buildBookingEmailContextFromLean } from '@utils/booking-email.util';
import { isBookingInReminderWindow } from '@utils/booking-reminder.util';

export type BookingReminderBatchResult = {
    sent: number;
    skipped: number;
};

/** Process upcoming bookings in the reminder window and send reminder emails. */
export async function runBookingReminderBatch(
    now = new Date(),
): Promise<BookingReminderBatchResult> {
    await connectToDatabase();

    const candidates = await Booking.find({
        status: 'upcoming',
        'customer.email': { $exists: true, $nin: [null, ''] },
        $or: [
            { 'emailNotifications.reminderSentAt': { $exists: false } },
            { 'emailNotifications.reminderSentAt': null },
        ],
    }).lean();

    let sent = 0;
    let skipped = 0;

    for (const doc of candidates) {
        const email = doc.customer.email?.trim();
        if (!email) {
            skipped += 1;
            continue;
        }

        if (!isBookingInReminderWindow(doc.date, doc.time, now)) {
            skipped += 1;
            continue;
        }

        try {
            const emailContext = await buildBookingEmailContextFromLean(doc);
            const ok = await sendBookingReminder(email, emailContext);
            if (ok) {
                await Booking.findByIdAndUpdate(doc._id, {
                    'emailNotifications.reminderSentAt': new Date(),
                });
                sent += 1;
            } else {
                skipped += 1;
            }
        } catch (error) {
            console.error('[booking-reminder-batch]', doc.reference, error);
            skipped += 1;
        }
    }

    return { sent, skipped };
}
