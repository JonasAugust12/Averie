'use server';

import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializeTodo } from '@libs/todo.mapper';
import { Todo } from '@models/todo.model';
import type { ApiResponse } from '@typings/api.type';
import type { Todo as TodoDto } from '@typings/todo.type';
import {
    createTodoSchema,
    todoIdSchema,
    updateTodoSchema,
    type CreateTodoInput,
    type UpdateTodoInput,
} from '@validations/todo.schema';

/**
 * Mutations only (POST/PUT/PATCH/DELETE).
 * Reads (GET) → Route Handlers in `src/app/api/*`.
 */
export async function createTodoAction(input: CreateTodoInput): Promise<ApiResponse<TodoDto>> {
    const parsed = parseActionInput(createTodoSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<TodoDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const created = await Todo.create({ title: parsed.data.title });
        return apiSuccessResult(
            serializeTodo({
                _id: created._id,
                title: created.title,
                completed: Boolean(created.completed),
                createdAt: created.get('createdAt') as Date,
                updatedAt: created.get('updatedAt') as Date,
            }),
            'Todo created',
            201,
        );
    } catch (error) {
        console.error('[createTodoAction]', error);
        return apiErrorResult<TodoDto>('Failed to create todo', 500);
    }
}

export async function updateTodoAction(
    id: string,
    input: UpdateTodoInput,
): Promise<ApiResponse<TodoDto>> {
    const idParsed = parseActionInput(todoIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult<TodoDto>(idParsed.message, idParsed.status);
    }

    if (!mongoose.Types.ObjectId.isValid(idParsed.data.id)) {
        return apiErrorResult<TodoDto>('Invalid todo id', 400);
    }

    const parsed = parseActionInput(updateTodoSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<TodoDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const updated = await Todo.findByIdAndUpdate(
            idParsed.data.id,
            {
                ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
                ...(parsed.data.completed !== undefined
                    ? { completed: parsed.data.completed }
                    : {}),
            },
            { new: true },
        ).lean();

        if (!updated) {
            return apiErrorResult<TodoDto>('Todo not found', 404);
        }

        return apiSuccessResult(serializeTodo(updated), 'Todo updated');
    } catch (error) {
        console.error('[updateTodoAction]', error);
        return apiErrorResult<TodoDto>('Failed to update todo', 500);
    }
}

export async function deleteTodoAction(id: string): Promise<ApiResponse<null>> {
    const idParsed = parseActionInput(todoIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult(idParsed.message, idParsed.status);
    }

    if (!mongoose.Types.ObjectId.isValid(idParsed.data.id)) {
        return apiErrorResult('Invalid todo id', 400);
    }

    try {
        await connectToDatabase();
        const deleted = await Todo.findByIdAndDelete(idParsed.data.id).lean();

        if (!deleted) {
            return apiErrorResult('Todo not found', 404);
        }

        return apiSuccessResult(null, 'Todo deleted');
    } catch (error) {
        console.error('[deleteTodoAction]', error);
        return apiErrorResult('Failed to delete todo', 500);
    }
}
