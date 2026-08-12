'use client';

import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { HeroSection } from './HeroSection';
import { PhilosophySection } from './PhilosophySection';
import { ServicesPreview } from './ServicesPreview';
import { BrandMoment } from './BrandMoment';
import { BookingCtaSection } from './BookingCtaSection';
import { ContactSection } from './ContactSection';
import { TestimonialsSection } from './TestimonialsSection';
import { AppShell } from '@components/layout';

export function HomePageView() {
    return (
        <AppShell className="pb-0" contentClassName="pt-0">
            <SiteHeader />
            <main>
                <HeroSection />
                <PhilosophySection />
                <ServicesPreview />
                <TestimonialsSection />
                <BrandMoment />
                <BookingCtaSection />
                <ContactSection />
            </main>
            <SiteFooter />
        </AppShell>
    );
}
