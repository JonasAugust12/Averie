'use client';

import { useEffect } from 'react';
import {
    BookingChrome,
    BookingPausedOverlay,
    BookingSummary,
    CustomerStep,
    DateStep,
    EmployeeStep,
    ReviewStep,
    ServiceStep,
    TimeStep,
} from '@components/booking';
import { useBookingStore } from '@stores/booking.store';
import { useScheduleSettings } from '@services/schedule.service';
import { cn } from '@utils/cn.util';

/** Sidebar "Your Booking" appears on service, time, and customer steps. */
const SIDEBAR_STEPS = new Set([1, 4, 5]);

export function BookPageView() {
    const { step, serviceIds, staffPreference, staffId, date, time, customer, setStep } =
        useBookingStore();
    const resetBookingFlow = useBookingStore((s) => s.resetBookingFlow);
    const { data: settings, isLoading: isSettingsLoading } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;
    const isBookingPaused = settings?.bookingEnabled === false;
    const showSidebar = SIDEBAR_STEPS.has(step);

    useEffect(() => {
        // Reset step to 1 and clear selected services/date/time whenever entering booking page
        resetBookingFlow();
    }, [resetBookingFlow]);

    // Strict Step Guard: redirect user back if previous step requirements are missing
    useEffect(() => {
        if (isBookingPaused) return;

        if (step > 1 && serviceIds.length === 0) {
            setStep(1);
        } else if (step > 2 && allowStaffSelection && staffPreference === 'specific' && !staffId) {
            setStep(2);
        } else if (step > 3 && !date) {
            setStep(3);
        } else if (step > 4 && !time) {
            setStep(4);
        } else if (step > 5 && (!customer || !customer.firstName || !customer.phone)) {
            setStep(5);
        }
    }, [
        step,
        serviceIds,
        staffPreference,
        staffId,
        date,
        time,
        customer,
        allowStaffSelection,
        isBookingPaused,
        setStep,
    ]);

    return (
        <>
            <div
                className={cn(
                    'min-h-screen bg-background text-foreground',
                    isBookingPaused && 'pointer-events-none select-none blur-[2px]',
                )}
                aria-hidden={isBookingPaused || undefined}
            >
                {/* Ambient background glow for premium feel */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
                    <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-secondary-100/40 blur-3xl" />
                    <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-tertiary/50 blur-3xl" />
                </div>

                <BookingChrome step={step} />

                <div
                    className={cn(
                        'relative mx-auto w-full max-w-app px-4 pt-6 pb-28 sm:px-6 sm:pt-10 sm:pb-32 lg:px-8 lg:py-16',
                        !showSidebar && 'flex flex-col items-center',
                    )}
                >
                    <div
                        className={cn(
                            'w-full',
                            showSidebar
                                ? 'grid gap-8 lg:grid-cols-12'
                                : step === 3
                                  ? 'mx-auto max-w-5xl xl:max-w-6xl'
                                  : step === 2
                                    ? 'mx-auto max-w-4xl'
                                    : 'mx-auto max-w-3xl',
                        )}
                    >
                        <div
                            className={cn('min-w-0', showSidebar && 'lg:col-span-7 xl:col-span-8')}
                        >
                            {step === 1 && <ServiceStep />}
                            {step === 2 && (allowStaffSelection ? <EmployeeStep /> : null)}
                            {step === 3 && <DateStep />}
                            {step === 4 && <TimeStep />}
                            {step === 5 && <CustomerStep />}
                            {step === 6 && <ReviewStep />}
                        </div>
                        {showSidebar ? (
                            <div className={cn('lg:col-span-5 xl:col-span-4')}>
                                <BookingSummary />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            {isBookingPaused && !isSettingsLoading ? <BookingPausedOverlay /> : null}
        </>
    );
}
