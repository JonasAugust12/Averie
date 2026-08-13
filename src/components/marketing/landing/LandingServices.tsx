'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { FadeIn } from './FadeIn';
import { landingBody, landingTitle } from './styles';

const cards = [
    { key: 'mani' as const, image: '/salon/figma/svc-mani.png' },
    { key: 'facial' as const, image: '/salon/figma/svc-facial.png' },
    { key: 'wax' as const, image: '/salon/figma/svc-wax.png' },
];

export function LandingServices() {
    const t = useSalonTranslations();

    return (
        <section id="services" className="py-16 md:py-24">
            <FadeIn className="mb-12 text-center">
                <p className="font-sans text-sm font-medium text-secondary-600">
                    {t('landing.services.eyebrow')}
                </p>
                <h2 className={`mt-2 ${landingTitle}`}>{t('landing.services.title')}</h2>
                <p className={`mx-auto mt-3 max-w-xl ${landingBody}`}>
                    {t('landing.services.subtitle')}
                </p>
            </FadeIn>

            <div className="grid gap-6 md:grid-cols-3">
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
