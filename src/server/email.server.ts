import { createElement } from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { BookingConfirmationEmail } from '@email/BookingConfirmationEmail';
import { BookingReminderEmail } from '@email/BookingReminderEmail';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';

const DEFAULT_FROM = 'Averie <noreply@averienails.com>';

function getFromAddress() {
    return process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;
}

function getResendClient() {
    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) {
        console.warn('[email] RESEND_API_KEY missing — skipping send');
        return null;
    }
    return new Resend(key);
}

async function sendRendered(params: {
    to: string;
    subject: string;
    react: React.ReactElement;
}): Promise<boolean> {
    const resend = getResendClient();
    if (!resend) return false;

    const html = await render(params.react);
    const { error } = await resend.emails.send({
        from: getFromAddress(),
        to: params.to,
        subject: params.subject,
        html,
    });

    if (error) {
        console.error('[email] Resend error:', error);
        return false;
    }

    return true;
}

export async function sendBookingConfirmation(
    to: string,
    booking: EnrichedBookingEmailContext,
    options: BookingEmailRenderOptions = {},
): Promise<boolean> {
    return sendRendered({
        to,
        subject: `Averie — Booking confirmed (${booking.reference})`,
        react: createElement(BookingConfirmationEmail, {
            booking,
            introMessage: options.introMessage,
            design: options.design ?? 'classic',
            theme: options.theme ?? 'averie',
        }),
    });
}

export async function sendBookingReminder(
    to: string,
    booking: EnrichedBookingEmailContext,
    options: BookingEmailRenderOptions = {},
): Promise<boolean> {
    return sendRendered({
        to,
        subject: `Averie — Appointment reminder (${booking.reference})`,
        react: createElement(BookingReminderEmail, {
            booking,
            introMessage: options.introMessage,
            design: options.design ?? 'classic',
            theme: options.theme ?? 'averie',
        }),
    });
}

export async function sendBookingEmailToRecipient(params: {
    to: string;
    template: 'confirmation' | 'reminder';
    booking: EnrichedBookingEmailContext;
    customMessage?: string;
    emailDesign?: BookingEmailRenderOptions['design'];
    emailTheme?: BookingEmailRenderOptions['theme'];
}): Promise<boolean> {
    const renderOptions: BookingEmailRenderOptions = {
        introMessage: params.customMessage?.trim() || undefined,
        design: params.emailDesign ?? 'classic',
        theme: params.emailTheme ?? 'averie',
    };
    if (params.template === 'reminder') {
        return sendBookingReminder(params.to, params.booking, renderOptions);
    }
    return sendBookingConfirmation(params.to, params.booking, renderOptions);
}
