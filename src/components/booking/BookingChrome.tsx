'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared';
import type { BookingStep } from '@stores/booking.store';
import { cn } from '@utils/cn.util';

/** Wizard uses steps 1–6; Stitch labels confirmation as step 7 of 7. */
const TOTAL_STEPS = 7;

interface BookingChromeProps {
    step: BookingStep;
    /** When true, show “Step 7 Complete” (confirmation page). */
    complete?: boolean;
}

export function BookingChrome({ step, complete = false }: BookingChromeProps) {
    const t = useBookingTranslations();
    const current = complete ? TOTAL_STEPS : step;
    const progress = (current / TOTAL_STEPS) * 100;

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-neutral/90 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-app items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="font-display text-xl tracking-widest text-primary uppercase"
                >
                    {t('brand')}
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                    <LanguageSwitcher />
                    <Link
                        href="/"
                        className="inline-flex cursor-pointer items-center gap-2 font-sans text-xs tracking-widest text-muted uppercase transition-colors hover:text-primary"
                        aria-label={t('cancel')}
                    >
                        <span className="hidden sm:inline">{t('cancel')}</span>
                        <X className="h-5 w-5" />
                    </Link>
                </div>
            </div>
            <div className="mx-auto w-full max-w-app px-4 pb-4 sm:px-6 lg:px-8">
                <p className="font-sans text-xs tracking-widest text-muted uppercase">
                    {complete ? t('steps.complete') : t('stepOf', { current, total: TOTAL_STEPS })}
                </p>
                {!complete ? (
                    <h1 className="mt-1 font-display text-2xl text-primary md:text-3xl">
                        {t(`steps.${stepLabel(step)}`)}
                    </h1>
                ) : null}
                <div
                    className="mt-3 h-px w-full overflow-hidden bg-border/50"
                    role="progressbar"
                    aria-valuenow={current}
                    aria-valuemin={1}
                    aria-valuemax={TOTAL_STEPS}
                >
                    <div
                        className={cn('h-full bg-primary transition-all duration-300')}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </header>
    );
}

function stepLabel(step: BookingStep): string {
    const map: Record<BookingStep, string> = {
        1: 'service',
        2: 'employee',
        3: 'date',
        4: 'time',
        5: 'customer',
        6: 'review',
    };
    return map[step];
}
