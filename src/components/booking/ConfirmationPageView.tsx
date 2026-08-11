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
    const { reference, serviceId, staffId, date, time, reset } = useBookingStore();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();

    const service = services?.find((s) => s.id === serviceId);
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
            <div className="mx-auto flex w-full max-w-app flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex w-full max-w-lg flex-col items-center text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary bg-tertiary text-primary">
                        <Check className="h-8 w-8" aria-hidden />
                    </span>
                    <h1 className="mt-6 font-display text-3xl text-primary">
                        {t('steps.confirmation')}
                    </h1>
                    <p className="mt-3 font-sans text-sm text-muted">{t('confirmation.title')}</p>
                    <p className="mt-1 font-sans text-xs text-muted">
                        {t('confirmation.subtitle')}
                    </p>
                </div>

                <article className="mt-10 w-full max-w-lg rounded-lg border border-border/60 bg-neutral p-6 text-left md:p-8">
                    <dl className="space-y-4 font-sans text-sm">
                        {reference ? (
                            <Row label={t('confirmation.reference')} value={reference} />
                        ) : null}
                        {service ? (
                            <Row
                                label={t('review.service')}
                                value={`${service.name} · ${formatUsd(service.price)}`}
                            />
                        ) : null}
                        <Row label={t('review.employee')} value={employeeName} />
                        {date && time ? (
                            <Row
                                label={t('review.date')}
                                value={`${formatDisplayDate(date)} · ${time}`}
                            />
                        ) : null}
                    </dl>
                    <p className="mt-6 font-sans text-xs text-muted">
                        {t('confirmation.mockNote')}
                    </p>
                </article>

                <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                        variant="outlined"
                        className="tracking-widest uppercase"
                        onClick={() => {
                            /* mock calendar */
                        }}
                    >
                        {t('cta.addToCalendar')}
                    </Button>
                    <Link href="/">
                        <Button className="w-full tracking-widest uppercase sm:w-auto">
                            {t('cta.backHome')}
                        </Button>
                    </Link>
                    <Button
                        variant="secondary"
                        className="tracking-widest uppercase"
                        onClick={handleBookAnother}
                    >
                        {t('cta.bookAnother')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 border-b border-border/40 pb-3 last:border-0 last:pb-0">
            <dt className="text-xs tracking-widest text-muted uppercase">{label}</dt>
            <dd className="text-right text-primary">{value}</dd>
        </div>
    );
}
