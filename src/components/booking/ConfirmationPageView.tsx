'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useSalonServices, useSalonStaff } from '@services/salon.service';
import { useBookingStore } from '@stores/booking.store';
import { BookingChrome } from '@components/booking';
import { Button } from '@components/common';
import { formatDisplayDate, formatUsd } from '@utils/format.util';

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
        <div className="min-h-screen bg-background text-foreground">
            <BookingChrome step={6} complete />
            <div className="mx-auto flex w-full max-w-app flex-col items-center px-4 py-20 sm:px-6 lg:px-8">
                {/* Success icon */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-150" />
                        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20 scale-105">
                            <Check className="h-10 w-10" aria-hidden />
                        </span>
                    </div>
                    <h1 className="font-display text-4.5xl font-bold text-primary tracking-wide md:text-5xl">
                        {t('steps.confirmation')}
                    </h1>
                    <p className="mt-4 font-sans text-[16px] text-stone-700 font-medium max-w-sm leading-relaxed">
                        {t('confirmation.title')}
                    </p>
                    <p className="mt-2 font-sans text-sm font-semibold text-stone-500">
                        {t('confirmation.subtitle')}
                    </p>
                </div>

                {/* Details card */}
                <article className="mt-12 w-full max-w-md rounded-2xl border-2 border-stone-200 bg-white/70 backdrop-blur-md shadow-md overflow-hidden">
                    {reference ? (
                        <div className="border-b border-stone-200 px-7 py-5 bg-tertiary/40">
                            <p className="font-sans text-xs font-bold tracking-[0.15em] text-stone-700 uppercase">
                                Reference
                            </p>
                            <p className="mt-1 font-display text-xl font-bold text-primary tracking-wider">
                                {reference}
                            </p>
                        </div>
                    ) : null}

                    <dl className="divide-y divide-stone-200">
                        {/* Services list */}
                        {selectedServices.length > 0 ? (
                            <div className="px-7 py-5">
                                <dt className="font-sans text-xs font-bold tracking-[0.15em] text-stone-750 uppercase mb-3">
                                    {t('review.service')}
                                </dt>
                                <dd className="space-y-3">
                                    {selectedServices.map((svc) => (
                                        <div
                                            key={svc.id}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <span className="font-sans text-[15px] font-bold text-primary">
                                                {svc.name}
                                            </span>
                                            <span className="font-sans text-[15px] font-medium text-stone-500">
                                                {formatUsd(svc.price)}
                                            </span>
                                        </div>
                                    ))}
                                </dd>
                            </div>
                        ) : null}

                        <div className="px-7 py-4">
                            <dt className="font-sans text-xs font-bold tracking-[0.15em] text-stone-750 uppercase mb-1">
                                {t('review.employee')}
                            </dt>
                            <dd className="font-sans text-[15px] font-semibold text-primary">
                                {employeeName}
                            </dd>
                        </div>

                        {date && time ? (
                            <div className="px-7 py-4">
                                <dt className="font-sans text-xs font-bold tracking-[0.15em] text-stone-750 uppercase mb-1">
                                    {t('review.date')}
                                </dt>
                                <dd className="font-sans text-[15px] font-semibold text-primary">
                                    {formatDisplayDate(date)} · {time}
                                </dd>
                            </div>
                        ) : null}

                        {totalPrice > 0 ? (
                            <div className="flex items-center justify-between gap-4 px-7 py-5 bg-primary/10 border-t border-stone-200">
                                <span className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase">
                                    Total
                                </span>
                                <span className="font-display text-2xl font-black text-primary">
                                    {formatUsd(totalPrice)}
                                </span>
                            </div>
                        ) : null}
                    </dl>

                    <p className="px-7 py-4 border-t border-stone-200 font-sans text-sm font-medium text-stone-500 leading-relaxed bg-neutral/20">
                        {t('confirmation.mockNote')}
                    </p>
                </article>

                {/* Actions */}
                <div className="mt-10 flex w-full max-w-md flex-col gap-4">
                    <Button
                        className="w-full rounded-full py-4 tracking-widest uppercase hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={handleBookAnother}
                    >
                        {t('cta.bookAnother')}
                    </Button>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button
                            variant="outlined"
                            className="w-full rounded-full py-3 text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all duration-200"
                            onClick={() => {
                                /* mock calendar */
                            }}
                        >
                            {t('cta.addToCalendar')}
                        </Button>
                        <Link
                            href="/"
                            className="w-full hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            <Button
                                variant="secondary"
                                className="w-full rounded-full py-3 text-xs tracking-widest uppercase"
                            >
                                {t('cta.backHome')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
