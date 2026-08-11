'use client';

import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSalonServices, useSalonStaff, useSaveMockBooking } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { formatDisplayDate, formatUsd, generateBookingReference } from '@utils/format.util';
import type { SalonBooking } from '@typings/salon.type';

export function ReviewStep() {
    const t = useBookingTranslations();
    const router = useRouter();
    const saveBooking = useSaveMockBooking();
    const { serviceId, staffId, date, time, customer, setReference, setStep } = useBookingStore();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();

    const service = services?.find((s) => s.id === serviceId);
    const employee = staffId === 'any' ? t('anyTechnician') : staff?.find((s) => s.id === staffId);
    const employeeName = typeof employee === 'string' ? employee : (employee?.name ?? '—');
    const employeeInitials = typeof employee === 'string' ? '—' : (employee?.initials ?? '—');

    async function handleConfirm() {
        if (!service || !staffId || !date || !time || !customer) return;

        const reference = generateBookingReference();
        const booking: SalonBooking = {
            id: `bk-${Date.now()}`,
            reference,
            serviceId: service.id,
            staffId,
            date,
            time,
            durationMin: service.durationMin,
            price: service.price,
            customer: {
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone,
                email: customer.email || undefined,
                note: customer.note || undefined,
            },
            status: 'pending',
        };

        await saveBooking.mutateAsync(booking);
        setReference(reference);
        router.push('/book/confirmation');
    }

    if (!service || !staffId || !date || !time || !customer) {
        return <p className="font-sans text-sm text-muted">Please complete all previous steps.</p>;
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-8">
            <article className="rounded-lg border border-border/60 bg-neutral p-6 md:p-10">
                <dl className="space-y-6">
                    <ReviewRow
                        label={t('review.service')}
                        value={`${service.name} · ${formatUsd(service.price)}`}
                    />
                    <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-6">
                        <dt className="font-sans text-xs tracking-widest text-muted uppercase">
                            {t('review.employee')}
                        </dt>
                        <dd className="flex items-center gap-3 text-right">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-200 font-sans text-xs text-primary">
                                {employeeInitials}
                            </span>
                            <span className="font-sans text-sm text-primary">{employeeName}</span>
                        </dd>
                    </div>
                    <div className="grid gap-6 border-b border-border/40 pb-6 sm:grid-cols-2">
                        <ReviewRow label={t('review.date')} value={formatDisplayDate(date)} bare />
                        <ReviewRow label={t('review.time')} value={time} bare />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ReviewRow
                            label={t('review.customer')}
                            value={`${customer.firstName} ${customer.lastName}`}
                            bare
                        />
                        <ReviewRow label={t('customer.phone')} value={customer.phone} bare />
                        {customer.email ? (
                            <ReviewRow label={t('customer.email')} value={customer.email} bare />
                        ) : null}
                        {customer.note ? (
                            <ReviewRow label={t('customer.note')} value={customer.note} bare />
                        ) : null}
                    </div>
                </dl>
            </article>

            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outlined"
                    className="tracking-widest uppercase"
                    onClick={() => setStep(5)}
                    disabled={saveBooking.isPending}
                >
                    {t('back')}
                </Button>
                <Button
                    className="tracking-widest uppercase"
                    onClick={handleConfirm}
                    disabled={saveBooking.isPending}
                >
                    {saveBooking.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('cta.confirm')}
                        </>
                    ) : (
                        t('cta.confirm')
                    )}
                </Button>
            </div>
        </div>
    );
}

function ReviewRow({
    label,
    value,
    bare = false,
}: {
    label: string;
    value: string;
    bare?: boolean;
}) {
    return (
        <div
            className={
                bare
                    ? undefined
                    : 'flex items-start justify-between gap-4 border-b border-border/40 pb-6'
            }
        >
            <dt className="font-sans text-xs tracking-widest text-muted uppercase">{label}</dt>
            <dd className="font-sans text-sm text-primary sm:text-right">{value}</dd>
        </div>
    );
}
