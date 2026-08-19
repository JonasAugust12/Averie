'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import {
    CalendarCheck,
    CalendarHeart,
    ChevronLeft,
    ChevronRight,
    Gem,
    Sparkles,
    Store,
} from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { usePromotionSettings } from '@services/promotion.service';
import { formatDisplayDate } from '@utils/format.util';
import { isDateFullyClosed } from '@utils/schedule.util';
import { cn } from '@utils/cn.util';
import type { ScheduleSettingsDto } from '@typings/schedule-settings.type';

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

interface BookingDateStepProps {
    selectedDate: string;
    monthCursor: Date;
    settings: ScheduleSettingsDto | undefined;
    onSelectDate: (iso: string) => void;
    onMonthChange: (d: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function BookingDateStep({
    selectedDate,
    monthCursor,
    settings,
    onSelectDate,
    onMonthChange,
}: BookingDateStepProps) {
    const tAdmin = useAdminTranslations();
    const { data: promotion } = usePromotionSettings();

    const today = new Date();
    today.setHours(12, 0, 0, 0);

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

    // Build calendar grid
    const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1, 12, 0, 0, 0);
    const startPad = first.getDay();
    const daysInMonth = new Date(
        monthCursor.getFullYear(),
        monthCursor.getMonth() + 1,
        0,
    ).getDate();

    const calendarCells: Array<{
        iso: string;
        day: number;
        disabled: boolean;
        isPromo: boolean;
    } | null> = [];
    for (let i = 0; i < startPad; i++) calendarCells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day, 12, 0, 0, 0);
        const iso = isoDate(d);
        const past = d < today;
        const closed = settings ? isDateFullyClosed(iso, settings) : false;
        calendarCells.push({
            iso,
            day,
            disabled: past || closed,
            isPromo: isPromoDate(iso),
        });
    }

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
        <div className="space-y-5">
            {/* Quick date pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-lg mx-auto">
                {[0, 1, 2, 3, 4].map((offset) => {
                    const d = new Date();
                    d.setDate(d.getDate() + offset);
                    const iso = isoDate(d);
                    const isSelected = selectedDate === iso;
                    const label =
                        offset === 0
                            ? tAdmin('booking.date.today')
                            : offset === 1
                              ? tAdmin('booking.date.tomorrow')
                              : d.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'numeric',
                                    day: 'numeric',
                                });
                    return (
                        <button
                            key={iso}
                            type="button"
                            onClick={() => onSelectDate(iso)}
                            className={cn(
                                'px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer',
                                isSelected
                                    ? 'bg-stone-900 text-white shadow-sm'
                                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100',
                            )}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Layout Grid: Calendar on Left, Promotion Companion Card on Right when active */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Calendar */}
                <div
                    className={cn(
                        'bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between',
                        isPromoActive ? 'lg:col-span-6' : 'lg:col-span-12 max-w-xl mx-auto w-full',
                    )}
                >
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() =>
                                    onMonthChange(
                                        new Date(
                                            monthCursor.getFullYear(),
                                            monthCursor.getMonth() - 1,
                                            1,
                                            12,
                                        ),
                                    )
                                }
                                className="h-9 w-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <h3 className="font-display text-lg font-bold text-stone-900">
                                {monthCursor.toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    onMonthChange(
                                        new Date(
                                            monthCursor.getFullYear(),
                                            monthCursor.getMonth() + 1,
                                            1,
                                            12,
                                        ),
                                    )
                                }
                                className="h-9 w-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs font-bold text-stone-400 uppercase mb-2">
                            {WEEKDAYS.map((d) => (
                                <span key={d}>{d}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                            {calendarCells.map((cell, idx) => {
                                if (!cell)
                                    return <div key={`pad-${idx}`} className="aspect-square" />;
                                const isSelected = selectedDate === cell.iso;
                                return (
                                    <button
                                        key={cell.iso}
                                        type="button"
                                        disabled={cell.disabled}
                                        onClick={() => onSelectDate(cell.iso)}
                                        className={cn(
                                            'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl font-sans text-sm font-bold transition-all duration-200 overflow-hidden',
                                            cell.disabled &&
                                                'cursor-not-allowed text-stone-300 line-through opacity-55',
                                            !cell.disabled &&
                                                !isSelected &&
                                                !cell.isPromo &&
                                                'text-stone-800 bg-stone-50/60 hover:bg-stone-100 hover:scale-105 active:scale-95',
                                            !cell.disabled &&
                                                !isSelected &&
                                                cell.isPromo &&
                                                'bg-rose-50/90 text-rose-950 border border-rose-200/90 hover:bg-rose-100 hover:scale-105 active:scale-95 shadow-2xs',
                                            isSelected &&
                                                !cell.isPromo &&
                                                'bg-stone-900 text-white shadow-md scale-105 ring-2 ring-stone-900 ring-offset-1',
                                            isSelected &&
                                                cell.isPromo &&
                                                'bg-stone-900 text-white shadow-md scale-105 ring-2 ring-rose-500 ring-offset-1',
                                        )}
                                    >
                                        {/* Promo shine sweep animation for promo dates */}
                                        {cell.isPromo && !cell.disabled ? (
                                            <div
                                                className={cn(
                                                    'pointer-events-none absolute inset-0 -translate-x-full animate-shine z-10',
                                                    isSelected
                                                        ? 'bg-linear-to-r from-transparent via-white/40 to-transparent'
                                                        : 'bg-linear-to-r from-transparent via-rose-400/60 to-transparent',
                                                )}
                                                style={{
                                                    animationDelay: `${(cell.day % 4) * 0.75}s`,
                                                }}
                                            />
                                        ) : null}

                                        <span className="relative z-10">{cell.day}</span>

                                        {cell.isPromo && !cell.disabled ? (
                                            <span
                                                className={cn(
                                                    'relative z-10 mt-0.5 inline-flex items-center gap-0.5 text-[6.5px] font-extrabold uppercase tracking-wider leading-none truncate max-w-full px-0.5',
                                                    isSelected ? 'text-rose-200' : 'text-rose-700',
                                                )}
                                            >
                                                <Sparkles className="size-1.5 shrink-0 animate-pulse text-rose-500" />
                                                <span className="truncate">PROMO</span>
                                            </span>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    {isPromoActive && (
                        <div className="mt-4 flex items-center justify-center gap-4 border-t border-stone-200/60 pt-3 font-sans text-xs text-stone-600">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-stone-900" />
                                <span className="font-medium">Selected</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-rose-500 ring-1 ring-rose-400" />
                                <span className="font-bold text-rose-800">Promo Day</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-stone-200" />
                                <span className="font-medium line-through text-stone-400">
                                    Closed
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Promotion Companion Card in Admin Modal */}
                {isPromoActive && promotion ? (
                    <div className="lg:col-span-6 relative flex flex-col justify-between rounded-3xl border border-rose-200/80 bg-linear-to-b from-white via-rose-50/20 to-stone-50/90 p-5 shadow-sm overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-rose-500 to-red-600" />

                        {/* Top Content */}
                        <div className="space-y-3.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/90 bg-rose-50/95 px-3 py-0.5 font-sans text-xs font-bold text-rose-800 uppercase tracking-wider shadow-2xs">
                                    <Sparkles className="size-3 text-rose-600 animate-pulse" />
                                    <span>Special Promotion Active</span>
                                </div>
                                {periodLabel ? (
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white px-2.5 py-0.5 font-sans text-xs font-semibold text-stone-700 shadow-2xs">
                                        <CalendarHeart className="size-3 text-rose-500" />
                                        <span className="truncate">{periodLabel}</span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Image if available */}
                            {promotion.imageUrl ? (
                                <div className="group relative aspect-21/9 w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-xs">
                                    <Image
                                        src={promotion.imageUrl}
                                        alt={promotion.title || 'Promotion'}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                                    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-linear-to-r from-transparent via-white/35 to-transparent z-10" />
                                </div>
                            ) : null}

                            <div>
                                <h4 className="font-display text-lg font-bold text-stone-900 leading-snug line-clamp-1">
                                    {promotion.title || 'Special Salon Offer'}
                                </h4>
                                {promotion.description ? (
                                    <p className="font-sans text-xs leading-relaxed text-stone-600 mt-1 line-clamp-3">
                                        {promotion.description}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* Perks section */}
                        <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Gem className="size-3 text-rose-500" />
                                <p className="font-display text-[11px] font-bold uppercase tracking-wider text-stone-700">
                                    Active Promotion Privileges
                                </p>
                            </div>
                            <ul className="space-y-1.5 text-[11px] text-stone-600">
                                <li className="flex items-center gap-2">
                                    <Sparkles className="size-3 text-rose-500 shrink-0" />
                                    <span className="truncate">
                                        Promo discount applies at in-store checkout.
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Store className="size-3 text-stone-500 shrink-0" />
                                    <span className="truncate">
                                        Admin can apply offer for walking or phoned clients.
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CalendarCheck className="size-3 text-stone-500 shrink-0" />
                                    <span className="truncate">
                                        Guarantees promo priority slot allocation.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="text-center font-sans text-xs sm:text-sm font-semibold text-stone-600">
                {tAdmin('booking.date.selectedDate')}{' '}
                <span className="font-bold text-stone-950">{formatDisplayDate(selectedDate)}</span>
            </div>
        </div>
    );
}
