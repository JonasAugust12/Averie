import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';

const staffProfileSchema = z.object({
    color: z.string().trim().optional(),
    initials: z.string().trim().max(4).optional(),
});

export const createStaffSchema = z.object({
    email: z.string().trim().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    phone: z.string().trim().min(1, 'Phone is required'),
    note: z.string().trim().optional(),
    specialties: z.array(z.string().trim()).default([]),
    visible: z.boolean().optional(),
    isActive: z.boolean().optional(),
    staffProfile: staffProfileSchema.optional(),
});

export const updateStaffSchema = z
    .object({
        email: z.string().trim().email().optional(),
        firstName: z.string().trim().min(1).optional(),
        lastName: z.string().trim().min(1).optional(),
        phone: z.string().trim().min(1).optional(),
        note: z.string().trim().optional(),
        specialties: z.array(z.string().trim()).optional(),
        visible: z.boolean().optional(),
        isActive: z.boolean().optional(),
        staffProfile: staffProfileSchema.optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: 'At least one field is required',
    });

export const resetStaffPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminResetStaffPasswordFormSchema = z
    .object({
        staffId: z
            .string()
            .min(1, 'Select a staff member')
            .regex(/^[a-f\d]{24}$/i, 'Invalid staff'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const staffIdSchema = z.object({
    id: objectIdSchema,
});

export const staffListQuerySchema = z.object({
    visible: z.enum(['true', 'false']).optional(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type AdminResetStaffPasswordFormInput = z.infer<typeof adminResetStaffPasswordFormSchema>;
