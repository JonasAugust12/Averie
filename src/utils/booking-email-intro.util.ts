export type BookingEmailTemplate = 'confirmation' | 'reminder';

export function getDefaultBookingEmailIntro(
    template: BookingEmailTemplate,
    firstName: string,
): string {
    const name = firstName.trim() || 'there';
    if (template === 'reminder') {
        return `Hi ${name}, this is a friendly reminder that your appointment at Averie is scheduled for tomorrow.`;
    }
    return `Hi ${name}, thank you for booking with Averie. We look forward to seeing you.`;
}

export function getBookingEmailSubject(template: BookingEmailTemplate, reference: string): string {
    if (template === 'reminder') {
        return `Averie - Appointment reminder (${reference})`;
    }
    return `Averie - Booking confirmed (${reference})`;
}
