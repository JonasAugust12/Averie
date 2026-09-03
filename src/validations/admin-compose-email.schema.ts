import { z } from 'zod';
import { EMAIL_COLOR_THEMES, EMAIL_DESIGN_VARIANTS } from '@email/themes';

export const sendAdminComposeEmailSchema = z.object({
    to: z.email(),
    subject: z.string().trim().min(1).max(200),
    heading: z.string().trim().max(200).optional(),
    body: z.string().trim().min(1).max(5000),
    emailDesign: z.enum(EMAIL_DESIGN_VARIANTS),
    emailTheme: z.enum(EMAIL_COLOR_THEMES),
});

export type SendAdminComposeEmailInput = z.infer<typeof sendAdminComposeEmailSchema>;
