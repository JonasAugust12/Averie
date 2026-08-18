'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useUIStore } from '@stores/ui.store';
import { useCommonTranslations } from '@i18n/use-app-translations';

type LoadingTimingContext = {
    __loadingStartedAt?: number;
};

type AppMutationOptions<TData, TError, TVariables, TContext> = UseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
> & {
    loadingMessage?: string;
    /** When false, skip the global loading overlay (default true). */
    showGlobalLoading?: boolean;
    /** Keep overlay visible at least this long on success (ms). Errors hide immediately. */
    minLoadingMs?: number;
};

export function useAppMutation<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown,
>(options: AppMutationOptions<TData, TError, TVariables, TContext>) {
    const showLoading = useUIStore((state) => state.showLoading);
    const hideLoading = useUIStore((state) => state.hideLoading);
    const t = useCommonTranslations();

    const {
        loadingMessage,
        showGlobalLoading = true,
        minLoadingMs,
        onMutate,
        onSettled,
        ...rest
    } = options;

    return useMutation({
        ...rest,
        onMutate: async (variables, mutation) => {
            const startedAt = Date.now();
            if (showGlobalLoading) {
                showLoading(loadingMessage ?? t('status.loading'));
            }
            const userContext = (await onMutate?.(variables, mutation)) ?? {};
            return {
                ...(userContext as object),
                __loadingStartedAt: startedAt,
            } as TContext;
        },
        onSettled: async (data, error, variables, context, mutation) => {
            if (showGlobalLoading) {
                const startedAt =
                    (context as LoadingTimingContext | undefined)?.__loadingStartedAt ?? Date.now();
                if (!error && minLoadingMs != null && minLoadingMs > 0) {
                    const remaining = minLoadingMs - (Date.now() - startedAt);
                    if (remaining > 0) {
                        await new Promise<void>((resolve) => {
                            setTimeout(resolve, remaining);
                        });
                    }
                }
                hideLoading();
            }
            return onSettled?.(data, error, variables, context, mutation);
        },
    });
}
