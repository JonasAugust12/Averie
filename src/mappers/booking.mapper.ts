import { toId, toIso, toOptionalIso, type IdLike } from '@mappers/shared.mapper';
import type { BookingDto } from '@typings/salon/booking.type';

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

/** Map booking doc to schedule.util compatible shape for slot computation */
export function bookingForScheduleUtil(doc: {
    date: string;
    time: string;
    status: 'upcoming' | 'cancelled';
}) {
    return {
        id: '',
        reference: '',
        serviceId: '',
        staffId: 'any' as const,
        date: doc.date,
        time: doc.time,
        durationMin: 0,
        price: 0,
        customer: { firstName: '', lastName: '', phone: '' },
        status: doc.status === 'cancelled' ? ('cancelled' as const) : ('upcoming' as const),
    };
}
