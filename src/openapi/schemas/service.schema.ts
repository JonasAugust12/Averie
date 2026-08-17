import { z } from 'zod';
import { objectIdSchema } from '@validations/service-category.schema';
import {
    serviceCategoryWithServicesExample,
    serviceGelExample,
    serviceManicureExample,
} from '@openapi/examples/service.examples';

export const serviceDtoSchema = z.object({
    id: objectIdSchema,
    categoryId: objectIdSchema,
    name: z.string(),
    description: z.string(),
    price: z.number(),
    estimatedMinutes: z.number().int(),
    visible: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const serviceCategoryDtoSchema = z.object({
    id: objectIdSchema,
    name: z.string(),
    sortOrder: z.number().int(),
    icon: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const serviceCategoryWithServicesDtoSchema = serviceCategoryDtoSchema.extend({
    services: z.array(serviceDtoSchema),
});

export const serviceCategoriesApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: z.array(serviceCategoryWithServicesDtoSchema),
    })
    .meta({
        examples: [{ status: 200, message: 'OK', data: [serviceCategoryWithServicesExample] }],
    });

export const servicesApiResponseSchema = z
    .object({
        status: z.number().int().describe('HTTP status code (mirrored in body)'),
        message: z.string(),
        data: z.array(serviceDtoSchema),
    })
    .meta({
        examples: [
            { status: 200, message: 'OK', data: [serviceManicureExample, serviceGelExample] },
        ],
    });
