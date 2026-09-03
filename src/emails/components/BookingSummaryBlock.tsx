import { Section, Text } from '@react-email/components';
import { emailStyles } from './EmailLayout';
import type { EnrichedBookingEmailContext } from '@email/types';

type BookingSummaryBlockProps = {
    booking: EnrichedBookingEmailContext;
};

function formatPrice(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function BookingSummaryBlock({ booking }: BookingSummaryBlockProps) {
    const serviceLines = booking.services.map((service) => service.name).join(', ');

    return (
        <Section style={emailStyles.card}>
            <Text style={emailStyles.label}>Reference</Text>
            <Text style={emailStyles.value}>{booking.reference}</Text>

            <Text style={emailStyles.label}>Date &amp; time</Text>
            <Text style={emailStyles.value}>
                {booking.date} at {booking.time}
            </Text>

            <Text style={emailStyles.label}>Services</Text>
            <Text style={emailStyles.value}>{serviceLines || '—'}</Text>

            <Text style={emailStyles.label}>Duration</Text>
            <Text style={emailStyles.value}>{booking.totalEstimatedMinutes} min</Text>

            <Text style={emailStyles.label}>Estimated total</Text>
            <Text style={{ ...emailStyles.value, marginBottom: 0 }}>
                {formatPrice(booking.totalPrice)}
            </Text>
        </Section>
    );
}
