import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';

const dayOffSchema = z.object({
    id: objectIdSchema.optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    scope: z.enum(['full', 'morning', 'afternoon', 'evening']),
});

const periodSlotsSchema = z.object({
    morning: z.array(z.string().trim().min(1)),
    afternoon: z.array(z.string().trim().min(1)),
    evening: z.array(z.string().trim().min(1)),
});

const weekdayScheduleSchema = z.object({
    weekday: z.number().int().min(0).max(6),
    isOpen: z.boolean(),
    periodSlots: periodSlotsSchema,
});

export const updateScheduleSettingsSchema = z.object({
    allowStaffSelection: z.boolean().optional(),
    allowGuestLanguageSwitch: z.boolean().optional(),
    weekdaySchedules: z
        .array(weekdayScheduleSchema)
        .length(7)
        .refine(
            (schedules) => new Set(schedules.map((s) => s.weekday)).size === 7,
            'weekdaySchedules must include each weekday 0–6 exactly once',
        )
        .optional(),
    dayOffs: z.array(dayOffSchema).optional(),
});

export type UpdateScheduleSettingsInput = z.infer<typeof updateScheduleSettingsSchema>;
