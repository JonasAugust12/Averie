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

/** Sidebar “Your Booking” appears on service, time, and customer (Stitch). */
const SIDEBAR_STEPS = new Set([1, 4, 5]);

export function BookPageView() {
    const step = useBookingStore((s) => s.step);
    const showSidebar = SIDEBAR_STEPS.has(step);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <BookingChrome step={step} />
            <div
                className={cn(
                    'mx-auto w-full max-w-app px-4 py-10 sm:px-6 md:py-16 lg:px-8',
                    !showSidebar && 'flex flex-col items-center',
                )}
            >
                <div
                    className={cn(
                        'w-full',
                        showSidebar ? 'grid gap-10 lg:grid-cols-12' : 'mx-auto max-w-3xl',
                    )}
                >
                    <div className={cn('min-w-0', showSidebar && 'lg:col-span-8')}>
                        {step === 1 && <ServiceStep />}
                        {step === 2 && <EmployeeStep />}
                        {step === 3 && <DateStep />}
                        {step === 4 && <TimeStep />}
                        {step === 5 && <CustomerStep />}
                        {step === 6 && <ReviewStep />}
                    </div>
                    {showSidebar ? (
                        <div className="lg:col-span-4">
                            <BookingSummary />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
