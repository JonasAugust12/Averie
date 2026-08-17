'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { FadeIn, LandingBubbles } from '@components/marketing/landing';
import {
    landingBleedLeft,
    landingBody,
    landingEyebrow,
    landingImage,
    landingOrnamentDesktopOnly,
    landingStaticText,
    landingTitle,
} from '@components/marketing/landing/styles';

const reviews = ['rev1', 'rev2', 'rev3'] as const;

export function LandingTestimonials() {
    const t = useSalonTranslations();

    return (
        <section id="testimonials" className="relative isolate py-12 md:py-24">
            <LandingBubbles variant="testimonials" />
            <div
                className={cn(
                    'absolute bottom-0 z-0 aspect-3/4 w-56 translate-y-1/2 md:w-72',
                    landingBleedLeft,
                    landingOrnamentDesktopOnly,
                )}
            >
                <Image
                    src="/salon/figma/hero02.svg"
                    alt=""
                    draggable={false}
                    sizes="300px"
                    width={450}
                    height={750}
                    className={`h-full w-full object-cover rotate-180 ${landingImage}`}
                />
            </div>
            <div className="relative z-10">
                <FadeIn className="mb-8 text-center md:mb-10">
                    <div className={landingEyebrow}>
                        <span>Client Love</span>
                    </div>
                    <h2 className={`mt-3 ${landingTitle}`}>{t('landing.testimonials.title')}</h2>
                </FadeIn>

                {/* Mobile: Horizontal Snap-Scroll Luxury Carousel */}
                <div className="md:hidden -mx-4 flex snap-x snap-mandatory overflow-x-auto gap-4 px-4 pb-4 scrollbar-none">
                    {reviews.map((key, i) => (
                        <FadeIn
                            key={key}
                            delay={i * 0.08}
                            className="shrink-0 w-[84vw] max-w-85 snap-center"
                        >
                            <article className="flex h-full flex-col rounded-4xl border border-stone-200/80 bg-white/95 p-6 shadow-[0_12px_32px_-8px_rgba(58,48,39,0.08)]">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex gap-1 text-nude">
                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                            <Star
                                                key={starIndex}
                                                className="size-4.5 fill-current stroke-none"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p
                                    className={`flex-1 font-sans text-sm italic leading-relaxed text-secondary-600 ${landingStaticText}`}
                                >
                                    &ldquo;{t(`landing.testimonials.reviews.${key}.text`)}&rdquo;
                                </p>
                                <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
                                    <div
                                        className={`flex size-10 items-center justify-center rounded-full bg-third font-sans text-xs font-semibold text-cream shadow-xs ${landingStaticText}`}
                                    >
                                        {t(`landing.testimonials.reviews.${key}.initials`)}
                                    </div>
                                    <div className={landingStaticText}>
                                        <p className="font-sans text-sm font-semibold text-third">
                                            {t(`landing.testimonials.reviews.${key}.author`)}
                                        </p>
                                        <p className="font-sans text-[11px] text-muted">
                                            Averie Member
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </FadeIn>
                    ))}
                </div>

                {/* Desktop: 3-column Grid (100% Unchanged) */}
                <div className="hidden md:grid gap-6 md:grid-cols-3">
                    {reviews.map((key, i) => (
                        <FadeIn key={key} delay={i * 0.08}>
                            <article className="flex h-full flex-col rounded-card bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                                <div className="mb-4 flex gap-1 text-nude">
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <Star
                                            key={starIndex}
                                            className="size-6.5 fill-current stroke-none"
                                        />
                                    ))}
                                </div>
                                <p className={`flex-1 ${landingBody}`}>
                                    &ldquo;{t(`landing.testimonials.reviews.${key}.text`)}&rdquo;
                                </p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div
                                        className={`flex size-12.5 items-center justify-center rounded-full bg-third font-sans text-sm font-medium text-cream ${landingStaticText}`}
                                    >
                                        {t(`landing.testimonials.reviews.${key}.initials`)}
                                    </div>
                                    <p
                                        className={`font-sans text-base font-medium text-third ${landingStaticText}`}
                                    >
                                        {t(`landing.testimonials.reviews.${key}.author`)}
                                    </p>
                                </div>
                            </article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
