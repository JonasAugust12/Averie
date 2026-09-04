'use client';

import { AppShell } from '@components/layout';
import {
    LandingHeader,
    LandingHero,
    LandingPromotion,
    LandingPhilosophy,
    LandingServices,
    LandingPriceList,
    LandingTestimonials,
    LandingSearchBooking,
    LandingHoursCta,
    LandingFooter,
} from '@components/landing';
import type { ServiceCategoryWithServicesDto } from '@services/service-catalog.service';

interface LandingPageViewProps {
    catalog: ServiceCategoryWithServicesDto[];
}

export function LandingPageView({ catalog }: LandingPageViewProps) {
    return (
        <AppShell maxWidth="landing" className="bg-cream pb-0" contentClassName="pt-0">
            <LandingHeader />
            <main>
                <LandingHero />
                <LandingPromotion />
                <LandingPhilosophy />
                <LandingServices />
                <LandingPriceList categories={catalog} />
                <LandingTestimonials />
                <LandingSearchBooking />
                <LandingHoursCta />
            </main>
            <LandingFooter />
        </AppShell>
    );
}
