import { createElement } from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { AdminComposeEmail } from '@email/AdminComposeEmail';
import { DEFAULT_EMAIL_FROM } from '@email/constants';
import { BookingConfirmationEmail } from '@email/BookingConfirmationEmail';
import { BookingNotificationEmail } from '@email/BookingNotificationEmail';
import { BookingReminderEmail } from '@email/BookingReminderEmail';
import type { BookingEmailRenderOptions, EnrichedBookingEmailContext } from '@email/types';
import { getBookingEmailPreset, type BookingEmailPurpose } from '@utils/booking-email-preset.util';
import type { SendAdminComposeEmailInput } from '@validations/admin-compose-email.schema';

const DEFAULT_FROM = DEFAULT_EMAIL_FROM;

function getFromAddress() {
    return process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;
}

export function getEmailFromAddress() {
    return getFromAddress();
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
    const preset = getBookingEmailPreset('confirmation', {
        firstName: booking.customer.firstName,
        reference: booking.reference,
    });

    return sendRendered({
        to,
        subject: preset.subject,
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
    const preset = getBookingEmailPreset('reminder', {
        firstName: booking.customer.firstName,
        reference: booking.reference,
    });

    return sendRendered({
        to,
        subject: preset.subject,
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
    purpose: BookingEmailPurpose;
    booking: EnrichedBookingEmailContext;
    emailSubject: string;
    emailHeading: string;
    emailBadge?: string;
    customMessage?: string;
    emailDesign?: BookingEmailRenderOptions['design'];
    emailTheme?: BookingEmailRenderOptions['theme'];
}): Promise<boolean> {
    const preset = getBookingEmailPreset(params.purpose, {
        firstName: params.booking.customer.firstName,
        reference: params.booking.reference,
    });
    const renderOptions: BookingEmailRenderOptions = {
        design: params.emailDesign ?? 'classic',
        theme: params.emailTheme ?? 'averie',
    };
    const introMessage = params.customMessage?.trim() || preset.introMessage;

    return sendRendered({
        to: params.to,
        subject: params.emailSubject.trim(),
        react: createElement(BookingNotificationEmail, {
            booking: params.booking,
            subject: params.emailSubject.trim(),
            heading: params.emailHeading.trim(),
            badge: params.emailBadge?.trim() || undefined,
            introMessage,
            preview: preset.preview,
            footerNote: params.purpose === 'reminder' ? preset.footerNote : undefined,
            ...renderOptions,
        }),
    });
}

export async function sendAdminComposeEmail(input: SendAdminComposeEmailInput): Promise<boolean> {
    return sendRendered({
        to: input.to,
        subject: input.subject.trim(),
        react: createElement(AdminComposeEmail, {
            subject: input.subject.trim(),
            heading: input.heading?.trim() || input.subject.trim(),
            body: input.body.trim(),
            design: input.emailDesign,
            theme: input.emailTheme,
        }),
    });
}
