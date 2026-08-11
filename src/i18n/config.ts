export const DEFAULT_LOCALE = 'vi';
export const LOCALES = ['vi', 'en'] as const;

export const APP_NAMESPACES = ['common', 'errors', 'success', 'pages'] as const;

export type AppLocale = (typeof LOCALES)[number];
export type AppNamespace = (typeof APP_NAMESPACES)[number];
