'use client';

import {
    BookingChrome,
    BookingSummary,
    CustomerStep,
    DateStep,
    EmployeeStep,
    ReviewStep,
    ServiceStep,
    TimeStep,
} from '@components/booking';
import { useBookingStore } from '@stores/booking.store';
import { cn } from '@utils/cn.util';

/** Sidebar "Your Booking" appears on service, time, and customer steps. */
const SIDEBAR_STEPS = new Set([1, 4, 5]);

export function BookPageView() {
    const step = useBookingStore((s) => s.step);
    const showSidebar = SIDEBAR_STEPS.has(step);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Ambient background glow for premium feel */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-secondary-100/40 blur-3xl" />
                <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-tertiary/50 blur-3xl" />
            </div>

            <BookingChrome step={step} />

            <div
                className={cn(
                    'relative mx-auto w-full max-w-app px-4 py-10 sm:px-6 md:py-16 lg:px-8',
                    !showSidebar && 'flex flex-col items-center',
                )}
            >
                <div
                    className={cn(
                        'w-full',
                        showSidebar ? 'grid gap-8 lg:grid-cols-12' : 'mx-auto max-w-3xl',
                    )}
                >
                    <div className={cn('min-w-0', showSidebar && 'lg:col-span-7 xl:col-span-8')}>
                        {step === 1 && <ServiceStep />}
                        {step === 2 && <EmployeeStep />}
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
    );
}
