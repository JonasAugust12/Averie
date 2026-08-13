'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared';
import { cn } from '@utils/cn.util';
import { PillLink } from './FadeIn';

const nav = [
    { href: '#philosophy', key: 'about' as const },
    { href: '#services', key: 'menu' as const },
    { href: '#products', key: 'blog' as const },
    { href: '#hours', key: 'contact' as const },
];

export function LandingHeader() {
    const t = useSalonTranslations();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 px-4 pt-4 md:px-8 md:pt-5">
            <div
                className={cn(
                    'border border-white/60 bg-cream/55 shadow-[0_8px_32px_rgb(58_48_39/0.07)] backdrop-blur-xl transition-[border-radius] duration-300',
                    open ? 'rounded-3xl px-4 py-4' : 'rounded-full px-4 py-3 md:px-6 md:py-3.5',
                )}
            >
                <nav className="relative flex items-center justify-between gap-3">
                    <Link href="/" className="relative z-10 shrink-0">
                        <Image
                            src="/salon/figma/logo.svg"
                            alt={t('brand')}
                            width={157}
                            height={50}
                            className="h-11 w-36 object-contain object-left md:h-12.5 md:w-39.25"
                            priority
                        />
                    </Link>

                    <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
                        {nav.map((item) => (
                            <a
                                key={item.key}
                                href={item.href}
                                className="nav-link-underline pb-1 font-sans text-base font-medium text-secondary-600 transition-colors hover:text-nude"
                            >
                                {t(`landing.header.${item.key}`)}
                            </a>
                        ))}
                    </div>

                    <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                        <LanguageSwitcher variant="pill" />
                        <PillLink href="/book" className="hidden min-w-37.75 px-6 md:inline-flex">
                            {t('landing.header.book')}
                        </PillLink>
                        <button
                            type="button"
                            className="cursor-pointer rounded-full p-1.5 text-third transition-colors hover:bg-third/5 md:hidden"
                            aria-label="Menu"
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </nav>

                <div className={cn('md:hidden', !open && 'hidden')}>
                    <div className="mt-4 flex flex-col gap-3 border-t border-third/10 pt-4">
                        {nav.map((item) => (
                            <a
                                key={item.key}
                                href={item.href}
                                className="font-sans text-base text-third"
                                onClick={() => setOpen(false)}
                            >
                                {t(`landing.header.${item.key}`)}
                            </a>
                        ))}
                        <Link
                            href="/book"
                            className="mt-2 inline-flex h-12.5 items-center justify-center rounded-full bg-third font-sans text-sm uppercase tracking-wide text-cream"
                            onClick={() => setOpen(false)}
                        >
                            {t('landing.header.book')}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
