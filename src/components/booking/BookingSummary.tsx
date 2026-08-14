'use client';

import { Check, Clock } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useSalonServices, useSalonStaff, useScheduleSettings } from '@services/salon.service';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { formatDisplayDate, formatUsd } from '@utils/format.util';

export function BookingSummary() {
    const t = useBookingTranslations();
    const { step, serviceIds, staffId, date, time, customer, setStep, setStaffId } =
        useBookingStore();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();
    const { data: settings } = useScheduleSettings();
    const allowStaffSelection = settings?.allowStaffSelection ?? true;

    const selectedServices = services?.filter((s) => serviceIds.includes(s.id)) ?? [];
    const employee =
        staffId === 'any' ? t('anyTechnician') : staff?.find((s) => s.id === staffId)?.name;

    const hasSelection = selectedServices.length > 0;
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMin, 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    const handleContinue = () => {
        if (!allowStaffSelection) {
            setStaffId('any');
            setStep(3);
        } else {
            setStep(2);
        }
    };

    return (
        <>
            {/* Desktop Sidebar (lg and above) */}
            <aside className="hidden lg:block space-y-3 lg:sticky lg:top-40">
                {/* Your Booking card */}
                <div className="overflow-hidden rounded-2xl border border-stone-200/60 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-md">
                    <div className="border-b border-stone-200/40 px-5 py-4">
                        <h2 className="font-display text-xl text-primary tracking-wide">
                            {t('yourBooking')}
                        </h2>
                    </div>

                    {!hasSelection ? (
                        <div className="px-5 py-6">
                            <p className="font-sans text-sm text-muted italic">
                                {t('selectToBegin')}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Services list */}
                            <div className="px-5 py-4">
                                <p className="mb-3 font-sans text-xs font-bold tracking-[0.15em] text-stone-700 uppercase">
                                    {t('review.service')}
                                </p>
                                <ul className="space-y-3">
                                    {selectedServices.map((svc) => (
                                        <li
                                            key={svc.id}
                                            className="flex items-start justify-between gap-3"
                                        >
                                            <div className="flex items-start gap-2 min-w-0">
                                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                                <div className="min-w-0">
                                                    <p className="font-sans text-[15px] font-bold text-primary leading-snug">
                                                        {svc.name}
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-1 font-sans text-sm font-semibold text-stone-500">
                                                        <Clock className="h-3 w-3" aria-hidden />
                                                        {t('duration', { min: svc.durationMin })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="shrink-0 font-display text-[17px] font-bold text-primary">
                                                {formatUsd(svc.price)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Other details */}
                            {(employee || totalDuration > 0 || date || time || customer) && (
                                <div className="space-y-3 border-t border-stone-200/40 px-5 py-4">
                                    {employee && (
                                        <DetailRow label={t('review.employee')} value={employee} />
                                    )}
                                    {totalDuration > 0 && (
                                        <DetailRow
                                            label="Total duration"
                                            value={t('duration', { min: totalDuration })}
                                        />
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
                        </>
                    )}

                    {/* ── Sticky CTA at bottom of card for Step 1 ── */}
                    {step === 1 && (
                        <div className="border-t border-stone-200/40 px-5 py-4">
                            <Button
                                className="w-full rounded-full py-3.5 text-base tracking-widest uppercase shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 hover:shadow-lg"
                                disabled={!hasSelection}
                                onClick={handleContinue}
                            >
                                {hasSelection
                                    ? `Continue · ${formatUsd(totalPrice)}`
                                    : 'Select a service to continue'}
                            </Button>
                            {hasSelection && (
                                <p className="mt-2 text-center font-sans text-xs text-muted">
                                    {selectedServices.length} service
                                    {selectedServices.length > 1 ? 's' : ''} ·{' '}
                                    {t('duration', { min: totalDuration })} total
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Total card (shows when services selected and past step 1) */}
                {hasSelection && step !== 1 && (
                    <div className="flex items-center justify-between rounded-2xl border-2 border-primary/20 bg-primary/10 px-5 py-4 shadow-xs">
                        <div>
                            <p className="font-sans text-xs font-bold tracking-[0.15em] text-stone-700 uppercase">
                                {t('total')}
                            </p>
                            <p className="mt-0.5 font-sans text-sm font-semibold text-stone-600">
                                {t('duration', { min: totalDuration })} total
                            </p>
                        </div>
                        <p className="font-display text-2xl font-bold text-primary">
                            {formatUsd(totalPrice)}
                        </p>
                    </div>
                )}
            </aside>

            {/* Mobile Bottom Floating Bar (< lg) */}
            <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-300 bg-white/95 px-4 py-3 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl">
                <div className="mx-auto flex max-w-app items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                            {hasSelection
                                ? `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
                                : t('yourBooking')}
                        </p>
                        <p className="font-display text-lg font-bold text-primary leading-tight">
                            {hasSelection ? formatUsd(totalPrice) : '$0'}
                            {hasSelection && (
                                <span className="ml-2 font-sans text-xs font-semibold text-stone-500">
                                    ({totalDuration} min)
                                </span>
                            )}
                        </p>
                    </div>

                    {step === 1 ? (
                        <Button
                            className="rounded-full px-6 py-3 font-sans text-sm font-bold tracking-wider uppercase shadow-md active:scale-95 transition-all"
                            disabled={!hasSelection}
                            onClick={handleContinue}
                        >
                            Continue →
                        </Button>
                    ) : (
                        <div className="text-right">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-sans text-xs font-bold text-primary">
                                Step {step} of 6
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 py-0.5">
            <span className="font-sans text-sm font-semibold text-stone-600">{label}</span>
            <span className="text-right font-sans text-sm font-bold text-primary">{value}</span>
        </div>
    );
}
