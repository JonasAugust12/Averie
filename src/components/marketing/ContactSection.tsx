'use client';

import { useSalonTranslations } from '@i18n/use-app-translations';

export function ContactSection() {
    const t = useSalonTranslations();

    return (
        <section
            id="contact"
            className="-mx-4 border-t border-border/10 bg-neutral-100/50 px-4 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:py-28 backdrop-blur-xs"
        >
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-3 md:divide-x md:divide-secondary/20">
                    <div className="md:pr-12 md:pb-0 pb-8 animate-fade-in-up">
                        <h3 className="mb-6 font-sans text-xs font-bold tracking-[0.25em] text-muted uppercase">
                            {t('contact.location')}
                        </h3>
                        <p className="mb-1 font-sans text-base font-medium text-primary">
                            {t('contact.addressLine1')}
                        </p>
                        <p className="mb-6 font-sans text-base font-medium text-primary">
                            {t('contact.addressLine2')}
                        </p>
                        <a
                            href="https://maps.google.com/?q=132+Chief+Justice+Cushing+Highway+%2325+Cohasset+MA+02025"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-muted hover:text-primary transition-colors underline underline-offset-4 uppercase tracking-widest"
                        >
                            {t('contact.directions')}
                        </a>
                    </div>
                    <div
                        className="md:px-12 md:py-0 py-8 border-t border-secondary/15 md:border-t-0 animate-fade-in-up"
                        style={{ animationDelay: '150ms' }}
                    >
                        <h3 className="mb-6 font-sans text-xs font-bold tracking-[0.25em] text-muted uppercase">
                            {t('contact.hours')}
                        </h3>
                        <ul className="space-y-3 font-sans text-base text-primary font-medium">
                            <li className="flex justify-between gap-6">
                                <span className="text-muted/80">{t('contact.monFri')}</span>
                                <span>{t('contact.monFriHours')}</span>
                            </li>
                            <li className="flex justify-between gap-6">
                                <span className="text-muted/80">{t('contact.sat')}</span>
                                <span>{t('contact.satHours')}</span>
                            </li>
                            <li className="flex justify-between gap-6">
                                <span className="text-muted/80">{t('contact.sun')}</span>
                                <span>{t('contact.sunHours')}</span>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="md:pl-12 md:py-0 py-8 border-t border-secondary/15 md:border-t-0 animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <h3 className="mb-6 font-sans text-xs font-bold tracking-[0.25em] text-muted uppercase">
                            {t('contact.contact')}
                        </h3>
                        <p className="mb-1 font-sans text-base font-medium text-primary hover:text-muted transition-colors">
                            {t('contact.phone')}
                        </p>
                        <p className="mb-6 font-sans text-base font-medium text-primary hover:text-muted transition-colors">
                            {t('contact.email')}
                        </p>
                        <a
                            href="https://facebook.com/averiespa"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-muted hover:text-primary transition-colors underline underline-offset-4 uppercase tracking-widest"
                        >
                            {t('contact.facebook')}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
