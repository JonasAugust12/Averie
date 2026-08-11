import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { fontsVariables } from './fonts';
import { QueryProvider } from '@providers/QueryProvider';
import { I18nProvider } from '@providers/I18nProvider';
import { AuthProvider } from '@providers/AuthProvider';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Avere — Nails • Facials • Beauty',
        template: '%s | Avere',
    },
    description:
        'Avere luxury nail salon in Cohasset, MA. Book manicures, gel, enhancements, waxing, and facials online.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body className={`${fontsVariables.join(' ')} antialiased`} suppressHydrationWarning>
                <AuthProvider>
                    <I18nProvider>
                        <QueryProvider>{children}</QueryProvider>
                    </I18nProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
