import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { ReactNode } from 'react';

interface I18nProviderProps {
    children: ReactNode;
}

export async function I18nProvider({ children }: I18nProviderProps) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
