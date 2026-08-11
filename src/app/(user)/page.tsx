import type { Metadata } from 'next';
import { HomePageView } from '@components/marketing/HomePageView';

export const metadata: Metadata = {
    title: 'Avere — Nails • Facials • Beauty',
    description:
        'Refined nail care, gel, enhancements, and facials in Cohasset, MA. Book your Avere appointment online.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Avere — Nails • Facials • Beauty',
        description:
            'Refined nail care, gel, enhancements, and facials in Cohasset, MA. Book your Avere appointment online.',
        url: '/',
    },
};

export default function HomePage() {
    return <HomePageView />;
}
