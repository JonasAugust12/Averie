import { z } from 'zod';

export const createTodoSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(200, 'Title must be at most 200 characters'),
});

export const updateTodoSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, 'Title is required')
            .max(200, 'Title must be at most 200 characters')
            .optional(),
        completed: z.boolean().optional(),
    })
    .refine((data) => data.title !== undefined || data.completed !== undefined, {
        message: 'At least one field is required',
    });

export const todoIdSchema = z.object({
    id: z.string().min(1, 'Todo id is required'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
