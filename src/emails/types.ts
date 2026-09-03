import type { EmailColorTheme, EmailDesignVariant } from '@email/themes';

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

export type BookingEmailRenderOptions = {
    introMessage?: string;
    design?: EmailDesignVariant;
    theme?: EmailColorTheme;
};
