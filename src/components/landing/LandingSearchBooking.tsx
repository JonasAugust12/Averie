'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useBookingByReference } from '@services/booking.service';
import { useSalonTranslations, useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { FadeIn, PillLink } from '@components/landing';
import { landingInteractive, landingStaticText } from '@components/landing/styles';
import {
    Search,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Scissors,
    Phone,
    Copy,
    Check,
    CalendarX,
    ArrowRight,
    Sparkles,
    X,
    FileText,
} from 'lucide-react';
import { cn } from '@utils/cn.util';
import { formatUserName } from '@utils/staff.util';
import { formatUsd } from '@utils/format.util';
import { normalizeBookingLookupQuery } from '@utils/phone.util';

// Micro Barcode Component for luxury appointment pass aesthetic
function BarCode({ code }: { code: string }) {
    const bits = useMemo(() => {
        let h = 0;
        for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
        return Array.from({ length: 60 }, (_, i) => ((h >> (i % 31)) & 1) === 1);
    }, [code]);

    const width = 150;
    const height = 36;
    const barW = Math.floor(width / bits.length);
    const offsetX = (width - bits.length * barW) / 2;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            aria-label={`Barcode ${code}`}
            className="select-none mx-auto opacity-75"
        >
            <rect x="0" y="0" width={width} height={height} fill="transparent" />
            <g transform={`translate(${offsetX}, 0)`}>
                {bits.map((isThick, i) => (
                    <rect
                        key={i}
                        x={i * barW}
                        y={2}
                        width={isThick ? Math.max(1, barW) : Math.max(1, Math.floor(barW * 0.6))}
                        height={height - 4}
                        fill="#2E2A27"
                    />
                ))}
            </g>
        </svg>
    );
}

