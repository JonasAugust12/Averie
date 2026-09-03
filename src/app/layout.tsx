import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { fontsVariables } from './fonts';
import { QueryProvider } from '@providers/QueryProvider';
import { I18nProvider } from '@providers/I18nProvider';
import { AuthProvider } from '@providers/AuthProvider';
import { AppShell } from '@providers/AppShell';
import { ToastProvider } from '@providers/ToastProvider';
import { buildRootMetadata, buildRootViewport } from '@libs/site-seo';

export const metadata: Metadata = buildRootMetadata();
export const viewport = buildRootViewport();

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
