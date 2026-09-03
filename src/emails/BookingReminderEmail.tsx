import { getBookingEmailPreset } from '@utils/booking-email-preset.util';
import { BookingNotificationEmail } from '@email/BookingNotificationEmail';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';

type BookingReminderEmailProps = BookingEmailRenderOptions & {
    booking: EnrichedBookingEmailContext;
};

export function BookingReminderEmail({
    booking,
    introMessage,
    design = 'classic',
    theme = 'averie',
}: BookingReminderEmailProps) {
    const preset = getBookingEmailPreset('reminder', {
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
            footerNote={preset.footerNote}
            design={design}
            theme={theme}
        />
    );
}
