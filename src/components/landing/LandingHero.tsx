'use client';

import Image from 'next/image';
import { Star, Phone } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { FadeIn, LandingBubbles, PillLink } from '@components/landing';
import {
    landingBody,
    landingDesktopOnly,
    landingEyebrow,
    landingImage,
    landingImageFrame,
    landingMobileOnly,
    landingStaticText,
} from '@components/landing/styles';

export function LandingHero() {
    const t = useSalonTranslations();

    return (
        <section className="relative z-20 py-8 sm:py-12 md:py-16">
            <LandingBubbles variant="hero" />
            <div className="relative z-10 grid items-center gap-8 md:grid-cols-12 md:gap-8">
                {/* Text Content */}
                <FadeIn className="flex flex-col items-center text-center md:items-start md:text-left md:col-span-5">
                    {/* Eyebrow badge */}
                    <div className={landingEyebrow}>
                        <span>{t('landing.hero.eyebrow')}</span>
                    </div>

                    <h1
                        className={`mt-4 font-display text-4xl font-semibold uppercase leading-[1.08] tracking-tight text-nude sm:text-5xl md:text-6xl lg:text-7xl xl:text-hero ${landingStaticText}`}
                    >
                        {t('landing.hero.title')}
                    </h1>

                    <p className={`mt-3.5 max-w-md md:mt-6 ${landingBody} text-secondary-600`}>
                        {t('landing.hero.body')}
                    </p>

                    {/* Mobile CTAs & Trust Badge */}
                    <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
                        <PillLink
                            href="/book"
                            className="flex items-center justify-center gap-2 sm:max-w-none"
                        >
                            <span>{t('landing.hero.cta')}</span>
                        </PillLink>
                        <PillLink
                            href="tel:+17819231955"
                            variant="outline"
                            className="inline-flex h-12.5 w-full items-center justify-center gap-2 rounded-full border border-third/30 bg-white/60 px-6 font-sans text-sm font-medium tracking-wide text-third backdrop-blur-xs transition-colors sm:w-auto md:hidden"
                        >
                            <Phone className="size-4" />
                            <span>781-923-1955</span>
                        </PillLink>
                    </div>

                    {/* Social proof rating */}
                    <div
                        className={`mt-5 flex items-center gap-2 text-xs font-medium text-stone-600 ${landingStaticText}`}
                    >
                        <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="size-3.5 fill-current" />
                            ))}
                        </div>
                        <span className="font-semibold text-stone-800">5.0</span>
                        <span className="text-stone-400">•</span>
                        <span>Cohasset, MA</span>
                    </div>
                </FadeIn>

                {/* Visual Imagery */}
                <FadeIn delay={0.12} className="md:col-span-7">
                    {/* Mobile Luxury Frame */}
                    <div className={`relative mx-auto w-full max-w-sm ${landingMobileOnly}`}>
                        {/* Soft ambient background glow */}
                        <div className="absolute -inset-2 -z-10 rounded-[2.5rem] bg-linear-to-tr from-nude/25 via-secondary/20 to-cream/50 blur-xl" />

                        {/* Main framed photo */}
                        <div className="relative aspect-3/4 w-full overflow-hidden rounded-4xl border border-white/80 bg-white/50 p-2 shadow-[0_20px_40px_-15px_rgba(58,48,39,0.18)]">
                            <div
                                className={`relative h-full w-full overflow-hidden rounded-3xl ${landingImageFrame}`}
                            >
                                <Image
                                    src="/salon/figma/hero.png"
                                    alt=""
                                    fill
                                    draggable={false}
                                    sizes="(max-width: 768px) 90vw, 500px"
                                    className={`translate-x-[4%] object-cover transition-transform duration-1000 group-hover:scale-105 ${landingImage}`}
                                    priority
                                />
                            </div>

                            {/* Floating luxury badge */}
                            <div
                                className={`absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-md backdrop-blur-md ${landingStaticText}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-sans text-xs font-semibold tracking-wide text-third">
                                        Sanctuary of Calm
                                    </span>
                                </div>
                                <span className="font-sans text-[11px] font-medium text-nude uppercase tracking-wider">
                                    Est. Cohasset
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Editorial Collage */}
                    <div
                        className={`relative mx-auto h-150 w-full max-w-125 ${landingDesktopOnly}`}
                    >
                        <div className="pointer-events-none absolute -right-40 -top-30 z-10 aspect-3/4 w-[80%] rounded-card">
                            <Image
                                src="/salon/figma/hero01.svg"
                                alt=""
                                draggable={false}
                                sizes="300px"
                                width={450}
                                height={750}
                                className={`h-full w-full object-cover ${landingImage}`}
                            />
                        </div>
                        <div className="pointer-events-none absolute -bottom-18 -left-40 z-10 aspect-3/4 w-[80%] rounded-card">
                            <Image
                                src="/salon/figma/hero02.svg"
                                alt=""
                                draggable={false}
                                sizes="300px"
                                width={450}
                                height={750}
                                className={`h-full w-full object-cover ${landingImage}`}
                            />
                        </div>
                        <div
                            className={`absolute left-1/2 top-1/2 z-20 aspect-3/4 w-[68%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card ${landingImageFrame}`}
                        >
                            <Image
                                src="/salon/figma/hero.png"
                                alt=""
                                draggable={false}
                                sizes="300px"
                                width={500}
                                height={750}
                                className={`h-full w-full object-cover transition-transform duration-2000 group-hover:scale-105 ${landingImage}`}
                                priority
                            />
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
