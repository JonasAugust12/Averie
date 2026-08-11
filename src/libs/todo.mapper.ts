import type { Todo } from '@typings/todo.type';

type TodoLean = {
    _id: unknown;
    title: string;
    completed: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export function serializeTodo(doc: TodoLean): Todo {
    return {
        _id: String(doc._id),
        title: doc.title,
        completed: doc.completed,
        createdAt: new Date(doc.createdAt).toISOString(),
        updatedAt: new Date(doc.updatedAt).toISOString(),
    };
}
