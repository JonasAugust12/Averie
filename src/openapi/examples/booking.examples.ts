import {
    EXAMPLE_BOOKING_ID,
    EXAMPLE_DATE,
    EXAMPLE_REFERENCE,
    EXAMPLE_SERVICE_GEL_ID,
    EXAMPLE_SERVICE_MANICURE_ID,
    EXAMPLE_STAFF_ID,
    EXAMPLE_TIME,
    EXAMPLE_TIMESTAMP,
} from '@openapi/examples/ids';

export const bookingCustomerExample = {
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '(555) 123-4567',
    email: 'jane.doe@example.com',
    note: 'Prefer gel finish',
};

export const bookingExample = {
    id: EXAMPLE_BOOKING_ID,
    reference: EXAMPLE_REFERENCE,
    serviceIds: [EXAMPLE_SERVICE_MANICURE_ID, EXAMPLE_SERVICE_GEL_ID],
    staffPreference: 'specific' as const,
    staffId: EXAMPLE_STAFF_ID,
    date: EXAMPLE_DATE,
    time: EXAMPLE_TIME,
    totalEstimatedMinutes: 95,
    totalPrice: 80,
    customer: bookingCustomerExample,
    status: 'upcoming' as const,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const timeSlotExample = {
    id: 'slot-0900',
    time: '09:00 AM',
    available: true,
};

export const bookingSlotsDataExample = {
    date: EXAMPLE_DATE,
    slots: [
        timeSlotExample,
        { id: 'slot-0930', time: '09:30 AM', available: false },
        { id: 'slot-1000', time: '10:00 AM', available: true },
    ],
};

export const paginatedBookingsDataExample = {
    items: [bookingExample],
    total: 1,
    page: 1,
    limit: 20,
};
