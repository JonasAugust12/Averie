export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'vi'] as const;

/** Cookie used when there is no `[locale]` path segment (flat routes). */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const APP_NAMESPACES = [
    'common',
    'errors',
    'success',
    'pages',
    'salon',
    'booking',
    'account',
    'admin',
] as const;

export type AppLocale = (typeof LOCALES)[number];
export type AppNamespace = (typeof APP_NAMESPACES)[number];
