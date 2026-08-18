'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import { setLocaleAction } from '@actions/locale.action';
import { useCommonTranslations } from '@i18n/use-app-translations';
import { useScheduleSettings } from '@services/schedule.service';
import { usePreferencesStore } from '@stores/preferences.store';
import type { AppLocale } from '@i18n/config';
import { cn } from '@utils/cn.util';

export function LanguageSwitcher({
    variant = 'compact',
    className,
    scope = 'any',
}: {
    variant?: 'compact' | 'pill';
    className?: string;
    /** When `guest`, respects admin `allowGuestLanguageSwitch` (click no-ops if disabled). */
    scope?: 'guest' | 'any';
}) {
    const router = useRouter();
    const locale = useLocale() as AppLocale;
    const t = useCommonTranslations();
    const setLanguage = usePreferencesStore((s) => s.setLanguage);
    const { data: settings } = useScheduleSettings({ enabled: scope === 'guest' });
    const [isHovered, setIsHovered] = useState(false);
    const [isPending, startTransition] = useTransition();
    const isPill = variant === 'pill';

    const canSwitch = scope !== 'guest' || settings?.allowGuestLanguageSwitch !== false;

    function handleToggleLanguage() {
        if (!canSwitch || isPending) return;

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
            className={cn(
                'group relative flex cursor-pointer select-none items-center overflow-hidden transition-all duration-300 ease-out active:scale-95',
                isPill
                    ? 'flex size-10 items-center justify-center rounded-full border border-stone-200/80 bg-white/85 shadow-2xs hover:border-nude hover:bg-white md:h-9.5 md:w-auto md:px-3.5 lg:h-10.5 lg:px-4.5 md:gap-2 md:border-third/60'
                    : 'h-9 gap-1 rounded px-1.5 sm:gap-2 sm:border sm:border-border sm:bg-tertiary/60 sm:px-3 sm:hover:border-primary/40 sm:hover:shadow-md sm:hover:shadow-primary/10',
                isPending && 'pointer-events-none opacity-70',
                className,
            )}
            aria-label={
                locale === 'vi' ? t('language.switchToEnglish') : t('language.switchToVietnamese')
            }
        >
            <Globe
                className={cn(
                    'hidden size-3.5 transition-transform duration-700 md:block',
                    isPill ? 'text-third' : 'text-primary',
                    isHovered ? 'rotate-180' : 'rotate-0',
                )}
            />

            <div className="relative h-3.5 w-5.5 shrink-0 overflow-hidden rounded-xs shadow-xs perspective-normal">
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
                        draggable={false}
                        sizes="24px"
                        unoptimized
                        className="pointer-events-none select-none object-cover [-webkit-user-drag:none]"
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
                        draggable={false}
                        sizes="24px"
                        unoptimized
                        className="pointer-events-none select-none object-cover [-webkit-user-drag:none]"
                    />
                </div>
            </div>

            <span
                className={cn(
                    'hidden font-sans font-semibold tracking-wider uppercase md:block',
                    isPill ? 'text-xs text-third' : 'text-2xs text-primary',
                )}
            >
                {locale === 'vi' ? t('language.vi') : t('language.en')}
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
