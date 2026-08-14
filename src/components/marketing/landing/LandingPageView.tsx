'use client';

import { AppShell } from '@components/layout';
import {
    LandingHeader,
    LandingHero,
    LandingPhilosophy,
    LandingServices,
    LandingPricing,
    LandingProducts,
    LandingTestimonials,
    LandingSearchBooking,
    LandingHoursCta,
    LandingFooter,
} from '@components/marketing/landing';

export function LandingPageView() {
    return (
        <AppShell maxWidth="landing" className="bg-cream pb-0" contentClassName="pt-0">
            <LandingHeader />
            <main>
                <LandingHero />
                <LandingPhilosophy />
                <LandingServices />
                <LandingPricing />
                <LandingProducts />
                <LandingTestimonials />
                <LandingSearchBooking />
                <LandingHoursCta />
            </main>
            <LandingFooter />
        </AppShell>
    );
}
