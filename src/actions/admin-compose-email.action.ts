'use server';

import { requireAdmin } from '@guard/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { sendAdminComposeEmail, getEmailFromAddress } from '@server/email.server';
import type { ApiResponse } from '@typings/api.type';
import {
    sendAdminComposeEmailSchema,
    type SendAdminComposeEmailInput,
} from '@validations/admin-compose-email.schema';

export async function getAdminEmailFromAction(): Promise<ApiResponse<{ from: string }>> {
    const authError = await requireAdmin<{ from: string }>();
    if (authError) return authError;

    return apiSuccessResult({ from: getEmailFromAddress() }, 'OK');
}

export async function sendAdminComposeEmailAction(
    input: SendAdminComposeEmailInput,
): Promise<ApiResponse<null>> {
    const authError = await requireAdmin<null>();
    if (authError) return authError;

    const parsed = parseActionInput(sendAdminComposeEmailSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<null>(parsed.message, parsed.status);
    }

    try {
        const sent = await sendAdminComposeEmail(parsed.data);
        if (!sent) {
            return apiErrorResult<null>('Failed to send email', 502);
        }

        return apiSuccessResult(null, 'Email sent');
    } catch (error) {
        console.error('[sendAdminComposeEmailAction]', error);
        return apiErrorResult<null>('Failed to send email', 500);
    }
}
