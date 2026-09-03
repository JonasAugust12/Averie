import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@email/components';
import { resolveEmailTheme } from '@email/themes';
import type { EmailColorTheme, EmailDesignVariant } from '@email/themes';

type AdminComposeEmailProps = {
    subject: string;
    heading: string;
    body: string;
    design?: EmailDesignVariant;
    theme?: EmailColorTheme;
};

export function AdminComposeEmail({
    subject,
    heading,
    body,
    design = 'classic',
    theme = 'averie',
}: AdminComposeEmailProps) {
    const resolved = resolveEmailTheme(design, theme);
    const paragraphs = body
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

    return (
        <EmailLayout preview={subject} resolved={resolved}>
            <Heading style={resolved.styles.heading}>{heading}</Heading>
            {paragraphs.map((paragraph, index) => (
                <Text
                    key={`${index}-${paragraph.slice(0, 12)}`}
                    style={{
                        ...resolved.styles.text,
                        fontSize: '15px',
                        lineHeight: '25px',
                        marginBottom: index === paragraphs.length - 1 ? 0 : '12px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {paragraph}
                </Text>
            ))}
        </EmailLayout>
    );
}
