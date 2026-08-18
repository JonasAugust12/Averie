'use client';

import { useState } from 'react';
import { useBookingByReference } from '@services/booking.service';
import { useSalonTranslations, useBookingTranslations } from '@i18n/use-app-translations';
import { FadeIn } from '@components/landing';
import { landingInteractive, landingStaticText } from '@components/landing/styles';
import { Search, Calendar, Clock, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@utils/cn.util';
import { formatUserName } from '@utils/staff.util';

export function LandingSearchBooking() {
    const t = useSalonTranslations();
    const tBook = useBookingTranslations();
    const [reference, setReference] = useState('');
    const [searchReference, setSearchReference] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const { data: booking, isLoading, isError } = useBookingByReference(searchReference);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchReference(reference.trim());
        setHasSearched(true);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'upcoming':
                return {
                    bg: 'bg-emerald-50 border-emerald-250 text-emerald-700',
                    icon: <CheckCircle className="size-4 shrink-0 text-emerald-600" />,
                };
            case 'cancelled':
                return {
                    bg: 'bg-rose-50 border-rose-250 text-rose-700',
                    icon: <XCircle className="size-4 shrink-0 text-rose-600" />,
                };
            default:
                return {
                    bg: 'bg-stone-50 border-stone-200 text-stone-600',
                    icon: <AlertCircle className="size-4 shrink-0 text-stone-500" />,
                };
        }
    };

    const formatDisplayDate = (d: string) => {
        try {
            const dateObj = new Date(d);
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
            <div className="mx-auto max-w-3xl px-4">
                <FadeIn className="text-center">
                    <h2
                        className={`font-display text-3xl font-semibold uppercase tracking-wide text-nude md:text-4xl ${landingStaticText}`}
                    >
                        {t('landing.searchBooking.title')}
                    </h2>
                    <p className={`mt-4 font-sans text-base text-body ${landingStaticText}`}>
                        {t('landing.searchBooking.subtitle')}
                    </p>
                </FadeIn>

                <FadeIn delay={0.1} className="mt-10">
                    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white/50 p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(43,38,35,0.25)] ring-1 ring-black/5 backdrop-blur-xl">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    required
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder={t('landing.searchBooking.placeholder')}
                                    className="w-full rounded-full border border-stone-300 bg-white/90 py-3.5 px-5 font-sans text-base text-stone-800 placeholder:text-stone-450 focus:border-stone-500 focus:outline-hidden focus:ring-1 focus:ring-stone-500 shadow-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-third px-6 py-4 font-sans text-sm font-semibold tracking-wider text-cream uppercase transition-all hover:scale-105 active:scale-95 duration-200 shadow-sm shrink-0 ${landingInteractive}`}
                            >
                                <Search className="size-4" />
                                {t('landing.searchBooking.button')}
                            </button>
                        </form>

                        {hasSearched && (
                            <div className="mt-8 border-t border-stone-200/60 pt-6">
                                {isLoading ? (
                                    <p className="text-center font-sans text-sm text-stone-500">
                                        Loading…
                                    </p>
                                ) : !booking || isError ? (
                                    <div
                                        className={`rounded-card border border-stone-200/50 bg-white/50 p-6 text-center backdrop-blur-md ${landingStaticText}`}
                                    >
                                        <p className="font-sans text-base text-stone-600 font-medium">
                                            {t('landing.searchBooking.noResults')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden rounded-card border border-stone-200 bg-white/90 p-5 shadow-xs md:p-6">
                                        <div
                                            className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${landingStaticText}`}
                                        >
                                            <div>
                                                <p className="font-display text-lg font-bold text-primary">
                                                    {booking.services.map((s) => s.name).join(', ')}
                                                </p>
                                                <p className="mt-1 font-sans text-xs font-semibold text-stone-500 tracking-wider">
                                                    REF:{' '}
                                                    <span className="text-secondary-600 font-bold">
                                                        {booking.reference}
                                                    </span>
                                                </p>
                                            </div>
                                            <div
                                                className={cn(
                                                    'inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider truncate',
                                                    getStatusStyles(booking.status).bg,
                                                )}
                                            >
                                                {getStatusStyles(booking.status).icon}
                                                {booking.status}
                                            </div>
                                        </div>

                                        <div
                                            className={`mt-5 grid grid-cols-1 gap-3 border-t border-stone-100 pt-4 sm:grid-cols-3 ${landingStaticText}`}
                                        >
                                            <div className="flex items-center gap-2 text-stone-700">
                                                <Calendar className="size-4 shrink-0 text-stone-400" />
                                                <span className="font-sans text-sm font-semibold">
                                                    {formatDisplayDate(booking.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-stone-700">
                                                <Clock className="size-4 shrink-0 text-stone-400" />
                                                <span className="font-sans text-sm font-semibold">
                                                    {booking.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-stone-700">
                                                <User className="size-4 shrink-0 text-stone-400" />
                                                <span className="font-sans text-sm font-semibold">
                                                    {staffLabel}
                                                </span>
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
