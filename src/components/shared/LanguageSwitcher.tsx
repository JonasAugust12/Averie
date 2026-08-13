'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import { setLocaleAction } from '@actions/locale.action';
import { usePreferencesStore } from '@stores/preferences.store';
import type { AppLocale } from '@i18n/config';
import { cn } from '@utils/cn.util';

const LABEL: Record<AppLocale, string> = {
    en: 'ENG',
    vi: 'VI',
};

export function LanguageSwitcher({
    variant = 'compact',
    className,
}: {
    variant?: 'compact' | 'pill';
    className?: string;
}) {
    const router = useRouter();
    const locale = useLocale() as AppLocale;
    const setLanguage = usePreferencesStore((s) => s.setLanguage);
    const [isHovered, setIsHovered] = useState(false);
    const [isPending, startTransition] = useTransition();
    const isPill = variant === 'pill';

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
                'group relative flex cursor-pointer items-center overflow-hidden transition-all duration-300 ease-out active:scale-95',
                isPill
                    ? 'h-12.5 min-w-37.75 justify-center gap-2 rounded-full border border-third bg-white px-5 hover:border-nude'
                    : 'h-9 gap-1 rounded px-1.5 sm:gap-2 sm:border sm:border-border sm:bg-tertiary/60 sm:px-3 sm:hover:border-primary/40 sm:hover:shadow-md sm:hover:shadow-primary/10',
                isPending && 'pointer-events-none opacity-70',
                className,
            )}
            aria-label={locale === 'vi' ? 'Switch to English' : 'Switch to Vietnamese'}
        >
            <Globe
                className={cn(
                    'hidden size-4 transition-transform duration-700 sm:block',
                    isPill ? 'text-third' : 'text-primary',
                    isHovered ? 'rotate-180' : 'rotate-0',
                )}
            />

            <div className="relative h-4 w-6 overflow-hidden rounded-sm shadow-sm perspective-normal">
                <div
                    className="absolute inset-0 transition-transform duration-500 ease-in-out"
                    style={{
                        transform: locale === 'vi' ? 'rotateY(0deg)' : 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <Image
                        src="/icons/vnflag.svg"
                        alt=""
                        fill
                        sizes="24px"
                        unoptimized
                        className="object-cover"
                    />
                </div>
                <div
                    className="absolute inset-0 transition-transform duration-500 ease-in-out"
                    style={{
                        transform: locale === 'en' ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <Image
                        src="/icons/usaflag.svg"
                        alt=""
                        fill
                        sizes="24px"
                        unoptimized
                        className="object-cover"
                    />
                </div>
            </div>

            <span
                className={cn(
                    'hidden min-w-6 font-sans font-bold tracking-wider uppercase sm:block',
                    isPill ? 'text-sm text-third' : 'text-2xs text-primary',
                )}
            >
                {LABEL[locale] ?? LABEL.en}
            </span>

            {!isPill && (
                <span
                    className={cn(
                        'absolute bottom-0 left-0 h-px bg-primary transition-all duration-300 ease-out',
                        isHovered ? 'w-full' : 'w-0',
                    )}
                />
            )}
        </button>
    );
}
