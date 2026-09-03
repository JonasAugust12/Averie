import { Heading, Text } from '@react-email/components';
import {
    BookingSummaryBlock,
    EmailContactBlock,
    EmailLayout,
    emailStyles,
} from '@email/components';
import type { EnrichedBookingEmailContext } from '@email/types';

type BookingReminderEmailProps = {
    booking: EnrichedBookingEmailContext;
};

export function BookingReminderEmail({ booking }: BookingReminderEmailProps) {
    return (
        <EmailLayout preview={`Appointment reminder — ${booking.reference}`}>
            <Heading style={emailStyles.heading}>Reminder: your appointment is coming up</Heading>
            <Text style={emailStyles.text}>
                Hi {booking.customer.firstName}, this is a friendly reminder that your appointment
                at Averie is scheduled in about one hour.
            </Text>
            <BookingSummaryBlock booking={booking} />
            <EmailContactBlock />
            <Text style={emailStyles.text}>We look forward to welcoming you soon.</Text>
        </EmailLayout>
    );
}
