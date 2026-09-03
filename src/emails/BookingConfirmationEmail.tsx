import { Heading, Text } from '@react-email/components';
import { BookingSummaryBlock, EmailContactBlock, EmailLayout } from '@email/components';
import { useEmailStyles, useEmailTheme } from '@email/themes';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';

type BookingConfirmationEmailProps = BookingEmailRenderOptions & {
    booking: EnrichedBookingEmailContext;
};

function ConfirmationBody({
    booking,
    introMessage,
}: {
    booking: EnrichedBookingEmailContext;
    introMessage?: string;
}) {
    const emailStyles = useEmailStyles();
    const { palette } = useEmailTheme();
    const intro =
        introMessage?.trim() ||
        `Hi ${booking.customer.firstName}, thank you for booking with Averie. We look forward to seeing you.`;

    return (
        <>
            <span style={emailStyles.badge}>✓ APPOINTMENT CONFIRMED</span>
            <Heading style={emailStyles.heading}>Your appointment is confirmed</Heading>
            <Text
                style={{
                    ...emailStyles.text,
                    fontSize: '15px',
                    lineHeight: '25px',
                    color: palette.primary,
                    marginBottom: '20px',
                }}
            >
                {intro}
            </Text>
            <BookingSummaryBlock booking={booking} />
            <EmailContactBlock />
        </>
    );
}

export function BookingConfirmationEmail({
    booking,
    introMessage,
    design = 'classic',
    theme = 'averie',
}: BookingConfirmationEmailProps) {
    return (
        <EmailLayout
            preview={`Booking confirmed — ${booking.reference}`}
            design={design}
            theme={theme}
        >
            <ConfirmationBody booking={booking} introMessage={introMessage} />
        </EmailLayout>
    );
}
