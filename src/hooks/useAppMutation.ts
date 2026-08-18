'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useUIStore } from '@stores/ui.store';
import { useCommonTranslations } from '@i18n/use-app-translations';

type AppMutationOptions<TData, TError, TVariables, TContext> = UseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
> & {
    loadingMessage?: string;
    /** When false, skip the global loading overlay (default true). */
    showGlobalLoading?: boolean;
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

    const { loadingMessage, showGlobalLoading = true, onMutate, onSettled, ...rest } = options;

    return useMutation({
        ...rest,
        onMutate: async (variables, mutation) => {
            if (showGlobalLoading) {
                showLoading(loadingMessage ?? t('status.loading'));
            }
            return (await onMutate?.(variables, mutation)) as TContext;
        },
        onSettled: (data, error, variables, context, mutation) => {
            if (showGlobalLoading) {
                hideLoading();
            }
            return onSettled?.(data, error, variables, context, mutation);
        },
    });
}
