import { NextResponse } from 'next/server';

/** Returns 404 when API docs are disabled (prod default). */
export function isApiDocsEnabled(): boolean {
    return process.env.ENABLE_API_DOCS === '1';
}

export function apiDocsDisabledResponse() {
    return NextResponse.json({ status: 404, message: 'Not found', data: null }, { status: 404 });
}
