import { connectToDatabase } from '@libs/mongodb';
import { serializeTodo } from '@libs/todo.mapper';
import { Todo } from '@models/todo.model';
import { apiError, apiSuccess } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET todos — read via Route Handler.
 * Create/Update/Delete → Server Actions in `@actions/todo.action`.
 */
export async function GET() {
    try {
        await connectToDatabase();
        const todos = await Todo.find().sort({ createdAt: -1 }).lean();
        return apiSuccess(todos.map(serializeTodo), 'OK');
    } catch (error) {
        console.error('[GET /api/todos]', error);
        return apiError('Failed to fetch todos', 500);
    }
}
