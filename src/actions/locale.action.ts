'use server';

import { cookies } from 'next/headers';
import { LOCALE_COOKIE, LOCALES, type AppLocale } from '@i18n/config';
import { apiErrorResult, apiSuccessResult } from '@libs/action.util';
import type { ApiResponse } from '@typings/api.type';

function isAppLocale(value: string): value is AppLocale {
    return (LOCALES as readonly string[]).includes(value);
}

export async function setLocaleAction(locale: string): Promise<ApiResponse<{ locale: AppLocale }>> {
    if (!isAppLocale(locale)) {
        return apiErrorResult('Unsupported locale', 400);
    }

    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    });

    return apiSuccessResult({ locale }, 'Locale updated');
}
