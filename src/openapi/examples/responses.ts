import { adminKpiExample } from '@openapi/examples/admin.examples';
import {
    bookingExample,
    bookingSlotsDataExample,
    paginatedBookingsDataExample,
} from '@openapi/examples/booking.examples';
import { healthDataExample } from '@openapi/examples/health.examples';
import { scheduleSettingsExample } from '@openapi/examples/schedule.examples';
import {
    serviceCategoryWithServicesExample,
    serviceGelExample,
    serviceManicureExample,
} from '@openapi/examples/service.examples';
import { staffUserExample } from '@openapi/examples/user.examples';

/** Full `{ status, message, data }` examples keyed by OpenAPI response schema name. */
export const openApiResponseExamples = {
    healthApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: healthDataExample,
    },
    serviceCategoriesApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: [serviceCategoryWithServicesExample],
    },
    servicesApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: [serviceManicureExample, serviceGelExample],
    },
    staffListApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: [staffUserExample],
    },
    scheduleSettingsApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: scheduleSettingsExample,
    },
    bookingSlotsApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: bookingSlotsDataExample,
    },
    bookingByReferenceApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: bookingExample,
    },
    bookingDetailApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: bookingExample,
    },
    bookingsListApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: paginatedBookingsDataExample,
    },
    staffBookingsApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: [bookingExample],
    },
    adminKpisApiResponseSchema: {
        status: 200,
        message: 'OK',
        data: adminKpiExample,
    },
    apiErrorResponseSchema: {
        status: 400,
        message: 'Validation failed',
        data: null,
    },
} as const;

export type OpenApiResponseExampleKey = keyof typeof openApiResponseExamples;
