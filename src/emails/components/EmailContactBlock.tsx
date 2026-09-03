import { Link, Section, Text } from '@react-email/components';
import { useEmailStyles, useEmailTheme } from '@email/themes';
import { EMAIL_SALON_CONTACT } from '@email/salon-contact';

export function EmailContactBlock() {
    const emailStyles = useEmailStyles();
    const { palette } = useEmailTheme();

    return (
        <Section
            style={{
                ...emailStyles.card,
                marginTop: '16px',
                marginBottom: 0,
                backgroundColor: palette.card,
            }}
        >
            {/* Need to modify guide */}
            <Text
                style={{
                    ...emailStyles.label,
                    marginBottom: '6px',
                    color: palette.accent,
                }}
            >
                NEED TO MODIFY YOUR APPOINTMENT?
            </Text>
            <Text
                style={{
                    ...emailStyles.text,
                    fontSize: '14px',
                    lineHeight: '22px',
                    marginBottom: '16px',
                }}
            >
                {EMAIL_SALON_CONTACT.modifyGuide}
            </Text>

            {/* Location & Contact info */}
            <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td align="left" style={{ verticalAlign: 'top', paddingRight: '12px' }}>
                            <Text style={{ ...emailStyles.label, marginBottom: '4px' }}>
                                {EMAIL_SALON_CONTACT.locationLabel}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Inter, Arial, sans-serif',
                                    fontSize: '13px',
                                    lineHeight: '18px',
                                    fontWeight: 500,
                                    color: palette.primary,
                                    margin: 0,
                                }}
                            >
                                {EMAIL_SALON_CONTACT.addressLine1}
                                <br />
                                {EMAIL_SALON_CONTACT.addressLine2}
                            </Text>
                        </td>
                        <td align="right" style={{ verticalAlign: 'top' }}>
                            <Text
                                style={{
                                    ...emailStyles.label,
                                    marginBottom: '4px',
                                    textAlign: 'right',
                                }}
                            >
                                Direct Line
                            </Text>
                            <Text style={{ margin: 0, textAlign: 'right' }}>
                                <Link
                                    href={`tel:${EMAIL_SALON_CONTACT.phoneTel}`}
                                    style={{
                                        fontFamily: 'Inter, Arial, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: palette.accent || palette.primary,
                                        textDecoration: 'none',
                                    }}
                                >
                                    {EMAIL_SALON_CONTACT.phone}
                                </Link>
                            </Text>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Section>
    );
}
