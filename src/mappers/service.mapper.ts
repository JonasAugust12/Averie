import { toId, toIso, type IdLike } from '@mappers/shared.mapper';
import type { ServiceDto } from '@typings/service.type';

export function serializeService(doc: {
    _id: IdLike;
    categoryId: IdLike;
    name: string;
    description: string;
    price: number;
    estimatedMinutes: number;
    visible: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}): ServiceDto {
    return {
        id: toId(doc._id),
        categoryId: toId(doc.categoryId),
        name: doc.name,
        description: doc.description,
        price: doc.price,
        estimatedMinutes: doc.estimatedMinutes,
        visible: doc.visible,
        createdAt: toIso(doc.createdAt),
        updatedAt: toIso(doc.updatedAt),
    };
}
