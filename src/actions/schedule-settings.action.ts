'use server';

import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@libs/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializeScheduleSettings } from '@mappers';
import { getSalonSettingsDocument } from '@libs/schedule.server';
import { SalonSettings } from '@models/salon-settings.model';
import type { ApiResponse } from '@typings/api.type';
import type { ScheduleSettingsDto } from '@typings/salon/schedule.type';
import {
    updateScheduleSettingsSchema,
    type UpdateScheduleSettingsInput,
} from '@validations/schedule-settings.schema';

export async function updateScheduleSettingsAction(
    input: UpdateScheduleSettingsInput,
): Promise<ApiResponse<ScheduleSettingsDto>> {
    const authError = await requireAdmin<ScheduleSettingsDto>();
    if (authError) return authError;

    const parsed = parseActionInput(updateScheduleSettingsSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<ScheduleSettingsDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const existing = await getSalonSettingsDocument();
        const updated = await SalonSettings.findByIdAndUpdate(existing._id, parsed.data, {
            new: true,
        }).lean();

        if (!updated) {
            return apiErrorResult<ScheduleSettingsDto>('Settings not found', 404);
        }

        return apiSuccessResult(serializeScheduleSettings(updated), 'Settings updated');
    } catch (error) {
        console.error('[updateScheduleSettingsAction]', error);
        return apiErrorResult<ScheduleSettingsDto>('Failed to update settings', 500);
    }
}
