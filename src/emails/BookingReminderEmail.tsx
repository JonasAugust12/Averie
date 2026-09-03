import { Heading, Text } from '@react-email/components';
import { BookingSummaryBlock, EmailContactBlock, EmailLayout } from '@email/components';
import { resolveEmailTheme, type ResolvedEmailTheme } from '@email/themes';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';

type BookingReminderEmailProps = BookingEmailRenderOptions & {
    booking: EnrichedBookingEmailContext;
};

function ReminderBody({
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
        `Hi ${booking.customer.firstName}, this is a friendly reminder that your appointment at Averie is scheduled for tomorrow.`;

    return (
        <>
            <span style={emailStyles.badge}>⏰ UPCOMING REMINDER</span>
            <Heading style={emailStyles.heading}>Reminder: your appointment is coming up</Heading>
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
            <Text
                style={{
                    ...emailStyles.subText,
                    marginTop: '20px',
                    marginBottom: 0,
                    textAlign: 'center',
                    fontStyle: 'italic',
                }}
            >
                We look forward to welcoming you soon.
            </Text>
        </>
    );
}

export function BookingReminderEmail({
    booking,
    introMessage,
    design = 'classic',
    theme = 'averie',
}: BookingReminderEmailProps) {
    const resolved = resolveEmailTheme(design, theme);

    return (
        <EmailLayout preview={`Appointment reminder — ${booking.reference}`} resolved={resolved}>
            <ReminderBody booking={booking} introMessage={introMessage} resolved={resolved} />
        </EmailLayout>
    );
}
