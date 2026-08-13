'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { FadeIn } from './FadeIn';
import { landingBleedLeft, landingBody, landingOrnamentDesktopOnly, landingTitle } from './styles';

const reviews = ['rev1', 'rev2', 'rev3'] as const;

export function LandingTestimonials() {
    const t = useSalonTranslations();

    return (
        <section id="testimonials" className="relative py-16 md:py-24">
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
                    sizes="300px"
                    width={450}
                    height={750}
                    className="h-full w-full object-cover rotate-180"
                />
            </div>
            <div className="relative z-10">
                <FadeIn className="mb-10 text-center">
                    <h2 className={landingTitle}>{t('landing.testimonials.title')}</h2>
                </FadeIn>

                <div className="grid gap-6 md:grid-cols-3">
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
                                    <div className="flex size-12.5 items-center justify-center rounded-full bg-third font-sans text-sm font-medium text-cream">
                                        {t(`landing.testimonials.reviews.${key}.initials`)}
                                    </div>
                                    <p className="font-sans text-base font-medium text-third">
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
