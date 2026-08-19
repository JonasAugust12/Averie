'use client';

import { ArrowRight, Check, Clock, Gem, Sparkles, X } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { BookingSummarySkeleton } from '@components/skeletons';
import { useServices } from '@services/service-catalog.service';
import { useStaff } from '@services/staff.service';
import { useScheduleSettings } from '@services/schedule.service';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import { cn } from '@utils/cn.util';

export function BookingSummary() {
    const t = useBookingTranslations();
    const {
        step,
        serviceIds,
        staffPreference,
        staffId,
        date,
        time,
        customer,
        setStep,
        setStaffPreference,
        toggleServiceId,
    } = useBookingStore();
    const { data: services, isLoading: servicesLoading } = useServices();
    const { data: staff } = useStaff();
    const { data: settings } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;

    const selectedServices = services?.filter((s) => serviceIds.includes(s.id)) ?? [];
    const employee =
        staffPreference === 'any'
            ? t('anyTechnician')
            : staff?.find((s) => s.id === staffId)
              ? `${staff.find((s) => s.id === staffId)!.firstName} ${staff.find((s) => s.id === staffId)!.lastName}`
              : undefined;

    const hasSelection = selectedServices.length > 0;
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.estimatedMinutes, 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    const handleContinue = () => {
        if (!allowStaffSelection) {
            setStaffPreference('any');
            setStep(3);
        } else {
            setStep(2);
        }
    };

    if (servicesLoading && step === 1) {
        return (
            <>
                <BookingSummarySkeleton />
                <div className="block animate-pulse border-t border-stone-300 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden fixed bottom-0 left-0 right-0 z-40 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
                    <div className="mx-auto flex max-w-app items-center justify-between gap-3">
                        <div className="min-w-0 space-y-2">
                            <div className="h-3 w-28 rounded bg-stone-100" />
                            <div className="h-6 w-20 rounded bg-stone-200" />
                        </div>
                        <div className="h-11 w-32 shrink-0 rounded-full bg-stone-200" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Desktop Sidebar (lg and above) */}
            <aside className="hidden lg:block space-y-4 lg:sticky lg:top-32">
                {/* Your Booking Card */}
                <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 shadow-md backdrop-blur-md relative">
                    {/* Top luxury accent bar */}
                    <div className="h-1 w-full bg-linear-to-r from-red-600 via-rose-500 to-red-600" />

                    {/* Header */}
                    <div className="border-b border-stone-100 px-6 py-4.5 bg-stone-50/40 flex items-center justify-between">
                        <div>
                            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-stone-600">
                                AVERIE SALON
                            </p>
                            <h2 className="font-display text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                                <span>{t('summary.title') || t('yourBooking')}</span>
                                <Sparkles className="size-3.5 text-rose-500" />
                            </h2>
                        </div>
                        {hasSelection ? (
                            <span className="rounded-full border border-stone-200/80 bg-white px-2.5 py-0.5 font-sans text-xs font-semibold text-stone-700 shadow-2xs">
                                {selectedServices.length}
                            </span>
                        ) : null}
                    </div>

                    {!hasSelection ? (
                        <div className="px-6 py-8 text-center space-y-3">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                                <Gem className="size-5 text-stone-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-display text-base font-bold text-stone-800">
                                    {t('summary.emptyTitle') || 'Curate Your Visit'}
                                </p>
                                <p className="font-sans text-xs text-stone-500 leading-relaxed max-w-55 mx-auto">
                                    {t('summary.emptyHint') ||
                                        'Select one or more services to curate your custom experience.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Selected Services List */}
                            <div className="px-6 py-4 space-y-3 max-h-95 overflow-y-auto">
                                <p className="font-sans text-[11px] font-bold tracking-wider text-stone-600 uppercase">
                                    {t('review.service')}
                                </p>
                                <ul className="space-y-2.5">
                                    {selectedServices.map((svc) => (
                                        <li
                                            key={svc.id}
                                            className="group flex items-start justify-between gap-3 rounded-2xl border border-stone-200/70 bg-stone-50/70 p-3 transition-all hover:bg-stone-50 hover:border-stone-300"
                                        >
                                            <div className="flex items-start gap-2.5 min-w-0">
                                                {step === 1 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleServiceId(svc.id)}
                                                        className="group/check mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-lg border border-stone-800 bg-stone-900 text-white shadow-2xs transition-all hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                                        title="Bỏ chọn dịch vụ này"
                                                        aria-label={`Bỏ chọn ${svc.name}`}
                                                    >
                                                        <Check className="size-3.5 stroke-3 group-hover/check:hidden" />
                                                        <X className="size-3.5 stroke-3 hidden group-hover/check:block" />
                                                    </button>
                                                ) : (
                                                    <div className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white shadow-2xs">
                                                        <Check className="size-3.5 stroke-3" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-display text-sm font-bold text-stone-900 leading-snug">
                                                        {svc.name}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-1 font-sans text-xs font-medium text-stone-500">
                                                        <Clock className="size-3 text-stone-400" />
                                                        <span>
                                                            {t('duration', {
                                                                min: svc.estimatedMinutes,
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span className="font-display text-base font-bold text-stone-900">
                                                    {formatUsd(svc.price)}
                                                </span>
                                                {step === 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleServiceId(svc.id)}
                                                        className="flex size-6 items-center justify-center rounded-full text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                                                        title="Bỏ chọn"
                                                        aria-label={`Bỏ chọn ${svc.name}`}
                                                    >
                                                        <X className="size-3.5 stroke-2" />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Additional Booking Context for Subsequent Steps */}
                            {(employee || date || time || customer) && (
                                <div className="space-y-2 border-t border-stone-100 px-6 py-3.5 bg-stone-50/30">
                                    {employee && (
                                        <DetailRow label={t('review.employee')} value={employee} />
                                    )}
                                    {date && (
                                        <DetailRow
                                            label={t('review.date')}
                                            value={formatDisplayDate(date)}
                                        />
                                    )}
                                    {time && <DetailRow label={t('review.time')} value={time} />}
                                    {customer && (
                                        <DetailRow
                                            label={t('review.customer')}
                                            value={`${customer.firstName} ${customer.lastName}`}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Totals Breakdown */}
                            <div className="border-t border-stone-100 px-6 py-4 bg-stone-50/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-wider">
                                            {t('total')}
                                        </p>
                                        <p className="font-sans text-xs text-stone-500 font-medium">
                                            {t('duration', { min: totalDuration })} total
                                        </p>
                                    </div>
                                    <p className="font-display text-2xl font-bold text-stone-900">
                                        {formatUsd(totalPrice)}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 1 CTA Action */}
                    {step === 1 && (
                        <div className="border-t border-stone-100 p-5 bg-white space-y-2.5">
                            <Button
                                className={cn(
                                    'w-full rounded-2xl py-3.5 font-sans text-sm font-bold tracking-wider uppercase shadow-md transition-all duration-300 flex items-center justify-center gap-2',
                                    hasSelection
                                        ? 'bg-stone-900 text-white hover:bg-stone-800 hover:shadow-lg active:scale-98'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed',
                                )}
                                disabled={!hasSelection}
                                onClick={handleContinue}
                            >
                                <span>
                                    {hasSelection
                                        ? t('summary.continueWithTotal', {
                                              total: formatUsd(totalPrice),
                                          }) || `Continue · ${formatUsd(totalPrice)}`
                                        : t('summary.selectToContinue') ||
                                          'Select a service to continue'}
                                </span>
                                {hasSelection && <ArrowRight className="size-4" />}
                            </Button>

                            <p className="text-center font-sans text-[11px] text-stone-600 flex items-center justify-center gap-1.5">
                                <Sparkles className="size-3 text-rose-500 shrink-0" />
                                <span>
                                    {t('summary.guarantee') ||
                                        'Complimentary consultation & sanitation standards guaranteed'}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Bottom Floating Dock (< lg) — For Step 1 */}
            {step === 1 && (
                <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/90 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                    <div className="mx-auto flex max-w-app items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    {hasSelection
                                        ? t('summary.servicesSelected', {
                                              count: selectedServices.length,
                                          }) || `${selectedServices.length} services`
                                        : t('yourBooking')}
                                </span>
                                {hasSelection && (
                                    <span className="font-sans text-[11px] font-medium text-stone-400">
                                        • {totalDuration} min
                                    </span>
                                )}
                            </div>
                            <p className="font-display text-xl font-bold text-stone-900 leading-tight mt-0.5">
                                {hasSelection ? formatUsd(totalPrice) : '$0.00'}
                            </p>
                        </div>

                        <Button
                            className={cn(
                                'rounded-2xl px-5 sm:px-6 py-2.5 font-sans text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md active:scale-95 transition-all flex items-center gap-2',
                                hasSelection
                                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed',
                            )}
                            disabled={!hasSelection}
                            onClick={handleContinue}
                        >
                            <span>{t('continue') || 'Continue'}</span>
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 py-1 text-xs">
            <span className="font-sans font-medium text-stone-500">{label}</span>
            <span className="text-right font-sans font-bold text-stone-800 truncate max-w-40">
                {value}
            </span>
        </div>
    );
}
