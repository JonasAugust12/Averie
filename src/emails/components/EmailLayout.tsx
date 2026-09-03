import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import type { ReactNode } from 'react';
import { EMAIL_SALON_CONTACT } from '@email/salon-contact';

const colors = {
    background: '#FDFCFB',
    card: '#F5EFEA',
    primary: '#2B2623',
    secondary: '#D4C5B9',
    muted: '#78716C',
};

const salonAddress = `${EMAIL_SALON_CONTACT.addressLine1}, ${EMAIL_SALON_CONTACT.addressLine2}`;

type EmailLayoutProps = {
    preview: string;
    children: ReactNode;
};

export function EmailLayout({ preview, children }: EmailLayoutProps) {
    return (
        <Html lang="en">
            <Head />
            <Preview>{preview}</Preview>
            <Body style={{ backgroundColor: colors.background, margin: 0, padding: '24px 12px' }}>
                <Container
                    style={{
                        maxWidth: '560px',
                        margin: '0 auto',
                        backgroundColor: colors.card,
                        borderRadius: '16px',
                        border: `1px solid ${colors.secondary}`,
                        overflow: 'hidden',
                    }}
                >
                    <Section
                        style={{
                            backgroundColor: colors.primary,
                            padding: '24px 32px',
                        }}
                    >
                        <Heading
                            style={{
                                color: '#FFFFFF',
                                fontFamily: 'Georgia, serif',
                                fontSize: '28px',
                                fontWeight: 600,
                                margin: 0,
                                letterSpacing: '0.08em',
                            }}
                        >
                            AVERIE
                        </Heading>
                        <Text
                            style={{
                                color: colors.secondary,
                                fontFamily: 'Inter, Arial, sans-serif',
                                fontSize: '13px',
                                margin: '8px 0 0',
                            }}
                        >
                            Nail Salon &amp; Facials
                        </Text>
                    </Section>
                    <Section style={{ padding: '32px' }}>{children}</Section>
                    <Hr style={{ borderColor: colors.secondary, margin: 0 }} />
                    <Section style={{ padding: '24px 32px' }}>
                        <Text
                            style={{
                                color: colors.muted,
                                fontFamily: 'Inter, Arial, sans-serif',
                                fontSize: '12px',
                                lineHeight: '20px',
                                margin: 0,
                            }}
                        >
                            {salonAddress}
                            <br />
                            Phone:{' '}
                            <Link
                                href={`tel:${EMAIL_SALON_CONTACT.phoneTel}`}
                                style={{ color: colors.primary }}
                            >
                                {EMAIL_SALON_CONTACT.phone}
                            </Link>
                            <br />
                            <span style={{ fontSize: '11px' }}>
                                {EMAIL_SALON_CONTACT.noreplyNotice}
                            </span>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

export const emailStyles = {
    heading: {
        color: colors.primary,
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        fontWeight: 600,
        margin: '0 0 16px',
    } as const,
    text: {
        color: colors.primary,
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '15px',
        lineHeight: '24px',
        margin: '0 0 12px',
    } as const,
    label: {
        color: colors.muted,
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        margin: '0 0 4px',
    },
    value: {
        color: colors.primary,
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '15px',
        fontWeight: 600,
        margin: '0 0 16px',
    } as const,
    card: {
        backgroundColor: colors.background,
        borderRadius: '12px',
        border: `1px solid ${colors.secondary}`,
        padding: '16px',
        margin: '16px 0',
    } as const,
};
