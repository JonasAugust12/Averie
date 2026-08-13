'use client';

import Image from 'next/image';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { FadeIn, PillLink } from './FadeIn';
import { landingBody, landingDesktopOnly, landingMobileOnly } from './styles';

export function LandingHero() {
    const t = useSalonTranslations();

    return (
        <section className="py-12 md:py-16">
            <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
                <FadeIn className="flex flex-col items-start md:col-span-5">
                    <p className="font-sans text-sm font-medium text-secondary-600">
                        {t('landing.hero.eyebrow')}
                    </p>
                    <h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-none text-nude sm:text-6xl md:text-7xl lg:text-hero">
                        {t('landing.hero.title')}
                    </h1>
                    <p className={`mt-6 max-w-md ${landingBody} text-secondary-600`}>
                        {t('landing.hero.body')}
                    </p>
                    <PillLink href="/book" className="mt-8">
                        {t('landing.hero.cta')}
                    </PillLink>
                </FadeIn>

                <FadeIn delay={0.12} className="md:col-span-7">
                    <div
                        className={`relative mx-auto aspect-3/4 w-full max-w-xs overflow-hidden rounded-card ${landingMobileOnly}`}
                    >
                        <Image
                            src="/salon/figma/hero.png"
                            alt=""
                            fill
                            sizes="(max-width: 768px) 90vw, 500px"
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div
                        className={`relative mx-auto h-150 w-full max-w-125 ${landingDesktopOnly}`}
                    >
                        <div className="pointer-events-none absolute -right-40 -top-30 z-10 aspect-3/4 w-[80%] rounded-card">
                            <Image
                                src="/salon/figma/hero01.svg"
                                alt=""
                                sizes="300px"
                                width={450}
                                height={750}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="pointer-events-none absolute -bottom-18 -left-40 z-10 aspect-3/4 w-[80%] rounded-card">
                            <Image
                                src="/salon/figma/hero02.svg"
                                alt=""
                                sizes="300px"
                                width={450}
                                height={750}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute left-1/2 top-1/2 z-20 aspect-3/4 w-[68%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card">
                            <Image
                                src="/salon/figma/hero.png"
                                alt=""
                                sizes="300px"
                                width={500}
                                height={750}
                                className="h-full w-full object-cover transition-transform duration-2000 hover:scale-105"
                                priority
                            />
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
