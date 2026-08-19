import { connectToDatabase } from '@libs/mongodb';
import {
    bookingForScheduleUtil,
    scheduleSettingsForUtil,
    serializeScheduleSettings,
} from '@mappers';
import { Booking } from '@models/booking.model';
import { SalonSettings, type SalonSettingsDocument } from '@models/salon-settings.model';
import type { TimeSlotDto } from '@typings/booking.type';
import type { ScheduleSettingsDto } from '@typings/schedule-settings.type';
import { defaultWeekdaySchedules } from '@utils/schedule.util';
import { getAvailableSlotsForDate } from '@utils/schedule.util';

type LegacySettingsDoc = {
    workingWeekdays?: unknown;
    periodSlots?: unknown;
};

async function removeLegacyScheduleFields(doc: SalonSettingsDocument & LegacySettingsDoc) {
    if (doc.workingWeekdays === undefined && doc.periodSlots === undefined) {
        return;
    }

    await SalonSettings.collection.updateOne(
        { _id: doc._id },
        { $unset: { workingWeekdays: '', periodSlots: '' } },
    );
}

export async function getSalonSettingsDocument() {
    await connectToDatabase();
    const existing = await SalonSettings.findOne().lean();
    if (existing) {
        await removeLegacyScheduleFields(existing);
        return existing;
    }

    const created = await SalonSettings.create({
        allowStaffSelection: true,
        allowGuestLanguageSwitch: true,
        weekdaySchedules: defaultWeekdaySchedules(),
        dayOffs: [],
    });

    return created.toObject();
}

export async function getScheduleSettingsDto(): Promise<ScheduleSettingsDto> {
    const settings = await getSalonSettingsDocument();
    return serializeScheduleSettings(settings);
}

export async function getAvailableSlotsForDateServer(
    date: string,
    options?: {
        staffPreference?: 'any' | 'specific';
        staffId?: string;
    },
): Promise<TimeSlotDto[]> {
    const settingsDoc = await getSalonSettingsDocument();
    const settingsDto = serializeScheduleSettings(settingsDoc);
    const settings = scheduleSettingsForUtil(settingsDto);

    await connectToDatabase();
    const bookings = await Booking.find({ date, status: 'upcoming' })
        .select('date time status staffId staffPreference totalEstimatedMinutes')

        .lean();

    const slots = getAvailableSlotsForDate(date, settings, bookings.map(bookingForScheduleUtil), {
        staffPreference: options?.staffPreference ?? 'any',
        staffId: options?.staffId ?? null,
    });

    return slots.map((slot) => ({
        id: slot.id,
        time: slot.time,
        available: slot.available,
        ...(slot.lockReason ? { lockReason: slot.lockReason } : {}),
    }));
}
