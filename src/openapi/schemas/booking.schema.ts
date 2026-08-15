import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';
import {
    bookingExample,
    bookingSlotsDataExample,
    paginatedBookingsDataExample,
} from '@openapi/examples/booking.examples';

export const bookingCustomerDtoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    note: z.string().optional(),
});

export const bookingDtoSchema = z.object({
    id: objectIdSchema,
    reference: z.string(),
    serviceIds: z.array(objectIdSchema),
    staffPreference: z.enum(['any', 'specific']),
    staffId: objectIdSchema.optional(),
    date: z.string().describe('YYYY-MM-DD'),
    time: z.string().describe('e.g. 09:00 AM'),
    totalEstimatedMinutes: z.number().int(),
    totalPrice: z.number(),
    customer: bookingCustomerDtoSchema,
    status: z.enum(['upcoming', 'cancelled']),
    cancelledAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const timeSlotDtoSchema = z.object({
    id: z.string(),
    time: z.string(),
    available: z.boolean(),
});

export const paginatedBookingsDataSchema = z.object({
    items: z.array(bookingDtoSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
});

export const bookingSlotsDataSchema = z.object({
    date: z.string().describe('YYYY-MM-DD'),
    slots: z.array(timeSlotDtoSchema),
});

export const bookingDetailApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: bookingDtoSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: bookingExample }] });

export const bookingByReferenceApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: bookingDtoSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: bookingExample }] });

export const bookingsListApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: paginatedBookingsDataSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: paginatedBookingsDataExample }] });

export const bookingSlotsApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: bookingSlotsDataSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: bookingSlotsDataExample }] });

export const staffBookingsApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: z.array(bookingDtoSchema),
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: [bookingExample] }] });
