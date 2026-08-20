'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    Sparkles,
    ShieldCheck,
    MessageSquareQuote,
    Check,
} from 'lucide-react';
import { CREATE_BOOKING_MIN_LOADING_MS, useCreateBooking } from '@services/booking.service';
import { useServices } from '@services/service-catalog.service';
import { useStaff } from '@services/staff.service';
import { useScheduleSettings } from '@services/schedule.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { useUIStore } from '@stores/ui.store';
import { Button } from '@components/common';
import { RouteLoadingScreen } from '@components/shared';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import { formatUserName, getUserInitials, getUserColor, staffColorAlpha } from '@utils/staff.util';
import { toastSuccess } from '@utils/toast.util';

export function ReviewStep() {
    const t = useBookingTranslations();
    const router = useRouter();
    const createBooking = useCreateBooking();
    const { showConfirm, hideConfirm } = useUIStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { serviceIds, staffPreference, staffId, date, time, customer, setReference, setStep } =
        useBookingStore();
    const { data: services } = useServices();
    const { data: staff } = useStaff();
    const { data: settings } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;

    const selectedServices = services?.filter((s) => serviceIds.includes(s.id)) ?? [];
    const matchedStaff =
        staffPreference === 'specific' ? staff?.find((s) => s.id === staffId) : null;
    const employeeName =
        staffPreference === 'any'
            ? t('anyTechnician')
            : matchedStaff
              ? formatUserName(matchedStaff)
              : '—';
    const employeeInitials =
        staffPreference === 'any' ? '★' : matchedStaff ? getUserInitials(matchedStaff) : '—';
    const staffColor = matchedStaff ? getUserColor(matchedStaff) : undefined;
    const staffSpecialty = matchedStaff?.specialties?.[0];

    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.estimatedMinutes, 0);

    async function handleSubmit() {
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
            router.push(`/book/confirmation/${data.id}`);
        } catch {
            // Toast handled by useCreateBooking onError
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleConfirm() {
        showConfirm({
            title: t('review.confirmTitle') || 'Confirm your appointment?',
            message:
                t('review.confirmMessage') ||
                `${formatDisplayDate(date ?? '')} • ${time} — ${selectedServices.map((s) => s.name).join(', ')}`,
            confirmText: t('cta.confirm'),
            type: 'info',
            onConfirm: () => {
                hideConfirm();
                return handleSubmit();
            },
        });
    }

    if (selectedServices.length === 0 || !date || !time || !customer) {
        return (
            <div className="rounded-3xl border border-dashed border-stone-300 p-8 text-center bg-white/50">
                <p className="font-sans text-sm text-stone-500">
                    Please complete all previous steps before reviewing.
                </p>
                <Button
                    variant="outlined"
                    className="mt-4 rounded-full text-xs font-semibold"
                    onClick={() => setStep(1)}
                >
                    Return to Step 1
                </Button>
            </div>
        );
    }

    if (staffPreference === 'specific' && !staffId) {
        return (
            <div className="rounded-3xl border border-dashed border-stone-300 p-8 text-center bg-white/50">
                <p className="font-sans text-sm text-stone-500">Please select a technician.</p>
                <Button
                    variant="outlined"
                    className="mt-4 rounded-full text-xs font-semibold"
                    onClick={() => setStep(2)}
                >
                    Choose Technician
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-6 animate-fade-in-up">
            {/* Editorial Heading */}
            <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/70 mb-2">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('review.finalStepTag')}
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-primary">
                    {t('review.title') || 'Appointment Review'}
                </h2>
                <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500">
                    {t('review.subtitle') ||
                        'Please take a moment to review your appointment details before confirming.'}
                </p>
            </div>

            {/* Main Luxury Bento Ticket */}
            <article className="rounded-3xl border border-stone-200/90 bg-white/95 shadow-sm overflow-hidden backdrop-blur-md transition-all duration-300">
                {/* Services Section */}
                <div className="p-5 sm:p-7 border-b border-stone-100">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Sparkles className="size-4" />
                            </span>
                            <h3 className="font-display text-sm sm:text-base font-bold tracking-wide text-primary uppercase">
                                {t('review.service')}
                            </h3>
                        </div>
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-stone-600">
                            {selectedServices.length}{' '}
                            {selectedServices.length === 1 ? 'service' : 'services'}
                        </span>
                    </div>

                    <ul className="divide-y divide-stone-100 rounded-2xl border border-stone-200/70 bg-stone-50/50 p-1">
                        {selectedServices.map((svc) => (
                            <li
                                key={svc.id}
                                className="flex items-center justify-between gap-4 p-3 sm:p-4 rounded-xl hover:bg-white/80 transition-colors"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-sans text-sm sm:text-base font-semibold text-primary truncate">
                                        {svc.name}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-stone-500 font-medium">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-stone-200/60 px-1.5 py-0.5 text-[11px] text-stone-700">
                                            <Clock className="size-3 text-stone-400" />
                                            {svc.estimatedMinutes} min
                                        </span>
                                    </div>
                                </div>
                                <span className="font-display text-base sm:text-lg font-bold text-primary shrink-0">
                                    {formatUsd(svc.price)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bento Grid: Technician & Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 bg-white">
                    {/* Technician Bento Card */}
                    {allowStaffSelection && (
                        <div className="p-5 sm:p-6 flex flex-col justify-between">
                            <span className="font-sans text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                                {t('review.employee')}
                            </span>
                            <div className="mt-3 flex items-center gap-3.5">
                                {staffPreference === 'any' ? (
                                    <span className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-tertiary text-primary shadow-xs">
                                        <Sparkles className="size-6 text-primary" />
                                    </span>
                                ) : (
                                    <span
                                        className="flex size-12 sm:size-14 items-center justify-center rounded-2xl font-sans text-base sm:text-lg font-bold shadow-xs transition-transform"
                                        style={{
                                            backgroundColor: staffColor
                                                ? staffColorAlpha(staffColor, 15)
                                                : '#F3EFEB',
                                            color: staffColor || '#1C1917',
                                            borderWidth: 2,
                                            borderColor: staffColor
                                                ? staffColorAlpha(staffColor, 35)
                                                : '#E7E5E4',
                                        }}
                                    >
                                        {employeeInitials}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="font-display text-base sm:text-lg font-bold text-primary truncate">
                                        {employeeName}
                                    </p>
                                    <p className="font-sans text-xs text-stone-500 font-medium truncate mt-0.5">
                                        {staffSpecialty
                                            ? t('staffSpecialist.specializesIn', {
                                                  specialty: staffSpecialty,
                                              })
                                            : staffPreference === 'any'
                                              ? t('anyTechnicianHint')
                                              : t('defaultRole')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Date & Time Bento Card */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <span className="font-sans text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                            {t('review.date')} & {t('review.time')}
                        </span>
                        <div className="mt-3 flex items-center gap-3.5">
                            <span className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-900 shadow-xs">
                                <Calendar className="size-6 text-amber-800" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-sans text-base sm:text-lg font-bold text-primary capitalize truncate">
                                    {formatDisplayDate(date)}
                                </p>
                                <div className="mt-0.5 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-amber-800">
                                    <Clock className="size-3.5" />
                                    <span>{time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guest Contact Information Card */}
                <div className="border-t border-stone-100 bg-stone-50/40 p-5 sm:p-6">
                    <span className="font-sans text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                        {t('review.customer')}
                    </span>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 rounded-2xl border border-stone-200/60 bg-white p-3.5">
                            <span className="flex size-9 items-center justify-center rounded-xl bg-stone-100 text-stone-600 shrink-0">
                                <User className="size-4 text-stone-700" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-sans text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                                    {t('review.fullName')}
                                </p>
                                <p className="font-sans text-sm font-semibold text-primary truncate">
                                    {customer.firstName} {customer.lastName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-stone-200/60 bg-white p-3.5">
                            <span className="flex size-9 items-center justify-center rounded-xl bg-stone-100 text-stone-600 shrink-0">
                                <Phone className="size-4 text-stone-700" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-sans text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                                    {t('review.phoneNumber')}
                                </p>
                                <p className="font-sans text-sm font-semibold text-primary truncate">
                                    {customer.phone}
                                </p>
                            </div>
                        </div>

                        {customer.email && (
                            <div className="flex items-center gap-3 rounded-2xl border border-stone-200/60 bg-white p-3.5 sm:col-span-2">
                                <span className="flex size-9 items-center justify-center rounded-xl bg-stone-100 text-stone-600 shrink-0">
                                    <Mail className="size-4 text-stone-700" />
                                </span>
                                <div className="min-w-0">
                                    <p className="font-sans text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                                        {t('review.emailAddress')}
                                    </p>
                                    <p className="font-sans text-sm font-semibold text-primary truncate">
                                        {customer.email}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special Requests / Notes (if provided) */}
                {customer.note && (
                    <div className="border-t border-stone-100 bg-amber-50/20 p-5 sm:p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquareQuote className="size-4 text-amber-700" />
                            <span className="font-sans text-[11px] font-bold tracking-wider text-amber-900 uppercase">
                                {t('review.notes') || 'Special Requests & Preferences'}
                            </span>
                        </div>
                        <div className="rounded-2xl border border-amber-200/60 bg-white/90 p-4">
                            <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                                &ldquo;{customer.note}&rdquo;
                            </p>
                        </div>
                    </div>
                )}

                {/* Payment Policy Reassurance Badge */}
                <div className="border-t border-stone-100 bg-stone-50/70 px-5 sm:px-7 py-3.5 flex items-center gap-3">
                    <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                    <p className="font-sans text-xs text-stone-600 font-medium">
                        {t('review.paymentPolicy') ||
                            'No upfront payment required. You will pay at the salon upon completion.'}
                    </p>
                </div>

                {/* Pricing & Duration Total Footer */}
                <div className="border-t border-stone-200 bg-primary/5 px-5 sm:px-7 py-5 flex items-center justify-between gap-4">
                    <div>
                        <span className="font-sans text-[11px] font-bold tracking-widest text-stone-500 uppercase">
                            {t('review.totalEstimate') || 'Total Estimate'}
                        </span>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                            <Clock className="size-3.5 text-stone-400" />
                            <span>{t('review.estimatedTime', { min: totalDuration })}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                            {formatUsd(totalPrice)}
                        </span>
                    </div>
                </div>
            </article>

            {/* Bottom Floating/Static Action Bar */}
            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:pt-2 sm:shadow-none sm:backdrop-blur-none">
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
                        className="rounded-full tracking-widest uppercase px-8 sm:px-10 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all duration-200 bg-primary hover:bg-primary/90 text-neutral"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {t('cta.confirm')}
                            </>
                        ) : (
                            <span className="inline-flex items-center gap-1.5">
                                {t('cta.confirm')}
                                <Check className="size-4" />
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Luxury Brand Loading Screen while booking is being submitted */}
            {isSubmitting && (
                <RouteLoadingScreen
                    overlay="fullscreen"
                    message={t('review.submitting') || 'Securing your appointment...'}
                    hint={
                        t('review.submittingHint') ||
                        'Please wait a moment while we confirm your reservation.'
                    }
                />
            )}
        </div>
    );
}
