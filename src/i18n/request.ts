import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, type AppLocale } from '@i18n/config';
import { messages } from '@i18n/messages';

function resolveLocale(locale: string | undefined): AppLocale {
    if (locale && (LOCALES as readonly string[]).includes(locale)) {
        return locale as AppLocale;
    }
    return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
    const store = await cookies();
    const locale = resolveLocale(store.get(LOCALE_COOKIE)?.value);

    return {
        locale,
        messages: messages[locale],
    };
});
