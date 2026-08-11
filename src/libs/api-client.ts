import axios from 'axios';

/**
 * Browser → same-origin Next.js Route Handlers (`/api/*`).
 * No separate backend server needed on Vercel.
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
