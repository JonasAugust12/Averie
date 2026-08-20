import { NextResponse } from 'next/server';
import type { ApiResponse } from '@typings/api.type';
import { encryptData, OBFUSCATION_ENABLED } from '@server/encryption.server';

/**
 * Route Handler helpers — always return { status, message, data }.
 *
 * Convention:
 * - GET            → Route Handlers (`src/app/api/*`)
 * - POST/PUT/PATCH/DELETE → Server Actions (`src/actions/*`)
 *
 * Also use Route Handlers for external SVC, webhooks, streams, public APIs.
 *
 * When ENABLE_OBFUSCATION=1, `data` in success responses is AES-256-GCM
 * encrypted (see `src/server/encryption.server.ts`). Error responses are never
 * encrypted — they surface user-facing messages that clients must read.
 */

export function apiSuccess<T>(data: T, message = 'Success', status = 200) {
    const payload = OBFUSCATION_ENABLED ? encryptData(data) : data;
    const body: ApiResponse<typeof payload> = { status, message, data: payload };
    return NextResponse.json(body, { status });
}

export function apiError(message: string, status = 500) {
    const body: ApiResponse<null> = { status, message, data: null };
    return NextResponse.json(body, { status });
}
