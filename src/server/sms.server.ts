import Twilio from 'twilio';
import type { EnrichedBookingEmailContext } from '@email/types';

function isSmsEnabled(): boolean {
    const flag = process.env.SMS_ENABLED?.trim().toLowerCase();
    if (flag === 'false' || flag === '0') return false;
    return true;
}

function getTwilioConfig(): { client: Twilio.Twilio; from: string } | null {
    if (!isSmsEnabled()) {
        console.warn('[sms] SMS_ENABLED=false — skipping send');
        return null;
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    const from = process.env.TWILIO_SMS_FROM?.trim();

    if (!accountSid || !authToken || !from) {
        console.warn('[sms] Twilio env missing — skipping send');
        return null;
    }

    return {
        client: Twilio(accountSid, authToken),
        from,
    };
}

/** Twilio trial predefined template slugs (body must be exact slug, not custom text). */
export const TWILIO_PREDEFINED_SMS_TEMPLATES = [
    'sms_2fa',
    'sms_appointment_reminders',
    'sms_order_confirmation',
    'sms_delivery_updates',
    'sms_customer_support',
    'sms_marketing_promotions',
    'sms_event_notifications',
    'sms_account_alerts',
    'sms_feedback_surveys',
    'sms_internal_alerts',
] as const;

export type TwilioPredefinedSmsTemplate = (typeof TWILIO_PREDEFINED_SMS_TEMPLATES)[number];

export function buildBookingConfirmationSmsBody(booking: EnrichedBookingEmailContext): string {
    const serviceLine =
        booking.services.length > 0
            ? booking.services.map((service) => service.name).join(', ')
            : 'Dich vu da chon';

    return [
        `Xin chao ${booking.customer.firstName}!`,
        `Dat lich Averie thanh cong.`,
        `Ma: ${booking.reference}`,
        `Ngay ${booking.date} luc ${booking.time}.`,
        `${serviceLine}.`,
        `LH: averienails.com`,
    ].join(' ');
}

function resolveSmsBody(booking: EnrichedBookingEmailContext): string {
    const template = process.env.TWILIO_SMS_TEMPLATE?.trim();
    if (template) {
        return template;
    }
    return buildBookingConfirmationSmsBody(booking);
}

export async function sendBookingConfirmationSms(
    toE164: string,
    booking: EnrichedBookingEmailContext,
): Promise<boolean> {
    const config = getTwilioConfig();
    if (!config) return false;

    try {
        await config.client.messages.create({
            from: config.from,
            to: toE164,
            body: resolveSmsBody(booking),
        });
        return true;
    } catch (error) {
        console.error('[sms] Twilio error:', error);
        return false;
    }
}
