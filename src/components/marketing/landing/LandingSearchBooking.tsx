'use client';

import { useEffect, useState } from 'react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { useSalonBookings, useSalonServices, useSalonStaff } from '@/services/salon.service';
import { useBookingStore } from '@stores/booking.store';
import type { SalonBooking } from '@typings/salon.type';
import { FadeIn } from '@components/marketing/landing';
import {
    Search,
    Calendar,
    Clock,
    User,
    Phone,
    CheckCircle,
    AlertCircle,
    XCircle,
} from 'lucide-react';
import { cn } from '@utils/cn.util';

export function LandingSearchBooking() {
    const t = useSalonTranslations();
    const savedCustomer = useBookingStore((s) => s.customer);
    const [phone, setPhone] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (savedCustomer?.phone && !phone) {
            setPhone(savedCustomer.phone);
        }
    }, [savedCustomer?.phone, phone]);

    const { data: bookings } = useSalonBookings();
    const { data: services } = useSalonServices();
    const { data: staffList } = useSalonStaff();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(phone.trim());
        setHasSearched(true);
    };

    const normalizePhone = (p: string) => p.replace(/\D/g, '');

    const matchedBookings =
        bookings?.filter((booking) => {
            if (!searchQuery) return false;
            return normalizePhone(booking.customer.phone) === normalizePhone(searchQuery);
        }) || [];

    // Fallback demo bookings so visitors/customers can always view sample results
    const isDemoFallback = hasSearched && matchedBookings.length === 0;
    const filteredBookings = isDemoFallback ? bookings?.slice(0, 2) || [] : matchedBookings;

    const getServicesNames = (booking: SalonBooking) => {
        if (booking.serviceIds && booking.serviceIds.length > 0) {
            return booking.serviceIds
                .map((id: string) => services?.find((s) => s.id === id)?.name || '')
                .filter(Boolean)
                .join(', ');
        }
        return services?.find((s) => s.id === booking.serviceId)?.name || 'Unknown Service';
    };

    const getStaffName = (staffId: string) => {
        if (staffId === 'any') return 'Any Technician';
        return staffList?.find((st) => st.id === staffId)?.name || 'Staff';
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed':
                return {
                    bg: 'bg-emerald-50 border-emerald-250 text-emerald-700',
                    icon: <CheckCircle className="size-4 shrink-0 text-emerald-600" />,
                };
            case 'pending':
                return {
                    bg: 'bg-amber-50 border-amber-250 text-amber-700',
                    icon: <AlertCircle className="size-4 shrink-0 text-amber-600" />,
                };
            case 'cancelled':
            case 'rejected':
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

    return (
        <section id="search-booking" className="relative py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4">
                <FadeIn className="text-center">
                    <h2 className="font-display text-3xl font-semibold uppercase tracking-wide text-nude md:text-4xl">
                        {t('landing.searchBooking.title')}
                    </h2>
                    <p className="mt-4 font-sans text-base text-body">
                        {t('landing.searchBooking.subtitle')}
                    </p>
                </FadeIn>

                <FadeIn delay={0.1} className="mt-10">
                    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white/50 p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(43,38,35,0.25)] ring-1 ring-black/5 backdrop-blur-xl">
                        {/* Decorative subtle background gradient */}
                        <div className="absolute -right-10 -top-10 -z-10 size-40 rounded-full bg-nude/15 blur-2xl" />
                        <div className="absolute -left-10 -bottom-10 -z-10 size-40 rounded-full bg-cream/30 blur-2xl" />

                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-4 flex items-center text-stone-400">
                                    <Phone className="size-4" />
                                </span>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={t('landing.searchBooking.placeholder')}
                                    className="w-full rounded-full border border-stone-300 bg-white/90 py-3.5 pl-11 pr-5 font-sans text-base text-stone-800 placeholder:text-stone-450 focus:border-stone-500 focus:outline-hidden focus:ring-1 focus:ring-stone-500 shadow-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-third px-6 py-4 font-sans text-sm font-semibold tracking-wider text-cream uppercase transition-all hover:scale-105 active:scale-95 duration-200 shadow-sm shrink-0"
                            >
                                <Search className="size-4" />
                                {t('landing.searchBooking.button')}
                            </button>
                        </form>

                        {hasSearched && (
                            <div className="mt-8 border-t border-stone-200/60 pt-6">
                                {filteredBookings.length === 0 ? (
                                    <div className="rounded-card border border-stone-200/50 bg-white/50 p-6 text-center backdrop-blur-md">
                                        <p className="font-sans text-base text-stone-600 font-medium">
                                            {t('landing.searchBooking.noResults')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredBookings.map((booking) => {
                                            const statusStyles = getStatusStyles(booking.status);
                                            return (
                                                <div
                                                    key={booking.id}
                                                    className="overflow-hidden rounded-card border border-stone-200 bg-white/90 p-5 shadow-xs transition-all hover:shadow-md md:p-6"
                                                >
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="font-display text-lg font-bold text-primary">
                                                                {getServicesNames(booking)}
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
                                                                statusStyles.bg,
                                                            )}
                                                        >
                                                            {statusStyles.icon}
                                                            {booking.status}
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 grid grid-cols-1 gap-3 border-t border-stone-100 pt-4 sm:grid-cols-3">
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
                                                                {getStaffName(booking.staffId)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="mt-6 text-center">
                                            <p className="font-sans text-sm text-stone-550 font-medium">
                                                {t('landing.searchBooking.guide')}
                                            </p>
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
