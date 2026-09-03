import { createContext, useContext, type ReactNode } from 'react';
import { buildEmailStyles, type EmailStyleSet } from './styles';
import { getEmailPalette } from './palettes';
import type { EmailColorTheme, EmailDesignVariant, EmailPalette, EmailThemeTokens } from './types';

const EmailThemeContext = createContext<(EmailThemeTokens & { styles: EmailStyleSet }) | null>(
    null,
);

export function EmailThemeProvider({
    design,
    theme,
    children,
}: {
    design: EmailDesignVariant;
    theme: EmailColorTheme;
    children: ReactNode;
}) {
    const palette = getEmailPalette(theme);
    const styles = buildEmailStyles(palette);
    const value = { design, theme, palette, styles };

    return <EmailThemeContext.Provider value={value}>{children}</EmailThemeContext.Provider>;
}

export function useEmailTheme() {
    const ctx = useContext(EmailThemeContext);
    if (!ctx) {
        const palette = getEmailPalette('averie');
        return {
            design: 'classic' as EmailDesignVariant,
            theme: 'averie' as EmailColorTheme,
            palette,
            styles: buildEmailStyles(palette),
        };
    }
    return ctx;
}

export function useEmailPalette(): EmailPalette {
    return useEmailTheme().palette;
}

export function useEmailStyles(): EmailStyleSet {
    return useEmailTheme().styles;
}
