import { EXAMPLE_OBJECT_ID, EXAMPLE_STAFF_ID, EXAMPLE_TIMESTAMP } from '@openapi/examples/ids';

export const staffProfileExample = {
    color: '#C4A882',
    initials: 'AL',
};

export const staffUserExample = {
    id: EXAMPLE_STAFF_ID,
    email: 'anna.lee@averie.local',
    role: 'staff' as const,
    firstName: 'Anna',
    lastName: 'Lee',
    phone: '(555) 987-6543',
    note: 'Gel and nail art specialist',
    specialties: ['Gel Polish', 'Nail Art'],
    visible: true,
    isActive: true,
    staffProfile: staffProfileExample,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const adminUserExample = {
    id: EXAMPLE_OBJECT_ID,
    email: 'admin@averie.local',
    role: 'admin' as const,
    firstName: 'Salon',
    lastName: 'Admin',
    phone: '(000) 000-0000',
    specialties: [] as string[],
    visible: true,
    isActive: true,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};
