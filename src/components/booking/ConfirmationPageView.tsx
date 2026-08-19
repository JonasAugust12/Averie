'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Check,
    Copy,
    CheckCheck,
    ExternalLink,
    MapPin,
    Phone,
    Clock,
    Calendar,
    Sparkles,
    User,
    Mail,
    MessageSquareQuote,
    ShieldCheck,
    CalendarCheck,
} from 'lucide-react';
import { useBookingByReference } from '@services/booking.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { BookingChrome } from '@components/booking';
import { Button } from '@components/common';
import { BookingConfirmationSkeleton } from '@components/skeletons';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import { formatUserName, deriveInitials } from '@utils/staff.util';
import { toastSuccess } from '@utils/toast.util';

const SALON_MAP_EMBED_URL =
    'https://maps.google.com/maps?q=Averie%20Nails%20Spa%20Cohasset%20MA&t=&z=17&ie=UTF8&iwloc=&output=embed';
const SALON_MAP_DIRECTIONS_URL = 'https://maps.app.goo.gl/YCtZW533i3x6BB5QA';

export function ConfirmationPageView() {
    const t = useBookingTranslations();
    const router = useRouter();
    const { reference, reset } = useBookingStore();
    const { data: booking, isLoading } = useBookingByReference(reference ?? '');
    const [copied, setCopied] = useState(false);

    const activeReference = booking?.reference ?? reference ?? '';
    const selectedServices = booking?.services ?? [];
    const totalPrice = booking?.totalPrice ?? 0;
    const totalDuration =
        booking?.totalEstimatedMinutes ??
        selectedServices.reduce((sum, s) => sum + s.estimatedMinutes, 0);

    const employeeName = booking
        ? booking.staff
            ? formatUserName(booking.staff)
            : booking.staffPreference === 'any'
              ? t('anyTechnician')
              : '—'
        : '—';
    const employeeInitials = booking?.staff ? deriveInitials(formatUserName(booking.staff)) : '★';

    function handleCopyReference() {
        if (!activeReference) return;
        navigator.clipboard.writeText(activeReference);
        setCopied(true);
        toastSuccess(t('confirmation.copied') || 'Reference code copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    }

    function handleBookAnother() {
        reset();
        router.push('/book');
    }

    if (reference && isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-background pb-36 text-foreground md:pb-12">
                <BookingChrome step={6} complete />
                <div className="mx-auto flex w-full max-w-app flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-10 md:max-w-5xl lg:max-w-6xl">
                    <BookingConfirmationSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background pb-36 text-foreground md:pb-14">
            <BookingChrome step={6} complete />

            <div className="mx-auto flex w-full max-w-app flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-10 md:max-w-5xl lg:max-w-6xl">
                {/* Hero Header */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8 animate-fade-in-up">
                    <div className="relative mb-3 sm:mb-4">
                        <div className="absolute inset-0 scale-150 rounded-full bg-emerald-500/15 blur-xl animate-pulse" />
                        <span className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-emerald-600/30 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/15">
                            <Check className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/70 mb-2.5">
                        <CalendarCheck className="size-3.5" />
                        Booking Request Received
                    </div>

                    <h1 className="font-display text-2.5xl sm:text-3.5xl md:text-4xl font-bold tracking-tight text-primary">
                        {t('confirmation.title')}
                    </h1>
                    <p className="mt-2 max-w-md sm:max-w-xl font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {t('confirmation.subtitle')}
                    </p>
                </div>

                {/* 2-Column Bento Grid */}
                <div className="grid w-full gap-6 md:grid-cols-2 md:items-start lg:gap-8 animate-fade-in-up">
                    {/* Left Column: Boarding Pass / Reservation Ticket */}
                    <article className="flex w-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 shadow-sm backdrop-blur-md">
                        {/* Reference Bar */}
                        {activeReference ? (
                            <div className="border-b border-stone-200/80 bg-stone-50/80 p-4 sm:p-5 flex items-center justify-between gap-3">
                                <div>
                                    <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-widest text-stone-500 uppercase">
                                        {t('confirmation.reference')}
                                    </span>
                                    <p className="font-display text-lg sm:text-xl font-bold tracking-wider text-primary">
                                        {activeReference}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyReference}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300/80 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-stone-700 shadow-xs hover:border-primary hover:text-primary active:scale-95 transition-all duration-200"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCheck className="size-3.5 text-emerald-600" />
                                            <span className="text-emerald-700">
                                                {t('confirmation.copied')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3.5 text-stone-400" />
                                            <span>{t('confirmation.copyCode')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : null}

                        {/* Services Details */}
                        <div className="p-5 sm:p-6 border-b border-stone-100">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="font-sans text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                    {t('review.service')}
                                </span>
                                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-sans text-[10px] font-semibold text-stone-600">
                                    {selectedServices.length}{' '}
                                    {selectedServices.length === 1 ? 'service' : 'services'}
                                </span>
                            </div>

                            {selectedServices.length > 0 ? (
                                <ul className="divide-y divide-stone-100 rounded-2xl border border-stone-200/70 bg-stone-50/50 p-1">
                                    {selectedServices.map((svc) => (
                                        <li
                                            key={svc.id}
                                            className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-sans text-xs sm:text-sm font-semibold text-primary truncate">
                                                    {svc.name}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 font-medium shrink-0 bg-white border border-stone-200/60 px-2.5 py-1 rounded-lg shadow-2xs">
                                                <Clock className="size-3 text-stone-400" />
                                                {svc.estimatedMinutes} min
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>

                        {/* Bento Grid: Technician & Schedule */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 border-b border-stone-100 bg-white">
                            {/* Technician */}
                            <div className="p-4 sm:p-5 flex flex-col justify-between">
                                <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                    {t('review.employee')}
                                </span>
                                <div className="mt-2.5 flex items-center gap-3">
                                    {booking?.staffPreference === 'any' ? (
                                        <span className="flex size-10 sm:size-11 items-center justify-center rounded-xl bg-tertiary text-primary shadow-xs">
                                            <Sparkles className="size-5 text-primary" />
                                        </span>
                                    ) : (
                                        <span className="flex size-10 sm:size-11 items-center justify-center rounded-xl font-sans text-sm sm:text-base font-bold shadow-xs bg-primary/10 text-primary border border-primary/20">
                                            {employeeInitials}
                                        </span>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-display text-sm sm:text-base font-bold text-primary truncate">
                                            {employeeName}
                                        </p>
                                        <p className="font-sans text-[11px] text-stone-500 font-medium truncate">
                                            {booking?.staffPreference === 'any'
                                                ? t('anyTechnicianHint')
                                                : t('defaultRole')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="p-4 sm:p-5 flex flex-col justify-between">
                                <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                    {t('review.date')} & {t('review.time')}
                                </span>
                                <div className="mt-2.5 flex items-center gap-3">
                                    <span className="flex size-10 sm:size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-900 shadow-xs">
                                        <Calendar className="size-5 text-amber-800" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-sans text-sm sm:text-base font-bold text-primary capitalize truncate">
                                            {booking?.date ? formatDisplayDate(booking.date) : '—'}
                                        </p>
                                        <div className="mt-0.5 inline-flex items-center gap-1 font-sans text-xs font-semibold text-amber-800">
                                            <Clock className="size-3" />
                                            <span>{booking?.time || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        {booking?.customer ? (
                            <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/30">
                                <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                    {t('review.customer')}
                                </span>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                                    <div className="flex items-center gap-2 rounded-xl border border-stone-200/60 bg-white p-2.5">
                                        <User className="size-3.5 text-stone-500 shrink-0" />
                                        <span className="font-semibold text-primary truncate">
                                            {booking.customer.firstName} {booking.customer.lastName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-xl border border-stone-200/60 bg-white p-2.5">
                                        <Phone className="size-3.5 text-stone-500 shrink-0" />
                                        <span className="font-semibold text-primary truncate">
                                            {booking.customer.phone}
                                        </span>
                                    </div>
                                    {booking.customer.email && (
                                        <div className="flex items-center gap-2 rounded-xl border border-stone-200/60 bg-white p-2.5 sm:col-span-2">
                                            <Mail className="size-3.5 text-stone-500 shrink-0" />
                                            <span className="font-semibold text-primary truncate">
                                                {booking.customer.email}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Special Requests (if any) */}
                        {booking?.customer?.note && (
                            <div className="p-4 sm:p-5 border-b border-stone-100 bg-amber-50/20">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <MessageSquareQuote className="size-3.5 text-amber-700" />
                                    <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-wider text-amber-900 uppercase">
                                        {t('review.notes') || 'Special Requests'}
                                    </span>
                                </div>
                                <div className="rounded-xl border border-amber-200/60 bg-white/90 p-3">
                                    <p className="font-sans text-xs text-stone-700 leading-relaxed italic">
                                        &ldquo;{booking.customer.note}&rdquo;
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Price & Summary Total */}
                        <div className="border-t border-stone-200 bg-primary/5 p-4 sm:p-6 flex items-center justify-between gap-4">
                            <div>
                                <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-widest text-stone-500 uppercase">
                                    {t('total')}
                                </span>
                                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-stone-600 font-medium">
                                    <Clock className="size-3 text-stone-400" />
                                    <span>{totalDuration} mins estimated time</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-display text-xl sm:text-2xl font-bold text-primary tracking-tight">
                                    {formatUsd(totalPrice)}
                                </span>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden border-t border-stone-200 bg-white p-5 sm:p-6 md:flex md:flex-col md:gap-2.5">
                            <Button
                                className="w-full rounded-full py-3 font-sans text-xs font-bold tracking-widest uppercase shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] bg-primary hover:bg-primary/90 text-neutral"
                                onClick={handleBookAnother}
                            >
                                {t('cta.bookAnother')}
                            </Button>
                            <Link href="/" className="w-full">
                                <Button
                                    variant="outlined"
                                    className="w-full rounded-full py-2.5 font-sans text-xs font-bold tracking-widest uppercase hover:bg-stone-50"
                                >
                                    {t('cta.backHome')}
                                </Button>
                            </Link>
                        </div>
                    </article>

                    {/* Right Column: Salon Concierge & Location */}
                    <section
                        aria-labelledby="confirmation-location-heading"
                        className="flex w-full flex-col gap-5"
                    >
                        <article className="flex w-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 shadow-sm backdrop-blur-md">
                            {/* Card Header with Address */}
                            <div className="p-5 sm:p-6 border-b border-stone-100">
                                <div className="flex items-start gap-3.5">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-xs">
                                        <MapPin className="size-5" aria-hidden />
                                    </span>
                                    <div className="min-w-0 text-left">
                                        <h2
                                            id="confirmation-location-heading"
                                            className="font-display text-sm sm:text-base font-bold tracking-wide text-primary uppercase"
                                        >
                                            {t('confirmation.visitUs')}
                                        </h2>
                                        <p className="mt-1 font-sans text-xs sm:text-sm font-semibold text-stone-800">
                                            {t('confirmation.addressLine1')}
                                        </p>
                                        <p className="font-sans text-[11px] sm:text-xs text-stone-500 font-medium">
                                            {t('confirmation.addressLine2')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Google Maps Frame */}
                            <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                                <iframe
                                    title={t('confirmation.visitUs')}
                                    src={SALON_MAP_EMBED_URL}
                                    className="absolute inset-0 h-full w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            {/* Contact & Hours Quick Bar */}
                            <div className="p-5 sm:p-6 space-y-3.5 bg-stone-50/50">
                                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                                    <div className="flex items-center gap-2 text-stone-600 font-medium">
                                        <Phone className="size-4 text-primary shrink-0" />
                                        <span>{t('confirmation.phone')}:</span>
                                    </div>
                                    <a
                                        href="tel:7819231955"
                                        className="font-bold text-primary underline underline-offset-4 hover:text-stone-900 transition-colors"
                                    >
                                        {t('confirmation.phoneNumber')}
                                    </a>
                                </div>

                                <div className="flex items-start justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-2 text-stone-600 font-medium shrink-0">
                                        <Clock className="size-4 text-primary shrink-0" />
                                        <span>{t('confirmation.hours')}:</span>
                                    </div>
                                    <span className="font-medium text-stone-700 text-right leading-tight">
                                        {t('confirmation.hoursDetail')}
                                    </span>
                                </div>

                                <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between">
                                    <a
                                        href={SALON_MAP_DIRECTIONS_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-1.5 font-sans text-xs font-bold text-primary transition-colors hover:text-stone-900"
                                    >
                                        <span className="underline underline-offset-4 group-hover:decoration-primary">
                                            {t('confirmation.getDirections')}
                                        </span>
                                        <ExternalLink className="size-3.5 shrink-0 text-primary group-hover:translate-x-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </article>

                        {/* Reassurance & Arrival Policy */}
                        <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-5 shadow-xs flex items-start gap-3.5">
                            <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-sans text-xs font-bold text-stone-800">
                                    {t('confirmation.needChanges')}
                                </p>
                                <p className="font-sans text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                                    {t('confirmation.callAnytime')}
                                </p>
                                <p className="font-sans text-[11px] sm:text-xs text-stone-500 italic pt-1">
                                    {t('confirmation.arrivalTip')}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Mobile Bottom Fixed Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/80 bg-white/95 px-4 py-3 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all">
                <div className="mx-auto flex max-w-app flex-col gap-2">
                    <Button
                        className="w-full rounded-full py-3 font-sans text-xs font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all bg-primary hover:bg-primary/90 text-neutral"
                        onClick={handleBookAnother}
                    >
                        {t('cta.bookAnother')}
                    </Button>
                    <Link href="/" className="w-full">
                        <Button
                            variant="outlined"
                            className="w-full rounded-full py-2.5 font-sans text-[11px] font-bold tracking-wider uppercase active:scale-95 transition-all"
                        >
                            {t('cta.backHome')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