export function LandingSearchBooking() {
    const t = useSalonTranslations();
    const tBook = useBookingTranslations();
    const savedPhone = useBookingStore((state) => state.customer?.phone);
    const [reference, setReference] = useState('');
    const [searchReference, setSearchReference] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (savedPhone) {
            setReference((current) => current || savedPhone);
        }
    }, [savedPhone]);

    const { data: booking, isLoading, isError } = useBookingByReference(searchReference);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = reference.trim();
        if (!trimmed) return;
        setSearchReference(normalizeBookingLookupQuery(trimmed));
        setHasSearched(true);
    };

    const handleClear = () => {
        setReference('');
        setSearchReference('');
        setHasSearched(false);
    };

    const handleCopy = () => {
        if (!booking?.reference) return;
        navigator.clipboard.writeText(booking.reference);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return {
                    label: 'Confirmed',
                    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
                    dot: 'bg-emerald-500',
                    ping: true,
                    icon: <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />,
                };
            case 'cancelled':
                return {
                    label: 'Cancelled',
                    bg: 'bg-rose-50 text-rose-700 border-rose-200',
                    dot: 'bg-rose-500',
                    ping: false,
                    icon: <XCircle className="size-3.5 shrink-0 text-rose-600" />,
                };
            default:
                return {
                    label: status || 'Completed',
                    bg: 'bg-stone-100 text-stone-700 border-stone-300/80',
                    dot: 'bg-stone-500',
                    ping: false,
                    icon: <AlertCircle className="size-3.5 shrink-0 text-stone-500" />,
                };
        }
    };

    const formatDisplayDate = (d: string) => {
        try {
            const dateObj = new Date(`${d}T12:00:00`);
            return dateObj.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return d;
        }
    };

    const staffLabel = booking
        ? booking.staff
            ? formatUserName(booking.staff)
            : booking.staffPreference === 'any'
              ? tBook('anyTechnician')
              : tBook('staffFallback')
        : '';

    return (
        <section id="search-booking" className="relative py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <FadeIn className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-nude/30 bg-nude/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nude">
                        <Sparkles className="h-3.5 w-3.5 text-primary02" aria-hidden />
                        <span>{t('landing.searchBooking.title')}</span>
                    </div>
                    <h2
                        className={cn(
                            'mt-4 font-display text-3xl font-semibold uppercase tracking-wide text-nude sm:text-4xl md:text-[40px]',
                            landingStaticText,
                        )}
                    >
                        {t('landing.searchBooking.title')}
                    </h2>
                    <p
                        className={cn(
                            'mt-3 max-w-lg mx-auto font-sans text-sm sm:text-base text-body',
                            landingStaticText,
                        )}
                    >
                        {t('landing.searchBooking.subtitle')}
                    </p>
                </FadeIn>

                <FadeIn delay={0.1} className="mt-8 md:mt-10">
                    <div className="relative mx-auto w-full overflow-hidden rounded-3xl border border-stone-200/80 bg-white/80 p-5 sm:p-7 md:p-8 shadow-[0_20px_50px_-15px_rgba(43,38,35,0.15)] ring-1 ring-black/5 backdrop-blur-xl">
                        {/* Search Input Form */}
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 size-4.5 text-stone-400" />
                                <input
                                    type="text"
                                    required
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder={t('landing.searchBooking.placeholder')}
                                    className="w-full rounded-full border border-stone-300/90 bg-white/95 py-3.5 pl-11.5 pr-10 font-sans text-sm sm:text-base text-stone-800 placeholder:text-stone-450 focus:border-stone-600 focus:outline-hidden focus:ring-2 focus:ring-stone-600/20 shadow-xs transition-all"
                                />
                                {reference && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
                                        aria-label="Clear input"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className={cn(
                                    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-third px-6 py-3.5 sm:py-4 font-sans text-xs sm:text-sm font-semibold tracking-wider text-cream uppercase transition-all duration-300 hover:shadow-[0_8px_20px_-4px_rgba(43,38,35,0.4)] hover:scale-[1.02] active:scale-[0.98] shrink-0',
                                    landingInteractive,
                                )}
                            >
                                <Search className="size-4" />
                                <span>{t('landing.searchBooking.button')}</span>
                            </button>
                        </form>

                        {/* Search Results Area */}
                        {hasSearched && (
                            <div className="mt-6 md:mt-8 border-t border-stone-200/60 pt-6">
                                {isLoading ? (
                                    /* Loading Skeleton */
                                    <div className="animate-pulse space-y-4 rounded-2xl border border-stone-200/70 bg-[#FAF9F6]/80 p-5 sm:p-6 backdrop-blur-md">
                                        <div className="flex items-center justify-between">
                                            <div className="h-5 w-32 rounded-full bg-stone-200/80" />
                                            <div className="h-6 w-24 rounded-full bg-stone-200/80" />
                                        </div>
                                        <div className="h-7 w-48 rounded-md bg-stone-200/80" />
                                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 pt-1">
                                            <div className="h-14 rounded-xl bg-stone-200/60" />
                                            <div className="h-14 rounded-xl bg-stone-200/60" />
                                            <div className="h-14 rounded-xl bg-stone-200/60" />
                                        </div>
                                        <p className="text-center font-sans text-xs text-stone-500 font-medium pt-1">
                                            {t('landing.searchBooking.searching')}
                                        </p>
                                    </div>
                                ) : !booking || isError ? (
                                    /* Not Found / Error State */
                                    <div
                                        className={cn(
                                            'flex flex-col items-center justify-center rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-6 sm:p-8 text-center shadow-xs backdrop-blur-md',
                                            landingStaticText,
                                        )}
                                    >
                                        <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-stone-100 border border-stone-200/80 text-stone-400 shadow-2xs">
                                            <CalendarX className="size-6 text-stone-500" />
                                        </div>
                                        <h4 className="mt-3.5 font-display text-lg sm:text-xl font-bold text-stone-900">
                                            {t('landing.searchBooking.noResultsTitle')}
                                        </h4>
                                        <p className="mt-1.5 max-w-md font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
                                            {t('landing.searchBooking.noResultsDesc')}
                                        </p>
                                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                            <PillLink
                                                href="/book"
                                                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
                                            >
                                                <span>{t('landing.searchBooking.bookNew')}</span>
                                                <ArrowRight className="size-3.5" />
                                            </PillLink>
                                        </div>
                                    </div>
                                ) : (
                                    /* Found State — Luxury Appointment Pass */
                                    <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-[#FCFAF6] shadow-[0_12px_30px_-8px_rgba(43,38,35,0.12)]">
                                        {/* Ticket Header & Brand */}
                                        <div className="flex flex-col gap-3.5 border-b border-stone-200/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#221F1C] text-white shadow-2xs">
                                                    <Image
                                                        src="/icons/logo_round.png"
                                                        alt="Averie Logo"
                                                        width={36}
                                                        height={36}
                                                        className="size-8 rounded-full object-cover opacity-90"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="font-serif text-sm font-bold uppercase tracking-widest text-amber-900 block">
                                                        Averie Salon
                                                    </span>
                                                    <span className="text-[11px] font-sans text-stone-500 font-medium block">
                                                        {t('landing.searchBooking.passSubtitle')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                                {(() => {
                                                    const badge = getStatusBadge(booking.status);
                                                    return (
                                                        <div
                                                            className={cn(
                                                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-2xs',
                                                                badge.bg,
                                                            )}
                                                        >
                                                            <span className="relative flex h-2 w-2">
                                                                {badge.ping && (
                                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                                                )}
                                                                <span
                                                                    className={cn(
                                                                        'relative inline-flex h-2 w-2 rounded-full',
                                                                        badge.dot,
                                                                    )}
                                                                />
                                                            </span>
                                                            <span>{badge.label}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {/* Ticket Main Content */}
                                        <div className="p-4 sm:p-6 space-y-5">
                                            {/* Services & Duration Banner */}
                                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-stone-200/50 pb-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {booking.services.map((s) => (
                                                            <span
                                                                key={s.id}
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100/90 border border-stone-200/80 px-2.5 py-1 text-xs font-medium text-stone-800"
                                                            >
                                                                <Scissors className="size-3 text-stone-500" />
                                                                {s.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                                    {booking.totalEstimatedMinutes ? (
                                                        <span className="text-xs text-stone-500 font-medium">
                                                            {booking.totalEstimatedMinutes} mins
                                                        </span>
                                                    ) : null}
                                                    {booking.totalPrice ? (
                                                        <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                                                            {formatUsd(booking.totalPrice)}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Bento Key Details Grid */}
                                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                                {/* Date Card */}
                                                <div className="flex items-center gap-3 rounded-xl border border-stone-200/70 bg-white p-3 shadow-2xs">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                                                        <Calendar className="size-4.5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                                            {t('landing.searchBooking.date')}
                                                        </span>
                                                        <span className="font-sans text-xs sm:text-sm font-bold text-stone-800 truncate block">
                                                            {formatDisplayDate(booking.date)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Time Card */}
                                                <div className="flex items-center gap-3 rounded-xl border border-stone-200/70 bg-white p-3 shadow-2xs">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                                                        <Clock className="size-4.5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                                            {t('landing.searchBooking.time')}
                                                        </span>
                                                        <span className="font-sans text-xs sm:text-sm font-bold text-stone-800 truncate block">
                                                            {booking.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Technician Card */}
                                                <div className="flex items-center gap-3 rounded-xl border border-stone-200/70 bg-white p-3 shadow-2xs">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                                                        <User className="size-4.5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                                            {t('landing.searchBooking.staff')}
                                                        </span>
                                                        <span className="font-sans text-xs sm:text-sm font-bold text-stone-800 truncate block">
                                                            {staffLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Name & Phone Details */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-100/70 px-3.5 py-2.5 text-xs text-stone-700">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-stone-900">
                                                        {booking.customer.firstName}{' '}
                                                        {booking.customer.lastName}
                                                    </span>
                                                    {booking.customer.phone && (
                                                        <span className="inline-flex items-center gap-1 text-stone-500 font-mono">
                                                            <Phone className="size-3 text-stone-400" />
                                                            {booking.customer.phone}
                                                        </span>
                                                    )}
                                                </div>
                                                {booking.customer.note ? (
                                                    <div className="flex items-center gap-1.5 text-stone-500 italic text-[11px] w-full mt-1 border-t border-stone-200/60 pt-1.5">
                                                        <FileText className="size-3.5 shrink-0" />
                                                        <span className="truncate">
                                                            &ldquo;{booking.customer.note}&rdquo;
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Perforated Tear Line with Punch Holes */}
                                        <div className="relative py-1">
                                            <div className="h-0.5 w-full [background:repeating-linear-gradient(to_right,#E5E0D8_0_8px,transparent_8px_14px)]" />
                                            <span className="absolute -left-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-white border border-stone-200/80" />
                                            <span className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-white border border-stone-200/80" />
                                        </div>

                                        {/* Ticket Stub Footer (Barcode & Reference) */}
                                        <div className="p-4 sm:p-5 bg-[#FAF8F4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            {/* Barcode & Reference Tag */}
                                            <div className="flex flex-col items-center sm:items-start space-y-1">
                                                <BarCode code={booking.reference} />
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-stone-800 tracking-wider">
                                                        REF: {booking.reference}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={handleCopy}
                                                        className="inline-flex items-center gap-1 rounded-md bg-white border border-stone-200/80 px-2 py-0.5 text-[10px] font-semibold text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 transition-all cursor-pointer"
                                                        title="Copy reference code"
                                                    >
                                                        {copied ? (
                                                            <>
                                                                <Check className="size-3 text-emerald-600" />
                                                                <span className="text-emerald-700 font-bold">
                                                                    {t(
                                                                        'landing.searchBooking.copied',
                                                                    )}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="size-3 text-stone-400" />
                                                                <span>
                                                                    {t(
                                                                        'landing.searchBooking.copyCode',
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Concierge Hotline Guidance */}
                                            <div className="max-w-xs text-center sm:text-right">
                                                <p className="font-sans text-[11px] text-stone-500 leading-relaxed">
                                                    {t('landing.searchBooking.guide')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
