import { connectToDatabase } from '@libs/mongodb';
import {
    bookingForScheduleUtil,
    scheduleSettingsForUtil,
    serializeScheduleSettings,
} from '@mappers';
import { Booking } from '@models/booking.model';
import { SalonSettings } from '@models/salon-settings.model';
import type { TimeSlotDto } from '@typings/salon/booking.type';
import type { ScheduleSettingsDto } from '@typings/salon/schedule.type';
import { defaultPeriodSlots } from '@utils/schedule.util';
import { getAvailableSlotsForDate } from '@utils/schedule.util';

export async function getSalonSettingsDocument() {
    await connectToDatabase();
    const existing = await SalonSettings.findOne().lean();
    if (existing) {
        return existing;
    }

    const created = await SalonSettings.create({
        allowStaffSelection: true,
        workingWeekdays: [1, 2, 3, 4, 5, 6],
        periodSlots: defaultPeriodSlots(),
        dayOffs: [],
    });

    return created.toObject();
}

export async function getScheduleSettingsDto(): Promise<ScheduleSettingsDto> {
    const settings = await getSalonSettingsDocument();
    return serializeScheduleSettings(settings);
}

export async function getAvailableSlotsForDateServer(date: string): Promise<TimeSlotDto[]> {
    const settingsDoc = await getSalonSettingsDocument();
    const settingsDto = serializeScheduleSettings(settingsDoc);
    const settings = scheduleSettingsForUtil(settingsDto);

    await connectToDatabase();
    const bookings = await Booking.find({ date, status: 'upcoming' }).lean();

    const slots = getAvailableSlotsForDate(date, settings, bookings.map(bookingForScheduleUtil));

    return slots.map((slot) => ({
        id: slot.id,
        time: slot.time,
        available: slot.available,
    }));
}
