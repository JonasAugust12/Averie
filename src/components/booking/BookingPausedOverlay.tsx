'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PhoneCall, MapPin, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { Button } from '@components/common';

export function BookingPausedOverlay() {
    const t = useBookingTranslations();
    usePreventScroll(true);

    // Helper for safe translation resolution to prevent runtime MISSING_MESSAGE crashes
    const safeT = (key: string, fallback: string) => {
        try {
            return t(key) || fallback;
        } catch {
            return fallback;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-paused-title"
        >
            {/* Multi-layered luxury glassmorphic backdrop */}
            <div
                className="absolute inset-0 bg-stone-950/75 backdrop-blur-md transition-opacity"
                aria-hidden
            />

            {/* Ambient background glows */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 sm:size-120 rounded-full bg-nude/25 blur-3xl animate-ambient-pulse" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 sm:size-88 rounded-full bg-[#d4c5b9]/25 blur-2xl animate-ambient-pulse animation-delay-200" />
            </div>

            {/* Modal Card - 100% No-scroll viewport fit */}
            <div className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200/90 bg-linear-to-b from-[#FCFAF6] via-[#F8F5EE] to-[#F3EFE6] p-4.5 xs:p-5.5 sm:p-7.5 shadow-[0_32px_80px_-16px_rgba(43,38,35,0.4)] animate-scale-in">
                {/* Decorative gold top shine line */}
                <div
                    className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-nude to-transparent"
                    aria-hidden
                />

                {/* Subtle corner sparkle decoration */}
                <div
                    className="absolute top-3.5 right-4 sm:top-4 sm:right-5 text-stone-300/60"
                    aria-hidden
                >
                    <Sparkles className="size-4 sm:size-5 animate-pulse" />
                </div>

                <div className="text-center">
                    {/* Brand header badge */}
                    <div className="mb-1.5 sm:mb-3 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-nude/30 bg-nude/10 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#8d7766] uppercase tracking-widest">
                        <span className="size-1.5 rounded-full bg-nude animate-pulse" />
                        {safeT('paused.badge', 'Thông báo dịch vụ')}
                    </div>

                    {/* Prominent Mascot Hero Section (Large, clear & animated) */}
                    <div className="relative mx-auto mb-2 sm:mb-3.5 flex items-center justify-center">
                        {/* Soft Ambient Glow Halo Behind Mascot */}
                        <div className="absolute size-32 sm:size-44 rounded-full bg-nude/30 blur-2xl animate-pulse" />

                        {/* Floating Mascot Image with slow levitation animation */}
                        <div className="relative animate-float-slow">
                            <Image
                                src="/icons/mascot.png"
                                alt="Averie Mascot"
                                width={240}
                                height={240}
                                priority
                                className="size-36 xs:size-40 sm:size-48 md:size-52 object-contain drop-shadow-[0_16px_32px_rgba(43,38,35,0.22)] hover:scale-105 transition-transform duration-300 pointer-events-none"
                            />
                            {/* Sparkle emblem accent */}
                            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex size-6 sm:size-7 items-center justify-center rounded-full bg-linear-to-br from-stone-900 via-stone-800 to-stone-900 text-nude shadow-lg border border-stone-700/60">
                                <Sparkles className="size-3.5 sm:size-4 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2
                        id="booking-paused-title"
                        className="font-display text-base xs:text-lg sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug"
                    >
                        {safeT('paused.title', 'Hệ thống đặt lịch đang tạm dừng')}
                    </h2>

                    {/* Gold accent line */}
                    <div className="my-1.5 sm:my-3 mx-auto w-10 sm:w-12 h-0.5 bg-linear-to-r from-nude/20 via-nude to-nude/20 rounded-full" />

                    {/* Message Body */}
                    <p className="font-sans text-[11px] xs:text-xs sm:text-sm leading-relaxed text-stone-600">
                        {safeT(
                            'paused.body',
                            'Hiện chúng tôi chưa nhận đặt lịch trực tuyến. Vui lòng gọi điện hoặc quay lại sau.',
                        )}
                    </p>
                </div>

                {/* Concierge & Contact Box */}
                <div className="mt-3 sm:mt-5 rounded-2xl border border-stone-200/80 bg-white/85 p-3 sm:p-4 shadow-2xs backdrop-blur-xs space-y-2 sm:space-y-3">
                    {/* Direct Hotline Call Button (High Contrast Luxury Style) */}
                    <a
                        href="tel:7819231955"
                        className="group flex items-center justify-between rounded-xl bg-stone-900 px-3 py-2 sm:px-4 sm:py-3 text-white shadow-md border border-stone-700 hover:border-nude hover:bg-stone-800 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-nude"
                    >
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex size-7 sm:size-9 items-center justify-center rounded-lg bg-nude text-stone-950 font-bold shadow-xs group-hover:scale-105 transition-transform shrink-0">
                                <PhoneCall className="size-3.5 sm:size-4.5" />
                            </div>
                            <div className="text-left min-w-0">
                                <span className="block text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-stone-300">
                                    {safeT('paused.hotlineTitle', 'Hotline đặt lịch')}
                                </span>
                                <span className="block text-xs sm:text-base font-extrabold text-white tracking-wide truncate">
                                    (781) 923-1955
                                </span>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-nude/20 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-nude group-hover:bg-nude group-hover:text-stone-950 transition-colors shrink-0 ml-1">
                            {safeT('paused.callNow', 'Gọi ngay')} &rarr;
                        </span>
                    </a>

                    {/* Location & Directions */}
                    <a
                        href="https://maps.google.com/?q=132+Chief+Justice+Cushing+Hwy,+Cohasset,+MA+02025"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl border border-stone-200/90 bg-stone-50/90 px-3 py-2 sm:px-4 sm:py-2.5 text-stone-800 transition-all duration-200 hover:bg-stone-100 hover:border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-400"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <MapPin className="size-3.5 shrink-0 text-[#8d7766]" />
                            <span className="text-[10px] sm:text-xs font-semibold text-stone-800 truncate">
                                {safeT(
                                    'paused.address',
                                    '132 Chief Justice Cushing Hwy, Cohasset, MA',
                                )}
                            </span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#8d7766] shrink-0 ml-2 group-hover:text-stone-900 transition-colors">
                            {safeT('paused.directions', 'Chỉ đường')}
                        </span>
                    </a>

                    {/* Operating Hours info */}
                    <div className="flex items-center gap-2 pt-0.5 px-0.5 text-[10px] sm:text-xs text-stone-600 font-medium">
                        <Clock className="size-3.5 shrink-0 text-stone-500" />
                        <span className="leading-tight truncate">
                            {safeT(
                                'paused.hours',
                                'T2 - T7: 9:30 AM - 7:00 PM • CN: 10:00 AM - 5:00 PM',
                            )}
                        </span>
                    </div>
                </div>

                {/* Primary CTA Home */}
                <div className="mt-3 sm:mt-5">
                    <Link href="/" className="block">
                        <Button className="group w-full rounded-full py-2.5 sm:py-3 text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-100">
                            <ArrowLeft className="size-3.5 sm:size-4 group-hover:-translate-x-1 transition-transform" />
                            {safeT('paused.ctaHome', 'Trở về trang chủ')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
