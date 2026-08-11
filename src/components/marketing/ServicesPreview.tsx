'use client';

import Link from 'next/link';
import { useSalonTranslations } from '@i18n/use-app-translations';

const items = [
    { key: 'mani' as const, image: '/salon/svc1.jpg', href: '/book' },
    { key: 'facial' as const, image: '/salon/svc2.jpg', href: '/book' },
    { key: 'wax' as const, image: '/salon/svc3.jpg', href: '/book' },
];

export function ServicesPreview() {
    const t = useSalonTranslations();

    return (
        <section
            id="services"
            className="-mx-4 bg-neutral-100 px-4 py-24 sm:-mx-6 sm:px-6 md:py-32 lg:-mx-8 lg:px-8"
        >
            <div className="mb-16 text-center md:mb-20">
                <h2 className="mb-4 font-display text-3xl text-primary md:text-[40px] md:leading-[48px]">
                    {t('curated.title')}
                </h2>
                <p className="mx-auto max-w-lg font-sans text-base text-muted">
                    {t('curated.subtitle')}
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <Link key={item.key} href={item.href} className="group cursor-pointer">
                        <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <h3 className="mb-2 font-display text-2xl text-primary">
                            {t(`curated.items.${item.key}.title`)}
                        </h3>
                        <p className="line-clamp-2 font-sans text-base text-muted">
                            {t(`curated.items.${item.key}.body`)}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Link
                    href="/book"
                    className="inline-block cursor-pointer rounded-full border border-border px-10 py-4 font-sans text-sm font-medium tracking-widest text-primary uppercase transition-colors hover:bg-neutral"
                >
                    {t('curated.viewAll')}
                </Link>
            </div>
        </section>
    );
}
