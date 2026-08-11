import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@libs/api-client';
import type { CreateTodoInput, Todo } from '@typings/todo.type';

export function useTodos() {
    return useQuery<Todo[], Error>({
        queryKey: ['todos'],
        queryFn: async () => {
            const response = await apiClient.get<Todo[]>('/api/todos');
            return response.data;
        },
    });
}

export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateTodoInput) => {
            const response = await apiClient.post<Todo>('/api/todos', input);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

export function useToggleTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
            const response = await apiClient.patch<Todo>(`/api/todos/${id}`, { completed });
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/api/todos/${id}`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
}
