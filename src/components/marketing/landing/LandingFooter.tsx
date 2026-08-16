'use client';

import Image from 'next/image';
import { Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { landingBleedSecondary600, landingBleedWhite } from '@components/marketing/landing/styles';

export function LandingFooter() {
    const t = useSalonTranslations();

    return (
        <footer className={cn('border-t border-border/40 py-12 pb-0', landingBleedWhite)}>
            <div className="grid gap-10 md:grid-cols-12 md:gap-10">
                {/* Logo */}
                <div className="flex flex-col items-center text-center md:col-span-4 md:items-start md:text-left">
                    <div className="relative flex size-42 items-center justify-center overflow-hidden rounded-full p-3 md:size-auto md:aspect-square md:w-3/4 md:p-8">
                        <div className="relative h-full w-full">
                            <Image
                                src="/icons/logo_round.png"
                                alt={t('brand')}
                                fill
                                className="rounded-full object-contain transition-transform duration-300 hover:scale-100"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col items-center text-center md:col-span-4 md:items-start md:text-left">
                    <p className="mb-4 flex w-full items-center justify-center gap-2 border-b border-stone-200/60 pb-2 font-sans text-sm font-bold tracking-wide text-nude md:justify-start md:text-[17px]">
                        {t('landing.footer.contact')}
                    </p>
                    <address className="flex flex-col items-center gap-3 not-italic md:items-start">
                        {/* Phone */}
                        <div className="flex items-center justify-center gap-2.5">
                            <a
                                href="tel:+17819231955"
                                className="font-sans text-sm font-bold text-stone-850 transition-colors hover:text-nude"
                            >
                                {t('landing.footer.phone')}
                            </a>
                        </div>

                        {/* Address */}
                        <div className="flex items-start justify-center gap-2.5">
                            <div className="flex flex-col text-center md:text-left">
                                <p className="font-sans text-xs font-bold leading-tight text-stone-855 md:text-[13px]">
                                    {t('landing.footer.addressLine1')}
                                </p>
                                <p className="mt-0.5 font-sans text-[11px] font-semibold text-stone-500 md:mt-1 md:text-xs">
                                    {t('landing.footer.addressLine2')}
                                </p>
                            </div>
                        </div>
                    </address>

                    {/* Social */}
                    <div className="mt-4 flex justify-center gap-3 md:mt-5 md:justify-start">
                        <a
                            href="https://facebook.com"
                            className="flex size-10 items-center justify-center rounded-full bg-third text-cream shadow-md transition-all duration-200 hover:scale-105 hover:bg-nude active:scale-95 md:size-11"
                            aria-label="Facebook"
                        >
                            <Facebook className="size-4.5 md:size-5" />
                        </a>
                        <a
                            href="https://instagram.com"
                            className="flex size-10 items-center justify-center rounded-full bg-third text-cream shadow-md transition-all duration-200 hover:scale-105 hover:bg-nude active:scale-95 md:size-11"
                            aria-label="Instagram"
                        >
                            <Instagram className="size-4.5 md:size-5" />
                        </a>
                    </div>
                </div>

                {/* Google Map */}
                <div className="flex flex-col items-center text-center md:col-span-4 md:items-start md:text-left">
                    <p className="mb-4 flex w-full items-center justify-center gap-2 border-b border-stone-200/60 pb-2 font-sans text-sm font-bold tracking-wide text-nude md:justify-start md:text-[17px]">
                        {t('landing.footer.location')}
                    </p>
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/40 bg-cream/10 shadow-xs md:rounded-lg">
                        <iframe
                            src="https://maps.google.com/maps?q=Averie%20Nails%20Spa%20Cohasset%20MA&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>

            {/* Copyright & Legal */}
            <div
                className={cn(
                    'relative mt-10 flex flex-col items-center gap-3 py-6 text-center md:flex-row md:items-center md:justify-between md:text-left',
                    landingBleedSecondary600,
                )}
            >
                <p className="relative z-10 px-4 font-sans text-xs text-cream/90 md:px-0 md:text-sm">
                    {t('landing.footer.rights')}
                </p>
                <div className="relative z-10 flex flex-wrap justify-center gap-4 px-4 md:gap-8 md:px-0">
                    <a
                        href="#"
                        className="font-sans text-xs text-cream/90 hover:text-cream md:text-sm"
                    >
                        {t('landing.footer.terms')}
                    </a>
                    <a
                        href="#"
                        className="font-sans text-xs text-cream/90 hover:text-cream md:text-sm"
                    >
                        {t('landing.footer.privacy')}
                    </a>
                </div>
            </div>
        </footer>
    );
}
