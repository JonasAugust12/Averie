'use client';

import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared';
import type { BookingStep } from '@stores/booking.store';
import { cn } from '@utils/cn.util';

interface StepDotDef {
    step: BookingStep;
    labelKey: string;
}

const STEPS: StepDotDef[] = [
    { step: 1, labelKey: 'steps.service' },
    { step: 2, labelKey: 'steps.employee' },
    { step: 3, labelKey: 'steps.date' },
    { step: 4, labelKey: 'steps.time' },
    { step: 5, labelKey: 'steps.customer' },
    { step: 6, labelKey: 'steps.review' },
];

interface BookingChromeProps {
    step: BookingStep;
    complete?: boolean;
}

export function BookingChrome({ step, complete = false }: BookingChromeProps) {
    const t = useBookingTranslations();

    return (
        <header className="sticky top-0 z-50 border-b border-border/30 bg-background/95 backdrop-blur-xl shadow-sm">
            {/* Top bar */}
            <div className="mx-auto flex w-full max-w-app items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="font-display text-xl tracking-[0.2em] text-primary uppercase transition-opacity hover:opacity-60"
                >
                    {t('brand')}
                </Link>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    {/* Cancel — clearly labeled, visible button */}
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 font-sans text-sm font-medium text-primary shadow-sm transition-all hover:border-primary hover:bg-tertiary/40"
                        aria-label={t('cancel')}
                    >
                        <X className="h-4 w-4 shrink-0" />
                        <span>{t('cancel')}</span>
                    </Link>
                </div>
            </div>

            {/* Step indicator */}
            <div className="mx-auto w-full max-w-app px-4 pb-5 sm:px-6 lg:px-8">
                <nav aria-label="Booking progress">
                    <ol className="flex w-full items-start">
                        {STEPS.map((s, index) => {
                            const isComplete = complete || s.step < step;
                            const isActive = !complete && s.step === step;
                            const isLast = index === STEPS.length - 1;

                            return (
                                <li
                                    key={s.step}
                                    className="relative flex flex-1 flex-col items-center"
                                >
                                    {/* Connector */}
                                    {!isLast && (
                                        <div
                                            className="absolute top-4 z-0 h-px"
                                            style={{ left: '50%', width: '100%' }}
                                        >
                                            <div className="h-full w-full bg-border/60" />
                                            <div
                                                className="absolute inset-y-0 left-0 bg-primary transition-all duration-700 ease-out"
                                                style={{ width: isComplete ? '100%' : '0%' }}
                                            />
                                        </div>
                                    )}

                                    {/* Circle */}
                                    <div className="relative z-10">
                                        <div
                                            className={cn(
                                                'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500',
                                                isComplete
                                                    ? 'border-primary bg-primary text-neutral'
                                                    : isActive
                                                      ? 'border-primary bg-background text-primary shadow-md shadow-primary/10'
                                                      : 'border-border/60 bg-background text-muted',
                                            )}
                                        >
                                            {isComplete ? (
                                                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                            ) : (
                                                <span className="font-sans text-[11px] font-semibold">
                                                    {s.step}
                                                </span>
                                            )}
                                        </div>
                                        {isActive && (
                                            <span className="absolute -inset-1 rounded-full bg-primary/15 animate-ambient-pulse" />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={cn(
                                            'mt-2 hidden w-full px-0.5 text-center font-sans text-[9px] tracking-widest uppercase sm:block',
                                            isActive
                                                ? 'font-semibold text-primary'
                                                : isComplete
                                                  ? 'text-primary/60'
                                                  : 'text-muted',
                                        )}
                                    >
                                        {t(s.labelKey)}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </header>
    );
}
