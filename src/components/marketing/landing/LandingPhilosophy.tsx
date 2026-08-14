'use client';

import Image from 'next/image';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { FadeIn, PillLink } from '@components/marketing/landing';
import {
    landingBody,
    landingBleedWhite,
    landingDesktopOnly,
    landingMobileOnly,
    landingTitle,
} from '@components/marketing/landing/styles';

export function LandingPhilosophy() {
    const t = useSalonTranslations();

    return (
        <section
            id="philosophy"
            className={cn(
                'grid items-center gap-8 py-12 md:grid-cols-12 md:gap-6 md:py-24',
                landingBleedWhite,
            )}
        >
            {/* Visual Imagery */}
            <FadeIn className="relative order-2 md:order-0 md:col-span-7 md:pb-20">
                {/* Mobile Layered Editorial Frame */}
                <div className={`relative mx-auto w-full max-w-sm px-2 ${landingMobileOnly}`}>
                    {/* Main Image Frame */}
                    <div className="relative aspect-3/4 w-full overflow-hidden rounded-4xl border border-stone-200/80 bg-white/60 p-2 shadow-[0_16px_36px_-10px_rgba(58,48,39,0.12)]">
                        <div className="relative h-full w-full overflow-hidden rounded-3xl">
                            <Image
                                src="/salon/figma/philosophy-main.png"
                                alt=""
                                fill
                                sizes="(max-width: 768px) 90vw, 400px"
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                priority
                            />
                        </div>
                    </div>

                    {/* Floating Inset Badge Thumbnail on Mobile */}
                    <div className="absolute -bottom-4 -right-1 z-20 aspect-square w-32 overflow-hidden rounded-2xl border-2 border-white bg-cream p-1.5 shadow-xl">
                        <div className="relative h-full w-full overflow-hidden rounded-xl">
                            <Image
                                src="/salon/figma/philosophy-inset.png"
                                alt=""
                                fill
                                sizes="120px"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Floating luxury pill badge */}
                    <div className="absolute -top-3 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3.5 py-1.5 shadow-md backdrop-blur-md">
                        <Sparkles className="size-3 text-nude" />
                        <span className="font-sans text-xs font-semibold text-third tracking-wide">
                            The Averie Ritual
                        </span>
                    </div>
                </div>

                {/* Desktop Collage */}
                <div
                    className={`relative mx-auto aspect-4/4.25 w-full max-w-129.5 ${landingDesktopOnly}`}
                >
                    <div className="pointer-events-none absolute -right-50 -top-44 z-10 aspect-3/4 w-[80%]">
                        <Image
                            src="/salon/figma/hero01.svg"
                            alt=""
                            sizes="300px"
                            width={450}
                            height={750}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="pointer-events-none absolute -bottom-30 -left-40 z-10 aspect-3/4 w-[80%]">
                        <Image
                            src="/salon/figma/hero02.svg"
                            alt=""
                            width={450}
                            height={750}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="relative z-20 flex h-full w-full items-center justify-center">
                        <Image
                            src="/salon/figma/philosophy-main.png"
                            alt=""
                            width={400}
                            height={750}
                            className="object-cover transition-transform duration-700 hover:scale-[1.03] cursor-pointer"
                            priority
                        />
                    </div>
                    <div className="absolute -bottom-16 -right-10 z-30 aspect-[4/4.6] w-[50%]">
                        <Image
                            src="/salon/figma/philosophy-inset.png"
                            alt=""
                            width={300}
                            height={750}
                            className="object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
                        />
                    </div>
                </div>
            </FadeIn>

            {/* Text Content */}
            <FadeIn
                delay={0.1}
                className="order-1 flex flex-col items-center text-center md:items-start md:text-left md:order-0 md:col-span-5 md:max-w-md md:justify-self-end md:pr-8"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-stone-300/60 bg-stone-100/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    <span>{t('landing.philosophy.eyebrow')}</span>
                </div>

                <h2 className={`mt-3 ${landingTitle}`}>{t('landing.philosophy.title')}</h2>

                <p
                    className={`mt-4 max-w-lg ${landingBody} text-secondary-600 md:mt-6 md:text-justify`}
                >
                    {t('landing.philosophy.body')}
                </p>

                {/* Mobile Luxury Hallmarks */}
                <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center md:hidden">
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-250/60 bg-white/70 px-3 py-2 text-xs font-medium text-stone-700 shadow-2xs">
                        <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                        <span>100% Clean & Medical-Grade Sanitation</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-250/60 bg-white/70 px-3 py-2 text-xs font-medium text-stone-700 shadow-2xs">
                        <HeartHandshake className="size-3.5 text-nude shrink-0" />
                        <span>Artisan Care & Non-Toxic Gels</span>
                    </div>
                </div>

                <PillLink href="#services" className="mt-7 w-full sm:w-auto md:w-40">
                    {t('landing.philosophy.cta')}
                </PillLink>
            </FadeIn>
        </section>
    );
}
