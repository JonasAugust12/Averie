'use client';

import Image from 'next/image';
import {
    Instagram,
    Facebook,
    Phone,
    MapPin,
    Compass,
    Sparkles,
    Share2,
    ChevronRight,
} from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { landingBleedSecondary600, landingBleedWhite } from './styles';

const menu = [
    { href: '#philosophy', key: 'about' as const },
    { href: '#products', key: 'portfolio' as const },
    { href: '#services', key: 'services' as const },
    { href: '#hours', key: 'contact' as const },
];

const services = [
    { href: '#services', key: 'mani' as const },
    { href: '#services', key: 'facial' as const },
    { href: '#services', key: 'wax' as const },
    { href: '#products', key: 'products' as const },
];

export function LandingFooter() {
    const t = useSalonTranslations();

    return (
        <footer className={cn('border-t border-border/40 py-12 pb-0', landingBleedWhite)}>
            <div className="grid gap-8 md:grid-cols-12 md:gap-10">
                {/* Brand & Logo */}
                <div className="flex flex-col items-center text-center md:col-span-3 md:items-start md:text-left">
                    <p className="font-sans text-[17px] font-bold tracking-wide text-nude flex items-center gap-2 border-b border-stone-200/60 pb-2 mb-4 w-full justify-center md:justify-start">
                        <span className="font-display font-semibold tracking-wider text-xl">
                            Averie
                        </span>
                    </p>
                    <div className="size-24 md:size-auto md:w-full md:aspect-square overflow-hidden rounded-full border border-stone-250/70 bg-white/90 p-4 md:p-8 shadow-xs flex items-center justify-center relative backdrop-blur-xs">
                        <div className="relative w-full h-full">
                            <Image
                                src="/icons/logo_round.png"
                                alt={t('brand')}
                                fill
                                className="object-contain rounded-full scale-102 hover:scale-105 transition-transform duration-300"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile: 2-column navigation grid for Menu & Services */}
                <div className="grid grid-cols-2 gap-6 md:contents">
                    {/* Menu Navigation */}
                    <div className="md:col-span-2">
                        <p className="font-sans text-sm md:text-[17px] font-bold tracking-wide text-nude flex items-center gap-1.5 md:gap-2 border-b border-stone-200/60 pb-2 mb-3 md:mb-4">
                            <Compass className="size-3.5 md:size-4 text-nude/70" />
                            {t('landing.footer.menu')}
                        </p>
                        <ul className="space-y-1.5">
                            {menu.map((item) => (
                                <li key={item.key}>
                                    <a
                                        href={item.href}
                                        className="group font-sans text-sm md:text-base font-semibold text-body hover:text-nude transition-colors flex items-center gap-1 py-0.5"
                                    >
                                        <ChevronRight className="size-3.5 md:size-4 text-third/35 shrink-0 transition-transform group-hover:translate-x-0.5" />
                                        {t(`landing.footer.${item.key}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Navigation */}
                    <div className="md:col-span-2">
                        <p className="font-sans text-sm md:text-[17px] font-bold tracking-wide text-nude flex items-center gap-1.5 md:gap-2 border-b border-stone-200/60 pb-2 mb-3 md:mb-4">
                            <Sparkles className="size-3.5 md:size-4 text-nude/70" />
                            {t('landing.footer.service')}
                        </p>
                        <ul className="space-y-1.5">
                            {services.map((item) => (
                                <li key={item.key}>
                                    <a
                                        href={item.href}
                                        className="group font-sans text-sm md:text-base font-semibold text-body hover:text-nude transition-colors flex items-center gap-1 py-0.5"
                                    >
                                        <ChevronRight className="size-3.5 md:size-4 text-third/35 shrink-0 transition-transform group-hover:translate-x-0.5" />
                                        {t(`landing.footer.${item.key}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social & Contact */}
                <div className="md:col-span-2">
                    <p className="font-sans text-sm md:text-[17px] font-bold tracking-wide text-nude flex items-center gap-2 border-b border-stone-200/60 pb-2 mb-4">
                        <Share2 className="size-3.5 md:size-4 text-nude/70" />
                        {t('landing.footer.social')}
                    </p>
                    <address className="flex flex-col gap-3 not-italic">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-8 md:size-9 shrink-0 items-center justify-center rounded-full bg-cream/70 text-nude border border-stone-200/50 shadow-xs">
                                <Phone className="size-3.5 md:size-4" />
                            </span>
                            <a
                                href="tel:+17819231955"
                                className="font-sans text-sm font-bold text-stone-850 hover:text-nude transition-colors"
                            >
                                {t('landing.footer.phone')}
                            </a>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="flex size-8 md:size-9 shrink-0 items-center justify-center rounded-full bg-cream/70 text-stone-600 border border-stone-200/50 shadow-xs mt-0.5">
                                <MapPin className="size-3.5 md:size-4" />
                            </span>
                            <div className="flex flex-col">
                                <p className="font-sans text-xs md:text-[13px] font-bold text-stone-855 leading-tight">
                                    {t('landing.footer.addressLine1')}
                                </p>
                                <p className="font-sans text-[11px] md:text-xs font-semibold text-stone-500 mt-0.5 md:mt-1">
                                    {t('landing.footer.addressLine2')}
                                </p>
                            </div>
                        </div>
                    </address>
                    <div className="mt-4 md:mt-5 flex gap-3">
                        <a
                            href="https://facebook.com"
                            className="flex size-10 md:size-11 items-center justify-center rounded-full bg-third text-cream hover:bg-nude hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
                            aria-label="Facebook"
                        >
                            <Facebook className="size-4.5 md:size-5" />
                        </a>
                        <a
                            href="https://instagram.com"
                            className="flex size-10 md:size-11 items-center justify-center rounded-full bg-third text-cream hover:bg-nude hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
                            aria-label="Instagram"
                        >
                            <Instagram className="size-4.5 md:size-5" />
                        </a>
                    </div>
                </div>

                {/* Google Map */}
                <div className="md:col-span-3">
                    <p className="font-sans text-sm md:text-[17px] font-bold tracking-wide text-nude flex items-center gap-2 border-b border-stone-200/60 pb-2 mb-4">
                        <MapPin className="size-3.5 md:size-4 text-nude/70" />
                        {t('landing.footer.location')}
                    </p>
                    <div className="aspect-video md:aspect-square w-full overflow-hidden rounded-2xl md:rounded-lg border border-border/40 shadow-xs bg-cream/10">
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
            <div
                className={cn(
                    'relative mt-10 flex flex-col items-center gap-3 py-6 text-center md:flex-row md:items-center md:justify-between md:text-left',
                    landingBleedSecondary600,
                )}
            >
                <p className="relative z-10 px-4 font-sans text-xs md:text-sm text-cream/90 md:px-0">
                    {t('landing.footer.rights')}
                </p>
                <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-8 px-4 md:px-0">
                    <a
                        href="#"
                        className="font-sans text-xs md:text-sm text-cream/90 hover:text-cream"
                    >
                        {t('landing.footer.terms')}
                    </a>
                    <a
                        href="#"
                        className="font-sans text-xs md:text-sm text-cream/90 hover:text-cream"
                    >
                        {t('landing.footer.privacy')}
                    </a>
                </div>
            </div>
        </footer>
    );
}
