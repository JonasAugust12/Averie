/**
 * Unified API / Server Action response envelope.
 *
 * {
 *   status: 200 | 400 | 404 | 500 | ...,
 *   message: string,
 *   data: T | null
 * }
 */
export type ApiResponse<T> = {
    status: number;
    message: string;
    data: T | null;
};
