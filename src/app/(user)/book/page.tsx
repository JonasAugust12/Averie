import type { Metadata } from 'next';
import { BookPageView } from '@components/booking';

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
    },
};

export default function BookPage() {
    return <BookPageView />;
}
