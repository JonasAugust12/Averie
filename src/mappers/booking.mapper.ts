import { toId, toIso, toOptionalIso, type IdLike } from '@mappers/shared.mapper';
import type {
    BookingDto,
    BookingListItemDto,
    BookingServiceSummaryDto,
    BookingStaffSummaryDto,
    StaffServiceMaps,
} from '@typings/booking.type';

export function serializeBooking(doc: {
    _id: IdLike;
    reference: string;
    serviceIds: IdLike[];
    staffPreference: 'any' | 'specific';
    staffId?: IdLike | null;
    date: string;
    time: string;
    totalEstimatedMinutes: number;
    totalPrice: number;
    customer: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string | null;
        note?: string | null;
    };
    status: 'upcoming' | 'cancelled';
    cancelledAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}): BookingDto {
    return {
        id: toId(doc._id),
        reference: doc.reference,
        serviceIds: doc.serviceIds.map(toId),
        staffPreference: doc.staffPreference,
        staffId: doc.staffId ? toId(doc.staffId) : undefined,
        date: doc.date,
        time: doc.time,
        totalEstimatedMinutes: doc.totalEstimatedMinutes,
        totalPrice: doc.totalPrice,
        customer: {
            firstName: doc.customer.firstName,
            lastName: doc.customer.lastName,
            phone: doc.customer.phone,
            email: doc.customer.email ?? undefined,
            note: doc.customer.note ?? undefined,
        },
        status: doc.status,
        cancelledAt: toOptionalIso(doc.cancelledAt),
        createdAt: toIso(doc.createdAt),
        updatedAt: toIso(doc.updatedAt),
    };
}

function resolveStaff(
    doc: { staffPreference: 'any' | 'specific'; staffId?: IdLike | null },
    staffById: Map<string, BookingStaffSummaryDto>,
): BookingStaffSummaryDto | null {
    if (doc.staffPreference === 'any' || !doc.staffId) {
        return null;
    }
    return staffById.get(toId(doc.staffId)) ?? null;
}

function resolveServices(
    serviceIds: IdLike[],
    serviceById: Map<string, BookingServiceSummaryDto>,
): BookingServiceSummaryDto[] {
    return serviceIds
        .map((id) => serviceById.get(toId(id)))
        .filter((service): service is BookingServiceSummaryDto => Boolean(service));
}

export function serializeBookingListItem(
    doc: Parameters<typeof serializeBooking>[0],
    maps: StaffServiceMaps,
): BookingListItemDto {
    const base = serializeBooking(doc);
    return {
        ...base,
        staff: resolveStaff(doc, maps.staffById),
        services: resolveServices(doc.serviceIds, maps.serviceById),
    };
}

/** Map booking doc to schedule.util compatible shape for slot computation */
export function bookingForScheduleUtil(doc: {
    date: string;
    time: string;
    status: 'upcoming' | 'cancelled';
    staffId?: unknown;
    staffPreference?: 'any' | 'specific';
    totalEstimatedMinutes?: number;
}) {
    return {
        date: doc.date,
        time: doc.time,
        status: doc.status,
        staffPreference: doc.staffPreference ?? ('any' as const),
        staffId: doc.staffId ? String(doc.staffId) : undefined,
        totalEstimatedMinutes: doc.totalEstimatedMinutes,
    };
}
