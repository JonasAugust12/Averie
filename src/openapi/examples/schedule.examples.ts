import { EXAMPLE_DAY_OFF_ID, EXAMPLE_SETTINGS_ID, EXAMPLE_TIMESTAMP } from '@openapi/examples/ids';
import { defaultWeekdaySchedules } from '@utils/schedule.util';

export const weekdaySchedulesExample = defaultWeekdaySchedules();

export const dayOffExample = {
    id: EXAMPLE_DAY_OFF_ID,
    date: '2026-12-25',
    scope: 'full' as const,
};

export const scheduleSettingsExample = {
    id: EXAMPLE_SETTINGS_ID,
    allowStaffSelection: true,
    allowGuestLanguageSwitch: true,
    weekdaySchedules: weekdaySchedulesExample,
    dayOffs: [
        dayOffExample,
        { id: '507f1f77bcf86cd799439020', date: '2026-01-01', scope: 'full' as const },
    ],
    updatedAt: EXAMPLE_TIMESTAMP,
};
