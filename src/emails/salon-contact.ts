import enSalon from '@messages/en/salon.json';
import { SEO } from '@libs/site-seo';

const footer = enSalon.landing.footer;

/** Salon contact details for transactional emails (noreply sender — reply not monitored). */
export const EMAIL_SALON_CONTACT = {
    contactLabel: footer.contact,
    locationLabel: footer.location,
    phone: footer.phone,
    phoneTel: SEO.phone,
    addressLine1: footer.addressLine1,
    addressLine2: footer.addressLine2,
    noreplyNotice:
        'This message was sent from a no-reply address. Please do not reply to this email.',
    modifyGuide: enSalon.landing.searchBooking.guide,
} as const;
