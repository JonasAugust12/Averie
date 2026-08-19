'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
    Calendar,
    CalendarCheck,
    CalendarHeart,
    ChevronLeft,
    ChevronRight,
    Gem,
    Sparkles,
    Store,
} from 'lucide-react';
import { useScheduleSettings } from '@services/schedule.service';
import { usePromotionSettings } from '@services/promotion.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { DateStepSkeleton } from '@components/skeletons';
import { formatDisplayDate } from '@utils/format.util';
import { isDateFullyClosed } from '@utils/schedule.util';
import {
    BOOKING_MAX_DAYS_AHEAD,
    getSalonLocalDateTime,
    isBookingDateAllowed,
} from '@utils/booking-schedule.util';
import { cn } from '@utils/cn.util';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0);
}

export function DateStep() {
    const t = useBookingTranslations();
    const { date, setDate, setStep } = useBookingStore();
    const { data: settings, isLoading: isScheduleLoading } = useScheduleSettings();
    const { data: promotion, isLoading: isPromoLoading } = usePromotionSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;
    const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

    const todayIso = useMemo(() => getSalonLocalDateTime().isoDate, []);

    const isPromoActive = Boolean(promotion?.enabled);
    const promoStartIso = promotion?.startDate ? promotion.startDate.slice(0, 10) : null;
    const promoEndIso = promotion?.endDate ? promotion.endDate.slice(0, 10) : null;

    const isPromoDate = useMemo(() => {
        return (iso: string) => {
            if (!isPromoActive) return false;
            if (promoStartIso && iso < promoStartIso) return false;
            if (promoEndIso && iso > promoEndIso) return false;
            return true;
        };
    }, [isPromoActive, promoStartIso, promoEndIso]);

    const cells = useMemo(() => {
        const first = startOfMonth(cursor);
        const startPad = first.getDay();
        const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
        const list: Array<{
            iso: string;
            day: number;
            inMonth: boolean;
            disabled: boolean;
            isToday: boolean;
            isPromo: boolean;
        } | null> = [];

        for (let i = 0; i < startPad; i++) list.push(null);

        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(cursor.getFullYear(), cursor.getMonth(), day, 12, 0, 0, 0);
            const iso = isoDate(d);
            const closed = settings ? isDateFullyClosed(iso, settings) : false;
            const disabled = !isBookingDateAllowed(iso) || closed;
            list.push({
                iso,
                day,
                inMonth: true,
                disabled,
                isToday: iso === todayIso,
                isPromo: isPromoDate(iso),
            });
        }

        return list;
    }, [cursor, settings, todayIso, isPromoDate]);

    if (isScheduleLoading || isPromoLoading) {
        return <DateStepSkeleton />;
    }

    const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const periodLabel = (() => {
        if (!promotion?.startDate && !promotion?.endDate) return null;
        const fmt = (d: string) =>
            new Date(d).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        if (promotion.startDate && promotion.endDate) {
            return `${fmt(promotion.startDate)} - ${fmt(promotion.endDate)}`;
        }
        if (promotion.startDate) return `From ${fmt(promotion.startDate)}`;
        return `Until ${fmt(promotion.endDate!)}`;
    })();

    return (
        <div className="w-full space-y-6">
            {/* Advance booking notice banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-secondary-200/80 bg-secondary-50/70 p-4 backdrop-blur-xs transition-all">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-200/80 text-primary">
                    <Calendar className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                            {t('advanceDaysPill') ||
                                `Booking Window: Next ${BOOKING_MAX_DAYS_AHEAD} Days`}
                        </span>
                    </div>
                    <p className="mt-1 font-sans text-xs sm:text-[13px] leading-relaxed text-stone-600">
                        {t('advanceBookingNotice', { days: BOOKING_MAX_DAYS_AHEAD }) ||
                            `Appointments can be booked up to ${BOOKING_MAX_DAYS_AHEAD} days in advance.`}{' '}
                        <span className="font-medium text-stone-700">
                            {t('sameDayNotice') ||
                                'Same-day bookings require at least 1 hour notice.'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Layout Grid: Calendar on Left, Promotion Companion Card on Right (Desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* Calendar Card */}
                <div
                    className={cn(
                        'overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 p-5 sm:p-7 lg:p-8 shadow-xl shadow-stone-900/5 backdrop-blur-md flex flex-col justify-between',
                        isPromoActive ? 'lg:col-span-6' : 'lg:col-span-12 max-w-xl mx-auto',
                    )}
                >
                    <div>
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <button
                                type="button"
                                aria-label="Previous month"
                                onClick={() =>
                                    setCursor(
                                        new Date(
                                            cursor.getFullYear(),
                                            cursor.getMonth() - 1,
                                            1,
                                            12,
                                        ),
                                    )
                                }
                                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 shadow-2xs transition-all hover:border-primary hover:bg-white hover:text-primary active:scale-95"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-primary">
                                {monthLabel}
                            </h2>
                            <button
                                type="button"
                                aria-label="Next month"
                                onClick={() =>
                                    setCursor(
                                        new Date(
                                            cursor.getFullYear(),
                                            cursor.getMonth() + 1,
                                            1,
                                            12,
                                        ),
                                    )
                                }
                                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-600 shadow-2xs transition-all hover:border-primary hover:bg-white hover:text-primary active:scale-95"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </div>

                        {/* Weekday headers */}
                        <div className="mb-3 grid grid-cols-7 gap-1 text-center font-sans text-xs sm:text-sm font-bold tracking-wider text-stone-500 uppercase">
                            {WEEKDAY_KEYS.map((key) => (
                                <span key={key} className="py-1">
                                    {t(`weekdaysShort.${key}`) || key}
                                </span>
                            ))}
                        </div>

                        {/* Date Grid */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                            {cells.map((cell, idx) => {
                                if (!cell) {
                                    return <div key={`pad-${idx}`} className="aspect-square" />;
                                }
                                const selected = date === cell.iso;
                                return (
                                    <button
                                        key={cell.iso}
                                        type="button"
                                        disabled={cell.disabled}
                                        onClick={() => setDate(cell.iso)}
                                        className={cn(
                                            'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl font-sans text-sm sm:text-base font-bold transition-all duration-200 overflow-hidden',
                                            cell.disabled &&
                                                'cursor-not-allowed text-stone-300 line-through opacity-60',
                                            !cell.disabled &&
                                                !selected &&
                                                !cell.isPromo &&
                                                !cell.isToday &&
                                                'text-stone-800 bg-stone-50/50 hover:bg-secondary-100/60 hover:text-primary hover:scale-105 active:scale-95',
                                            !cell.disabled &&
                                                !selected &&
                                                cell.isPromo &&
                                                'bg-rose-50/90 text-rose-950 border border-rose-200/90 hover:bg-rose-100 hover:border-rose-300 hover:scale-105 active:scale-95 shadow-2xs',
                                            !cell.disabled &&
                                                !selected &&
                                                cell.isToday &&
                                                !cell.isPromo &&
                                                'bg-primary/10 text-primary ring-1.5 ring-primary/30 hover:bg-primary/15 hover:scale-105 active:scale-95',
                                            selected &&
                                                !cell.isPromo &&
                                                'bg-primary text-neutral shadow-md shadow-primary/25 scale-105 ring-2 ring-primary ring-offset-2',
                                            selected &&
                                                cell.isPromo &&
                                                'bg-primary text-neutral shadow-md shadow-rose-900/30 scale-105 ring-2 ring-rose-400 ring-offset-2',
                                        )}
                                    >
                                        {/* Subtle promo glow line */}
                                        {cell.isPromo && !cell.disabled ? (
                                            <div
                                                className={cn(
                                                    'pointer-events-none absolute top-0 right-0 left-0 h-0.5',
                                                    selected
                                                        ? 'bg-linear-to-r from-transparent via-rose-300 to-transparent'
                                                        : 'bg-linear-to-r from-transparent via-rose-500 to-transparent',
                                                )}
                                            />
                                        ) : null}

                                        <span>{cell.day}</span>

                                        {/* Promo / Today Indicators (kept visible when selected) */}
                                        {cell.isPromo && !cell.disabled ? (
                                            <span
                                                className={cn(
                                                    'mt-0.5 inline-flex items-center gap-0.5 text-[7.5px] font-extrabold uppercase tracking-wider leading-none',
                                                    selected ? 'text-rose-200' : 'text-rose-700',
                                                )}
                                            >
                                                <Sparkles
                                                    className={cn(
                                                        'size-2 animate-pulse',
                                                        selected
                                                            ? 'text-rose-200'
                                                            : 'text-rose-500',
                                                    )}
                                                />
                                                PROMO
                                            </span>
                                        ) : cell.isToday && !cell.disabled ? (
                                            <span
                                                className={cn(
                                                    'mt-0.5 font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-wider leading-none',
                                                    selected ? 'text-amber-200' : 'text-primary/80',
                                                )}
                                            >
                                                {t('dateToday') || 'Today'}
                                            </span>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Calendar Legend */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5 border-t border-stone-200/60 pt-4 font-sans text-xs text-stone-600">
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-primary" />
                            <span className="font-medium">
                                {t('legend.selected') || 'Selected'}
                            </span>
                        </div>
                        {isPromoActive ? (
                            <div className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full bg-rose-500 ring-1 ring-rose-400" />
                                <span className="font-bold text-rose-800">
                                    {t('promoCompanion.promoDaysNotice')
                                        ? 'Special Promo'
                                        : 'Promo'}
                                </span>
                            </div>
                        ) : null}
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-primary/20 ring-1 ring-primary/50" />
                            <span className="font-medium">{t('legend.today') || 'Today'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full border border-stone-300 bg-stone-50" />
                            <span className="font-medium">
                                {t('legend.available') || 'Available'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-stone-200" />
                            <span className="font-medium line-through text-stone-400">
                                {t('legend.closed') || 'Closed'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Companion Promotion Card (Desktop Right Col, Mobile Stacked Below) */}
                {isPromoActive && promotion ? (
                    <div className="lg:col-span-6 relative flex flex-col justify-between rounded-3xl border border-rose-200/80 bg-linear-to-b from-white via-rose-50/20 to-stone-50/90 p-5 sm:p-7 lg:p-8 shadow-xl shadow-rose-950/5 backdrop-blur-md overflow-hidden animate-fade-in-up">
                        {/* Top Ruby Red Luxury Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-rose-500 to-red-600" />

                        {/* Ambient decorative red/rose luxury glow */}
                        <div
                            className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-red-500/15 blur-3xl"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-rose-600/15 blur-3xl"
                            aria-hidden
                        />
                        <div
                            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 rounded-full bg-red-400/5 blur-3xl"
                            aria-hidden
                        />

                        {/* Corner Ribbon with shine sweep (expanded geometry to prevent clipping) */}
                        <div
                            className="pointer-events-none absolute right-0 top-0 z-20 h-32 w-32 overflow-hidden"
                            aria-hidden
                        >
                            <div className="absolute top-7 -right-10 w-44 rotate-45 overflow-hidden bg-linear-to-r from-red-700 via-rose-600 to-red-700 py-1.5 text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-rose-950/25">
                                <div className="absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/40 to-transparent" />
                                {t('promoCompanion.limited') || 'LIMITED'}
                            </div>
                        </div>

                        {/* Top Content Section */}
                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/90 bg-rose-50/95 px-3.5 py-1 font-sans text-xs font-bold text-rose-800 uppercase tracking-wider shadow-2xs">
                                    <Sparkles className="size-3 text-rose-600 animate-pulse" />
                                    <span>{t('promoCompanion.badge') || 'Special Promotion'}</span>
                                </div>
                                {periodLabel ? (
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/90 px-3 py-1 font-sans text-xs font-semibold text-stone-700 shadow-2xs">
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600" />
                                        </span>
                                        <CalendarHeart className="size-3.5 text-stone-500" />
                                        <span className="truncate">{periodLabel}</span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Promotion Image banner if available */}
                            {promotion.imageUrl ? (
                                <div className="group relative aspect-video sm:aspect-21/9 lg:aspect-video w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-sm">
                                    <Image
                                        src={promotion.imageUrl}
                                        alt={promotion.title || 'Promotion'}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <h3 className="font-display text-xl sm:text-2xl font-bold text-primary tracking-wide leading-snug wrap-break-word line-clamp-2">
                                    {promotion.title || 'Exclusive Salon Experience'}
                                </h3>
                                {promotion.description ? (
                                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-stone-600 wrap-break-word line-clamp-4">
                                        {promotion.description}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* Bottom Perks & Terms Section */}
                        <div className="mt-6 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4 sm:p-5 space-y-3 shadow-2xs">
                            <div className="flex items-center gap-2">
                                <Gem className="size-3.5 text-rose-500" />
                                <p className="font-display text-xs font-bold uppercase tracking-wider text-stone-700">
                                    {t('promoCompanion.perksTitle') ||
                                        'Promotion Terms & Privileges'}
                                </p>
                            </div>
                            <ul className="space-y-2.5 text-xs text-stone-700">
                                <li className="flex items-start gap-2.5">
                                    <span className="flex size-5.5 shrink-0 items-center justify-center rounded-md border border-rose-200/80 bg-rose-50 text-rose-600 shadow-2xs">
                                        <Sparkles className="size-3" />
                                    </span>
                                    <span className="pt-0.5 leading-snug">
                                        {t('promoCompanion.perk1') ||
                                            'Applicable to eligible salon services during active period.'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="flex size-5.5 shrink-0 items-center justify-center rounded-md border border-nude/40 bg-nude/15 text-stone-800 shadow-2xs">
                                        <Store className="size-3" />
                                    </span>
                                    <span className="pt-0.5 leading-snug">
                                        {t('promoCompanion.perk2') ||
                                            'Applicable exclusively for direct in-store payment at checkout.'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="flex size-5.5 shrink-0 items-center justify-center rounded-md border border-stone-300/80 bg-white text-stone-700 shadow-2xs">
                                        <CalendarCheck className="size-3" />
                                    </span>
                                    <span className="pt-0.5 leading-snug">
                                        {t('promoCompanion.perk3') ||
                                            'Reserve online in advance to secure priority scheduling.'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-t sm:border-stone-200 sm:bg-background/95 sm:py-5 sm:backdrop-blur-sm sm:shadow-none">
                <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => setStep(allowStaffSelection ? 2 : 1)}
                        className="group inline-flex cursor-pointer items-center gap-1.5 sm:gap-3 rounded-full border border-stone-300 bg-background px-3.5 py-2 sm:px-4 sm:py-2 font-sans text-xs sm:text-sm font-semibold tracking-wider text-stone-700 uppercase transition-all hover:border-primary hover:text-primary hover:bg-tertiary/40 active:scale-95 duration-200 shadow-xs shrink-0"
                    >
                        <span className="flex size-5 items-center justify-center rounded-full bg-stone-100 group-hover:bg-primary/10">
                            ←
                        </span>
                        <span>{t('back') || 'Back'}</span>
                    </button>
                    <p className="font-sans text-xs sm:text-base text-stone-700 font-medium text-center truncate px-1">
                        <span className="hidden sm:inline">{t('selected') || 'Selected:'} </span>
                        <span className="font-bold text-primary">
                            {date ? formatDisplayDate(date) : '-'}
                        </span>
                    </p>
                    <Button
                        className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3.5 font-sans text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all duration-200 shrink-0"
                        disabled={!date}
                        onClick={() => setStep(4)}
                    >
                        {t('continue') || 'Continue'} →
                    </Button>
                </div>
            </div>
        </div>
    );
}
