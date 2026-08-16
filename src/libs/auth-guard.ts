import { auth } from '@libs/auth';
import { apiErrorResult } from '@libs/action.util';
import type { ApiResponse } from '@typings/api.type';
import type { UserRole } from '@typings/salon/common.type';

type SessionUser = {
    id?: string;
    role?: UserRole;
    email?: string | null;
    name?: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
    const session = await auth();
    if (!session?.user) return null;
    return session.user as SessionUser;
}

export async function requireAdmin<T>(): Promise<ApiResponse<T> | null> {
    const user = await getSessionUser();
    if (!user?.id) {
        return apiErrorResult<T>('Unauthorized', 401);
    }
    if (user.role !== 'admin') {
        return apiErrorResult<T>('Forbidden', 403);
    }
    return null;
}

export async function requireStaffOrAdmin<T>(): Promise<ApiResponse<T> | null> {
    const user = await getSessionUser();
    if (!user?.id) {
        return apiErrorResult<T>('Unauthorized', 401);
    }
    if (user.role !== 'admin' && user.role !== 'staff') {
        return apiErrorResult<T>('Forbidden', 403);
    }
    return null;
}

export async function requireStaffSelfOrAdmin<T>(staffId: string): Promise<ApiResponse<T> | null> {
    const user = await getSessionUser();
    if (!user?.id) {
        return apiErrorResult<T>('Unauthorized', 401);
    }
    if (user.role === 'admin') return null;
    if (user.role === 'staff' && user.id === staffId) return null;
    return apiErrorResult<T>('Forbidden', 403);
}
