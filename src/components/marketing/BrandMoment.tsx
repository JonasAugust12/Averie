'use client';

import { useSalonTranslations } from '@i18n/use-app-translations';

export function BrandMoment() {
    const t = useSalonTranslations();

    return (
        <section
            id="gallery"
            className="relative -mx-4 flex h-[50vh] min-h-90 items-center justify-center sm:-mx-6 lg:-mx-8 md:h-[60vh]"
        >
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/salon/brand.jpg" alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
            </div>
            <div className="relative z-10 px-6 text-center">
                <h2 className="font-display text-4xl text-neutral md:text-6xl">
                    {t('brandMoment')}
                </h2>
            </div>
        </section>
    );
}
