'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ExternalLink, MapPin } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useSalonServices, useSalonStaff } from '@services/salon.service';
import { useBookingStore } from '@stores/booking.store';
import { BookingChrome } from '@components/booking';
import { Button } from '@components/common';
import { formatDisplayDate, formatUsd } from '@utils/format.util';

const SALON_MAP_EMBED_URL =
    'https://maps.google.com/maps?q=Averie%20Nails%20Spa%20Cohasset%20MA&t=&z=17&ie=UTF8&iwloc=&output=embed';
const SALON_MAP_DIRECTIONS_URL = 'https://maps.app.goo.gl/YCtZW533i3x6BB5QA';

export function ConfirmationPageView() {
    const t = useBookingTranslations();
    const router = useRouter();
    const { reference, serviceIds, staffId, date, time, reset } = useBookingStore();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();

    const selectedServices = services?.filter((s) => serviceIds.includes(s.id)) ?? [];
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    const employeeName =
        staffId === 'any'
            ? t('anyTechnician')
            : (staff?.find((s) => s.id === staffId)?.name ?? '—');

    function handleBookAnother() {
        reset();
        router.push('/book');
    }

    return (
        <div className="flex min-h-screen flex-col bg-background pb-36 text-foreground md:pb-8">
            <BookingChrome step={6} complete />
            <div className="mx-auto flex w-full max-w-app flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-14 md:max-w-6xl md:justify-center md:py-6 lg:px-8">
                {/* Success header */}
                <div className="flex flex-col items-center text-center md:mb-5">
                    <div className="relative mb-6 sm:mb-8 md:mb-4">
                        <div className="absolute inset-0 scale-150 rounded-full bg-primary/10 blur-xl" />
                        <span className="relative flex h-16 w-16 scale-105 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20 sm:h-20 sm:w-20 md:h-14 md:w-14">
                            <Check className="h-8 w-8 sm:h-10 sm:w-10 md:h-7 md:w-7" aria-hidden />
                        </span>
                    </div>
                    <h1 className="font-display text-3.5xl font-bold tracking-wide text-primary sm:text-4.5xl md:text-4xl">
                        {t('steps.confirmation')}
                    </h1>
                    <p className="mt-3 max-w-sm font-sans text-sm font-medium leading-relaxed text-stone-700 sm:text-[16px] md:mt-2 md:max-w-xl md:text-[15px]">
                        {t('confirmation.title')}
                    </p>
                    <p className="mt-1 font-sans text-xs font-semibold text-stone-500 sm:text-sm md:mt-0.5">
                        {t('confirmation.subtitle')}
                    </p>
                </div>

                <div className="grid w-full gap-6 md:grid-cols-2 md:items-stretch md:gap-6 lg:gap-8">
                    {/* Left: booking details + desktop actions */}
                    <article className="flex w-full flex-col overflow-hidden rounded-2xl border-2 border-stone-200 bg-white/80 shadow-md backdrop-blur-md md:max-h-[min(62dvh,580px)]">
                        {reference ? (
                            <div className="border-b border-stone-200 bg-tertiary/40 px-5 py-4 sm:px-7 sm:py-5 md:px-6 md:py-3.5">
                                <p className="font-sans text-xs font-bold tracking-[0.15em] text-stone-700 uppercase">
                                    {t('confirmation.reference')}
                                </p>
                                <p className="mt-1 font-display text-lg font-bold tracking-wider text-primary sm:text-xl md:text-lg">
                                    {reference}
                                </p>
                            </div>
                        ) : null}

                        <dl className="divide-y divide-stone-200 md:min-h-0 md:flex-1 md:overflow-y-auto">
                            {selectedServices.length > 0 ? (
                                <div className="px-5 py-4 sm:px-7 sm:py-5 md:px-6 md:py-4">
                                    <dt className="mb-3 font-sans text-xs font-bold tracking-[0.15em] text-stone-750 uppercase">
                                        {t('review.service')}
                                    </dt>
                                    <dd className="space-y-2.5 sm:space-y-3">
                                        {selectedServices.map((svc) => (
                                            <div
                                                key={svc.id}
                                                className="flex items-center justify-between gap-4"
                                            >
                                                <span className="font-sans text-sm font-bold text-primary sm:text-[15px]">
                                                    {svc.name}
                                                </span>
                                                <span className="font-sans text-sm font-medium text-stone-500 sm:text-[15px]">
                                                    {formatUsd(svc.price)}
                                                </span>
                                            </div>
                                        ))}
                                    </dd>
                                </div>
                            ) : null}

                            <div className="px-5 py-3.5 sm:px-7 sm:py-4 md:px-6 md:py-3">
                                <dt className="mb-1 font-sans text-xs font-bold tracking-[0.15em] text-stone-750 uppercase">
                                    {t('review.employee')}
                                </dt>
                                <dd className="font-sans text-sm font-semibold text-primary sm:text-[15px]">
                                    {employeeName}
                                </dd>
                            </div>

                            {date && time ? (
                                <div className="px-5 py-3.5 sm:px-7 sm:py-4 md:px-6 md:py-3">
                                    <dt className="mb-1 font-sans text-xs font-bold tracking-[0.15em] text-stone-750 uppercase">
                                        {t('review.date')}
                                    </dt>
                                    <dd className="font-sans text-sm font-semibold text-primary sm:text-[15px]">
                                        {formatDisplayDate(date)} · {time}
                                    </dd>
                                </div>
                            ) : null}

                            {totalPrice > 0 ? (
                                <div className="flex items-center justify-between gap-4 border-t border-stone-200 bg-primary/10 px-5 py-4 sm:px-7 sm:py-5 md:px-6 md:py-3.5">
                                    <span className="font-sans text-xs font-bold tracking-[0.15em] text-stone-700 uppercase sm:text-sm">
                                        Total
                                    </span>
                                    <span className="font-display text-xl font-black text-primary sm:text-2xl md:text-xl">
                                        {formatUsd(totalPrice)}
                                    </span>
                                </div>
                            ) : null}
                        </dl>

                        <p className="border-t border-stone-200 bg-neutral/20 px-5 py-3.5 font-sans text-xs font-medium leading-relaxed text-stone-500 sm:px-7 sm:py-4 sm:text-sm md:px-6 md:py-3 md:text-xs">
                            {t('confirmation.mockNote')}
                        </p>

                        <div className="hidden border-t border-stone-200 bg-white/90 px-6 py-4 md:flex md:flex-col md:gap-3">
                            <Button
                                className="w-full rounded-full py-3 tracking-widest uppercase shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                onClick={handleBookAnother}
                            >
                                {t('cta.bookAnother')}
                            </Button>
                            <Link href="/" className="w-full">
                                <Button
                                    variant="secondary"
                                    className="w-full rounded-full py-2.5 text-xs tracking-widest uppercase"
                                >
                                    {t('cta.backHome')}
                                </Button>
                            </Link>
                        </div>
                    </article>

                    {/* Right: location map */}
                    <section
                        aria-labelledby="confirmation-location-heading"
                        className="flex w-full md:min-h-0"
                    >
                        <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-stone-200 bg-white/80 shadow-md backdrop-blur-md md:max-h-[min(62dvh,580px)]">
                            <div className="border-b border-stone-200 px-5 py-4 sm:px-7 sm:py-5 md:px-6 md:py-4">
                                <div className="flex items-start gap-3.5 sm:gap-4">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/10 text-primary shadow-sm sm:size-11 md:size-10">
                                        <MapPin
                                            className="size-4.5 sm:size-5 md:size-4.5"
                                            aria-hidden
                                        />
                                    </span>
                                    <div className="min-w-0 text-left">
                                        <h2
                                            id="confirmation-location-heading"
                                            className="font-sans text-xs font-bold tracking-[0.15em] text-stone-750 uppercase"
                                        >
                                            {t('confirmation.visitUs')}
                                        </h2>
                                        <p className="mt-1.5 font-sans text-sm font-semibold leading-snug text-primary sm:text-[15px]">
                                            {t('confirmation.addressLine1')}
                                        </p>
                                        <p className="mt-0.5 font-sans text-xs font-medium text-stone-500 sm:text-sm">
                                            {t('confirmation.addressLine2')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-5/4 w-full flex-1 overflow-hidden bg-cream/10 sm:aspect-4/3 md:aspect-auto md:min-h-0">
                                <iframe
                                    title={t('confirmation.visitUs')}
                                    src={SALON_MAP_EMBED_URL}
                                    className="absolute inset-0 h-full w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            <div className="border-t border-stone-200 bg-neutral/20 px-5 py-3.5 sm:px-7 sm:py-4 md:px-6 md:py-3">
                                <a
                                    href={SALON_MAP_DIRECTIONS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 font-sans text-xs font-semibold text-stone-600 transition-colors hover:text-primary sm:text-sm"
                                >
                                    <span className="underline decoration-stone-300 underline-offset-4 group-hover:decoration-primary/40">
                                        {t('confirmation.getDirections')}
                                    </span>
                                    <ExternalLink
                                        className="size-3.5 shrink-0 text-stone-400 transition-colors group-hover:text-primary"
                                        aria-hidden
                                    />
                                </a>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {/* ── Fixed Mobile Bottom Action Bar (< md) ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/80 bg-white/95 px-4 py-3 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all">
                <div className="mx-auto flex max-w-app flex-col gap-2">
                    <Button
                        className="w-full rounded-full py-3 font-sans text-xs font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all"
                        onClick={handleBookAnother}
                    >
                        {t('cta.bookAnother')}
                    </Button>
                    <Link href="/" className="w-full">
                        <Button
                            variant="secondary"
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
