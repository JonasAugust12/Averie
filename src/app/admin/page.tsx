'use client';

import Link from 'next/link';
import { CalendarPlus, Loader2, Plus } from 'lucide-react';
import {
    useSalonBookings,
    useSalonKpis,
    useSalonServices,
    useSalonStaff,
} from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { BookingStatusBadge } from '@components/admin';
import { Button } from '@components/common';
import { formatUsd } from '@utils/format.util';

export default function AdminDashboardPage() {
    const t = useAdminTranslations();
    const { data: kpis, isLoading: kpisLoading } = useSalonKpis();
    const { data: bookings, isLoading: bookingsLoading } = useSalonBookings();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();

    const today = bookings?.slice(0, 5) ?? [];

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl text-primary md:text-2xl">
                    {t('overview.heading')}
                </h2>
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/schedule">
                        <Button variant="outlined" size="sm" className="gap-2">
                            <CalendarPlus className="h-4 w-4" />
                            {t('manageSchedule')}
                        </Button>
                    </Link>
                    <Link href="/book">
                        <Button size="sm" className="gap-2 tracking-wide uppercase">
                            <Plus className="h-4 w-4" />
                            {t('newBooking')}
                        </Button>
                    </Link>
                </div>
            </div>

            {kpisLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
            ) : kpis ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        label={t('overview.appointments')}
                        value={String(kpis.appointments)}
                        hint={kpis.appointmentsDelta}
                    />
                    <KpiCard
                        label={t('overview.pending')}
                        value={String(kpis.pending)}
                        hint={kpis.pendingHint}
                    />
                    <KpiCard
                        label={t('overview.revenue')}
                        value={formatUsd(kpis.revenue)}
                        hint={kpis.revenueHint}
                    />
                    <KpiCard
                        label={t('overview.activeTechs')}
                        value={String(kpis.activeTechs)}
                        hint={kpis.activeTechsHint}
                    />
                </div>
            ) : null}

            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg text-primary">{t('overview.schedule')}</h3>
                    <Link
                        href="/admin/bookings"
                        className="font-sans text-sm text-muted transition-colors hover:text-primary"
                    >
                        View all
                    </Link>
                </div>

                {bookingsLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted" />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-border/60 bg-neutral">
                        <table className="w-full min-w-160 font-sans text-sm">
                            <thead className="border-b border-border/60 bg-tertiary/50 text-left text-muted">
                                <tr>
                                    <th className="px-4 py-3 font-medium">{t('overview.time')}</th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('overview.client')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('overview.service')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('overview.technician')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('overview.status')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {today.map((b) => {
                                    const svc = services?.find((s) => s.id === b.serviceId);
                                    const tech =
                                        b.staffId === 'any'
                                            ? 'Any'
                                            : staff?.find((s) => s.id === b.staffId)?.name;
                                    return (
                                        <tr
                                            key={b.id}
                                            className="border-b border-border/40 last:border-0"
                                        >
                                            <td className="px-4 py-3 text-primary">{b.time}</td>
                                            <td className="px-4 py-3 text-primary">
                                                {b.customer.firstName} {b.customer.lastName}
                                            </td>
                                            <td className="px-4 py-3 text-muted">
                                                {svc?.name ?? '—'}
                                            </td>
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
            </section>
        </div>
    );
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint: string }) {
    return (
        <article className="rounded-lg border border-border/60 bg-neutral p-5">
            <p className="font-sans text-xs tracking-widest text-muted uppercase">{label}</p>
            <p className="mt-2 font-display text-3xl text-primary">{value}</p>
            <p className="mt-2 font-sans text-xs text-muted">{hint}</p>
        </article>
    );
}
