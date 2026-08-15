import { EXAMPLE_DAY_OFF_ID, EXAMPLE_SETTINGS_ID, EXAMPLE_TIMESTAMP } from '@openapi/examples/ids';

export const periodSlotsExample = {
    morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'],
    afternoon: ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'],
    evening: ['05:00 PM', '05:30 PM', '06:00 PM'],
};

export const dayOffExample = {
    id: EXAMPLE_DAY_OFF_ID,
    date: '2026-12-25',
    scope: 'full' as const,
};

export const scheduleSettingsExample = {
    id: EXAMPLE_SETTINGS_ID,
    allowStaffSelection: true,
    workingWeekdays: [1, 2, 3, 4, 5, 6],
    periodSlots: periodSlotsExample,
    dayOffs: [
        dayOffExample,
        { id: '507f1f77bcf86cd799439020', date: '2026-01-01', scope: 'full' as const },
    ],
    updatedAt: EXAMPLE_TIMESTAMP,
};
