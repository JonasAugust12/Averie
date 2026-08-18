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

export const bookingSlotsQuerySchema = z
    .object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
        serviceIds: z
            .string()
            .min(1)
            .transform((s) => s.split(',').map((id) => id.trim()))
            .pipe(z.array(objectIdSchema).min(1)),
        staffPreference: z.enum(['any', 'specific']).default('any'),
        staffId: objectIdSchema.optional(),
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

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const bookingsListQuerySchema = z
    .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(500).default(20),
        status: z.enum(['upcoming', 'cancelled']).optional(),
        date: isoDateSchema.optional(),
        dateFrom: isoDateSchema.optional(),
        dateTo: isoDateSchema.optional(),
        search: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.date && (data.dateFrom || data.dateTo)) {
            ctx.addIssue({
                code: 'custom',
                message: 'Use either date or dateFrom/dateTo, not both',
                path: ['date'],
            });
        }
        if (data.dateFrom && data.dateTo && data.dateFrom > data.dateTo) {
            ctx.addIssue({
                code: 'custom',
                message: 'dateFrom must be on or before dateTo',
                path: ['dateFrom'],
            });
        }
    });

export const staffBookingsQuerySchema = z
    .object({
        dateFrom: isoDateSchema.optional(),
        dateTo: isoDateSchema.optional(),
    })
    .superRefine((data, ctx) => {
        if (data.dateFrom && data.dateTo && data.dateFrom > data.dateTo) {
            ctx.addIssue({
                code: 'custom',
                message: 'dateFrom must be on or before dateTo',
                path: ['dateFrom'],
            });
        }
    });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingsListQuery = z.infer<typeof bookingsListQuerySchema>;
export type StaffBookingsQuery = z.infer<typeof staffBookingsQuerySchema>;
