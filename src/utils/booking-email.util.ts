import { Service } from '@models/service.model';
import type { EnrichedBookingEmailContext } from '@email/types';

type BookingEmailSource = {
    reference: string;
    date: string;
    time: string;
    totalEstimatedMinutes: number;
    totalPrice: number;
    serviceIds: unknown[];
    customer: {
        firstName: string;
        lastName: string;
    };
};

export async function buildBookingEmailContext(
    doc: BookingEmailSource,
): Promise<EnrichedBookingEmailContext> {
    const serviceDocs = await Service.find({ _id: { $in: doc.serviceIds } })
        .select('name estimatedMinutes')
        .lean();

    const serviceById = new Map(serviceDocs.map((service) => [String(service._id), service]));

    const services = doc.serviceIds
        .map((id) => serviceById.get(String(id)))
        .filter((service): service is (typeof serviceDocs)[number] => Boolean(service))
        .map((service) => ({
            name: service.name,
            estimatedMinutes: service.estimatedMinutes,
        }));

    return {
        reference: doc.reference,
        date: doc.date,
        time: doc.time,
        totalEstimatedMinutes: doc.totalEstimatedMinutes,
        totalPrice: doc.totalPrice,
        customer: {
            firstName: doc.customer.firstName,
            lastName: doc.customer.lastName,
        },
        services,
    };
}

export const buildBookingEmailContextFromLean = buildBookingEmailContext;
