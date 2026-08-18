'use server';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectToDatabase } from '@libs/mongodb';
import { requireAdmin } from '@guard/auth-guard';
import { apiErrorResult, apiSuccessResult, parseActionInput } from '@libs/action.util';
import { serializeUser } from '@mappers';
import { User } from '@models/user.model';
import type { ApiResponse } from '@typings/api.type';
import type { UserDto } from '@typings/salon-user.type';
import {
    createStaffSchema,
    resetStaffPasswordSchema,
    staffIdSchema,
    updateStaffSchema,
    type CreateStaffInput,
    type UpdateStaffInput,
} from '@validations/staff.schema';

export async function createStaffAction(input: CreateStaffInput): Promise<ApiResponse<UserDto>> {
    const authError = await requireAdmin<UserDto>();
    if (authError) return authError;

    const parsed = parseActionInput(createStaffSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<UserDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const passwordHash = await bcrypt.hash(parsed.data.password, 10);
        const created = await User.create({
            email: parsed.data.email.toLowerCase(),
            passwordHash,
            role: 'staff',
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            phone: parsed.data.phone,
            note: parsed.data.note,
            specialties: parsed.data.specialties,
            visible: parsed.data.visible ?? true,
            isActive: parsed.data.isActive ?? true,
            staffProfile: parsed.data.staffProfile,
        });

        return apiSuccessResult(serializeUser(created.toObject()), 'Staff created', 201);
    } catch (error) {
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            return apiErrorResult<UserDto>('Email already in use', 409);
        }
        console.error('[createStaffAction]', error);
        return apiErrorResult<UserDto>('Failed to create staff', 500);
    }
}

export async function updateStaffAction(
    id: string,
    input: UpdateStaffInput,
): Promise<ApiResponse<UserDto>> {
    const authError = await requireAdmin<UserDto>();
    if (authError) return authError;

    const idParsed = parseActionInput(staffIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult<UserDto>(idParsed.message, idParsed.status);
    }

    const parsed = parseActionInput(updateStaffSchema, input);
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult<UserDto>(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const updated = await User.findOneAndUpdate(
            { _id: idParsed.data.id, role: 'staff' },
            {
                ...parsed.data,
                ...(parsed.data.email ? { email: parsed.data.email.toLowerCase() } : {}),
            },
            { new: true },
        ).lean();

        if (!updated) {
            return apiErrorResult<UserDto>('Staff not found', 404);
        }

        return apiSuccessResult(serializeUser(updated), 'Staff updated');
    } catch (error) {
        console.error('[updateStaffAction]', error);
        return apiErrorResult<UserDto>('Failed to update staff', 500);
    }
}

export async function deleteStaffAction(id: string): Promise<ApiResponse<null>> {
    const authError = await requireAdmin<null>();
    if (authError) return authError;

    const idParsed = parseActionInput(staffIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult(idParsed.message, idParsed.status);
    }

    try {
        await connectToDatabase();
        const deleted = await User.findOneAndDelete({
            _id: idParsed.data.id,
            role: 'staff',
        }).lean();

        if (!deleted) {
            return apiErrorResult('Staff not found', 404);
        }

        return apiSuccessResult(null, 'Staff deleted');
    } catch (error) {
        console.error('[deleteStaffAction]', error);
        return apiErrorResult('Failed to delete staff', 500);
    }
}

export async function resetStaffPasswordAction(
    id: string,
    password: string,
): Promise<ApiResponse<null>> {
    const authError = await requireAdmin<null>();
    if (authError) return authError;

    const idParsed = parseActionInput(staffIdSchema, { id });
    if (idParsed.status >= 400 || !idParsed.data) {
        return apiErrorResult(idParsed.message, idParsed.status);
    }

    const parsed = parseActionInput(resetStaffPasswordSchema, { password });
    if (parsed.status >= 400 || !parsed.data) {
        return apiErrorResult(parsed.message, parsed.status);
    }

    try {
        await connectToDatabase();
        const passwordHash = await bcrypt.hash(parsed.data.password, 10);
        const updated = await User.findOneAndUpdate(
            { _id: idParsed.data.id, role: 'staff' },
            { passwordHash },
            { new: true },
        ).lean();

        if (!updated) {
            return apiErrorResult('Staff not found', 404);
        }

        return apiSuccessResult(null, 'Password reset');
    } catch (error) {
        console.error('[resetStaffPasswordAction]', error);
        return apiErrorResult('Failed to reset password', 500);
    }
}
