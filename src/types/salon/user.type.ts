import type { UserRole } from '@typings/salon/common.type';

export interface StaffProfileDto {
    color?: string;
    initials?: string;
}

export interface UserDto {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone: string;
    note?: string;
    specialties: string[];
    visible: boolean;
    isActive: boolean;
    staffProfile?: StaffProfileDto;
    createdAt: string;
    updatedAt: string;
}
