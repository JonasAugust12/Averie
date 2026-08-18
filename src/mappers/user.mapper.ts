import { toId, toIso, type IdLike } from '@mappers/shared.mapper';
import type { UserDto } from '@typings/salon-user.type';

export function serializeUser(doc: {
    _id: IdLike;
    email: string;
    role: 'admin' | 'staff';
    firstName: string;
    lastName: string;
    phone: string;
    note?: string | null;
    specialties?: string[];
    visible: boolean;
    isActive: boolean;
    staffProfile?: { color?: string | null; initials?: string | null } | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}): UserDto {
    return {
        id: toId(doc._id),
        email: doc.email,
        role: doc.role,
        firstName: doc.firstName,
        lastName: doc.lastName,
        phone: doc.phone,
        note: doc.note ?? undefined,
        specialties: doc.specialties ?? [],
        visible: doc.visible,
        isActive: doc.isActive,
        staffProfile: doc.staffProfile
            ? {
                  color: doc.staffProfile.color ?? undefined,
                  initials: doc.staffProfile.initials ?? undefined,
              }
            : undefined,
        createdAt: toIso(doc.createdAt),
        updatedAt: toIso(doc.updatedAt),
    };
}
