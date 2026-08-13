'use client';

import Image from 'next/image';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { FadeIn, PillLink } from './FadeIn';
import {
    landingBody,
    landingBleedWhite,
    landingDesktopOnly,
    landingMobileOnly,
    landingTitle,
} from './styles';

export function LandingPhilosophy() {
    const t = useSalonTranslations();

    return (
        <section
            id="philosophy"
            className={cn(
                'grid items-center gap-10 py-16 md:grid-cols-12 md:gap-6 md:py-24',
                landingBleedWhite,
            )}
        >
            <FadeIn className="relative order-2 md:order-0 md:col-span-7 md:pb-20">
                <div
                    className={`relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-card ${landingMobileOnly}`}
                >
                    <Image
                        src="/salon/figma/philosophy-main.png"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 90vw, 400px"
                        className="object-cover"
                        priority
                    />
                </div>

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
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="absolute -bottom-16 -right-10 z-30 aspect-[4/4.6] w-[50%] overflow-hidden">
                        <Image
                            src="/salon/figma/philosophy-inset.png"
                            alt=""
                            width={300}
                            height={750}
                            className="object-cover"
                        />
                    </div>
                </div>
            </FadeIn>

            <FadeIn
                delay={0.1}
                className="order-1 flex flex-col md:order-0 md:col-span-5 md:max-w-md md:justify-self-end md:pr-8"
            >
                <p className="font-sans text-base font-medium text-muted">
                    {t('landing.philosophy.eyebrow')}
                </p>
                <h2 className={`mt-3 ${landingTitle}`}>{t('landing.philosophy.title')}</h2>
                <p className={`mt-6 max-w-lg ${landingBody} text-secondary-600 md:text-justify`}>
                    {t('landing.philosophy.body')}
                </p>
                <PillLink href="#services" className="mt-8 md:w-40">
                    {t('landing.philosophy.cta')}
                </PillLink>
            </FadeIn>
        </section>
    );
}
