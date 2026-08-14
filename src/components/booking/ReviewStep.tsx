'use client';

import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
    useSalonServices,
    useSalonStaff,
    useSaveMockBooking,
    useScheduleSettings,
} from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { formatDisplayDate, formatUsd, generateBookingReference } from '@utils/format.util';
import type { SalonBooking } from '@typings/salon.type';

export function ReviewStep() {
    const t = useBookingTranslations();
    const router = useRouter();
    const saveBooking = useSaveMockBooking();
    const { serviceIds, staffId, date, time, customer, setReference, setStep } = useBookingStore();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();
    const { data: settings } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;

    const selectedServices = services?.filter((s) => serviceIds.includes(s.id)) ?? [];
    const employee = staffId === 'any' ? t('anyTechnician') : staff?.find((s) => s.id === staffId);
    const employeeName = typeof employee === 'string' ? employee : (employee?.name ?? '—');
    const employeeInitials = typeof employee === 'string' ? '—' : (employee?.initials ?? '—');

    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMin, 0);
    const primaryService = selectedServices[0];

    async function handleConfirm() {
        if (!primaryService || !staffId || !date || !time || !customer) return;

        const reference = generateBookingReference();
        const booking: SalonBooking = {
            id: `bk-${Date.now()}`,
            reference,
            serviceId: primaryService.id,
            serviceIds: serviceIds,
            staffId,
            date,
            time,
            durationMin: totalDuration,
            price: totalPrice,
            customer: {
                firstName: customer.firstName,
                lastName: customer.lastName || '',
                phone: customer.phone,
                email: customer.email || undefined,
                note: customer.note || undefined,
            },
            status: 'upcoming',
        };

        await saveBooking.mutateAsync(booking);
        setReference(reference);
        router.push('/book/confirmation');
    }

    if (!primaryService || !staffId || !date || !time || !customer) {
        return <p className="font-sans text-sm text-muted">Please complete all previous steps.</p>;
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-8">
            {/* Summary card */}
            <article className="rounded-2xl border border-border/70 bg-neutral/40 overflow-hidden backdrop-blur-sm">
                {/* Services section */}
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
                                        {svc.durationMin} min
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
                    {/* Technician */}
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

                    {/* Date & Time */}
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

                    {/* Customer */}
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

                {/* Total footer */}
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

            {/* Mobile-Fixed & Desktop-Static Bottom Action Bar */}
            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:pt-4 sm:shadow-none sm:backdrop-blur-none">
                <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 sm:justify-start">
                    <Button
                        variant="outlined"
                        className="rounded-full tracking-widest uppercase px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm active:scale-95 transition-all duration-200"
                        onClick={() => setStep(5)}
                        disabled={saveBooking.isPending}
                    >
                        ← {t('back')}
                    </Button>
                    <Button
                        className="rounded-full tracking-widest uppercase px-8 sm:px-10 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all duration-200"
                        onClick={handleConfirm}
                        disabled={saveBooking.isPending}
                    >
                        {saveBooking.isPending ? (
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
