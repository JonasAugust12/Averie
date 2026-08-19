'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { ArrowRight, CalendarCheck, Gem, Sparkles, Store } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { usePromotionSettings } from '@services/promotion.service';
import { formatPromotionDate, shouldRenderPromotionSection } from '@utils/promotion.util';
import { cn } from '@utils/cn.util';
import { FadeIn, PillLink } from '@components/landing';
import {
    landingBody,
    landingEyebrow,
    landingImage,
    landingStaticText,
    landingTitle,
} from '@components/landing/styles';

const promotionGridBg =
    'before:bg-[linear-gradient(to_right,rgba(120,113,108,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,113,108,0.06)_1px,transparent_1px)] before:bg-size-[24px_24px]';

export function LandingPromotion() {
    const t = useSalonTranslations();
    const locale = useLocale();
    const { data: promotion } = usePromotionSettings();

    const periodLabel = useMemo(() => {
        if (!promotion) return null;
        const { startDate, endDate } = promotion;
        if (startDate && endDate) {
            return t('landing.promotion.dateRange', {
                start: formatPromotionDate(startDate, locale),
                end: formatPromotionDate(endDate, locale),
            });
        }
        if (startDate) {
            return t('landing.promotion.dateFrom', {
                start: formatPromotionDate(startDate, locale),
            });
        }
        if (endDate) {
            return t('landing.promotion.dateUntil', {
                end: formatPromotionDate(endDate, locale),
            });
        }
        return null;
    }, [locale, promotion, t]);

    if (!promotion || !shouldRenderPromotionSection(promotion)) {
        return null;
    }

    const imageAlt = promotion.title.trim() || t('landing.promotion.eyebrow');
    const aspectRatio =
        promotion.imageWidth && promotion.imageHeight
            ? `${promotion.imageWidth} / ${promotion.imageHeight}`
            : '4 / 5';

    return (
        <section
            id="promotion"
            className={cn(
                'relative isolate py-8 sm:py-12 md:py-24',
                "before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:content-['']",
                promotionGridBg,
            )}
        >
            {/* Running Text Luxury Marquee Ticker */}
            <div className="relative mb-6 md:mb-8 w-full overflow-hidden rounded-full border border-nude/20 bg-linear-to-r from-white/90 via-tertiary-50/90 to-white/90 py-2 sm:py-2.5 shadow-xs backdrop-blur-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-12 bg-linear-to-r from-cream to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-12 bg-linear-to-l from-cream to-transparent" />
                <div className="animate-marquee whitespace-nowrap text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-nude select-none">
                    <span className="mx-4 sm:mx-6 inline-flex items-center gap-2">
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary02" />
                        {t('landing.promotion.ticker')}
                    </span>
                    <span className="mx-4 sm:mx-6 inline-flex items-center gap-2">
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary02" />
                        {t('landing.promotion.ticker')}
                    </span>
                </div>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-12 md:gap-8">
                <FadeIn className="flex flex-col items-center text-center md:col-span-5 md:items-start md:pr-4 md:text-left">
                    <div className={landingEyebrow}>
                        <Sparkles
                            className="h-3.5 w-3.5 animate-pulse-soft text-primary02"
                            aria-hidden
                        />
                        <span>{t('landing.promotion.eyebrow')}</span>
                    </div>

                    <h2 className={cn('mt-4 line-clamp-2', landingTitle)}>
                        {promotion.title || t('landing.promotion.fallbackTitle')}
                    </h2>

                    {promotion.description ? (
                        <p
                            className={cn(
                                'mt-3.5 md:mt-4 max-w-lg line-clamp-4 wrap-break-word',
                                landingBody,
                                'text-secondary-600',
                            )}
                        >
                            {promotion.description}
                        </p>
                    ) : null}

                    {/* Quiet Luxury Key Highlights */}
                    <ul
                        className={cn(
                            'mt-5 md:mt-6 space-y-3 sm:space-y-3.5 text-left w-full max-w-lg',
                            landingStaticText,
                        )}
                    >
                        <li className="flex items-start gap-3 font-sans text-sm text-secondary-700 md:text-base">
                            <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg border border-primary02/25 bg-primary02/10 text-primary02 shadow-2xs">
                                <Sparkles className="size-3.5 sm:size-4" aria-hidden />
                            </span>
                            <span className="pt-0.5 leading-snug">
                                {t('landing.promotion.contextOffer')}
                            </span>
                        </li>
                        <li className="flex items-start gap-3 font-sans text-sm text-secondary-700 md:text-base">
                            <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg border border-nude/30 bg-nude/10 text-nude shadow-2xs">
                                <Store className="size-3.5 sm:size-4" aria-hidden />
                            </span>
                            <span className="pt-0.5 leading-snug">
                                {t('landing.promotion.contextLocation')}
                            </span>
                        </li>
                        <li className="flex items-start gap-3 font-sans text-sm text-secondary-700 md:text-base">
                            <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg border border-stone-200/90 bg-stone-100/90 text-stone-700 shadow-2xs">
                                <CalendarCheck className="size-3.5 sm:size-4" aria-hidden />
                            </span>
                            <span className="pt-0.5 leading-snug">
                                {t('landing.promotion.contextBooking')}
                            </span>
                        </li>
                    </ul>

                    {/* Combined Urgency CTA and Validity Period centered on mobile */}
                    <div className="mt-6 md:mt-8 flex w-full flex-col items-center gap-2.5 sm:w-auto sm:flex-row sm:items-center">
                        <PillLink
                            href="/book"
                            className="group relative flex h-11.5 sm:h-12.5 w-full max-w-xs items-center justify-center gap-2 overflow-hidden px-6 sm:px-8 text-xs sm:text-sm font-semibold tracking-wider shadow-[0_8px_20px_-4px_rgba(43,38,35,0.3)] transition-all duration-300 hover:shadow-[0_12px_28px_-6px_rgba(43,38,35,0.4)] sm:w-auto sm:max-w-none"
                        >
                            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/25 to-transparent" />
                            <span>{t('landing.promotion.cta')}</span>
                            <ArrowRight
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden
                            />
                        </PillLink>

                        {periodLabel ? (
                            <div
                                className={cn(
                                    'inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-nude/25 bg-white/95 px-3.5 py-2 shadow-2xs backdrop-blur-xs sm:w-auto sm:max-w-none sm:justify-start sm:gap-2.5 sm:px-4 sm:py-2.5',
                                    landingStaticText,
                                )}
                            >
                                <span className="relative flex h-2 w-2 shrink-0 sm:h-2.5 sm:w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary02 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary02 sm:h-2.5 sm:w-2.5" />
                                </span>
                                <div className="flex flex-row items-center gap-1.5 text-left sm:flex-col sm:items-start sm:gap-0">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-nude sm:tracking-[0.16em]">
                                        {t('landing.promotion.validPeriod')}
                                    </span>
                                    <span className="hidden sm:inline font-sans text-xs font-semibold text-stone-800 md:text-sm">
                                        {periodLabel}
                                    </span>
                                    <span className="sm:hidden font-sans text-[11px] font-semibold text-stone-800">
                                        • {periodLabel}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </FadeIn>

                <FadeIn delay={0.1} className="flex md:col-span-7 md:justify-end">
                    <div className="relative mx-auto w-full min-w-60 max-w-105 md:mx-0">
                        {/* Celebratory luxury floating accents & sparkles */}
                        <div
                            className="pointer-events-none absolute -top-5 -left-5 z-20 animate-float-slow text-primary02 drop-shadow-md"
                            aria-hidden
                        >
                            <Sparkles className="h-7 w-7" />
                        </div>
                        <div
                            className="pointer-events-none absolute -bottom-4 -right-4 z-20 animate-float-slow-reverse text-nude drop-shadow-md"
                            aria-hidden
                        >
                            <Gem className="h-6 w-6" />
                        </div>
                        <div
                            className="pointer-events-none absolute top-8 -right-5 z-20 animate-confetti-float text-rose-500/80 drop-shadow-xs"
                            aria-hidden
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                            </svg>
                        </div>
                        <div
                            className="pointer-events-none absolute -bottom-3 left-6 z-20 animate-confetti-float text-primary01/70 drop-shadow-xs"
                            style={{ animationDelay: '1.2s' }}
                            aria-hidden
                        >
                            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                            </svg>
                        </div>

                        {/* Dual luxury ambient glow */}
                        <div className="absolute -inset-4 -z-10 rounded-4xl bg-linear-to-br from-primary02/20 via-nude/25 to-primary01/20 blur-xl animate-ambient-pulse" />

                        {/* Card Frame */}
                        <div className="relative overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-white p-2 shadow-[0_20px_44px_-16px_rgba(58,48,39,0.22)]">
                            {/* Corner Limited Ribbon with shine sweep */}
                            <div
                                className="pointer-events-none absolute right-0 top-0 z-20 h-28 w-28 overflow-hidden"
                                aria-hidden
                            >
                                <div className="relative -right-8 top-6 w-38 rotate-45 overflow-hidden bg-linear-to-r from-red-700 via-red-600 to-red-700 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_4px_12px_rgba(185,28,28,0.35)]">
                                    <div className="absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/40 to-transparent" />
                                    {t('landing.promotion.limitedRibbon')}
                                </div>
                            </div>

                            <div
                                className="animate-promotion-wiggle relative mx-auto w-full min-h-70 max-h-140 overflow-hidden rounded-[1.35rem] bg-linear-to-b from-stone-100 to-stone-50/80"
                                style={{ aspectRatio, maxHeight: '560px' }}
                            >
                                {promotion.imageUrl ? (
                                    <Image
                                        src={promotion.imageUrl}
                                        alt={imageAlt}
                                        fill
                                        draggable={false}
                                        sizes="(max-width: 768px) 90vw, 420px"
                                        className={cn('object-contain', landingImage)}
                                        priority={false}
                                    />
                                ) : null}
                                <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/35 to-transparent z-10" />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
