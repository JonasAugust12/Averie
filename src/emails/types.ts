export interface BookingEmailServiceLine {
    name: string;
    estimatedMinutes: number;
}

export interface EnrichedBookingEmailContext {
    reference: string;
    date: string;
    time: string;
    totalEstimatedMinutes: number;
    totalPrice: number;
    customer: {
        firstName: string;
        lastName: string;
    };
    services: BookingEmailServiceLine[];
}
