export interface Todo {
    _id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTodoInput {
    title: string;
}

export interface HealthResponse {
    status: 'ok' | 'degraded' | 'error';
    mongo: string;
    timestamp: string;
}
