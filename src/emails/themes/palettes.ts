import type { EmailColorTheme, EmailPalette } from './types';

export const EMAIL_PALETTES: Record<EmailColorTheme, EmailPalette> = {
    averie: {
        primary: '#2B2623',
        secondary: '#E8DFD8',
        background: '#FDFCFB',
        card: '#F7F2EE',
        muted: '#78716C',
        onPrimary: '#FFFFFF',
        accent: '#C0957F',
    },
    rose: {
        primary: '#5C3344',
        secondary: '#EED5D8',
        background: '#FFFBFB',
        card: '#FBF0F2',
        muted: '#9B7280',
        onPrimary: '#FFFFFF',
        accent: '#D4848E',
    },
    sage: {
        primary: '#2D4038',
        secondary: '#CEE0D6',
        background: '#FAFCFB',
        card: '#EEF5F1',
        muted: '#6B7F74',
        onPrimary: '#FFFFFF',
        accent: '#5E8C73',
    },
    midnight: {
        primary: '#1A1A2E',
        secondary: '#E2D5B5',
        background: '#F9F8F6',
        card: '#F3EFE6',
        muted: '#6B6B7B',
        onPrimary: '#F8F7F4',
        accent: '#C9A962',
    },
};

export function getEmailPalette(theme: EmailColorTheme): EmailPalette {
    return EMAIL_PALETTES[theme];
}
