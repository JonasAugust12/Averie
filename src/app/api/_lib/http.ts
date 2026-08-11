import { NextResponse } from 'next/server';
import type { ApiResponse } from '@typings/api.type';

/**
 * Route Handler helpers — always return { status, message, data }.
 *
 * Convention:
 * - GET            → Route Handlers (`src/app/api/*`)
 * - POST/PUT/PATCH/DELETE → Server Actions (`src/actions/*`)
 *
 * Also use Route Handlers for external SVC, webhooks, streams, public APIs.
 */

export function apiSuccess<T>(data: T, message = 'Success', status = 200) {
    const body: ApiResponse<T> = { status, message, data };
    return NextResponse.json(body, { status });
}

export function apiError(message: string, status = 500) {
    const body: ApiResponse<null> = { status, message, data: null };
    return NextResponse.json(body, { status });
}
