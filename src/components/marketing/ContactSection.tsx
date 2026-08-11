'use client';

import { useSalonTranslations } from '@i18n/use-app-translations';

export function ContactSection() {
    const t = useSalonTranslations();

    return (
        <section
            id="contact"
            className="-mx-4 border-t border-border/40 bg-neutral-100 px-4 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:py-24"
        >
            <div className="grid gap-12 md:grid-cols-3">
                <div>
                    <h3 className="mb-6 font-sans text-xs font-semibold tracking-widest text-muted uppercase">
                        {t('contact.location')}
                    </h3>
                    <p className="mb-2 font-sans text-base text-primary">
                        {t('contact.addressLine1')}
                    </p>
                    <p className="mb-6 font-sans text-base text-primary">
                        {t('contact.addressLine2')}
                    </p>
                    <a
                        href="https://maps.google.com/?q=132+Chief+Justice+Cushing+Highway+%2325+Cohasset+MA+02025"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-primary"
                    >
                        {t('contact.directions')}
                    </a>
                </div>
                <div>
                    <h3 className="mb-6 font-sans text-xs font-semibold tracking-widest text-muted uppercase">
                        {t('contact.hours')}
                    </h3>
                    <ul className="max-w-55 space-y-2 font-sans text-base text-primary">
                        <li className="flex justify-between gap-6">
                            <span>{t('contact.monFri')}</span>
                            <span>{t('contact.monFriHours')}</span>
                        </li>
                        <li className="flex justify-between gap-6">
                            <span>{t('contact.sat')}</span>
                            <span>{t('contact.satHours')}</span>
                        </li>
                        <li className="flex justify-between gap-6">
                            <span>{t('contact.sun')}</span>
                            <span>{t('contact.sunHours')}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-6 font-sans text-xs font-semibold tracking-widest text-muted uppercase">
                        {t('contact.contact')}
                    </h3>
                    <p className="mb-2 font-sans text-base text-primary">{t('contact.phone')}</p>
                    <p className="mb-6 font-sans text-base text-primary">{t('contact.email')}</p>
                    <a
                        href="https://facebook.com/averiespa"
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted transition-colors hover:text-primary"
                    >
                        {t('contact.facebook')}
                    </a>
                </div>
            </div>
        </section>
    );
}
