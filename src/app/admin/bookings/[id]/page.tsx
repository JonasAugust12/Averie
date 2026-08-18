'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBooking } from '@services/booking.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin/bookings';
import { EmptyState } from '@components/ui';
import { BookingDetailSkeleton } from '@components/skeletons';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import { formatUserName } from '@utils/staff.util';

export default function AdminBookingDetailPage() {
    const t = useAdminTranslations();
    const params = useParams<{ id: string }>();
    const { data: booking, isLoading } = useBooking(params.id);

    if (isLoading) {
        return <BookingDetailSkeleton />;
    }

    if (!booking) {
        return (
            <EmptyState
                title={t('bookings.notFound')}
                action={
                    <Link
                        href="/admin/bookings"
                        className="font-sans text-sm text-primary underline"
                    >
                        Back to bookings
                    </Link>
                }
            />
        );
    }

    const serviceNames = booking.services.map((s) => s.name).join(', ');
    const tech = booking.staff
        ? formatUserName(booking.staff)
        : booking.staffPreference === 'any'
          ? t('bookings.detailCard.anyStaff')
          : '—';

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <BookingStatusBadge status={booking.status} label={t(`status.${booking.status}`)} />
            </div>
            <p className="font-display text-lg text-primary">{booking.reference}</p>

            <dl className="divide-y divide-border rounded-xl border border-border bg-neutral font-sans text-sm">
                {[
                    [
                        t('overview.client'),
                        `${booking.customer.firstName} ${booking.customer.lastName}`,
                    ],
                    ['Phone', booking.customer.phone],
                    ['Email', booking.customer.email ?? '—'],
                    [t('overview.service'), serviceNames || '—'],
                    [t('overview.technician'), tech],
                    ['Date', formatDisplayDate(booking.date)],
                    [t('overview.time'), booking.time],
                    ['Duration', `${booking.totalEstimatedMinutes} min`],
                    ['Price', formatUsd(booking.totalPrice)],
                    ['Note', booking.customer.note ?? '—'],
                ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 px-4 py-3">
                        <dt className="text-muted">{label}</dt>
                        <dd className="text-right text-primary">{value}</dd>
                    </div>
                ))}
            </dl>

            <Link
                href="/admin/bookings"
                className="font-sans text-sm text-muted hover:text-primary"
            >
                ← Back to bookings
            </Link>
        </div>
    );
}
