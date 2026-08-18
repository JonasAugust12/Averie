'use client';

import { useMemo, useState } from 'react';
import { Calendar, ClipboardList, RefreshCw, TrendingUp, Users, Filter } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useBookings } from '@services/booking.service';
import { useAdminKpis } from '@services/admin.service';
import { Button } from '@components/common';
import { DashboardSkeleton } from '@components/skeletons';
import { formatUsd } from '@utils/format.util';
import {
    formatFilterTodayLabel,
    getDashboardPeriodRange,
    getPreviousDashboardPeriodRange,
    type DashboardPeriod,
} from '@utils/dashboard-period.util';
import { sortBookingsRecentFirst } from '@utils/dashboard-analytics.util';
import {
    KpiCard,
    RevenueChart,
    CategoryDistribution,
    RecentBookingsTable,
    StaffLeaderboard,
    PopularServices,
} from '@components/admin/dashboard';

export default function AdminDashboardPage() {
    const t = useAdminTranslations();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState<DashboardPeriod>('all');

    const currentRange = useMemo(() => getDashboardPeriodRange(filterPeriod), [filterPeriod]);
    const previousRange = useMemo(
        () => getPreviousDashboardPeriodRange(filterPeriod),
        [filterPeriod],
    );

    const todayFilterLabel = useMemo(() => formatFilterTodayLabel(new Date()), []);

    const { data: kpis, isLoading: kpisLoading, refetch: refetchKpis } = useAdminKpis(filterPeriod);
    const {
        data: bookingsData,
        isLoading: bookingsLoading,
        refetch: refetchBookings,
    } = useBookings({ page: 1, limit: 100, ...currentRange });
    const { data: previousBookingsData, refetch: refetchPreviousBookings } = useBookings(
        { page: 1, limit: 100, ...previousRange },
        { enabled: filterPeriod !== 'all' && Boolean(previousRange.dateFrom) },
    );

    const bookings = useMemo(
        () => sortBookingsRecentFirst(bookingsData?.items ?? []),
        [bookingsData?.items],
    );
    const previousBookings = previousBookingsData?.items ?? [];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([refetchKpis(), refetchBookings(), refetchPreviousBookings()]);
        } catch (error) {
            console.error('Failed to refresh dashboard data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const isLoading = kpisLoading || bookingsLoading;

    const kpiHints: Record<
        'appointments' | 'pending' | 'revenue' | 'activeTechs',
        Record<DashboardPeriod, string>
    > = {
        appointments: {
            today: t('overview.kpiHints.appointments.today'),
            week: t('overview.kpiHints.appointments.week'),
            month: t('overview.kpiHints.appointments.month'),
            year: t('overview.kpiHints.appointments.year'),
            all: t('overview.kpiHints.appointments.all'),
        },
        pending: {
            today: t('overview.kpiHints.pending.today'),
            week: t('overview.kpiHints.pending.week'),
            month: t('overview.kpiHints.pending.month'),
            year: t('overview.kpiHints.pending.year'),
            all: t('overview.kpiHints.pending.all'),
        },
        revenue: {
            today: t('overview.kpiHints.revenue.today'),
            week: t('overview.kpiHints.revenue.week'),
            month: t('overview.kpiHints.revenue.month'),
            year: t('overview.kpiHints.revenue.year'),
            all: t('overview.kpiHints.revenue.all'),
        },
        activeTechs: {
            today: t('overview.kpiHints.activeTechs.today'),
            week: t('overview.kpiHints.activeTechs.week'),
            month: t('overview.kpiHints.activeTechs.month'),
            year: t('overview.kpiHints.activeTechs.year'),
            all: t('overview.kpiHints.activeTechs.all'),
        },
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold text-stone-900 md:text-3xl">
                        {t('overview.dashboardTitle')}
                    </h2>
                    <p className="mt-1 font-sans text-xs sm:text-sm font-medium text-stone-500">
                        {t('overview.dashboardSubtitle')}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white/90 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
                        <Filter className="h-3.5 w-3.5 text-stone-400" />
                        <span className="font-sans text-xs font-semibold text-stone-600">
                            {t('overview.filterLabel')}
                        </span>
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value as DashboardPeriod)}
                            aria-label={t('overview.filterLabel')}
                            className="cursor-pointer rounded-lg border-0 bg-transparent py-0.5 pr-2 font-sans text-xs font-bold text-stone-900 focus:ring-0 focus:outline-none"
                        >
                            <option value="today">
                                {t('overview.filterTodayLabel', { date: todayFilterLabel })}
                            </option>
                            <option value="week">{t('overview.filterWeek')}</option>
                            <option value="month">{t('overview.filterMonth')}</option>
                            <option value="year">{t('overview.filterYear')}</option>
                            <option value="all">{t('overview.filterAll')}</option>
                        </select>
                    </div>

                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={isRefreshing || isLoading}
                        onClick={handleRefresh}
                        className="group relative gap-2 rounded-xl border-stone-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 transition-all"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 text-stone-500 ${isRefreshing ? 'animate-spin' : 'transition-transform duration-300 group-hover:rotate-45'}`}
                        />
                        <span>
                            {isRefreshing
                                ? t('overview.buttonRefreshing')
                                : t('overview.buttonRefresh')}
                        </span>
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <KpiCard
                            label={t('overview.appointmentsCardLabel')}
                            value={String(kpis?.appointments ?? 0)}
                            hint={kpiHints.appointments[filterPeriod]}
                            icon={ClipboardList}
                            color="primary"
                        />
                        <KpiCard
                            label={t('overview.pendingCardLabel')}
                            value={String(kpis?.pending ?? 0)}
                            hint={kpiHints.pending[filterPeriod]}
                            icon={Calendar}
                            color="secondary"
                        />
                        <KpiCard
                            label={t('overview.revenueCardLabel')}
                            value={formatUsd(kpis?.revenue ?? 0)}
                            hint={kpiHints.revenue[filterPeriod]}
                            icon={TrendingUp}
                            color="gold"
                        />
                        <KpiCard
                            label={t('overview.activeTechsCardLabel')}
                            value={String(kpis?.activeTechs ?? 0)}
                            hint={kpiHints.activeTechs[filterPeriod]}
                            icon={Users}
                            color="tech"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <RevenueChart
                                bookings={bookings}
                                previousBookings={previousBookings}
                                period={filterPeriod}
                            />
                        </div>
                        <CategoryDistribution bookings={bookings} />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <StaffLeaderboard bookings={bookings} />
                        <PopularServices bookings={bookings} />
                    </div>

                    <RecentBookingsTable bookings={bookings} />
                </>
            )}
        </div>
    );
}
