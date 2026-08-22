import type { Metadata } from 'next';
import { LandingPageView } from '@components/landing';

export const metadata: Metadata = {
    title: 'Averie | Nails • Facials • Beauty',
    description:
        'Refined nail care, gel, enhancements, and facials in Cohasset, MA. Book your Averie appointment online.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Averie | Nails • Facials • Beauty',
        description:
            'Refined nail care, gel, enhancements, and facials in Cohasset, MA. Book your Averie appointment online.',
        url: '/',
    },
};

export default function HomePage() {
    return <LandingPageView />;
}
