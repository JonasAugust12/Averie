'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { loginAction, logoutAction } from '@actions/auth.action';
import { useAppMutation } from '@hooks/useAppMutation';
import { unwrapApiResponse } from '@libs/action.util';
import type { LoginSchema } from '@validations/auth.schema';

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

/** Direct next-auth/react helpers if you prefer client-side calls. */
export { signIn, signOut };
