'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSalonBookings, useSalonServices, useSalonStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin';
import { Input } from '@components/ui';
import { formatDisplayDate, formatUsd } from '@utils/format.util';

export default function AdminBookingsPage() {
    const t = useAdminTranslations();
    const [query, setQuery] = useState('');
    const { data: bookings, isLoading } = useSalonBookings();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return bookings ?? [];
        return (bookings ?? []).filter((b) => {
            const name = `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase();
            return name.includes(q) || b.reference.toLowerCase().includes(q);
        });
    }, [bookings, query]);

    return (
        <div className="space-y-6">
            <Input
                placeholder={t('bookings.search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-sm"
            />

            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-180 font-sans text-sm">
                        <thead className="border-b border-border bg-tertiary text-left text-muted">
                            <tr>
                                <th className="px-4 py-3">Ref</th>
                                <th className="px-4 py-3">{t('overview.client')}</th>
                                <th className="px-4 py-3">{t('overview.service')}</th>
                                <th className="px-4 py-3">{t('overview.time')}</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">{t('overview.status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b) => {
                                const svc = services?.find((s) => s.id === b.serviceId);
                                const tech =
                                    b.staffId === 'any'
                                        ? 'Any'
                                        : staff?.find((s) => s.id === b.staffId)?.name;
                                return (
                                    <tr key={b.id} className="border-b border-border last:border-0">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/bookings/${b.id}`}
                                                className="text-primary hover:underline"
                                            >
                                                {b.reference}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-primary">
                                            {b.customer.firstName} {b.customer.lastName}
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {svc?.name ?? '—'}
                                            {tech ? ` · ${tech}` : ''}
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {formatDisplayDate(b.date)} {b.time}
                                        </td>
                                        <td className="px-4 py-3 text-primary">
                                            {formatUsd(b.price)}
                                        </td>
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
