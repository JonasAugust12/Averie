import type { Metadata } from 'next';
import { ClientLoginView } from '@components/account/ClientLoginView';

export const metadata: Metadata = {
    title: 'Client sign in',
    description: 'Sign in to your Averie client account.',
    alternates: {
        canonical: '/login',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function ClientLoginPage() {
    return <ClientLoginView />;
}
