import { Heading, Text } from '@react-email/components';
import { BookingSummaryBlock, EmailContactBlock, EmailLayout } from '@email/components';
import { resolveEmailTheme, type ResolvedEmailTheme } from '@email/themes';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';

export type BookingNotificationContent = {
    subject: string;
    heading: string;
    badge?: string;
    introMessage: string;
    preview?: string;
    footerNote?: string;
};

type BookingNotificationEmailProps = BookingEmailRenderOptions &
    BookingNotificationContent & {
        booking: EnrichedBookingEmailContext;
    };

function NotificationBody({
    booking,
    heading,
    badge,
    introMessage,
    footerNote,
    resolved,
}: BookingNotificationContent & {
    booking: EnrichedBookingEmailContext;
    resolved: ResolvedEmailTheme;
}) {
    const emailStyles = resolved.styles;
    const { palette } = resolved;

    return (
        <>
            {badge?.trim() ? <span style={emailStyles.badge}>{badge.trim()}</span> : null}
            <Heading style={emailStyles.heading}>{heading}</Heading>
            <Text
                style={{
                    ...emailStyles.text,
                    fontSize: '15px',
                    lineHeight: '25px',
                    color: palette.primary,
                    marginBottom: '20px',
                }}
            >
                {introMessage}
            </Text>
            <BookingSummaryBlock booking={booking} resolved={resolved} />
            <EmailContactBlock resolved={resolved} />
            {footerNote?.trim() ? (
                <Text
                    style={{
                        ...emailStyles.subText,
                        marginTop: '20px',
                        marginBottom: 0,
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}
                >
                    {footerNote.trim()}
                </Text>
            ) : null}
        </>
    );
}

export function BookingNotificationEmail({
    booking,
    subject,
    heading,
    badge,
    introMessage,
    preview,
    footerNote,
    design = 'classic',
    theme = 'averie',
}: BookingNotificationEmailProps) {
    const resolved = resolveEmailTheme(design, theme);
    const previewText = preview?.trim() || subject;

    return (
        <EmailLayout preview={previewText} resolved={resolved}>
            <NotificationBody
                booking={booking}
                subject={subject}
                heading={heading}
                badge={badge}
                introMessage={introMessage}
                footerNote={footerNote}
                resolved={resolved}
            />
        </EmailLayout>
    );
}
