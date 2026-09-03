import { Hr, Section, Text } from '@react-email/components';
import type { ResolvedEmailTheme } from '@email/themes';
import type { EnrichedBookingEmailContext } from '@email/types';

type BookingSummaryBlockProps = {
    booking: EnrichedBookingEmailContext;
    resolved: ResolvedEmailTheme;
};

function formatPrice(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function BookingSummaryBlock({ booking, resolved }: BookingSummaryBlockProps) {
    const emailStyles = resolved.styles;
    const { palette } = resolved;

    return (
        <Section style={emailStyles.card}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
                <tbody>
                    <tr>
                        <td align="left" style={{ verticalAlign: 'middle' }}>
                            <Text
                                style={{
                                    ...emailStyles.label,
                                    margin: 0,
                                    fontSize: '11px',
                                    letterSpacing: '0.12em',
                                    color: palette.muted,
                                }}
                            >
                                APPOINTMENT SUMMARY
                            </Text>
                        </td>
                        <td align="right" style={{ verticalAlign: 'middle' }}>
                            <span
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: palette.background,
                                    border: `1px solid ${palette.secondary}`,
                                    borderRadius: '6px',
                                    padding: '3px 8px',
                                    fontFamily: 'Inter, Arial, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    color: palette.primary,
                                }}
                            >
                                #{booking.reference}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Section style={emailStyles.highlightCard}>
                <Text style={{ ...emailStyles.label, marginBottom: '4px', color: palette.accent }}>
                    Date &amp; Time
                </Text>
                <Text
                    style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: palette.primary,
                        margin: 0,
                        lineHeight: '24px',
                    }}
                >
                    {booking.date}
                    <span
                        style={{
                            fontFamily: 'Inter, Arial, sans-serif',
                            fontSize: '15px',
                            fontWeight: 500,
                            color: palette.muted,
                            marginLeft: '8px',
                        }}
                    >
                        at {booking.time}
                    </span>
                </Text>
            </Section>

            <Text style={{ ...emailStyles.label, marginTop: '20px', marginBottom: '8px' }}>
                Services Reserved ({booking.services.length})
            </Text>

            {booking.services.length > 0 ? (
                booking.services.map((service, index) => (
                    <table
                        key={`${service.name}-${index}`}
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{
                            padding: '8px 0',
                            borderBottom:
                                index === booking.services.length - 1
                                    ? undefined
                                    : `1px dashed ${palette.secondary}`,
                        }}
                    >
                        <tbody>
                            <tr>
                                <td align="left" style={{ verticalAlign: 'middle' }}>
                                    <Text
                                        style={{
                                            fontFamily: 'Inter, Arial, sans-serif',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: palette.primary,
                                            margin: 0,
                                        }}
                                    >
                                        • {service.name}
                                    </Text>
                                </td>
                                <td align="right" style={{ verticalAlign: 'middle' }}>
                                    <Text
                                        style={{
                                            fontFamily: 'Inter, Arial, sans-serif',
                                            fontSize: '12px',
                                            color: palette.muted,
                                            margin: 0,
                                        }}
                                    >
                                        {service.estimatedMinutes} min
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ))
            ) : (
                <Text style={{ ...emailStyles.value, color: palette.muted }}>—</Text>
            )}

            <Hr style={{ borderColor: palette.secondary, margin: '16px 0' }} />

            <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td align="left" style={{ verticalAlign: 'middle' }}>
                            <Text style={{ ...emailStyles.label, margin: '0 0 2px' }}>
                                Total Duration
                            </Text>
                            <Text style={{ ...emailStyles.value, margin: 0, fontSize: '14px' }}>
                                {booking.totalEstimatedMinutes} min
                            </Text>
                        </td>
                        <td align="right" style={{ verticalAlign: 'middle' }}>
                            <Text
                                style={{
                                    ...emailStyles.label,
                                    margin: '0 0 2px',
                                    textAlign: 'right',
                                }}
                            >
                                Estimated Total
                            </Text>
                            <Text style={emailStyles.price}>{formatPrice(booking.totalPrice)}</Text>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Section>
    );
}
