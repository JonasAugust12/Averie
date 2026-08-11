'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { setLocaleAction } from '@actions/locale.action';
import { usePreferencesStore } from '@stores/preferences.store';
import type { AppLocale } from '@i18n/config';
import { cn } from '@utils/cn.util';

const LABEL: Record<AppLocale, string> = {
    en: 'ENG',
    vi: 'VI',
};

export function LanguageSwitcher() {
    const router = useRouter();
    const locale = useLocale() as AppLocale;
    const setLanguage = usePreferencesStore((s) => s.setLanguage);
    const [isHovered, setIsHovered] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleToggleLanguage() {
        const next: AppLocale = locale === 'en' ? 'vi' : 'en';
        startTransition(async () => {
            const result = await setLocaleAction(next);
            if (result.status >= 400) return;
            setLanguage(next);
            router.refresh();
        });
    }

    return (
        <button
            type="button"
            onClick={handleToggleLanguage}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isPending}
            className={cn(
                'group relative flex h-9 cursor-pointer items-center gap-1 overflow-hidden rounded px-1.5 transition-all duration-300 ease-out active:scale-95 sm:gap-2 sm:border sm:border-border sm:bg-tertiary/60 sm:px-3 sm:hover:border-primary/40 sm:hover:shadow-md sm:hover:shadow-primary/10',
                isPending && 'pointer-events-none opacity-70',
            )}
            aria-label={locale === 'vi' ? 'Switch to English' : 'Switch to Vietnamese'}
        >
            <Globe
                className={cn(
                    'hidden size-4 text-primary transition-transform duration-700 sm:block',
                    isHovered ? 'rotate-180' : 'rotate-0',
                )}
            />

            <div className="relative h-4 w-6 overflow-hidden rounded-sm shadow-sm perspective-[600px]">
                <div
                    className="absolute inset-0 transition-transform duration-500 ease-in-out"
                    style={{
                        transform: locale === 'vi' ? 'rotateY(0deg)' : 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/vnflag.svg" alt="" className="h-full w-full object-cover" />
                </div>
                <div
                    className="absolute inset-0 transition-transform duration-500 ease-in-out"
                    style={{
                        transform: locale === 'en' ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/usaflag.svg" alt="" className="h-full w-full object-cover" />
                </div>
            </div>

            <span className="hidden min-w-6 font-sans text-[10px] font-bold tracking-wider text-primary uppercase sm:block">
                {LABEL[locale] ?? LABEL.en}
            </span>

            <span
                className={cn(
                    'absolute bottom-0 left-0 h-px bg-primary transition-all duration-300 ease-out',
                    isHovered ? 'w-full' : 'w-0',
                )}
            />
        </button>
    );
}
