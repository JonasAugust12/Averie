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
import {
    EmailThemeProvider,
    useEmailPalette,
    useEmailStyles,
    useEmailTheme,
    type EmailColorTheme,
    type EmailDesignVariant,
} from '@email/themes';

const salonAddress = `${EMAIL_SALON_CONTACT.addressLine1}, ${EMAIL_SALON_CONTACT.addressLine2}`;

type EmailLayoutProps = {
    preview: string;
    children: ReactNode;
    design?: EmailDesignVariant;
    theme?: EmailColorTheme;
};

export function EmailLayout({
    preview,
    children,
    design = 'classic',
    theme = 'averie',
}: EmailLayoutProps) {
    return (
        <EmailThemeProvider design={design} theme={theme}>
            <Html lang="en">
                <Head />
                <Preview>{preview}</Preview>
                <EmailLayoutBody preview={preview}>{children}</EmailLayoutBody>
            </Html>
        </EmailThemeProvider>
    );
}

function EmailLayoutBody({ children }: { preview: string; children: ReactNode }) {
    const { design, palette } = useEmailTheme();
    const styles = useEmailStyles();

    return (
        <Body
            style={{
                backgroundColor: palette.background,
                margin: 0,
                padding: design === 'elegant' ? '36px 16px' : '28px 16px',
            }}
        >
            <Container
                style={{
                    maxWidth: '560px',
                    margin: '0 auto',
                    backgroundColor: design === 'modern' ? '#FFFFFF' : palette.card,
                    borderRadius: design === 'modern' ? '20px' : '16px',
                    border: `1px solid ${palette.secondary}`,
                    overflow: 'hidden',
                    borderLeft: design === 'modern' ? `5px solid ${palette.primary}` : undefined,
                    boxShadow:
                        design === 'elegant'
                            ? `0 8px 30px ${palette.secondary}60`
                            : `0 4px 20px rgba(0,0,0,0.03)`,
                }}
            >
                <EmailHeader design={design} palette={palette} />
                <Section style={{ padding: design === 'elegant' ? '40px 36px 32px' : '32px 28px' }}>
                    {children}
                </Section>
                <Hr style={{ borderColor: palette.secondary, margin: 0 }} />
                <Section
                    style={{
                        padding: '24px 28px',
                        backgroundColor: palette.background,
                    }}
                >
                    <Text
                        style={{
                            ...styles.subText,
                            color: palette.muted,
                            fontSize: '12px',
                            lineHeight: '20px',
                            margin: 0,
                            textAlign: design === 'elegant' ? 'center' : 'left',
                        }}
                    >
                        <strong style={{ color: palette.primary, fontWeight: 600 }}>
                            Averie Nail Salon &amp; Facials
                        </strong>
                        <br />
                        {salonAddress}
                        <br />
                        Phone:{' '}
                        <Link
                            href={`tel:${EMAIL_SALON_CONTACT.phoneTel}`}
                            style={{ ...styles.link, fontSize: '12px' }}
                        >
                            {EMAIL_SALON_CONTACT.phone}
                        </Link>
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Inter, Arial, sans-serif',
                            color: palette.muted,
                            fontSize: '11px',
                            lineHeight: '16px',
                            marginTop: '12px',
                            marginBottom: 0,
                            textAlign: design === 'elegant' ? 'center' : 'left',
                            opacity: 0.8,
                        }}
                    >
                        {EMAIL_SALON_CONTACT.noreplyNotice}
                    </Text>
                </Section>
            </Container>
        </Body>
    );
}

function EmailHeader({
    design,
    palette,
}: {
    design: EmailDesignVariant;
    palette: ReturnType<typeof useEmailPalette>;
}) {
    if (design === 'elegant') {
        return (
            <Section
                style={{
                    padding: '36px 32px 24px',
                    textAlign: 'center',
                    backgroundColor: palette.background,
                    borderBottom: `1px solid ${palette.secondary}`,
                }}
            >
                <Heading
                    style={{
                        color: palette.primary,
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        fontSize: '30px',
                        fontWeight: 400,
                        margin: 0,
                        letterSpacing: '0.25em',
                    }}
                >
                    AVERIE
                </Heading>
                <Text
                    style={{
                        color: palette.accent,
                        fontFamily: 'Inter, Arial, sans-serif',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        margin: '12px 0 0',
                    }}
                >
                    Nail Salon &amp; Facials · Cohasset, MA
                </Text>
            </Section>
        );
    }

    if (design === 'modern') {
        return (
            <Section
                style={{
                    padding: '28px 32px 20px',
                    backgroundColor: palette.background,
                    borderBottom: `1px solid ${palette.secondary}`,
                }}
            >
                <Text
                    style={{
                        color: palette.accent,
                        fontFamily: 'Inter, Arial, sans-serif',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                    }}
                >
                    Averie
                </Text>
                <Heading
                    style={{
                        color: palette.primary,
                        fontFamily: 'Inter, Arial, sans-serif',
                        fontSize: '22px',
                        fontWeight: 700,
                        margin: 0,
                        letterSpacing: '-0.02em',
                    }}
                >
                    Nail Salon &amp; Facials
                </Heading>
            </Section>
        );
    }

    return (
        <Section
            style={{
                backgroundColor: palette.primary,
                padding: '28px 32px',
            }}
        >
            <Heading
                style={{
                    color: palette.onPrimary,
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: '26px',
                    fontWeight: 600,
                    margin: 0,
                    letterSpacing: '0.12em',
                }}
            >
                AVERIE
            </Heading>
            <Text
                style={{
                    color: palette.secondary,
                    fontFamily: 'Inter, Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    margin: '6px 0 0',
                }}
            >
                Nail Salon &amp; Facials
            </Text>
        </Section>
    );
}

/** @deprecated Use useEmailStyles() inside themed email components */
export const emailStyles = {
    heading: {
        color: '#2B2623',
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        fontWeight: 600,
        margin: '0 0 16px',
    },
    text: {
        color: '#2B2623',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '15px',
        lineHeight: '24px',
        margin: '0 0 12px',
    },
    label: {
        color: '#78716C',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        margin: '0 0 4px',
    },
    value: {
        color: '#2B2623',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '15px',
        fontWeight: 600,
        margin: '0 0 16px',
    },
    card: {
        backgroundColor: '#FDFCFB',
        borderRadius: '12px',
        border: '1px solid #D4C5B9',
        padding: '16px',
        margin: '16px 0',
    },
};
