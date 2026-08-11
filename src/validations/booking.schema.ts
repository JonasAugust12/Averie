import { z } from 'zod';

export const bookingCustomerSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    phone: z.string().trim().min(7, 'Phone is required'),
    email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
    note: z.string().trim().max(500).optional(),
});

export type BookingCustomerInput = z.infer<typeof bookingCustomerSchema>;

export const salonLoginSchema = z.object({
    email: z.string().trim().email('Valid email is required'),
    password: z.string().min(1, 'Password is required'),
});

export type SalonLoginInput = z.infer<typeof salonLoginSchema>;
