import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTodoAction, deleteTodoAction, updateTodoAction } from '@actions/todo.action';
import { apiClient } from '@libs/api-client';
import { unwrapApiResponse } from '@libs/action.util';
import type { ApiResponse } from '@typings/api.type';
import type { Todo } from '@typings/todo.type';
import type { CreateTodoInput, UpdateTodoInput } from '@validations/todo.schema';

/**
 * Todos:
 * - GET                → Route Handler `/api/todos`
 * - POST/PATCH/DELETE  → Server Actions
 */
export function useTodos() {
    return useQuery<Todo[], Error>({
        queryKey: ['todos'],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<Todo[]>>('/api/todos');
            return unwrapApiResponse(response.data);
        },
    });
}

export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateTodoInput) =>
            unwrapApiResponse(await createTodoAction(input)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

export function useUpdateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateTodoInput }) =>
            unwrapApiResponse(await updateTodoAction(id, input)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

export function useToggleTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) =>
            unwrapApiResponse(await updateTodoAction(id, { completed })),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => unwrapApiResponse(await deleteTodoAction(id)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}
