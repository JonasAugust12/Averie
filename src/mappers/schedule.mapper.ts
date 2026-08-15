import { toId, toIso, type IdLike } from '@mappers/shared.mapper';
import type { ScheduleSettingsDto } from '@typings/salon/schedule.type';

export function serializeScheduleSettings(doc: {
    _id: IdLike;
    allowStaffSelection: boolean;
    workingWeekdays: number[];
    periodSlots: {
        morning: string[];
        afternoon: string[];
        evening: string[];
    };
    dayOffs: Array<{ _id?: IdLike; date: string; scope: string }>;
    updatedAt?: Date | string;
}): ScheduleSettingsDto {
    return {
        id: toId(doc._id),
        allowStaffSelection: doc.allowStaffSelection,
        workingWeekdays: doc.workingWeekdays,
        periodSlots: doc.periodSlots,
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
        workingWeekdays: doc.workingWeekdays,
        periodSlots: doc.periodSlots,
        dayOffs: doc.dayOffs,
        allowStaffSelection: doc.allowStaffSelection,
    };
}
