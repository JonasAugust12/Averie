'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
    ArrowRight,
    Calendar,
    CalendarCheck,
    Eye,
    Gem,
    ImageIcon,
    Laptop,
    Smartphone,
    Sparkles,
    Store,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatPromotionDate, isPromotionVisible } from '@utils/promotion.util';
import { resolvePromotionColor } from '@mappers/promotion.mapper';
import { cn } from '@utils/cn.util';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';

const promotionGridBg =
    'before:bg-[linear-gradient(to_right,rgba(120,113,108,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,113,108,0.06)_1px,transparent_1px)] before:bg-size-[24px_24px]';

interface PromotionLivePreviewProps {
    promotion: PromotionSettingsDto;
}

export function PromotionLivePreview({ promotion }: PromotionLivePreviewProps) {
    const t = useAdminTranslations();
    const locale = useLocale();
    const [previewTab, setPreviewTab] = useState<'landing' | 'booking'>('landing');
    const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
    const promoColor = resolvePromotionColor(promotion.color);

    const isVisibleNow = useMemo(() => isPromotionVisible(promotion), [promotion]);

    const periodLabel = useMemo(() => {
        const { startDate, endDate } = promotion;
        if (startDate && endDate) {
            return `${formatPromotionDate(startDate, locale)} – ${formatPromotionDate(endDate, locale)}`;
        }
        if (startDate) {
            return `From ${formatPromotionDate(startDate, locale)}`;
        }
        if (endDate) {
            return `Until ${formatPromotionDate(endDate, locale)}`;
        }
        return null;
    }, [locale, promotion]);

    const title = promotion.title.trim() || t('promotion.previewFallbackTitle');
    const description = promotion.description.trim() || t('promotion.previewFallbackDesc');

    const aspectRatio =
        promotion.imageWidth && promotion.imageHeight
            ? `${promotion.imageWidth} / ${promotion.imageHeight}`
            : '4 / 5';

    return (
        <section className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 shadow-md backdrop-blur-md transition-all duration-300">
            {/* Header Toolbar */}
            <div className="flex flex-col gap-4 border-b border-stone-200/80 bg-linear-to-r from-stone-50/90 via-stone-100/50 to-stone-50/90 px-6 py-4.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-xs">
                        <Eye className="h-4.5 w-4.5 text-sand-300" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-display text-base font-bold text-stone-900">
                                {t('promotion.previewTitle')}
                            </h2>
                            {/* Live status badge */}
                            {promotion.enabled ? (
                                isVisibleNow ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {t('promotion.previewStatusActive')}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                        {t('promotion.previewStatusUpcoming')}
                                    </span>
                                )
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                                    {t('promotion.previewStatusDisabled')}
                                </span>
                            )}
                        </div>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
                            {t('promotion.previewSubtitle')}
                        </p>
                    </div>
                </div>

                {/* Controls: Mode Tabs & Device Viewport */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* View Tabs */}
                    <div className="inline-flex rounded-full bg-stone-200/70 p-1">
                        <button
                            type="button"
                            onClick={() => setPreviewTab('landing')}
                            className={cn(
                                'cursor-pointer rounded-full px-3 py-1.5 font-sans text-xs font-semibold transition-all duration-200',
                                previewTab === 'landing'
                                    ? 'bg-white text-stone-900 shadow-xs'
                                    : 'text-stone-600 hover:text-stone-900',
                            )}
                        >
                            {t('promotion.previewTabLanding')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewTab('booking')}
                            className={cn(
                                'cursor-pointer rounded-full px-3 py-1.5 font-sans text-xs font-semibold transition-all duration-200',
                                previewTab === 'booking'
                                    ? 'bg-white text-stone-900 shadow-xs'
                                    : 'text-stone-600 hover:text-stone-900',
                            )}
                        >
                            {t('promotion.previewTabBooking')}
                        </button>
                    </div>

                    {/* Viewport Toggles */}
                    <div className="inline-flex rounded-full bg-stone-200/70 p-1">
                        <button
                            type="button"
                            onClick={() => setViewport('desktop')}
                            title={t('promotion.previewViewportDesktop')}
                            className={cn(
                                'flex items-center gap-1.5 cursor-pointer rounded-full px-2.5 py-1.5 font-sans text-xs font-semibold transition-all duration-200',
                                viewport === 'desktop'
                                    ? 'bg-white text-stone-900 shadow-xs'
                                    : 'text-stone-600 hover:text-stone-900',
                            )}
                        >
                            <Laptop className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                                {t('promotion.previewViewportDesktop')}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewport('mobile')}
                            title={t('promotion.previewViewportMobile')}
                            className={cn(
                                'flex items-center gap-1.5 cursor-pointer rounded-full px-2.5 py-1.5 font-sans text-xs font-semibold transition-all duration-200',
                                viewport === 'mobile'
                                    ? 'bg-white text-stone-900 shadow-xs'
                                    : 'text-stone-600 hover:text-stone-900',
                            )}
                        >
                            <Smartphone className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                                {t('promotion.previewViewportMobile')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Frame Container */}
            <div className="bg-stone-100/60 p-4 sm:p-6 md:p-8 flex justify-center items-start min-h-105 transition-all">
                <div
                    className={cn(
                        'w-full transition-all duration-300',
                        viewport === 'mobile'
                            ? 'max-w-sm rounded-[2.5rem] border-8 border-stone-800 bg-background p-4 shadow-2xl overflow-hidden'
                            : 'max-w-4xl rounded-2xl border border-stone-300/80 bg-background p-6 shadow-sm',
                    )}
                >
                    {/* View 1: Landing Page */}
                    {previewTab === 'landing' ? (
                        <div
                            className={cn(
                                'relative isolate space-y-6 overflow-hidden rounded-xl p-1',
                                "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:content-['']",
                                promotionGridBg,
                            )}
                        >
                            {/* Running Text Luxury Marquee Ticker */}
                            <div className="relative w-full overflow-hidden rounded-full border border-nude/20 bg-linear-to-r from-white/90 via-tertiary-50/90 to-white/90 py-2 sm:py-2.5 shadow-xs backdrop-blur-md">
                                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-12 bg-linear-to-r from-cream to-transparent" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-12 bg-linear-to-l from-cream to-transparent" />
                                <div className="animate-marquee whitespace-nowrap text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-nude select-none">
                                    <span className="mx-4 sm:mx-6 inline-flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary02" />
                                        {t('promotion.previewTicker')}
                                    </span>
                                    <span className="mx-4 sm:mx-6 inline-flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary02" />
                                        {t('promotion.previewTicker')}
                                    </span>
                                </div>
                            </div>

                            {/* Main Landing Promotion Section */}
                            <div
                                className={cn(
                                    'grid items-center gap-6',
                                    viewport === 'mobile'
                                        ? 'grid-cols-1'
                                        : 'grid-cols-1 md:grid-cols-12 md:gap-8',
                                )}
                            >
                                {/* Left Content */}
                                <div
                                    className={cn(
                                        'flex flex-col',
                                        viewport === 'mobile'
                                            ? 'items-center text-center'
                                            : 'md:col-span-6 items-start text-left',
                                    )}
                                >
                                    <div className="inline-flex items-center gap-2 rounded-full border border-nude/25 bg-white/90 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary02 shadow-2xs backdrop-blur-xs">
                                        <Sparkles className="h-3.5 w-3.5 animate-pulse-soft text-primary02" />
                                        <span>{t('promotion.previewEyebrow')}</span>
                                    </div>

                                    <h3
                                        className="mt-3 font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-stone-900 leading-snug line-clamp-2 wrap-break-word"
                                        title={promotion.title}
                                    >
                                        {title}
                                    </h3>

                                    <p
                                        className="mt-3 font-sans text-xs sm:text-sm text-secondary-600 leading-relaxed line-clamp-4 wrap-break-word max-w-md"
                                        title={promotion.description}
                                    >
                                        {description}
                                    </p>

                                    {/* Highlights list matching LandingPromotion */}
                                    <ul className="mt-5 space-y-3 text-left w-full max-w-md">
                                        <li className="flex items-start gap-3 font-sans text-xs sm:text-sm text-secondary-700">
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary02/25 bg-primary02/10 text-primary02 shadow-2xs">
                                                <Sparkles className="size-3.5" />
                                            </span>
                                            <span className="pt-0.5 leading-snug">
                                                {t('promotion.previewContextOffer')}
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3 font-sans text-xs sm:text-sm text-secondary-700">
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-nude/30 bg-nude/10 text-nude shadow-2xs">
                                                <Store className="size-3.5" />
                                            </span>
                                            <span className="pt-0.5 leading-snug">
                                                {t('promotion.previewContextLocation')}
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3 font-sans text-xs sm:text-sm text-secondary-700">
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-stone-200/90 bg-stone-100/90 text-stone-700 shadow-2xs">
                                                <CalendarCheck className="size-3.5" />
                                            </span>
                                            <span className="pt-0.5 leading-snug">
                                                {t('promotion.previewContextBooking')}
                                            </span>
                                        </li>
                                    </ul>

                                    {/* CTA & Validity pill */}
                                    <div className="mt-6 flex flex-wrap items-center gap-2.5">
                                        <div className="group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-stone-900 px-6 text-xs font-semibold tracking-wider text-white shadow-[0_8px_20px_-4px_rgba(43,38,35,0.3)]">
                                            <span>{t('promotion.previewCta')}</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </div>

                                        {periodLabel ? (
                                            <div className="inline-flex items-center gap-2 rounded-full border border-nude/25 bg-white/95 px-3.5 py-2 shadow-2xs backdrop-blur-xs">
                                                <span className="relative flex h-2 w-2 shrink-0">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary02 opacity-75" />
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary02" />
                                                </span>
                                                <div className="flex items-center gap-1.5 text-left">
                                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-nude">
                                                        {periodLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Right Image Card with Luxury Accents */}
                                <div
                                    className={cn(
                                        'relative w-full',
                                        viewport === 'mobile' ? 'mt-4' : 'md:col-span-6',
                                    )}
                                >
                                    <div className="relative mx-auto max-w-sm">
                                        {/* Floating Accents */}
                                        <div className="pointer-events-none absolute -top-4 -left-4 z-20 animate-float-slow text-primary02 drop-shadow-md">
                                            <Sparkles className="h-6 w-6" />
                                        </div>
                                        <div className="pointer-events-none absolute -bottom-3 -right-3 z-20 animate-float-slow-reverse text-nude drop-shadow-md">
                                            <Gem className="h-5 w-5" />
                                        </div>

                                        {/* Dual luxury ambient glow */}
                                        <div className="absolute -inset-4 -z-10 rounded-4xl bg-linear-to-br from-primary02/20 via-nude/25 to-primary01/20 blur-xl animate-ambient-pulse" />

                                        {/* Card Frame */}
                                        <div className="relative overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-white p-2 shadow-[0_20px_44px_-16px_rgba(58,48,39,0.22)]">
                                            {/* Corner Limited Ribbon with shine sweep */}
                                            <div className="pointer-events-none absolute right-0 top-0 z-20 h-28 w-28 overflow-hidden">
                                                <div
                                                    className="relative -right-8 top-6 w-38 rotate-45 overflow-hidden py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                                                    style={{
                                                        background: `linear-gradient(to right, color-mix(in srgb, ${promoColor} 90%, black), ${promoColor}, color-mix(in srgb, ${promoColor} 90%, black))`,
                                                    }}
                                                >
                                                    <div className="absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/40 to-transparent" />
                                                    {t('promotion.limitedRibbon') || 'LIMITED'}
                                                </div>
                                            </div>

                                            <div
                                                className="relative mx-auto w-full min-h-60 max-h-120 overflow-hidden rounded-[1.35rem] bg-linear-to-b from-stone-100 to-stone-50/80 flex items-center justify-center"
                                                style={{ aspectRatio }}
                                            >
                                                {promotion.imageUrl ? (
                                                    <Image
                                                        src={promotion.imageUrl}
                                                        alt={title}
                                                        fill
                                                        sizes="(max-width: 768px) 90vw, 400px"
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-center p-6">
                                                        <ImageIcon className="h-10 w-10 text-stone-300" />
                                                        <span className="mt-2 text-xs text-stone-400 font-medium">
                                                            {t('promotion.noImage')}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/35 to-transparent z-10" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* View 2: Booking Flow (Calendar + Sidebar Card) */
                        <div className="space-y-4">
                            <div className="text-center sm:text-left mb-3">
                                <h4 className="font-display text-sm font-bold text-stone-900">
                                    {t('promotion.previewSidebarSample')}
                                </h4>
                            </div>

                            <div
                                className={cn(
                                    'grid gap-5 items-stretch',
                                    viewport === 'mobile'
                                        ? 'grid-cols-1'
                                        : 'grid-cols-1 lg:grid-cols-12',
                                )}
                            >
                                {/* Mini Calendar Simulation (Left) */}
                                <div
                                    className={cn(
                                        'rounded-3xl border border-stone-200/90 bg-white p-4.5 shadow-sm flex flex-col justify-between',
                                        viewport === 'mobile' ? 'w-full' : 'lg:col-span-6',
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                                            <span className="font-display text-xs font-bold uppercase tracking-wider text-stone-800">
                                                August 2026
                                            </span>
                                            <span
                                                className="font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                                                style={{
                                                    color: promoColor,
                                                    backgroundColor: `${promoColor}18`,
                                                    borderColor: `${promoColor}40`,
                                                }}
                                            >
                                                ✦ {t('promotion.previewCalendarSample')}
                                            </span>
                                        </div>

                                        {/* Sample Grid with highlighted promo days */}
                                        <div className="grid grid-cols-7 gap-1.5 mt-3 text-center">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                                <span
                                                    key={i}
                                                    className="font-sans text-[10px] font-bold text-stone-400 uppercase py-1"
                                                >
                                                    {d}
                                                </span>
                                            ))}
                                            {[17, 18, 19, 20, 21, 22, 23].map((day, idx) => {
                                                const isPromoDay = idx >= 2 && idx <= 5;
                                                const isToday = idx === 2;
                                                return (
                                                    <div
                                                        key={day}
                                                        className={cn(
                                                            'relative flex aspect-square flex-col items-center justify-center rounded-xl font-sans text-xs font-bold overflow-hidden transition-all',
                                                            isPromoDay
                                                                ? 'text-stone-900'
                                                                : 'text-stone-800 bg-stone-50/60',
                                                        )}
                                                        style={
                                                            isPromoDay
                                                                ? {
                                                                      backgroundColor: `${promoColor}18`,
                                                                      border: `1px solid ${promoColor}50`,
                                                                  }
                                                                : undefined
                                                        }
                                                    >
                                                        {isPromoDay ? (
                                                            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/40 to-transparent" />
                                                        ) : null}
                                                        <span className="relative z-10">{day}</span>
                                                        {isPromoDay ? (
                                                            <span
                                                                className="relative z-10 font-sans text-[7px] font-extrabold uppercase"
                                                                style={{ color: promoColor }}
                                                            >
                                                                Promo
                                                            </span>
                                                        ) : isToday ? (
                                                            <span className="relative z-10 font-sans text-[7px] font-bold uppercase text-stone-400">
                                                                Today
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Notice */}
                                    <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200/80 p-2.5 text-[11px] text-stone-600">
                                        <span
                                            className="font-semibold"
                                            style={{ color: promoColor }}
                                        >
                                            {t('promotion.previewHighlightNotice')}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Step Promotion Card (Right / Stacked) */}
                                <div
                                    className={cn(
                                        'rounded-3xl border border-stone-200/90 bg-white/95 p-5 shadow-lg shadow-black/5 flex flex-col justify-between relative overflow-hidden',
                                        viewport === 'mobile' ? 'w-full' : 'lg:col-span-6',
                                    )}
                                >
                                    {/* Top Promo Accent Bar */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1"
                                        style={{
                                            background: `linear-gradient(to right, color-mix(in srgb, ${promoColor} 80%, black), ${promoColor}, color-mix(in srgb, ${promoColor} 80%, black))`,
                                        }}
                                    />

                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            {/* Header */}
                                            <div className="flex items-center justify-between gap-2">
                                                <span
                                                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                                                    style={{
                                                        backgroundColor: promoColor,
                                                        borderColor: promoColor,
                                                    }}
                                                >
                                                    <Sparkles className="size-3 animate-pulse" />
                                                    {t('promotion.limitedRibbon') || 'LIMITED'}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="relative flex h-2 w-2">
                                                        <span
                                                            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                                                            style={{ backgroundColor: promoColor }}
                                                        />
                                                        <span
                                                            className="relative inline-flex h-2 w-2 rounded-full"
                                                            style={{ backgroundColor: promoColor }}
                                                        />
                                                    </span>
                                                    <span
                                                        className="font-sans text-[9px] font-bold uppercase tracking-wider"
                                                        style={{ color: promoColor }}
                                                    >
                                                        {t('promotion.activePromoPill') ||
                                                            'Active Offer'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Image */}
                                            {promotion.imageUrl ? (
                                                <div className="group relative mt-3 w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50 aspect-16/10 min-h-28 max-h-44 shadow-inner">
                                                    <Image
                                                        src={promotion.imageUrl}
                                                        alt={title}
                                                        fill
                                                        sizes="300px"
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/25 to-transparent z-10" />
                                                </div>
                                            ) : null}

                                            {/* Title */}
                                            <h4
                                                className="mt-3 font-display text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-snug line-clamp-2"
                                                title={promotion.title}
                                            >
                                                {title}
                                            </h4>

                                            {/* Period Pill */}
                                            {periodLabel ? (
                                                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-stone-100/90 border border-stone-200/80 px-2 py-0.5 text-[10px] font-semibold text-stone-700 w-fit">
                                                    <Calendar className="size-3 text-rose-600 shrink-0" />
                                                    <span>{periodLabel}</span>
                                                </div>
                                            ) : null}

                                            {/* Description */}
                                            <p
                                                className="mt-2 font-sans text-[11px] sm:text-xs text-stone-600 leading-relaxed line-clamp-3"
                                                title={promotion.description}
                                            >
                                                {description}
                                            </p>
                                        </div>

                                        {/* Context Items */}
                                        <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3 sm:p-3.5 space-y-2.5 shadow-2xs">
                                            <div className="flex items-center gap-1.5">
                                                <Gem className="size-3 text-rose-500" />
                                                <p className="font-display text-[11px] font-bold uppercase tracking-wider text-stone-700">
                                                    Privileges & Terms
                                                </p>
                                            </div>
                                            <ul className="space-y-2 text-left">
                                                <li className="flex items-start gap-2 font-sans text-[10px] sm:text-[11px] text-stone-700">
                                                    <span
                                                        className="flex size-5 shrink-0 items-center justify-center rounded-md border shadow-2xs"
                                                        style={{
                                                            backgroundColor: `${promoColor}18`,
                                                            borderColor: `${promoColor}40`,
                                                            color: promoColor,
                                                        }}
                                                    >
                                                        <Sparkles className="size-2.5" />
                                                    </span>
                                                    <span className="pt-0.5 leading-snug">
                                                        {t('promotion.previewContextOffer')}
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2 font-sans text-[10px] sm:text-[11px] text-stone-700">
                                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-stone-300/80 bg-white text-stone-800 shadow-2xs">
                                                        <Store className="size-2.5" />
                                                    </span>
                                                    <span className="pt-0.5 leading-snug">
                                                        {t('promotion.previewContextLocation')}
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2 font-sans text-[10px] sm:text-[11px] text-stone-700">
                                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-stone-300/80 bg-white text-stone-700 shadow-2xs">
                                                        <CalendarCheck className="size-2.5" />
                                                    </span>
                                                    <span className="pt-0.5 leading-snug">
                                                        {t('promotion.previewContextBooking')}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
