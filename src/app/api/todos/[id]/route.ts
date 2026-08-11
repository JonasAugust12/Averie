import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@libs/mongodb';
import { Todo } from '@models/todo.model';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid todo id' }, { status: 400 });
        }

        const body = (await request.json()) as { completed?: boolean; title?: string };
        await connectToDatabase();

        const todo = await Todo.findByIdAndUpdate(
            id,
            {
                ...(typeof body.completed === 'boolean' ? { completed: body.completed } : {}),
                ...(body.title?.trim() ? { title: body.title.trim() } : {}),
            },
            { new: true },
        ).lean();

        if (!todo) {
            return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json(todo);
    } catch (error) {
        console.error('[TODOS PATCH]', error);
        return NextResponse.json({ message: 'Failed to update todo' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid todo id' }, { status: 400 });
        }

        await connectToDatabase();
        const todo = await Todo.findByIdAndDelete(id).lean();

        if (!todo) {
            return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[TODOS DELETE]', error);
        return NextResponse.json({ message: 'Failed to delete todo' }, { status: 500 });
    }
}
