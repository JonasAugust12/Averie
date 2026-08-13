'use client';

import { AppShell } from '@components/layout';
import { LandingHeader } from './LandingHeader';
import { LandingHero } from './LandingHero';
import { LandingPhilosophy } from './LandingPhilosophy';
import { LandingServices } from './LandingServices';
import { LandingPricing } from './LandingPricing';
import { LandingProducts } from './LandingProducts';
import { LandingTestimonials } from './LandingTestimonials';
import { LandingHoursCta } from './LandingHoursCta';
import { LandingFooter } from './LandingFooter';

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
                <LandingHoursCta />
            </main>
            <LandingFooter />
        </AppShell>
    );
}
