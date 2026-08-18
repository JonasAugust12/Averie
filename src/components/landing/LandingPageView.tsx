'use client';

import { AppShell } from '@components/layout';
import {
    LandingHeader,
    LandingHero,
    LandingPromotion,
    LandingPhilosophy,
    LandingServices,
    LandingTestimonials,
    LandingSearchBooking,
    LandingHoursCta,
    LandingFooter,
} from '@components/landing';

export function LandingPageView() {
    return (
        <AppShell maxWidth="landing" className="bg-cream pb-0" contentClassName="pt-0">
            <LandingHeader />
            <main>
                <LandingHero />
                <LandingPromotion />
                <LandingPhilosophy />
                <LandingServices />
                <LandingTestimonials />
                <LandingSearchBooking />
                <LandingHoursCta />
            </main>
            <LandingFooter />
        </AppShell>
    );
}
