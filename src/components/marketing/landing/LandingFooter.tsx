'use client';

import Image from 'next/image';
import { Instagram } from 'lucide-react';
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
            <div className="grid gap-10 md:grid-cols-12">
                <div className="md:col-span-4">
                    <Image
                        src="/salon/figma/logo.svg"
                        alt={t('brand')}
                        width={157}
                        height={50}
                        className="h-12.5 w-39.25 object-contain object-left"
                    />
                    <address className="mt-6 flex flex-col gap-1 not-italic">
                        <a
                            href="tel:+17819231955"
                            className="font-sans text-base font-semibold text-nude hover:text-nude/80"
                        >
                            {t('landing.footer.phone')}
                        </a>
                        <p className="font-sans text-sm text-third">
                            {t('landing.footer.addressLine1')}
                        </p>
                        <p className="font-sans text-sm text-third">
                            {t('landing.footer.addressLine2')}
                        </p>
                    </address>
                </div>
                <div className="md:col-span-2">
                    <p className="font-sans text-base font-medium text-third">
                        {t('landing.footer.menu')}
                    </p>
                    <ul className="mt-4 space-y-2">
                        {menu.map((item) => (
                            <li key={item.key}>
                                <a
                                    href={item.href}
                                    className="font-sans text-sm text-body hover:text-nude"
                                >
                                    {t(`landing.footer.${item.key}`)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-3">
                    <p className="font-sans text-base font-medium text-third">
                        {t('landing.footer.service')}
                    </p>
                    <ul className="mt-4 space-y-2">
                        {services.map((item) => (
                            <li key={item.key}>
                                <a
                                    href={item.href}
                                    className="font-sans text-sm text-body hover:text-nude"
                                >
                                    {t(`landing.footer.${item.key}`)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-3">
                    <p className="font-sans text-base font-medium text-third">
                        {t('landing.footer.social')}
                    </p>
                    <div className="mt-4 flex gap-3">
                        <a
                            href="https://facebook.com"
                            className="relative flex size-12 items-center justify-center rounded-full bg-third"
                            aria-label="Facebook"
                        >
                            <Image
                                src="/salon/figma/icon-facebook.svg"
                                alt=""
                                width={16}
                                height={16}
                                unoptimized
                            />
                        </a>
                        <a
                            href="https://instagram.com"
                            className="flex size-12 items-center justify-center rounded-full bg-third text-cream"
                            aria-label="Instagram"
                        >
                            <Instagram className="size-4" />
                        </a>
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    'relative mt-10 flex flex-col items-center gap-3 py-6 text-center md:flex-row md:items-center md:justify-between md:text-left',
                    landingBleedSecondary600,
                )}
            >
                <p className="relative z-10 px-4 font-sans text-sm text-cream/90 md:px-0">
                    {t('landing.footer.rights')}
                </p>
                <div className="relative z-10 flex flex-wrap justify-center gap-6 px-4 md:gap-8 md:px-0">
                    <a href="#" className="font-sans text-sm text-cream/90 hover:text-cream">
                        {t('landing.footer.terms')}
                    </a>
                    <a href="#" className="font-sans text-sm text-cream/90 hover:text-cream">
                        {t('landing.footer.privacy')}
                    </a>
                </div>
            </div>
        </footer>
    );
}
