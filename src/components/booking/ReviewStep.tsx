'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CREATE_BOOKING_MIN_LOADING_MS, useCreateBooking } from '@services/booking.service';
import { useServices } from '@services/service-catalog.service';
import { useStaff } from '@services/staff.service';
import { useScheduleSettings } from '@services/schedule.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import { formatUserName, getUserInitials } from '@utils/staff.util';
import { toastSuccess } from '@utils/toast.util';

export function ReviewStep() {
    const t = useBookingTranslations();
    const router = useRouter();
    const createBooking = useCreateBooking();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { serviceIds, staffPreference, staffId, date, time, customer, setReference, setStep } =
        useBookingStore();
    const { data: services } = useServices();
    const { data: staff } = useStaff();
    const { data: settings } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;

    const selectedServices = services?.filter((s) => serviceIds.includes(s.id)) ?? [];
    const employee =
        staffPreference === 'any' ? t('anyTechnician') : staff?.find((s) => s.id === staffId);
    const employeeName =
        typeof employee === 'string' ? employee : employee ? formatUserName(employee) : '—';
    const employeeInitials =
        typeof employee === 'string' ? '—' : employee ? getUserInitials(employee) : '—';

    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.estimatedMinutes, 0);

    async function handleConfirm() {
        if (selectedServices.length === 0 || !date || !time || !customer) return;
        if (staffPreference === 'specific' && !staffId) return;
        if (isSubmitting) return;

        setIsSubmitting(true);
        const startedAt = Date.now();

        try {
            const data = await createBooking.mutateAsync({
                serviceIds,
                staffPreference,
                staffId: staffPreference === 'specific' ? (staffId ?? undefined) : undefined,
                date,
                time,
                customer: {
                    firstName: customer.firstName,
                    lastName: customer.lastName || '—',
                    phone: customer.phone,
                    email: customer.email || undefined,
                    note: customer.note || undefined,
                },
            });

            const remaining = CREATE_BOOKING_MIN_LOADING_MS - (Date.now() - startedAt);
            if (remaining > 0) {
                await new Promise<void>((resolve) => {
                    setTimeout(resolve, remaining);
                });
            }

            setReference(data.reference);
            toastSuccess(t('toasts.bookingCreated'));
            router.push('/book/confirmation');
        } catch {
            // Toast handled by useCreateBooking onError
        } finally {
            setIsSubmitting(false);
        }
    }

    if (selectedServices.length === 0 || !date || !time || !customer) {
        return <p className="font-sans text-sm text-muted">Please complete all previous steps.</p>;
    }

    if (staffPreference === 'specific' && !staffId) {
        return <p className="font-sans text-sm text-muted">Please select a technician.</p>;
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-8">
            <article className="rounded-2xl border border-border/70 bg-neutral/40 overflow-hidden backdrop-blur-sm">
                <div className="px-7 pt-7 pb-5 border-b border-border/40">
                    <p className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase mb-4">
                        {t('review.service')}
                    </p>
                    <ul className="space-y-4">
                        {selectedServices.map((svc) => (
                            <li key={svc.id} className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-sans text-[16px] font-semibold text-primary">
                                        {svc.name}
                                    </p>
                                    <p className="mt-1 font-sans text-sm font-medium text-stone-500">
                                        {svc.estimatedMinutes} min
                                    </p>
                                </div>
                                <span className="font-display text-[17px] font-bold text-primary shrink-0">
                                    {formatUsd(svc.price)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <dl className="divide-y divide-border/30">
                    {allowStaffSelection && (
                        <div className="flex items-center justify-between gap-4 px-7 py-4">
                            <dt className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase">
                                {t('review.employee')}
                            </dt>
                            <dd className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 font-sans text-xs font-bold text-primary">
                                    {employeeInitials}
                                </span>
                                <span className="font-sans text-[15px] font-semibold text-primary">
                                    {employeeName}
                                </span>
                            </dd>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/30">
                        <div className="px-7 py-4">
                            <dt className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase mb-1.5">
                                {t('review.date')}
                            </dt>
                            <dd className="font-sans text-[15px] font-semibold text-primary">
                                {formatDisplayDate(date)}
                            </dd>
                        </div>
                        <div className="px-7 py-4">
                            <dt className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase mb-1.5">
                                {t('review.time')}
                            </dt>
                            <dd className="font-sans text-[15px] font-semibold text-primary">
                                {time}
                            </dd>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/30">
                        <div className="px-7 py-4">
                            <dt className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase mb-1.5">
                                {t('review.customer')}
                            </dt>
                            <dd className="font-sans text-[15px] font-semibold text-primary">
                                {customer.firstName} {customer.lastName}
                            </dd>
                        </div>
                        <div className="px-7 py-4">
                            <dt className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase mb-1.5">
                                {t('customer.phone')}
                            </dt>
                            <dd className="font-sans text-[15px] font-semibold text-primary">
                                {customer.phone}
                            </dd>
                        </div>
                    </div>

                    {customer.note ? (
                        <div className="px-7 py-4">
                            <dt className="font-sans text-sm font-bold tracking-[0.15em] text-stone-700 uppercase mb-1.5">
                                {t('customer.note')}
                            </dt>
                            <dd className="font-sans text-[15px] font-medium text-stone-600 leading-relaxed">
                                {customer.note}
                            </dd>
                        </div>
                    ) : null}
                </dl>

                <div className="flex items-center justify-between gap-4 border-t border-border/50 bg-primary/5 px-7 py-5">
                    <div>
                        <p className="font-sans text-xs tracking-widest text-muted uppercase">
                            Total
                        </p>
                        <p className="mt-0.5 font-sans text-xs text-muted">
                            {totalDuration} min total
                        </p>
                    </div>
                    <p className="font-display text-2xl text-primary">{formatUsd(totalPrice)}</p>
                </div>
            </article>

            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:pt-4 sm:shadow-none sm:backdrop-blur-none">
                <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 sm:justify-start">
                    <Button
                        variant="outlined"
                        className="rounded-full tracking-widest uppercase px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm active:scale-95 transition-all duration-200"
                        onClick={() => setStep(5)}
                        disabled={isSubmitting}
                    >
                        ← {t('back')}
                    </Button>
                    <Button
                        className="rounded-full tracking-widest uppercase px-8 sm:px-10 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all duration-200"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t('cta.confirm')}
                            </>
                        ) : (
                            `${t('cta.confirm')} ✓`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
