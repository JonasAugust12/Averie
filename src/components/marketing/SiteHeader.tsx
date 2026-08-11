'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared';
import { cn } from '@utils/cn.util';

const nav = [
    { href: '#services', key: 'services' as const },
    { href: '#gallery', key: 'gallery' as const },
    { href: '#about', key: 'about' as const },
    { href: '#contact', key: 'contact' as const },
];

export function SiteHeader() {
    const t = useSalonTranslations();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 -mx-4 border-b border-border/40 bg-background/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <nav className="flex items-center justify-between gap-3 py-5">
                <Link
                    href="/"
                    className="block h-14 w-14 overflow-hidden rounded-full transition-opacity hover:opacity-80"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/salon/logo.jpg"
                        alt={t('brand')}
                        className="h-full w-full object-cover"
                    />
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {nav.map((item) => (
                        <a
                            key={item.key}
                            href={item.href}
                            className="font-sans text-sm font-medium tracking-widest text-muted uppercase transition-colors hover:text-primary"
                        >
                            {t(`nav.${item.key}`)}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <LanguageSwitcher />
                    <Link
                        href="/book"
                        className="hidden cursor-pointer rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium tracking-widest text-neutral uppercase transition-opacity hover:opacity-80 md:inline-flex"
                    >
                        {t('nav.book')}
                    </Link>
                    <button
                        type="button"
                        className="cursor-pointer text-primary md:hidden"
                        aria-label="Menu"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </button>
                </div>
            </nav>

            <div className={cn('border-t border-border/40 pb-4 md:hidden', !open && 'hidden')}>
                <div className="flex flex-col gap-3 pt-4">
                    {nav.map((item) => (
                        <a
                            key={item.key}
                            href={item.href}
                            className="font-sans text-sm tracking-widest text-muted uppercase"
                            onClick={() => setOpen(false)}
                        >
                            {t(`nav.${item.key}`)}
                        </a>
                    ))}
                    <Link
                        href="/book"
                        className="mt-2 inline-flex justify-center rounded-full bg-primary px-6 py-3 font-sans text-sm tracking-widest text-neutral uppercase"
                        onClick={() => setOpen(false)}
                    >
                        {t('nav.book')}
                    </Link>
                </div>
            </div>
        </header>
    );
}
