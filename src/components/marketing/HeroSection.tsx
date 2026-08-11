'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';

export function HeroSection() {
    const t = useSalonTranslations();

    return (
        <section className="relative flex min-h-[85vh] items-center overflow-hidden py-16">
            <div className="relative z-10 grid w-full items-center gap-10 md:grid-cols-12">
                <div className="flex flex-col items-start gap-6 md:col-span-6">
                    <h1 className="font-display text-5xl leading-tight tracking-tight text-primary md:text-6xl lg:text-[64px] lg:leading-[72px]">
                        {t('hero.title')}
                        <span className="mt-2 block font-display text-2xl text-muted md:text-[28px] md:leading-9">
                            {t('hero.subtitle')}
                        </span>
                    </h1>
                    <p className="max-w-md font-sans text-lg leading-7 text-muted">
                        {t('hero.body')}
                    </p>
                    <Link
                        href="/book"
                        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-10 py-4 font-sans text-sm font-medium tracking-widest text-neutral uppercase transition-opacity hover:opacity-80"
                    >
                        {t('hero.cta')}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="relative mt-4 md:col-span-6 md:mt-0">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/salon/hero.jpg" alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    </div>
                    <div className="absolute -bottom-8 -left-8 -z-10 h-48 w-48 rounded-full bg-secondary/40 opacity-50 blur-3xl" />
                </div>
            </div>
        </section>
    );
}
