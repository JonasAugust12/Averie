import type { DayOffScope } from '@typings/salon/common.type';

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

export interface ScheduleSettingsDto {
    id: string;
    allowStaffSelection: boolean;
    workingWeekdays: number[];
    periodSlots: PeriodSlotsDto;
    dayOffs: DayOffDto[];
    updatedAt: string;
}
