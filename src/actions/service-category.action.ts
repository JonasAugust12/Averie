'use server';

import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@guard/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializeServiceCategory } from '@mappers';
import { ServiceCategory } from '@models/service-category.model';
import { Service } from '@models/service.model';
import type { ApiResponse } from '@typings/api.type';
import type { ServiceCategoryDto } from '@typings/service-category.type';
import {
    createServiceCategorySchema,
    serviceCategoryIdSchema,
    updateServiceCategorySchema,
    type CreateServiceCategoryInput,
    type UpdateServiceCategoryInput,
} from '@validations/service-category.schema';

export async function createServiceCategoryAction(
    input: CreateServiceCategoryInput,
): Promise<ApiResponse<ServiceCategoryDto>> {
    const authError = await requireAdmin<ServiceCategoryDto>();
    if (authError) return authError;

    const parsed = parseActionInput(createServiceCategorySchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<ServiceCategoryDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const created = await ServiceCategory.create(parsed.data);
        return apiSuccessResult(
            serializeServiceCategory(created.toObject()),
            'Category created',
            201,
        );
    } catch (error) {
        console.error('[createServiceCategoryAction]', error);
        return apiErrorResult<ServiceCategoryDto>('Failed to create category', 500);
    }
}

export async function updateServiceCategoryAction(
    id: string,
    input: UpdateServiceCategoryInput,
): Promise<ApiResponse<ServiceCategoryDto>> {
    const authError = await requireAdmin<ServiceCategoryDto>();
    if (authError) return authError;

    const idParsed = parseActionInput(serviceCategoryIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult<ServiceCategoryDto>(idParsed.message, idParsed.status);
    }

    const parsed = parseActionInput(updateServiceCategorySchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<ServiceCategoryDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const updated = await ServiceCategory.findByIdAndUpdate(idParsed.data.id, parsed.data, {
            new: true,
        }).lean();

        if (!updated) {
            return apiErrorResult<ServiceCategoryDto>('Category not found', 404);
        }

        return apiSuccessResult(serializeServiceCategory(updated), 'Category updated');
    } catch (error) {
        console.error('[updateServiceCategoryAction]', error);
        return apiErrorResult<ServiceCategoryDto>('Failed to update category', 500);
    }
}

export async function deleteServiceCategoryAction(id: string): Promise<ApiResponse<null>> {
    const authError = await requireAdmin<null>();
    if (authError) return authError;

    const idParsed = parseActionInput(serviceCategoryIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult(idParsed.message, idParsed.status);
    }

    try {
        await connectToDatabase();
        const serviceCount = await Service.countDocuments({ categoryId: idParsed.data.id });
        if (serviceCount > 0) {
            return apiErrorResult('Category has services and cannot be deleted', 409);
        }

        const deleted = await ServiceCategory.findByIdAndDelete(idParsed.data.id).lean();
        if (!deleted) {
            return apiErrorResult('Category not found', 404);
        }

        return apiSuccessResult(null, 'Category deleted');
    } catch (error) {
        console.error('[deleteServiceCategoryAction]', error);
        return apiErrorResult('Failed to delete category', 500);
    }
}
