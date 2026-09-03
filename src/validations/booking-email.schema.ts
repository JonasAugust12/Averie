import { z } from 'zod';
import { EMAIL_COLOR_THEMES, EMAIL_DESIGN_VARIANTS } from '@email/themes';

export const sendBookingEmailSchema = z.object({
    bookingId: z.string().min(1),
    to: z.email(),
    template: z.enum(['confirmation', 'reminder']),
    customMessage: z.string().trim().max(2000).optional(),
    emailDesign: z.enum(EMAIL_DESIGN_VARIANTS),
    emailTheme: z.enum(EMAIL_COLOR_THEMES),
});

export type SendBookingEmailInput = z.infer<typeof sendBookingEmailSchema>;
