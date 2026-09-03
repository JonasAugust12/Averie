export const EMAIL_DESIGN_VARIANTS = ['classic', 'elegant', 'modern'] as const;
export type EmailDesignVariant = (typeof EMAIL_DESIGN_VARIANTS)[number];

export const EMAIL_COLOR_THEMES = ['averie', 'rose', 'sage', 'midnight'] as const;
export type EmailColorTheme = (typeof EMAIL_COLOR_THEMES)[number];

export type EmailPalette = {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    muted: string;
    onPrimary: string;
    accent: string;
};

export type EmailThemeTokens = {
    design: EmailDesignVariant;
    theme: EmailColorTheme;
    palette: EmailPalette;
};
