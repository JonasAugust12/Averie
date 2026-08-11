import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, LOCALES, type AppLocale } from '@i18n/config';
import { messages } from '@i18n/messages';

function resolveLocale(locale: string | undefined): AppLocale {
    if (locale && (LOCALES as readonly string[]).includes(locale)) {
        return locale as AppLocale;
    }
    return DEFAULT_LOCALE;
}

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = resolveLocale(requested);

    return {
        locale,
        messages: messages[locale],
    };
});
