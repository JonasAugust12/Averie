'use client';

import { useSalonTranslations } from '@i18n/use-app-translations';

export function PhilosophySection() {
    const t = useSalonTranslations();

    return (
        <section id="about" className="py-24 md:py-32">
            <div className="grid items-center gap-12 md:grid-cols-12">
                <div className="order-2 md:col-span-5 md:col-start-2 md:order-1">
                    <div className="relative aspect-square overflow-hidden rounded-full border-8 border-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/salon/about.jpg" alt="" className="h-full w-full object-cover" />
                    </div>
                </div>
                <div className="order-1 mb-4 md:col-span-5 md:col-start-8 md:order-2 md:mb-0">
                    <span className="mb-4 block font-sans text-xs font-semibold tracking-widest text-muted uppercase">
                        {t('philosophy.eyebrow')}
                    </span>
                    <h2 className="mb-6 font-display text-2xl text-primary md:text-[28px] md:leading-9">
                        {t('philosophy.title')}
                    </h2>
                    <p className="mb-6 font-sans text-base leading-6 text-muted">
                        {t('philosophy.body')}
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 border-b border-primary pb-1 font-sans text-sm font-medium text-primary transition-colors hover:border-muted hover:text-muted"
                    >
                        {t('philosophy.cta')}
                    </a>
                </div>
            </div>
        </section>
    );
}
