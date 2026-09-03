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
    displayStatus: z.enum(['upcoming', 'completed', 'cancelled']),
    emailNotifications: z
        .object({
            confirmationSentAt: z.string().optional(),
            reminderSentAt: z.string().optional(),
        })
        .optional(),
    cancelledAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const timeSlotDtoSchema = z.object({
    id: z.string(),
    time: z.string(),
    available: z.boolean(),
});

export const bookingStaffSummarySchema = z.object({
    id: objectIdSchema,
    firstName: z.string(),
    lastName: z.string(),
});

export const bookingServiceSummarySchema = z.object({
    id: objectIdSchema,
    name: z.string(),
    estimatedMinutes: z.number().int(),
});

export const bookingListItemDtoSchema = bookingDtoSchema.extend({
    staff: bookingStaffSummarySchema.nullable(),
    services: z.array(bookingServiceSummarySchema),
});

export const bookingListStatsSchema = z.object({
    total: z.number().int(),
    upcoming: z.number().int(),
    cancelled: z.number().int(),
    completed: z.number().int(),
});

export const paginatedBookingsDataSchema = z.object({
    items: z.array(bookingListItemDtoSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    stats: bookingListStatsSchema,
});

export const bookingSlotsDataSchema = z.object({
    date: z.string().describe('YYYY-MM-DD'),
    slots: z.array(timeSlotDtoSchema),
});

export const bookingDetailApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: bookingListItemDtoSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: bookingExample }] });

export const bookingByReferenceApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: bookingListItemDtoSchema,
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
        data: z.array(bookingListItemDtoSchema),
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: [bookingExample] }] });

export const bookingReminderBatchDataSchema = z.object({
    sent: z.number().int().describe('Reminders sent in this batch'),
    skipped: z
        .number()
        .int()
        .describe('Bookings skipped (no email, outside window, or send failed)'),
});

export const bookingReminderBatchApiResponseSchema = z.object({
    status: z.number().int().describe('HTTP status code (mirrored in body)'),
    message: z.string(),
    data: bookingReminderBatchDataSchema,
});
