'use client';

import Image from 'next/image';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { FadeIn } from '@components/marketing/landing';
import {
    landingBleedWhite,
    landingOrnamentDesktopOnly,
    landingTitle,
} from '@components/marketing/landing/styles';

const tiles = [
    { key: 'limited' as const, image: '/salon/figma/product-limited.png' },
    { key: 'nailCare' as const, image: '/salon/figma/product-nail-care.png' },
    { key: 'trending' as const, image: '/salon/figma/product-colors.png' },
    { key: 'tools' as const, image: '/salon/figma/product-tools.png' },
];

export function LandingProducts() {
    const t = useSalonTranslations();

    return (
        <section
            id="products"
            className={cn('relative py-12 md:px-24 md:py-24', landingBleedWhite)}
        >
            <div
                className={`absolute -left-20 -top-20 z-0 aspect-3/4 w-[90%] max-w-md ${landingOrnamentDesktopOnly}`}
            >
                <Image
                    src="/salon/figma/hero01.svg"
                    alt=""
                    width={450}
                    height={750}
                    className="h-full w-full object-cover"
                />
            </div>
            <div
                className={`absolute left-0 top-16 z-0 aspect-3/4 w-[80%] max-w-sm ${landingOrnamentDesktopOnly}`}
            >
                <Image
                    src="/salon/figma/hero03.svg"
                    alt=""
                    width={350}
                    height={750}
                    className="h-full w-full object-cover"
                />
            </div>
            <div
                className={`absolute -bottom-30 -right-20 z-0 aspect-3/4 w-56 md:w-72 ${landingOrnamentDesktopOnly}`}
            >
                <Image
                    src="/salon/figma/hero01.svg"
                    alt=""
                    width={450}
                    height={750}
                    className="h-full w-full rotate-180 object-cover"
                />
            </div>
            <div className="relative z-10">
                <FadeIn className="mb-8 text-center md:mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-nude/30 bg-nude/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nude">
                        <span>Curated Essentials</span>
                    </div>
                    <h2 className={`mt-3 ${landingTitle}`}>{t('landing.products.title')}</h2>
                </FadeIn>

                <div className="grid gap-4 md:grid-cols-12">
                    <FadeIn className="relative min-h-72 sm:min-h-80 overflow-hidden rounded-4xl md:col-span-6 md:min-h-140 group cursor-pointer border border-stone-200/80 shadow-[0_12px_32px_-8px_rgba(58,48,39,0.1)]">
                        <Image
                            src="/salon/figma/product-featured.png"
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-third/90 via-third/40 to-transparent p-5 sm:p-6 md:p-8">
                            <div className="flex flex-col gap-1 md:mb-20">
                                <p className="font-sans text-xs sm:text-sm font-medium uppercase tracking-wider text-cream/90">
                                    {t('landing.products.featuredEyebrow')}
                                </p>
                                <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-cream md:text-3xl">
                                    {t('landing.products.featuredTitle')}
                                </h3>
                            </div>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-2 gap-3 md:col-span-6 md:gap-4">
                        {tiles.map((tile, i) => (
                            <FadeIn key={tile.key} delay={i * 0.06}>
                                <article className="relative aspect-square overflow-hidden rounded-3xl md:rounded-card group cursor-pointer border border-stone-200/60 shadow-2xs">
                                    <Image
                                        src={tile.image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-third/30 transition-opacity duration-300 group-hover:bg-third/15" />
                                    <p className="absolute inset-0 z-10 flex items-center justify-center px-2 text-center font-sans text-xs sm:text-sm font-medium uppercase tracking-wider text-white md:px-4 md:text-lg transition-transform duration-500 group-hover:scale-103">
                                        {t(`landing.products.${tile.key}`)}
                                    </p>
                                </article>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
