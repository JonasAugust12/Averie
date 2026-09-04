import { toId, toIso, type IdLike } from '@mappers/shared.mapper';
import type { ServiceCategoryDto } from '@typings/service-category.type';

export function serializeServiceCategory(doc: {
    _id: IdLike;
    name: string;
    slug: string;
    sortOrder?: number;
    icon?: string | null;
    subtitle?: string;
    description?: string;
    note?: string;
    featured?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}): ServiceCategoryDto {
    return {
        id: toId(doc._id),
        name: doc.name,
        slug: doc.slug,
        sortOrder: doc.sortOrder ?? 0,
        icon: doc.icon ?? null,
        subtitle: doc.subtitle ?? '',
        description: doc.description ?? '',
        note: doc.note ?? '',
        featured: doc.featured ?? false,
        createdAt: toIso(doc.createdAt),
        updatedAt: toIso(doc.updatedAt),
    };
}
