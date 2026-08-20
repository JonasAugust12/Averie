'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarX, RotateCcw } from 'lucide-react';
import { useBooking, useCancelBooking, useRestoreBooking } from '@services/booking.service';
import { useAdminTranslations, useCommonTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge, BookingTicketCard } from '@components/admin/bookings';
import { Button } from '@components/common';
import { EmptyState } from '@components/ui';
import { BookingDetailSkeleton } from '@components/skeletons';
import { useUIStore } from '@stores/ui.store';
import { formatUserName } from '@utils/staff.util';
import { toastSuccess } from '@utils/toast.util';
import type { BookingStatus } from '@typings/salon-common.type';

const pageShellClass = 'mx-auto flex w-full max-w-3xl flex-col items-center px-1 sm:px-0';

export default function AdminBookingDetailPage() {
    const t = useAdminTranslations();
    const tCommon = useCommonTranslations();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { data: booking, isLoading } = useBooking(params.id);
    const { showConfirm, hideConfirm } = useUIStore();
    const cancelBooking = useCancelBooking();
    const restoreBooking = useRestoreBooking();

    const handleGoBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
            return;
        }
        router.push('/admin/bookings');
    };

    const handleUpdateStatus = (newStatus: BookingStatus) => {
        if (!booking) return;

        const isCancelling = newStatus === 'cancelled';
        showConfirm({
            title: isCancelling
                ? t('bookings.actions.cancelConfirmTitle')
                : t('bookings.actions.restoreConfirmTitle'),
            message: isCancelling
                ? t('bookings.actions.cancelConfirmMsg', { reference: booking.reference })
                : t('bookings.actions.restoreConfirmMsg', { reference: booking.reference }),
            confirmText: isCancelling
                ? t('bookings.actions.confirmCancel')
                : t('bookings.actions.confirmRestore'),
            cancelText: t('bookings.actions.cancelNo'),
            type: isCancelling ? 'danger' : 'info',
            onConfirm: () => {
                const mutation = isCancelling ? cancelBooking : restoreBooking;
                mutation.mutate(booking.id, {
                    onSuccess: () => {
                        toastSuccess(
                            isCancelling
                                ? t('toasts.bookingCancelled')
                                : t('toasts.bookingRestored'),
                        );
                        hideConfirm();
                    },
                });
            },
        });
    };

    if (isLoading) {
        return (
            <div className={pageShellClass}>
                <BookingDetailSkeleton variant="ticket" centered />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className={pageShellClass}>
                <EmptyState
                    title={t('bookings.notFound')}
                    action={
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-stone-600 underline-offset-2 transition-colors hover:text-stone-900 hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {tCommon('notFound.back')}
                        </button>
                    }
                />
            </div>
        );
    }

    const serviceNames = booking.services.map((s) => s.name).join(', ');
    const staffName = booking.staff
        ? formatUserName(booking.staff)
        : booking.staffPreference === 'any'
          ? t('bookings.detailCard.anyStaff')
          : undefined;

    return (
        <div className={`${pageShellClass} space-y-6`}>
            <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-base font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
                <ArrowLeft className="h-5 w-5 shrink-0" />
                {tCommon('notFound.back')}
            </button>

            <div className="flex w-full flex-col items-center gap-4 text-center">
                <BookingStatusBadge
                    status={booking.displayStatus}
                    label={t(`status.${booking.displayStatus}`)}
                />
                <div>
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                        {t('bookings.detail')}
                    </h1>
                    <p className="mt-1.5 font-mono text-sm font-bold tracking-wide text-stone-500">
                        {booking.reference}
                    </p>
                </div>
            </div>

            <div className="w-full overflow-hidden rounded-xl shadow-md ring-1 ring-stone-200/80">
                <BookingTicketCard
                    booking={booking}
                    serviceName={serviceNames || undefined}
                    staffName={staffName}
                />
            </div>

            <div className="flex w-full flex-wrap items-center justify-center gap-3 pb-2">
                {booking.status === 'upcoming' ? (
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => handleUpdateStatus('cancelled')}
                        disabled={cancelBooking.isPending}
                        className="gap-2 border-red-200 bg-red-50/60 text-red-700 hover:bg-red-100"
                    >
                        <CalendarX className="h-4 w-4" />
                        {t('bookings.actions.cancel')}
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => handleUpdateStatus('upcoming')}
                        disabled={restoreBooking.isPending}
                        className="gap-2 border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100"
                    >
                        <RotateCcw className="h-4 w-4" />
                        {t('bookings.actions.restore')}
                    </Button>
                )}
            </div>
        </div>
    );
}
