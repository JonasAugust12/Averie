import { toId, toIso, type IdLike } from '@mappers/shared.mapper';
import type { ServiceCategoryDto } from '@typings/salon/service-category.type';

export function serializeServiceCategory(doc: {
    _id: IdLike;
    name: string;
    sortOrder?: number;
    icon?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}): ServiceCategoryDto {
    return {
        id: toId(doc._id),
        name: doc.name,
        sortOrder: doc.sortOrder ?? 0,
        icon: doc.icon ?? null,
        createdAt: toIso(doc.createdAt),
        updatedAt: toIso(doc.updatedAt),
    };
}
