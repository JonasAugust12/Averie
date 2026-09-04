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

export const bookingStaffSummaryExample = {
    id: EXAMPLE_STAFF_ID,
    firstName: 'Alex',
    lastName: 'Nguyen',
};

export const bookingServiceSummaryExample = {
    id: EXAMPLE_SERVICE_MANICURE_ID,
    name: 'Classic Manicure',
    estimatedMinutes: 45,
};

export const bookingExample = {
    id: EXAMPLE_BOOKING_ID,
    reference: EXAMPLE_REFERENCE,
    serviceIds: [EXAMPLE_SERVICE_MANICURE_ID, EXAMPLE_SERVICE_GEL_ID],
    staffPreference: 'specific' as const,
    staffId: EXAMPLE_STAFF_ID,
    staff: bookingStaffSummaryExample,
    services: [
        bookingServiceSummaryExample,
        {
            id: EXAMPLE_SERVICE_GEL_ID,
            name: 'Gel Polish',
            estimatedMinutes: 50,
        },
    ],
    date: EXAMPLE_DATE,
    time: EXAMPLE_TIME,
    totalEstimatedMinutes: 95,
    totalPrice: 80,
    customer: bookingCustomerExample,
    status: 'upcoming' as const,
    displayStatus: 'upcoming' as const,
    emailNotifications: {
        confirmationSentAt: EXAMPLE_TIMESTAMP,
    },
    smsNotifications: {
        confirmationSentAt: EXAMPLE_TIMESTAMP,
    },
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
    stats: {
        total: 42,
        upcoming: 28,
        completed: 9,
        cancelled: 5,
    },
};
