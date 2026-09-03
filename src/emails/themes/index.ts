export {
    EMAIL_COLOR_THEMES,
    EMAIL_DESIGN_VARIANTS,
    type EmailColorTheme,
    type EmailDesignVariant,
    type EmailPalette,
} from './types';
export { EMAIL_PALETTES, getEmailPalette } from './palettes';
export {
    EmailThemeProvider,
    useEmailPalette,
    useEmailStyles,
    useEmailTheme,
} from './EmailThemeContext';
