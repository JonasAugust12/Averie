import { getBookingEmailPreset } from '@utils/booking-email-preset.util';
import { BookingNotificationEmail } from '@email/BookingNotificationEmail';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';

type BookingConfirmationEmailProps = BookingEmailRenderOptions & {
    booking: EnrichedBookingEmailContext;
};

export function BookingConfirmationEmail({
    booking,
    introMessage,
    design = 'classic',
    theme = 'averie',
}: BookingConfirmationEmailProps) {
    const preset = getBookingEmailPreset('confirmation', {
        firstName: booking.customer.firstName,
        reference: booking.reference,
    });

    return (
        <BookingNotificationEmail
            booking={booking}
            subject={preset.subject}
            heading={preset.heading}
            badge={preset.badge}
            introMessage={introMessage?.trim() || preset.introMessage}
            preview={preset.preview}
            design={design}
            theme={theme}
        />
    );
}
