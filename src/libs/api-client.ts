import axios from 'axios';
import { decryptData } from '@utils/decryption.client';

/**
 * Client HTTP for GET Route Handlers (`/api/*`).
 * Response envelope: { status, message, data }.
 *
 * Mutations (POST/PUT/PATCH/DELETE) → Server Actions via `@actions/*`.
 *
 * When NEXT_PUBLIC_ENABLE_OBFUSCATION=true, the interceptor transparently
 * decrypts the `data` field before the response reaches TanStack Query hooks.
 * No changes needed in individual services.
 */
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? '',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

const OBFUSCATION_ENABLED = process.env.NEXT_PUBLIC_ENABLE_OBFUSCATION === 'true';

apiClient.interceptors.response.use(
    async (response) => {
        if (OBFUSCATION_ENABLED && typeof response.data?.data === 'string') {
            try {
                response.data = {
                    ...response.data,
                    data: await decryptData(response.data.data),
                };
            } catch {
                // If decryption fails (e.g. error responses left as plain), leave data as-is.
                // apiError responses are never encrypted — this catch handles that gracefully.
            }
        }
        return response;
    },
    (error) => Promise.reject(error),
);
