import type { Metadata } from 'next';
import './globals.css';
import { fontsVariables } from './fonts';
import { QueryProvider } from '@providers/QueryProvider';
import { I18nProvider } from '@providers/I18nProvider';
import { AppShell } from '@components/layout';

export const metadata: Metadata = {
    title: 'Averie',
    description: 'Averie — Next.js serverless app on Vercel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body className={`${fontsVariables.join(' ')} antialiased`} suppressHydrationWarning>
                <I18nProvider>
                    <QueryProvider>
                        <AppShell>{children}</AppShell>
                    </QueryProvider>
                </I18nProvider>
            </body>
        </html>
    );
}
