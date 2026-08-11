import { ZodError, type ZodType } from 'zod';
import type { ApiResponse } from '@typings/api.type';
import type { ActionFieldErrors } from '@typings/action.type';

export function apiSuccessResult<T>(data: T, message = 'Success', status = 200): ApiResponse<T> {
    return { status, message, data };
}

export function apiErrorResult<T = never>(message: string, status = 400): ApiResponse<T> {
    return { status, message, data: null };
}

export function zodFieldErrors(error: ZodError): ActionFieldErrors {
    const fieldErrors: ActionFieldErrors = {};

    for (const issue of error.issues) {
        const key = issue.path.join('.') || '_form';
        if (!fieldErrors[key]) {
            fieldErrors[key] = [];
        }
        fieldErrors[key].push(issue.message);
    }

    return fieldErrors;
}

export function parseActionInput<T>(schema: ZodType<T>, input: unknown): ApiResponse<T> {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors = zodFieldErrors(parsed.error);
        const firstError = Object.values(fieldErrors)[0]?.[0] ?? 'Validation failed';
        return apiErrorResult<T>(firstError, 400);
    }
    return apiSuccessResult(parsed.data);
}

/**
 * Unwrap unified { status, message, data } for TanStack Query / UI.
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
    if (response.status >= 400) {
        throw new Error(response.message || 'Request failed');
    }
    return response.data as T;
}
