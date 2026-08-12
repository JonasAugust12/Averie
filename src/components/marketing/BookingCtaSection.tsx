'use client';

import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';

export function BookingCtaSection() {
    const t = useSalonTranslations();

    return (
        <section
            id="booking"
            className="relative overflow-hidden bg-linear-to-b from-background to-secondary-50/70 py-24 md:py-32"
        >
            <div className="mx-auto max-w-3xl text-center relative z-10 animate-fade-in-up">
                <CalendarCheck className="mx-auto mb-6 h-10 w-10 text-muted/80 animate-pulse" />
                <h2 className="mb-6 font-display font-normal text-4xl text-primary md:text-5xl lg:text-6xl tracking-wide">
                    {t('bookingCta.title')}
                </h2>
                <p className="mb-12 font-sans text-base text-muted/90 max-w-xl mx-auto">
                    {t('bookingCta.body')}
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                        href="tel:7819231955"
                        className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-9 py-4 font-sans text-xs font-semibold tracking-[0.2em] text-neutral uppercase transition-all duration-300 hover:bg-muted hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(43,38,35,0.18)]"
                    >
                        {t('bookingCta.call')}
                    </a>
                    <Link
                        href="/book"
                        className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border px-9 py-4 font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-neutral hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(43,38,35,0.12)]"
                    >
                        {t('bookingCta.book')}
                    </Link>
                </div>
            </div>
            {/* Ambient Ambient Glow Blobs */}
            <div className="absolute -bottom-16 -right-16 z-0 h-96 w-96 rounded-full bg-secondary/15 opacity-40 blur-3xl pointer-events-none" />
            <div className="absolute -top-16 -left-16 z-0 h-80 w-80 rounded-full bg-tertiary/15 opacity-30 blur-3xl pointer-events-none" />
        </section>
    );
}
