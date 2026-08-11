import axios from 'axios';

/**
 * Client HTTP for GET Route Handlers (`/api/*`).
 * Response envelope: { status, message, data }.
 *
 * Mutations (POST/PUT/PATCH/DELETE) → Server Actions via `@actions/*`.
 */
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? '',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);
