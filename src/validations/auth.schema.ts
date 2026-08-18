import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().trim().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm password is required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type LoginSchema = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
