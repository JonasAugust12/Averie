'use server';

import { cookies } from 'next/headers';
import { auth } from '@libs/auth';
import { LOCALE_COOKIE, LOCALES, type AppLocale } from '@i18n/config';
import { apiErrorResult, apiSuccessResult } from '@libs/action.util';
import { getScheduleSettingsDto } from '@server/schedule.server';
import type { ApiResponse } from '@typings/api.type';

function isAppLocale(value: string): value is AppLocale {
    return (LOCALES as readonly string[]).includes(value);
}

export async function setLocaleAction(locale: string): Promise<ApiResponse<{ locale: AppLocale }>> {
    if (!isAppLocale(locale)) {
        return apiErrorResult('Unsupported locale', 400);
    }

    const session = await auth();
    const role = session?.user?.role;
    const isPrivileged = role === 'admin' || role === 'staff';

    if (!isPrivileged) {
        const settings = await getScheduleSettingsDto();
        if (!settings.allowGuestLanguageSwitch) {
            return apiErrorResult('Guest language switching is disabled', 403);
        }
    }

    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    });

    return apiSuccessResult({ locale }, 'Locale updated');
}
