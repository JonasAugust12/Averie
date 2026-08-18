'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared';
import { cn } from '@utils/cn.util';
import { landingImage, landingInteractive } from '@components/landing/styles';

const nav = [
    { href: '#philosophy', key: 'about' as const },
    { href: '#services', key: 'service' as const },
    { href: '#search-booking', key: 'search' as const },
    { href: '#hours', key: 'contact' as const },
];

export function LandingHeader() {
    const t = useSalonTranslations();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-8 md:pt-5">
            <div
                className={cn(
                    'border border-white/70 bg-cream/70 shadow-[0_8px_32px_rgb(58_48_39/0.08)] backdrop-blur-xl transition-[border-radius] duration-300',
                    open ? 'rounded-3xl p-4' : 'rounded-3xl px-4 py-2.5 sm:py-3 md:px-6 md:py-3.5',
                )}
            >
                <nav className="relative flex items-center justify-between gap-3">
                    <Link href="/" className={`relative z-10 shrink-0 ${landingInteractive}`}>
                        <Image
                            src="/salon/figma/logo.svg"
                            alt={t('brand')}
                            width={157}
                            height={50}
                            draggable={false}
                            className={`h-10 w-32 object-contain object-left sm:h-11 sm:w-36 md:h-12.5 md:w-39.25 ${landingImage}`}
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3.5 lg:flex lg:gap-6 xl:gap-8">
                        {nav.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`nav-link-underline whitespace-nowrap pb-1 font-sans text-sm font-medium text-secondary-600 transition-colors hover:text-nude lg:text-base ${landingInteractive}`}
                            >
                                {t(`landing.header.${item.key}`)}
                            </Link>
                        ))}
                    </div>

                    <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                        <LanguageSwitcher variant="pill" scope="guest" />
                        <Link
                            href="/book"
                            className={`hidden h-9.5 items-center justify-center whitespace-nowrap rounded-full bg-third px-4 font-sans text-xs font-semibold uppercase tracking-wider text-cream shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-800 lg:inline-flex lg:h-10.5 lg:px-6 ${landingInteractive}`}
                        >
                            {t('landing.header.book')}
                        </Link>
                        <button
                            type="button"
                            className={`flex size-10 items-center justify-center rounded-full border border-stone-200/50 bg-white/70 text-third shadow-2xs transition-colors hover:bg-white active:scale-95 lg:hidden ${landingInteractive}`}
                            aria-label="Menu"
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown */}
                <div className={cn('lg:hidden', !open && 'hidden')}>
                    <div className="mt-4 flex flex-col gap-2 border-t border-stone-200/60 pt-4">
                        {nav.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`group flex items-center justify-between rounded-2xl px-4 py-3 font-sans text-base font-medium text-secondary-600 transition-all hover:bg-white/80 hover:text-nude ${landingInteractive}`}
                                onClick={() => setOpen(false)}
                            >
                                <span className="flex items-center gap-2">
                                    {t(`landing.header.${item.key}`)}
                                </span>
                            </Link>
                        ))}
                        <Link
                            href="/book"
                            className={`mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-third font-sans text-xs font-semibold uppercase tracking-wider text-cream shadow-md transition-transform active:scale-98 ${landingInteractive}`}
                            onClick={() => setOpen(false)}
                        >
                            <span>{t('landing.header.book')}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
