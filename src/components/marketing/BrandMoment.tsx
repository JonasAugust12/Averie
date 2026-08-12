'use client';

import { useSalonTranslations } from '@i18n/use-app-translations';

export function BrandMoment() {
    const t = useSalonTranslations();

    return (
        <section
            id="gallery"
            className="relative -mx-4 flex h-[50vh] min-h-90 items-center justify-center sm:-mx-6 lg:-mx-8 md:h-[60vh] overflow-hidden"
        >
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/salon/brand.jpg"
                    alt=""
                    className="h-full w-full object-cover animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/30 to-primary/50 backdrop-blur-[0.5px]" />
            </div>
            <div className="relative z-10 px-6 text-center animate-fade-in-up">
                <h2 className="font-display text-4xl font-normal text-neutral md:text-6xl tracking-widest uppercase leading-tight">
                    {t('brandMoment')}
                </h2>
            </div>
        </section>
    );
}
