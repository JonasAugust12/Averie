import { serializeBookingListItem } from '@mappers/booking.mapper';
import { Service } from '@models/service.model';
import { User } from '@models/user.model';
import type {
    BookingListItemDto,
    BookingServiceSummaryDto,
    BookingStaffSummaryDto,
    StaffServiceMaps,
} from '@typings/booking.type';

export async function loadStaffServiceMaps(): Promise<StaffServiceMaps> {
    const [staffDocs, serviceDocs] = await Promise.all([
        User.find({ role: 'staff' }).select('firstName lastName').lean(),
        Service.find().select('name estimatedMinutes').lean(),
    ]);

    const staffById = new Map<string, BookingStaffSummaryDto>();
    for (const doc of staffDocs) {
        staffById.set(String(doc._id), {
            id: String(doc._id),
            firstName: doc.firstName,
            lastName: doc.lastName,
        });
    }

    const serviceById = new Map<string, BookingServiceSummaryDto>();
    for (const doc of serviceDocs) {
        serviceById.set(String(doc._id), {
            id: String(doc._id),
            name: doc.name,
            estimatedMinutes: doc.estimatedMinutes,
        });
    }

    return { staffById, serviceById };
}

type BookingDoc = Parameters<typeof serializeBookingListItem>[0];

export function enrichBookingListItem(doc: BookingDoc, maps: StaffServiceMaps): BookingListItemDto {
    return serializeBookingListItem(doc, maps);
}

export function enrichBookingListItems(
    docs: BookingDoc[],
    maps: StaffServiceMaps,
): BookingListItemDto[] {
    return docs.map((doc) => serializeBookingListItem(doc, maps));
}
