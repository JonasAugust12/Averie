import { Link, Section, Text } from '@react-email/components';
import { emailStyles } from './EmailLayout';
import { EMAIL_SALON_CONTACT } from '@email/salon-contact';

export function EmailContactBlock() {
    return (
        <Section
            style={{
                ...emailStyles.card,
                marginTop: '8px',
                marginBottom: 0,
            }}
        >
            <Text style={{ ...emailStyles.label, marginBottom: '8px' }}>
                {EMAIL_SALON_CONTACT.contactLabel}
            </Text>
            <Text style={{ ...emailStyles.text, marginBottom: '8px' }}>
                {EMAIL_SALON_CONTACT.noreplyNotice}
            </Text>
            <Text style={{ ...emailStyles.text, marginBottom: '4px' }}>
                {EMAIL_SALON_CONTACT.modifyGuide}
            </Text>
            <Text style={{ ...emailStyles.label, marginTop: '16px', marginBottom: '4px' }}>
                {EMAIL_SALON_CONTACT.locationLabel}
            </Text>
            <Text style={{ ...emailStyles.value, marginBottom: '4px' }}>
                {EMAIL_SALON_CONTACT.addressLine1}
                <br />
                {EMAIL_SALON_CONTACT.addressLine2}
            </Text>
            <Text style={{ ...emailStyles.text, marginBottom: 0 }}>
                Phone:{' '}
                <Link
                    href={`tel:${EMAIL_SALON_CONTACT.phoneTel}`}
                    style={{ color: '#2B2623', fontWeight: 600 }}
                >
                    {EMAIL_SALON_CONTACT.phone}
                </Link>
            </Text>
        </Section>
    );
}
