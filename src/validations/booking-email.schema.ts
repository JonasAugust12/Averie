import { z } from 'zod';

export const sendBookingEmailSchema = z.object({
    bookingId: z.string().min(1),
    to: z.email(),
    template: z.enum(['confirmation', 'reminder']),
});

export type SendBookingEmailInput = z.infer<typeof sendBookingEmailSchema>;
