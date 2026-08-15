import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';
import { scheduleSettingsExample } from '@openapi/examples/schedule.examples';

export const dayOffDtoSchema = z.object({
    id: objectIdSchema,
    date: z.string().describe('YYYY-MM-DD'),
    scope: z.union([z.literal('full'), z.enum(['morning', 'afternoon', 'evening'])]),
});

export const periodSlotsDtoSchema = z.object({
    morning: z.array(z.string()),
    afternoon: z.array(z.string()),
    evening: z.array(z.string()),
});

export const scheduleSettingsDtoSchema = z.object({
    id: objectIdSchema,
    allowStaffSelection: z.boolean(),
    workingWeekdays: z.array(z.number().int().min(0).max(6)),
    periodSlots: periodSlotsDtoSchema,
    dayOffs: z.array(dayOffDtoSchema),
    updatedAt: z.string(),
});

export const scheduleSettingsApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: scheduleSettingsDtoSchema,
    })
    .meta({ examples: [{ status: 200, message: 'OK', data: scheduleSettingsExample }] });
