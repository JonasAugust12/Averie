import type { Metadata } from 'next';
import { ConfirmationPageView } from '@components/booking';

export const metadata: Metadata = {
    title: 'Booking confirmation',
    description: 'Your Averie appointment request confirmation.',
    robots: {
        index: false,
        follow: false,
    },
};

type Props = { params: Promise<{ id: string }> };

export default async function BookingConfirmationByIdPage({ params }: Props) {
    const { id } = await params;
    return <ConfirmationPageView bookingId={id} />;
}
