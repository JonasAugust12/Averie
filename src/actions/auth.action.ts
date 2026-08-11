'use server';

import { AuthError } from 'next-auth';
import { auth, signIn, signOut } from '@libs/auth';
import { apiErrorResult, apiSuccessResult } from '@libs/action.util';
import type { ApiResponse } from '@typings/api.type';
import { loginSchema, type LoginSchema } from '@validations/auth.schema';

/**
 * Auth mutations via Server Actions.
 * NextAuth HTTP endpoints still live at `/api/auth/*` (required by Auth.js).
 */
export async function loginAction(input: LoginSchema): Promise<ApiResponse<{ ok: true }>> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
        return apiErrorResult(parsed.error.issues[0]?.message ?? 'Validation failed', 400);
    }

    try {
        await signIn('credentials', {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
        });
        return apiSuccessResult({ ok: true }, 'Signed in');
    } catch (error) {
        if (error instanceof AuthError) {
            return apiErrorResult('Invalid email or password', 401);
        }
        console.error('[loginAction]', error);
        return apiErrorResult('Failed to sign in', 500);
    }
}

export async function logoutAction(): Promise<ApiResponse<null>> {
    try {
        await signOut({ redirect: false });
        return apiSuccessResult(null, 'Signed out');
    } catch (error) {
        console.error('[logoutAction]', error);
        return apiErrorResult('Failed to sign out', 500);
    }
}

export async function getSessionAction() {
    return auth();
}
