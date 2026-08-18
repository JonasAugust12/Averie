'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared/LanguageSwitcher';
import { useScheduleSettings } from '@services/schedule.service';
import { useBookingStore, type BookingStep } from '@stores/booking.store';
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

const STEP_DOT_SIZE_PX = 36;
const STEP_DOT_RADIUS_PX = STEP_DOT_SIZE_PX / 2;

interface BookingChromeProps {
    step: BookingStep;
    complete?: boolean;
}

export function BookingChrome({ step, complete = false }: BookingChromeProps) {
    const t = useBookingTranslations();
    const { serviceIds, staffPreference, staffId, date, time, customer, setStep } =
        useBookingStore();
    const { data: settings } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;

    const canNavigateToStep = (targetStep: BookingStep): boolean => {
        if (complete) return false;
        if (targetStep === 1) return true;
        if (serviceIds.length === 0) return false;
        if (targetStep === 2) return true;
        if (allowStaffSelection && staffPreference === 'specific' && !staffId) return false;
        if (targetStep === 3) return true;
        if (!date) return false;
        if (targetStep === 4) return true;
        if (!time) return false;
        if (targetStep === 5) return true;
        if (!customer || !customer.firstName || !customer.phone) return false;
        if (targetStep === 6) return true;
        return false;
    };

    const visibleSteps = STEPS.filter((s) => s.step !== 2 || allowStaffSelection);

    const currentStepDef = visibleSteps.find((s) => s.step === step) || visibleSteps[0];
    const currentStepIndex = visibleSteps.findIndex((s) => s.step === step);
    const progressPercent = Math.round(((currentStepIndex + 1) / visibleSteps.length) * 100);

    return (
        <header className="sticky top-0 z-50 border-b border-border/30 bg-background/95 backdrop-blur-xl shadow-xs">
            {/* Top bar */}
            <div className="mx-auto flex w-full max-w-app items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                <Link href="/" className="transition-opacity hover:opacity-60">
                    <Image
                        src="/salon/figma/logo.svg"
                        alt="Averie Logo"
                        width={113}
                        height={36}
                        className="h-8 sm:h-9 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <LanguageSwitcher scope="guest" />
                    {/* Cancel button */}
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-stone-300 bg-background px-3 py-1.5 sm:px-4 sm:py-2 font-sans text-xs sm:text-sm font-semibold text-stone-800 shadow-xs transition-all hover:border-primary hover:bg-tertiary/40"
                        aria-label={t('cancel')}
                    >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-stone-600" />
                        <span>{t('cancel')}</span>
                    </Link>
                </div>
            </div>

            {/* Mobile-Friendly Step Bar (screens < sm) */}
            <div className="block sm:hidden px-4 pb-3">
                <div className="flex items-center justify-between font-sans text-xs font-bold text-stone-700">
                    <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-white">
                            {currentStepIndex + 1}
                        </span>
                        <span className="uppercase tracking-wider text-primary font-bold">
                            {t(currentStepDef.labelKey)}
                        </span>
                    </span>
                    <span className="text-stone-500 font-semibold">
                        {currentStepIndex + 1} / {visibleSteps.length}
                    </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Desktop / Tablet Step indicator (screens >= sm) */}
            <div className="hidden sm:block mx-auto w-full max-w-app px-4 pb-5 sm:px-6 lg:px-8">
                <nav aria-label="Booking progress">
                    <ol className="flex w-full items-start">
                        {visibleSteps.map((s, index) => {
                            const isComplete = complete || s.step < step;
                            const isActive = !complete && s.step === step;
                            const isLast = index === visibleSteps.length - 1;
                            const allowed = canNavigateToStep(s.step);

                            return (
                                <li
                                    key={s.step}
                                    className="relative flex flex-1 flex-col items-center"
                                >
                                    {/* Connector — runs in the gap between circles, not through them */}
                                    {!isLast && (
                                        <div
                                            aria-hidden
                                            className="pointer-events-none absolute z-0 h-0.5"
                                            style={{
                                                top: STEP_DOT_RADIUS_PX,
                                                left: `calc(50% + ${STEP_DOT_RADIUS_PX}px)`,
                                                width: `calc(100% - ${STEP_DOT_SIZE_PX}px)`,
                                            }}
                                        >
                                            <div className="h-full w-full rounded-full bg-stone-200/90" />
                                            <div
                                                key={`${s.step}-${isComplete ? 'done' : isActive ? 'active' : 'idle'}`}
                                                className={cn(
                                                    'absolute inset-y-0 left-0 origin-left rounded-full bg-primary',
                                                    isComplete && 'animate-booking-step-line-fill',
                                                    isActive && 'animate-booking-step-line-hint',
                                                    !isComplete && !isActive && 'w-0',
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Interactive Circle & Label Button */}
                                    <button
                                        type="button"
                                        disabled={!allowed}
                                        onClick={() => allowed && setStep(s.step)}
                                        className={cn(
                                            'group relative z-10 flex flex-col items-center border-0 bg-transparent p-0 transition-all duration-200 outline-none',
                                            allowed
                                                ? 'cursor-pointer hover:scale-105'
                                                : 'cursor-not-allowed opacity-60',
                                        )}
                                    >
                                        <div className="relative z-10">
                                            <div
                                                className={cn(
                                                    'relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ring-[3px] ring-background transition-all duration-300',
                                                    isComplete
                                                        ? 'border-primary bg-primary text-neutral'
                                                        : isActive
                                                          ? 'border-primary bg-background text-primary shadow-md shadow-primary/15'
                                                          : 'border-stone-300 bg-background text-stone-500 group-hover:border-primary/60',
                                                )}
                                            >
                                                {isComplete ? (
                                                    <Check className="h-4 w-4" strokeWidth={3} />
                                                ) : (
                                                    <span className="font-sans text-[13px] font-bold">
                                                        {index + 1}
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
                                                'mt-2 w-full truncate px-0.5 text-center font-sans text-[13px] tracking-wide uppercase',
                                                isActive
                                                    ? 'font-bold text-primary scale-102'
                                                    : isComplete
                                                      ? 'font-bold text-primary/85'
                                                      : 'font-semibold text-stone-500 group-hover:text-primary/70',
                                            )}
                                        >
                                            {t(s.labelKey)}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </header>
    );
}
