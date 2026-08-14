'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { FadeIn } from '@components/marketing/landing';
import { landingBody, landingTitle } from '@components/marketing/landing/styles';

const cards = [
    { key: 'mani' as const, image: '/salon/figma/svc-mani.png', tag: 'Hands & Feet' },
    { key: 'facial' as const, image: '/salon/figma/svc-facial.png', tag: 'Dermalogica' },
    { key: 'wax' as const, image: '/salon/figma/svc-wax.png', tag: 'Gentle Care' },
];

export function LandingServices() {
    const t = useSalonTranslations();

    return (
        <section id="services" className="py-12 md:py-24">
            <FadeIn className="mb-8 text-center md:mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-nude/30 bg-nude/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nude">
                    <Sparkles className="size-3 text-nude" />
                    <span>{t('landing.services.eyebrow')}</span>
                </div>
                <h2 className={`mt-3 ${landingTitle}`}>{t('landing.services.title')}</h2>
                <p className={`mx-auto mt-3 max-w-xl ${landingBody}`}>
                    {t('landing.services.subtitle')}
                </p>
            </FadeIn>

            {/* Mobile: Horizontal Snap-Scroll Luxury Carousel with peek effect */}
            <div className="md:hidden -mx-4 flex snap-x snap-mandatory overflow-x-auto gap-4 px-4 pb-4 scrollbar-none">
                {cards.map((card, i) => (
                    <FadeIn
                        key={card.key}
                        delay={i * 0.08}
                        className="shrink-0 w-[84vw] max-w-85 snap-center"
                    >
                        <article className="flex h-full flex-col rounded-4xl border border-stone-200/80 bg-white/95 p-4 shadow-[0_12px_32px_-8px_rgba(58,48,39,0.1)] transition-all">
                            {/* Card Image Container */}
                            <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
                                <Image
                                    src={card.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 85vw, 300px"
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-third shadow-xs backdrop-blur-md">
                                    {card.tag}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="flex flex-1 flex-col pt-4">
                                <h3 className="text-center font-display text-xl font-semibold text-secondary-600">
                                    {t(`landing.services.items.${card.key}.title`)}
                                </h3>
                                <p
                                    className={`mt-2 flex-1 text-center font-sans text-sm leading-relaxed text-body`}
                                >
                                    {t(`landing.services.items.${card.key}.body`)}
                                </p>

                                <Link
                                    href="/book"
                                    className="mt-4 flex items-center justify-center gap-2 rounded-full border border-third/20 bg-cream/60 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-third transition-colors hover:bg-third hover:text-cream"
                                >
                                    <span>{t('landing.services.book')}</span>
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </div>
                        </article>
                    </FadeIn>
                ))}
            </div>

            {/* Desktop: 3-column Grid */}
            <div className="hidden md:grid gap-6 md:grid-cols-3">
                {cards.map((card, i) => (
                    <FadeIn key={card.key} delay={i * 0.08}>
                        <article className="flex h-full flex-col rounded-card bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                            <div className="relative aspect-video overflow-hidden rounded-card">
                                <Image
                                    src={card.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-2000 hover:scale-105"
                                />
                            </div>
                            <h3 className="mt-6 text-center font-sans text-2xl font-medium text-secondary-600">
                                {t(`landing.services.items.${card.key}.title`)}
                            </h3>
                            <p className={`mt-2 flex-1 text-center ${landingBody}`}>
                                {t(`landing.services.items.${card.key}.body`)}
                            </p>
                            <Link
                                href="/book"
                                className="mt-4 text-center font-sans text-base text-secondary-600 transition-colors hover:text-nude"
                            >
                                {t('landing.services.book')}
                            </Link>
                        </article>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
