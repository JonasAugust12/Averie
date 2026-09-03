import { Heading, Text } from '@react-email/components';
import { BookingSummaryBlock, EmailContactBlock, EmailLayout } from '@email/components';
import { resolveEmailTheme, type ResolvedEmailTheme } from '@email/themes';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';

type BookingConfirmationEmailProps = BookingEmailRenderOptions & {
    booking: EnrichedBookingEmailContext;
};

function ConfirmationBody({
    booking,
    introMessage,
    resolved,
}: {
    booking: EnrichedBookingEmailContext;
    introMessage?: string;
    resolved: ResolvedEmailTheme;
}) {
    const emailStyles = resolved.styles;
    const { palette } = resolved;
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
            <BookingSummaryBlock booking={booking} resolved={resolved} />
            <EmailContactBlock resolved={resolved} />
        </>
    );
}

export function BookingConfirmationEmail({
    booking,
    introMessage,
    design = 'classic',
    theme = 'averie',
}: BookingConfirmationEmailProps) {
    const resolved = resolveEmailTheme(design, theme);

    return (
        <EmailLayout preview={`Booking confirmed — ${booking.reference}`} resolved={resolved}>
            <ConfirmationBody booking={booking} introMessage={introMessage} resolved={resolved} />
        </EmailLayout>
    );
}
