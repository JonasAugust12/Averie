'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { FadeIn, PillLink } from '@components/marketing/landing';
import {
    landingDesktopOnly,
    landingMobileOnly,
    landingTitle,
} from '@components/marketing/landing/styles';

const rows = ['mani', 'gel', 'enhance', 'wax', 'facial'] as const;

export function LandingPricing() {
    const t = useSalonTranslations();

    return (
        <section
            id="pricing"
            className="grid items-center gap-8 py-12 md:grid-cols-12 md:gap-10 md:py-24"
        >
            {/* Text & Price List */}
            <FadeIn className="order-2 md:order-0 md:col-span-5">
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-nude/30 bg-nude/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nude">
                        <Sparkles className="size-3 text-nude" />
                        <span>Menu & Pricing</span>
                    </div>
                    <h2 className={`mt-3 ${landingTitle}`}>{t('landing.pricing.title')}</h2>
                </div>

                {/* Mobile Menu Bento Card */}
                <div className="mt-6 rounded-4xl border border-stone-200/80 bg-white/90 p-5 shadow-[0_16px_36px_-10px_rgba(58,48,39,0.08)] backdrop-blur-xs md:border-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
                    <ul className="space-y-4 md:space-y-5">
                        {rows.map((key) => (
                            <li
                                key={key}
                                className="group flex flex-col gap-1 border-b border-stone-100/80 pb-3.5 last:border-none last:pb-0 md:border-none md:pb-0"
                            >
                                <div className="flex items-baseline justify-between gap-2">
                                    <p className="font-sans text-base font-medium text-stone-850 md:text-lg lg:text-[19px] md:text-secondary-600">
                                        {t(`landing.pricing.rows.${key}.name`)}
                                    </p>
                                    {/* Dotted leader line on mobile */}
                                    <div className="grow border-b border-dotted border-stone-300/80 mx-2 mb-1 md:hidden" />
                                    <p className="shrink-0 font-sans text-sm font-semibold text-nude md:text-base lg:text-[17px] md:font-medium md:text-secondary-600">
                                        {t(`landing.pricing.rows.${key}.price`)}
                                    </p>
                                </div>
                                <p className="font-sans text-xs text-stone-500 md:text-[15px] lg:text-base leading-relaxed md:text-body">
                                    {t(`landing.pricing.rows.${key}.desc`)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-7 flex justify-center md:justify-start">
                    <PillLink href="/book" className="w-full sm:w-auto">
                        {t('landing.pricing.cta')}
                    </PillLink>
                </div>
            </FadeIn>

            {/* Visual Imagery */}
            <FadeIn delay={0.1} className="order-1 md:order-0 md:col-span-7">
                {/* Mobile Art Frame */}
                <div
                    className={`relative mx-auto aspect-4/3 w-full max-w-sm overflow-hidden rounded-4xl border border-white/90 bg-white/60 p-2 shadow-[0_16px_36px_-10px_rgba(58,48,39,0.12)] ${landingMobileOnly}`}
                >
                    <div className="relative h-full w-full overflow-hidden rounded-3xl">
                        <Image
                            src="/salon/figma/pricing-art.png"
                            alt=""
                            fill
                            sizes="(max-width: 768px) 90vw, 400px"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                </div>

                {/* Desktop Art Collage (Unchanged) */}
                <div
                    className={`relative flex aspect-4/3 w-full items-center justify-center overflow-visible ${landingDesktopOnly}`}
                >
                    <div className="relative z-20 flex items-center justify-center w-full h-full">
                        <Image
                            src="/salon/figma/pricing-art.png"
                            alt=""
                            width={500}
                            height={750}
                            className="object-cover transition-transform duration-700 hover:scale-[1.03] cursor-pointer"
                        />
                    </div>
                    <div className="pointer-events-none absolute -bottom-60 -left-20 aspect-3/4">
                        <Image
                            src="/salon/figma/hero01.svg"
                            alt=""
                            sizes="300px"
                            width={400}
                            height={750}
                            className="object-cover"
                        />
                    </div>
                    <div className="pointer-events-none absolute -right-10 -top-36 aspect-3/4">
                        <Image
                            src="/salon/figma/hero02.svg"
                            alt=""
                            sizes="300px"
                            width={400}
                            height={750}
                            className="rotate-180 object-cover"
                        />
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}
