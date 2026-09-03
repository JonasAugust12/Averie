import { z } from 'zod';
import { EMAIL_COLOR_THEMES, EMAIL_DESIGN_VARIANTS } from '@email/themes';
import { BOOKING_EMAIL_PURPOSES } from '@utils/booking-email-preset.util';

export const sendBookingEmailSchema = z.object({
    bookingId: z.string().min(1),
    to: z.email(),
    purpose: z.enum(BOOKING_EMAIL_PURPOSES),
    emailSubject: z.string().trim().min(1).max(200),
    emailHeading: z.string().trim().min(1).max(200),
    emailBadge: z.string().trim().max(80).optional(),
    customMessage: z.string().trim().max(2000).optional(),
    emailDesign: z.enum(EMAIL_DESIGN_VARIANTS),
    emailTheme: z.enum(EMAIL_COLOR_THEMES),
});

export type SendBookingEmailInput = z.infer<typeof sendBookingEmailSchema>;
