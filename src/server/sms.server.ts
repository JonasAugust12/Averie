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
            body: buildBookingConfirmationSmsBody(booking),
        });
        return true;
    } catch (error) {
        console.error('[sms] Twilio error:', error);
        return false;
    }
}
