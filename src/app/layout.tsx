import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { fontsVariables } from './fonts';
import { QueryProvider } from '@providers/QueryProvider';
import { I18nProvider } from '@providers/I18nProvider';
import { AuthProvider } from '@providers/AuthProvider';
import { AppShell } from '@providers/AppShell';
import { ToastProvider } from '@providers/ToastProvider';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Averie | Nails • Facials • Beauty',
        template: '%s | Averie',
    },
    description:
        'Averie luxury nail salon in Cohasset, MA. Book manicures, gel, enhancements, waxing, and facials online.',
    openGraph: {
        title: 'Averie | Nails • Facials • Beauty',
        description:
            'Averie luxury nail salon in Cohasset, MA. Book manicures, gel, enhancements, waxing, and facials online.',
        url: '/',
        siteName: 'Averie Salon',
        images: [
            {
                url: '/salon/logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Averie Luxury Salon',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Averie | Nails • Facials • Beauty',
        description:
            'Averie luxury nail salon in Cohasset, MA. Book manicures, gel, enhancements, waxing, and facials online.',
        images: ['/salon/logo.jpg'],
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body className={`${fontsVariables.join(' ')} antialiased`} suppressHydrationWarning>
                <AuthProvider>
                    <I18nProvider>
                        <QueryProvider>
                            <AppShell>{children}</AppShell>
                            <ToastProvider />
                        </QueryProvider>
                    </I18nProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
