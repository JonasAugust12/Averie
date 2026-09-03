import { Heading, Text } from '@react-email/components';
import {
    BookingSummaryBlock,
    EmailContactBlock,
    EmailLayout,
    emailStyles,
} from '@email/components';
import type { EnrichedBookingEmailContext } from '@email/types';

type BookingConfirmationEmailProps = {
    booking: EnrichedBookingEmailContext;
};

export function BookingConfirmationEmail({ booking }: BookingConfirmationEmailProps) {
    return (
        <EmailLayout preview={`Booking confirmed — ${booking.reference}`}>
            <Heading style={emailStyles.heading}>Your appointment is confirmed</Heading>
            <Text style={emailStyles.text}>
                Hi {booking.customer.firstName}, thank you for booking with Averie. We look forward
                to seeing you.
            </Text>
            <BookingSummaryBlock booking={booking} />
            <EmailContactBlock />
        </EmailLayout>
    );
}
