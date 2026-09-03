export const BOOKING_EMAIL_PURPOSES = [
    'confirmation',
    'reminder',
    'cancellation',
    'reschedule',
    'staff_change',
    'custom',
] as const;

export type BookingEmailPurpose = (typeof BOOKING_EMAIL_PURPOSES)[number];

/** @deprecated Use BookingEmailPurpose */
export type BookingEmailTemplate = 'confirmation' | 'reminder';

export type BookingEmailPreset = {
    subject: string;
    heading: string;
    badge: string;
    introMessage: string;
    preview: string;
    footerNote?: string;
};

function customerName(firstName: string) {
    return firstName.trim() || 'there';
}

export function getBookingEmailPreset(
    purpose: BookingEmailPurpose,
    params: { firstName: string; reference: string },
): BookingEmailPreset {
    const name = customerName(params.firstName);
    const ref = params.reference;

    switch (purpose) {
        case 'reminder':
            return {
                subject: `Averie — Appointment reminder (${ref})`,
                heading: 'Reminder: your appointment is coming up',
                badge: '⏰ UPCOMING REMINDER',
                introMessage: `Hi ${name}, this is a friendly reminder that your appointment at Averie is scheduled for tomorrow.`,
                preview: `Appointment reminder — ${ref}`,
                footerNote: 'We look forward to welcoming you soon.',
            };
        case 'cancellation':
            return {
                subject: `Averie — Appointment cancelled (${ref})`,
                heading: 'Your appointment has been cancelled',
                badge: '✕ APPOINTMENT CANCELLED',
                introMessage: `Hi ${name}, we're writing to let you know that your appointment at Averie has been cancelled. If this was unexpected or you'd like to rebook, please contact us.`,
                preview: `Appointment cancelled — ${ref}`,
            };
        case 'reschedule':
            return {
                subject: `Averie — Appointment rescheduled (${ref})`,
                heading: 'Your appointment has been rescheduled',
                badge: '↻ APPOINTMENT UPDATED',
                introMessage: `Hi ${name}, your appointment details have been updated. Please review the information below and contact us if anything looks incorrect.`,
                preview: `Appointment rescheduled — ${ref}`,
            };
        case 'staff_change':
            return {
                subject: `Averie — Appointment update (${ref})`,
                heading: 'Your appointment specialist has changed',
                badge: '👤 SPECIALIST UPDATE',
                introMessage: `Hi ${name}, your appointment has been assigned to a different specialist. Your date and time remain the same unless noted below.`,
                preview: `Appointment update — ${ref}`,
            };
        case 'custom':
            return {
                subject: `Averie — Message regarding your appointment (${ref})`,
                heading: 'A message from Averie',
                badge: 'MESSAGE FROM AVERIE',
                introMessage: `Hi ${name},`,
                preview: `Message from Averie — ${ref}`,
            };
        case 'confirmation':
        default:
            return {
                subject: `Averie — Booking confirmed (${ref})`,
                heading: 'Your appointment is confirmed',
                badge: '✓ APPOINTMENT CONFIRMED',
                introMessage: `Hi ${name}, thank you for booking with Averie. We look forward to seeing you.`,
                preview: `Booking confirmed — ${ref}`,
            };
    }
}

/** @deprecated Use getBookingEmailPreset */
export function getDefaultBookingEmailIntro(
    template: BookingEmailTemplate,
    firstName: string,
): string {
    return getBookingEmailPreset(template, { firstName, reference: '' }).introMessage;
}

/** @deprecated Use getBookingEmailPreset */
export function getBookingEmailSubject(template: BookingEmailTemplate, reference: string): string {
    return getBookingEmailPreset(template, { firstName: '', reference }).subject.replace(
        ' ()',
        reference ? ` (${reference})` : '',
    );
}
