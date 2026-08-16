import { toId, toIso, type IdLike } from '@mappers/shared.mapper';
import type { ScheduleSettingsDto, WeekdayScheduleDto } from '@typings/salon/schedule.type';
import { defaultWeekdaySchedules, normalizeWeekdaySchedules } from '@utils/schedule.util';

type PeriodSlotsDoc = {
    morning: string[];
    afternoon: string[];
    evening: string[];
};

type WeekdayScheduleDoc = {
    weekday: number;
    isOpen: boolean;
    periodSlots: PeriodSlotsDoc;
};

function serializeWeekdaySchedules(
    weekdaySchedules: WeekdayScheduleDoc[] | undefined,
    legacy?: {
        workingWeekdays?: number[];
        periodSlots?: PeriodSlotsDoc;
    },
): WeekdayScheduleDto[] {
    return normalizeWeekdaySchedules(weekdaySchedules, legacy);
}

export function serializeScheduleSettings(doc: {
    _id: IdLike;
    allowStaffSelection: boolean;
    weekdaySchedules?: WeekdayScheduleDoc[];
    workingWeekdays?: number[];
    periodSlots?: PeriodSlotsDoc;
    dayOffs: Array<{ _id?: IdLike; date: string; scope: string }>;
    updatedAt?: Date | string;
}): ScheduleSettingsDto {
    return {
        id: toId(doc._id),
        allowStaffSelection: doc.allowStaffSelection,
        weekdaySchedules: serializeWeekdaySchedules(doc.weekdaySchedules, {
            workingWeekdays: doc.workingWeekdays,
            periodSlots: doc.periodSlots,
        }),
        dayOffs: doc.dayOffs.map((off) => ({
            id: toId(off._id),
            date: off.date,
            scope: off.scope as ScheduleSettingsDto['dayOffs'][number]['scope'],
        })),
        updatedAt: toIso(doc.updatedAt),
    };
}

export function scheduleSettingsForUtil(doc: ScheduleSettingsDto) {
    return {
        weekdaySchedules: doc.weekdaySchedules,
        dayOffs: doc.dayOffs,
        allowStaffSelection: doc.allowStaffSelection,
    };
}

export function weekdaySchedulesForSeed(): WeekdayScheduleDto[] {
    return defaultWeekdaySchedules();
}
