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
            className="relative -mx-4 overflow-hidden border-y border-border/10 bg-neutral-100/40 px-4 py-24 sm:-mx-6 sm:px-6 md:py-32 lg:-mx-8 lg:px-8 backdrop-blur-xs"
        >
            {/* Subtle luxury grid-line background pattern */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02] bg-[radial-gradient(#2b2623_1px,transparent_1px)] bg-size-[24px_24px]" />

            <div className="mb-16 text-center md:mb-20 animate-fade-in-up">
                <span className="mb-3 block font-sans text-xs font-semibold tracking-[0.3em] text-muted uppercase">
                    {t('brand')} Offerings
                </span>
                <h2 className="mb-4 font-display font-normal text-4xl text-primary md:text-5xl tracking-tight">
                    {t('curated.title')}
                </h2>
                <p className="mx-auto max-w-lg font-sans text-base text-muted/90">
                    {t('curated.subtitle')}
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-3xl border border-secondary/15 p-3 bg-white/60 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1.5 hover:border-secondary/40 shadow-[0_12px_32px_rgba(43,38,35,0.02)] hover:shadow-[0_24px_48px_rgba(43,38,35,0.08)] animate-fade-in-up"
                        style={{ animationDelay: `${(i + 1) * 150}ms` }}
                    >
                        {/* Radial Glow Overlay on Hover */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(212,197,185,0.12)_0%,transparent_60%)]" />

                        {/* Faded Large Corner Number Index */}
                        <div className="pointer-events-none absolute -top-4 -right-1 z-0 font-display text-[84px] font-light leading-none text-secondary/15 select-none transition-transform duration-500 group-hover:scale-105">
                            {String(i + 1).padStart(2, '0')}
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image}
                                    alt=""
                                    className="h-full w-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
                            </div>
                            <div className="p-5 pt-6 flex flex-col grow">
                                <h3 className="mb-2 font-display font-normal text-2xl text-primary transition-colors group-hover:text-muted">
                                    {t(`curated.items.${item.key}.title`)}
                                </h3>
                                <p className="mb-6 line-clamp-2 font-sans text-sm leading-relaxed text-muted/95 grow">
                                    {t(`curated.items.${item.key}.body`)}
                                </p>
                                <div className="mt-auto pt-4 border-t border-secondary/10 flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                                    <span>Book Service</span>
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Progressive accent line */}
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-secondary via-secondary-300 to-transparent transition-all duration-500 group-hover:w-full" />
                    </Link>
                ))}
            </div>

            <div className="mt-16 text-center relative z-10 animate-fade-in-up animation-delay-300">
                <Link
                    href="/book"
                    className="inline-block cursor-pointer rounded-full border border-border px-10 py-4 font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-neutral hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(43,38,35,0.1)]"
                >
                    {t('curated.viewAll')}
                </Link>
            </div>
        </section>
    );
}
