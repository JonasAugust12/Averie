import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@libs/mongodb';
import { Todo } from '@models/todo.model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();
        const todos = await Todo.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(todos);
    } catch (error) {
        console.error('[TODOS GET]', error);
        return NextResponse.json({ message: 'Failed to fetch todos' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as { title?: string };
        const title = body.title?.trim();

        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        await connectToDatabase();
        const todo = await Todo.create({ title });
        return NextResponse.json(todo, { status: 201 });
    } catch (error) {
        console.error('[TODOS POST]', error);
        return NextResponse.json({ message: 'Failed to create todo' }, { status: 500 });
    }
}
