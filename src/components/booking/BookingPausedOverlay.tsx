'use client';

import Link from 'next/link';
import { CalendarX } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';

export function BookingPausedOverlay() {
    const t = useBookingTranslations();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-paused-title"
        >
            <div className="absolute inset-0 bg-stone-900/45 backdrop-blur-sm" aria-hidden />
            <div className="relative w-full max-w-md rounded-2xl border border-stone-200/90 bg-[#FCFAF6] p-6 shadow-[0_24px_60px_-12px_rgba(43,38,35,0.25)] sm:p-8">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-600">
                    <CalendarX className="size-7" aria-hidden />
                </div>
                <h2
                    id="booking-paused-title"
                    className="mt-5 text-center font-display text-xl font-bold text-stone-900 sm:text-2xl"
                >
                    {t('paused.title')}
                </h2>
                <p className="mt-3 text-center font-sans text-sm leading-relaxed text-stone-600 sm:text-base">
                    {t('paused.body')}
                </p>
                <Link href="/" className="mt-6 block">
                    <Button className="w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-wider">
                        {t('paused.ctaHome')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
