import type { DayOffScope } from '@typings/salon-common.type';

export interface DayOffDto {
    id: string;
    date: string;
    scope: DayOffScope;
}

export interface PeriodSlotsDto {
    morning: string[];
    afternoon: string[];
    evening: string[];
}

export interface WeekdayScheduleDto {
    weekday: number;
    isOpen: boolean;
    periodSlots: PeriodSlotsDto;
}

export interface ScheduleSettingsDto {
    id: string;
    allowStaffSelection: boolean;
    allowGuestLanguageSwitch: boolean;
    bookingEnabled: boolean;
    weekdaySchedules: WeekdayScheduleDto[];
    dayOffs: DayOffDto[];
    updatedAt: string;
}
