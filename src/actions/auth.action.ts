'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { auth, signIn, signOut } from '@libs/auth';
import { connectToDatabase } from '@libs/mongodb';
import { requireStaffOrAdmin, getSessionUser } from '@guard/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { User } from '@models/user.model';
import type { ApiResponse } from '@typings/api.type';
import {
    changePasswordSchema,
    loginSchema,
    type ChangePasswordInput,
    type LoginSchema,
} from '@validations/auth.schema';

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
    } catch (error) {
        console.error('[logoutAction]', error);
    }
    return apiSuccessResult(null, 'Signed out');
}

export async function getSessionAction() {
    return auth();
}

export async function changeOwnPasswordAction(
    input: ChangePasswordInput,
): Promise<ApiResponse<null>> {
    const authError = await requireStaffOrAdmin<null>();
    if (authError) return authError;

    const parsed = parseActionInput(changePasswordSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult(parsed.message, parsed.status);
    }

    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
        return apiErrorResult('Unauthorized', 401);
    }

    try {
        await connectToDatabase();
        const user = await User.findById(sessionUser.id).select('+passwordHash').lean();

        if (!user?.passwordHash || !user.isActive) {
            return apiErrorResult('User not found', 404);
        }

        const currentValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
        if (!currentValid) {
            return apiErrorResult('Current password is incorrect', 400);
        }

        const sameAsOld = await bcrypt.compare(parsed.data.newPassword, user.passwordHash);
        if (sameAsOld) {
            return apiErrorResult('New password must be different from current password', 400);
        }

        const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
        await User.findByIdAndUpdate(sessionUser.id, { passwordHash });

        return apiSuccessResult(null, 'Password updated');
    } catch (error) {
        console.error('[changeOwnPasswordAction]', error);
        return apiErrorResult('Failed to update password', 500);
    }
}
