import { NextResponse } from 'next/server';
import { connectToDatabase, getMongoReadyState } from '@libs/mongodb';
import type { HealthResponse } from '@typings/todo.type';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();
        const mongo = getMongoReadyState();

        const body: HealthResponse = {
            status: mongo === 'connected' ? 'ok' : 'degraded',
            mongo,
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(body);
    } catch (error) {
        console.error('[HEALTH]', error);

        const body: HealthResponse = {
            status: 'error',
            mongo: 'disconnected',
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(body, { status: 503 });
    }
}
