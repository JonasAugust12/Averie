import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: (failureCount, error: unknown) => {
                const status = (error as { response?: { status?: number } })?.response?.status;
                if (status && status >= 400 && status < 500) {
                    return false;
                }
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: true,
        },
        mutations: {
            retry: 1,
        },
    },
});
