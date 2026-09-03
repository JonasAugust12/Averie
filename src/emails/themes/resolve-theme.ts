import { buildEmailStyles } from './styles';
import { getEmailPalette } from './palettes';
import type { EmailColorTheme, EmailDesignVariant } from './types';

export function resolveEmailTheme(
    design: EmailDesignVariant = 'classic',
    theme: EmailColorTheme = 'averie',
) {
    const palette = getEmailPalette(theme);
    const styles = buildEmailStyles(palette);

    return { design, theme, palette, styles };
}

export type ResolvedEmailTheme = ReturnType<typeof resolveEmailTheme>;
