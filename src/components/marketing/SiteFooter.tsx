'use client';

import { useSalonTranslations } from '@i18n/use-app-translations';

const links = ['privacy', 'terms', 'sustainability', 'careers', 'press'] as const;

export function SiteFooter() {
    const t = useSalonTranslations();

    return (
        <footer className="-mx-4 border-t border-border/50 bg-neutral-100 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:py-20">
            <div className="grid items-center gap-8 md:grid-cols-12">
                <div className="md:col-span-4">
                    <span className="font-display text-3xl tracking-wide text-primary md:text-4xl">
                        AVERIE
                    </span>
                </div>
                <div className="flex flex-wrap gap-6 md:col-span-8 md:justify-end">
                    {links.map((key) => (
                        <a
                            key={key}
                            href="#"
                            className="font-sans text-xs font-semibold tracking-widest text-muted uppercase transition-colors hover:text-primary"
                        >
                            {t(`footer.${key}`)}
                        </a>
                    ))}
                </div>
                <div className="mt-4 border-t border-border/30 pt-8 md:col-span-12 md:mt-8">
                    <p className="text-center font-sans text-xs font-semibold tracking-widest text-primary uppercase md:text-left">
                        {t('footer.rights')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
