import type { Metadata } from 'next';
import { ConfirmationPageView } from '@components/booking/ConfirmationPageView';

export const metadata: Metadata = {
    title: 'Booking confirmation',
    description: 'Your Averie appointment request confirmation.',
    alternates: {
        canonical: '/book/confirmation',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function BookingConfirmationPage() {
    return <ConfirmationPageView />;
}
