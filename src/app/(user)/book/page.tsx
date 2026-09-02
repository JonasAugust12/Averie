import type { Metadata } from 'next';
import { BookPageView } from '@components/booking';
import { SEO } from '@libs/site-seo';

export const metadata: Metadata = {
    title: 'Book an appointment',
    description:
        'Book your Averie salon appointment — choose a service, stylist, date, and time in a few steps.',
    alternates: {
        canonical: '/book',
    },
    openGraph: {
        title: 'Book an appointment | Averie',
        description:
            'Book your Averie salon appointment — choose a service, stylist, date, and time in a few steps.',
        url: '/book',
        images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Book an appointment | Averie',
        description:
            'Book your Averie salon appointment — choose a service, stylist, date, and time in a few steps.',
        images: [SEO.ogImage],
    },
};

export default function BookPage() {
    return <BookPageView />;
}
