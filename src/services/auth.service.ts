'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { loginAction, logoutAction, changeOwnPasswordAction } from '@actions/auth.action';
import { useAppMutation } from '@hooks/useAppMutation';
import { unwrapApiResponse } from '@libs/action.util';
import { toastApiError, toastSuccess } from '@utils/toast.util';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { ChangePasswordInput, LoginSchema } from '@validations/auth.schema';

type ChangeOwnPasswordOptions = {
    successMessage?: string;
};

/** Current session from Auth.js client. */
export function useAuthSession() {
    return useSession();
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useAppMutation({
        mutationFn: async (input: LoginSchema) => unwrapApiResponse(await loginAction(input)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['session'] });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useAppMutation({
        mutationFn: async () => unwrapApiResponse(await logoutAction()),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['session'] });
        },
    });
}

export function useChangeOwnPassword(options?: ChangeOwnPasswordOptions) {
    const t = useAdminTranslations();

    return useAppMutation({
        loadingMessage: t('settingsAccount.submitting'),
        mutationFn: async (input: ChangePasswordInput) =>
            unwrapApiResponse(await changeOwnPasswordAction(input)),
        onSuccess: () => {
            toastSuccess(options?.successMessage ?? t('settingsAccount.changeOwnSuccess'));
        },
        onError: toastApiError,
    });
}

/** Direct next-auth/react helpers if you prefer client-side calls. */
export { signIn, signOut };
