'use client';

import Image from 'next/image';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { FadeIn, PillLink } from './FadeIn';
import { landingDesktopOnly, landingMobileOnly, landingTitle } from './styles';

const rows = ['mani', 'gel', 'enhance', 'wax', 'facial'] as const;

export function LandingPricing() {
    const t = useSalonTranslations();

    return (
        <section id="pricing" className="grid items-center gap-10 py-16 md:grid-cols-12 md:py-24">
            <FadeIn className="md:col-span-5">
                <h2 className={landingTitle}>{t('landing.pricing.title')}</h2>
                <ul className="mt-8 space-y-5">
                    {rows.map((key) => (
                        <li key={key} className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="font-sans text-base font-medium text-secondary-600">
                                    {t(`landing.pricing.rows.${key}.name`)}
                                </p>
                                <p className="mt-1 font-sans text-sm leading-body text-body">
                                    {t(`landing.pricing.rows.${key}.desc`)}
                                </p>
                            </div>
                            <p className="shrink-0 font-sans text-sm text-secondary-600">
                                {t(`landing.pricing.rows.${key}.price`)}
                            </p>
                        </li>
                    ))}
                </ul>
                <PillLink href="/book" className="mt-8">
                    {t('landing.pricing.cta')}
                </PillLink>
            </FadeIn>

            <FadeIn delay={0.1} className="md:col-span-7">
                <div
                    className={`relative aspect-4/3 w-full flex flex-col items-center justify-center overflow-hidden rounded-card ${landingMobileOnly}`}
                >
                    <Image
                        src="/salon/figma/pricing-art.png"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-cover"
                    />
                </div>

                <div
                    className={`relative flex aspect-4/3 w-full items-center justify-center overflow-visible ${landingDesktopOnly}`}
                >
                    <div className="relative z-20 flex items-center justify-center w-full h-full">
                        <Image
                            src="/salon/figma/pricing-art.png"
                            alt=""
                            width={500}
                            height={750}
                            className=" object-cover"
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
