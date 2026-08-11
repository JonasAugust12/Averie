'use client';

import { Loader2 } from 'lucide-react';
import { useSalonBookings, useSalonServices, useSalonStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin';
import { formatDisplayDate } from '@utils/format.util';

export default function AdminSchedulePage() {
    const t = useAdminTranslations();
    const { data: bookings, isLoading } = useSalonBookings();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();

    const sorted = [...(bookings ?? [])].sort((a, b) => {
        const da = `${a.date} ${a.time}`;
        const db = `${b.date} ${b.time}`;
        return da.localeCompare(db);
    });

    return (
        <div className="space-y-6">
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-180 font-sans text-sm">
                        <thead className="border-b border-border bg-tertiary text-left text-muted">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">{t('overview.time')}</th>
                                <th className="px-4 py-3">{t('overview.client')}</th>
                                <th className="px-4 py-3">{t('overview.service')}</th>
                                <th className="px-4 py-3">{t('overview.technician')}</th>
                                <th className="px-4 py-3">{t('overview.status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((b) => {
                                const svc = services?.find((s) => s.id === b.serviceId);
                                const tech =
                                    b.staffId === 'any'
                                        ? 'Any'
                                        : staff?.find((s) => s.id === b.staffId)?.name;
                                return (
                                    <tr key={b.id} className="border-b border-border last:border-0">
                                        <td className="px-4 py-3 text-primary">
                                            {formatDisplayDate(b.date)}
                                        </td>
                                        <td className="px-4 py-3 text-primary">{b.time}</td>
                                        <td className="px-4 py-3 text-primary">
                                            {b.customer.firstName} {b.customer.lastName}
                                        </td>
                                        <td className="px-4 py-3 text-muted">{svc?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted">{tech ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <BookingStatusBadge
                                                status={b.status}
                                                label={t(`status.${b.status}`)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
