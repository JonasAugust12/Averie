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
                        <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl scale-150" />
                        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-tertiary/80 text-primary">
                            <Check className="h-9 w-9" aria-hidden />
                        </span>
                    </div>
                    <h1 className="font-display text-4xl text-primary tracking-wide md:text-5xl">
                        {t('steps.confirmation')}
                    </h1>
                    <p className="mt-4 font-sans text-sm text-muted max-w-sm leading-relaxed">
                        {t('confirmation.title')}
                    </p>
                    <p className="mt-1 font-sans text-xs text-muted/70">
                        {t('confirmation.subtitle')}
                    </p>
                </div>

                {/* Details card */}
                <article className="mt-12 w-full max-w-md rounded-2xl border border-border/70 bg-neutral/40 overflow-hidden backdrop-blur-sm">
                    {reference ? (
                        <div className="border-b border-border/30 px-6 py-4 bg-primary/5">
                            <p className="font-sans text-xs tracking-widest text-muted uppercase">
                                Reference
                            </p>
                            <p className="mt-0.5 font-display text-lg text-primary">{reference}</p>
                        </div>
                    ) : null}

                    <dl className="divide-y divide-border/30">
                        {/* Services list */}
                        {selectedServices.length > 0 ? (
                            <div className="px-6 py-5">
                                <dt className="font-sans text-xs tracking-widest text-muted uppercase mb-3">
                                    {t('review.service')}
                                </dt>
                                <dd className="space-y-3">
                                    {selectedServices.map((svc) => (
                                        <div
                                            key={svc.id}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <span className="font-sans text-sm text-primary">
                                                {svc.name}
                                            </span>
                                            <span className="font-sans text-sm text-muted">
                                                {formatUsd(svc.price)}
                                            </span>
                                        </div>
                                    ))}
                                </dd>
                            </div>
                        ) : null}

                        <div className="px-6 py-4">
                            <dt className="font-sans text-xs tracking-widest text-muted uppercase mb-1">
                                {t('review.employee')}
                            </dt>
                            <dd className="font-sans text-sm text-primary">{employeeName}</dd>
                        </div>

                        {date && time ? (
                            <div className="px-6 py-4">
                                <dt className="font-sans text-xs tracking-widest text-muted uppercase mb-1">
                                    {t('review.date')}
                                </dt>
                                <dd className="font-sans text-sm text-primary">
                                    {formatDisplayDate(date)} · {time}
                                </dd>
                            </div>
                        ) : null}

                        {totalPrice > 0 ? (
                            <div className="flex items-center justify-between gap-4 px-6 py-5 bg-primary/5">
                                <span className="font-sans text-xs tracking-widest text-muted uppercase">
                                    Total
                                </span>
                                <span className="font-display text-xl text-primary">
                                    {formatUsd(totalPrice)}
                                </span>
                            </div>
                        ) : null}
                    </dl>

                    <p className="px-6 pb-5 pt-1 font-sans text-xs text-muted/60 leading-relaxed">
                        {t('confirmation.mockNote')}
                    </p>
                </article>

                {/* Actions */}
                <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                        variant="outlined"
                        className="rounded-full tracking-widest uppercase px-8"
                        onClick={() => {
                            /* mock calendar */
                        }}
                    >
                        {t('cta.addToCalendar')}
                    </Button>
                    <Link href="/">
                        <Button className="w-full rounded-full tracking-widest uppercase sm:w-auto px-8">
                            {t('cta.backHome')}
                        </Button>
                    </Link>
                    <Button
                        variant="secondary"
                        className="rounded-full tracking-widest uppercase px-8"
                        onClick={handleBookAnother}
                    >
                        {t('cta.bookAnother')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
