'use client';

import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';

export function BookingCtaSection() {
    const t = useSalonTranslations();

    return (
        <section id="booking" className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
                <CalendarCheck className="mx-auto mb-6 h-10 w-10 text-muted" />
                <h2 className="mb-6 font-display text-3xl text-primary md:text-[40px] md:leading-12">
                    {t('bookingCta.title')}
                </h2>
                <p className="mb-12 font-sans text-base text-muted">{t('bookingCta.body')}</p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                        href="tel:7819231955"
                        className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-8 py-4 font-sans text-sm font-medium tracking-widest text-neutral uppercase transition-opacity hover:opacity-80"
                    >
                        {t('bookingCta.call')}
                    </a>
                    <Link
                        href="/book"
                        className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border px-8 py-4 font-sans text-sm font-medium tracking-widest text-primary uppercase transition-colors hover:bg-neutral"
                    >
                        {t('bookingCta.book')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
