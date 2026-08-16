import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';

/** UI booking wizard — lastName optional for mock flow */
export const bookingCustomerSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().optional().or(z.literal('')),
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

/** Server create booking — lastName required per system design */
export const bookingCustomerCreateSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    phone: z.string().trim().min(1, 'Phone is required'),
    email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
    note: z.string().trim().optional(),
});

export const createBookingSchema = z
    .object({
        serviceIds: z.array(objectIdSchema).min(1, 'At least one service is required'),
        staffPreference: z.enum(['any', 'specific']),
        staffId: objectIdSchema.optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
        time: z.string().trim().min(1, 'Time is required'),
        customer: bookingCustomerCreateSchema,
    })
    .superRefine((data, ctx) => {
        if (data.staffPreference === 'specific' && !data.staffId) {
            ctx.addIssue({
                code: 'custom',
                message: 'staffId is required when staffPreference is specific',
                path: ['staffId'],
            });
        }
    });

export const bookingIdSchema = z.object({
    id: objectIdSchema,
});

export const bookingReferenceQuerySchema = z.object({
    reference: z.string().trim().min(1, 'Reference is required'),
});

export const bookingSlotsQuerySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    serviceIds: z
        .string()
        .min(1)
        .transform((s) => s.split(',').map((id) => id.trim()))
        .pipe(z.array(objectIdSchema).min(1)),
});

export const bookingsListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['upcoming', 'cancelled']).optional(),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    search: z.string().trim().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingsListQuery = z.infer<typeof bookingsListQuerySchema>;
