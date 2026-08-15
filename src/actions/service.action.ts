'use server';

import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@libs/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializeService } from '@mappers';
import { Service } from '@models/service.model';
import type { ApiResponse } from '@typings/api.type';
import type { ServiceDto } from '@typings/salon/service.type';
import {
    createServiceSchema,
    serviceIdSchema,
    toggleServiceVisibilitySchema,
    updateServiceSchema,
    type CreateServiceInput,
    type UpdateServiceInput,
} from '@validations/service.schema';

export async function createServiceAction(
    input: CreateServiceInput,
): Promise<ApiResponse<ServiceDto>> {
    const authError = await requireAdmin<ServiceDto>();
    if (authError) return authError;

    const parsed = parseActionInput(createServiceSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<ServiceDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const created = await Service.create(parsed.data);
        return apiSuccessResult(serializeService(created.toObject()), 'Service created', 201);
    } catch (error) {
        console.error('[createServiceAction]', error);
        return apiErrorResult<ServiceDto>('Failed to create service', 500);
    }
}

export async function updateServiceAction(
    id: string,
    input: UpdateServiceInput,
): Promise<ApiResponse<ServiceDto>> {
    const authError = await requireAdmin<ServiceDto>();
    if (authError) return authError;

    const idParsed = parseActionInput(serviceIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult<ServiceDto>(idParsed.message, idParsed.status);
    }

    const parsed = parseActionInput(updateServiceSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<ServiceDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const updated = await Service.findByIdAndUpdate(idParsed.data.id, parsed.data, {
            new: true,
        }).lean();

        if (!updated) {
            return apiErrorResult<ServiceDto>('Service not found', 404);
        }

        return apiSuccessResult(serializeService(updated), 'Service updated');
    } catch (error) {
        console.error('[updateServiceAction]', error);
        return apiErrorResult<ServiceDto>('Failed to update service', 500);
    }
}

export async function deleteServiceAction(id: string): Promise<ApiResponse<null>> {
    const authError = await requireAdmin<null>();
    if (authError) return authError;

    const idParsed = parseActionInput(serviceIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult(idParsed.message, idParsed.status);
    }

    try {
        await connectToDatabase();
        const deleted = await Service.findByIdAndDelete(idParsed.data.id).lean();
        if (!deleted) {
            return apiErrorResult('Service not found', 404);
        }
        return apiSuccessResult(null, 'Service deleted');
    } catch (error) {
        console.error('[deleteServiceAction]', error);
        return apiErrorResult('Failed to delete service', 500);
    }
}

export async function toggleServiceVisibilityAction(
    id: string,
    visible: boolean,
): Promise<ApiResponse<ServiceDto>> {
    const authError = await requireAdmin<ServiceDto>();
    if (authError) return authError;

    const idParsed = parseActionInput(serviceIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult<ServiceDto>(idParsed.message, idParsed.status);
    }

    const parsed = parseActionInput(toggleServiceVisibilitySchema, { visible });
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<ServiceDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const updated = await Service.findByIdAndUpdate(
            idParsed.data.id,
            { visible: parsed.data.visible },
            { new: true },
        ).lean();

        if (!updated) {
            return apiErrorResult<ServiceDto>('Service not found', 404);
        }

        return apiSuccessResult(serializeService(updated), 'Service visibility updated');
    } catch (error) {
        console.error('[toggleServiceVisibilityAction]', error);
        return apiErrorResult<ServiceDto>('Failed to update visibility', 500);
    }
}
