'use client';

import { useSalonTranslations } from '@i18n/use-app-translations';

export function PhilosophySection() {
    const t = useSalonTranslations();

    return (
        <section id="about" className="py-24 md:py-32 relative overflow-hidden">
            <div className="grid items-center gap-12 md:grid-cols-12">
                <div className="order-2 md:col-span-5 md:col-start-2 md:order-1 animate-fade-in-up animation-delay-150 flex justify-center">
                    <div className="relative w-full max-w-105">
                        <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-secondary/15 p-2 bg-neutral-50/50 backdrop-blur-sm shadow-[0_24px_50px_rgba(43,38,35,0.06)] transition-all duration-700 hover:border-secondary/40 hover:shadow-[0_32px_75px_rgba(43,38,35,0.14)] luxury-frame">
                            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/salon/about.jpg"
                                    alt=""
                                    className="h-full w-full object-cover transition-transform duration-[2.5s] hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>
                        {/* Decorative background border offset to the left */}
                        <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-3xl border border-secondary/10 pointer-events-none hidden sm:block -translate-x-8 translate-y-2" />
                    </div>
                </div>
                <div className="order-1 mb-4 md:col-span-6 md:col-start-8 md:order-2 md:mb-0 animate-fade-in-up">
                    <span className="mb-4 block font-sans text-xs font-semibold tracking-[0.3em] text-muted uppercase">
                        {t('philosophy.eyebrow')}
                    </span>
                    <h2 className="mb-6 font-display font-normal text-4xl leading-tight text-primary md:text-5xl tracking-wide max-w-lg">
                        {t('philosophy.title')}
                    </h2>
                    <p className="mb-8 font-sans text-base leading-relaxed text-muted/90 max-w-md">
                        {t('philosophy.body')}
                    </p>
                    <a
                        href="#contact"
                        className="group inline-flex items-center gap-2 border-b border-primary/45 pb-1 font-sans text-xs font-semibold tracking-wider text-primary uppercase transition-all duration-300 hover:border-primary hover:text-primary hover:translate-x-0.5"
                    >
                        {t('philosophy.cta')}
                    </a>
                </div>
            </div>
        </section>
    );
}
