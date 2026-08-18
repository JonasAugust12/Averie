'use client';

import { useState } from 'react';
import { Calendar, ClipboardList, RefreshCw, TrendingUp, Users, Filter } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useBookings } from '@services/booking.service';
import { useAdminKpis } from '@services/admin.service';
import { Button } from '@components/common';
import { DashboardSkeleton } from '@components/skeletons';
import { formatUsd } from '@utils/format.util';
import {
    KpiCard,
    RevenueChart,
    CategoryDistribution,
    RecentBookingsTable,
    StaffLeaderboard,
    PopularServices,
} from '@components/admin/dashboard';

type FilterPeriod = 'today' | 'week' | 'month' | 'year' | 'all';

export default function AdminDashboardPage() {
    const t = useAdminTranslations();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');

    const { data: kpis, isLoading: kpisLoading, refetch: refetchKpis } = useAdminKpis();
    const {
        data: bookingsData,
        isLoading: bookingsLoading,
        refetch: refetchBookings,
    } = useBookings({ page: 1, limit: 100 });

    const bookings = bookingsData?.items ?? [];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([refetchKpis(), refetchBookings()]);
        } catch (error) {
            console.error('Failed to refresh dashboard data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const isLoading = kpisLoading || bookingsLoading;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="font-display text-2xl text-neutral-955 md:text-3xl font-bold">
                        {t('overview.dashboardTitle')}
                    </h2>
                    <p className="font-sans text-[13.5px] text-stone-500 mt-1 font-medium">
                        {t('overview.dashboardSubtitle')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-white border border-stone-200/60 rounded-xl p-1.5 shadow-3xs">
                        <Filter className="h-3.5 w-3.5 text-stone-500 ml-2" />
                        <span className="text-[13px] text-stone-605 font-sans font-medium">
                            {t('overview.filterLabel')}
                        </span>
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value as FilterPeriod)}
                            className="bg-transparent border-0 font-sans text-[13px] font-semibold text-stone-850 focus:ring-0 focus:outline-none cursor-pointer pr-8 py-1 rounded-lg"
                        >
                            <option value="today">{t('overview.filterToday')}</option>
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
                        className="gap-2 border-stone-250 bg-white hover:bg-stone-50/50 text-stone-705 relative pr-3 group shadow-3xs font-medium text-[13px]"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 text-stone-605 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-45 transition-transform duration-300'}`}
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
                            hint={kpis?.appointmentsDelta ?? t('overview.appointmentsDeltaAll')}
                            icon={ClipboardList}
                            color="primary"
                        />
                        <KpiCard
                            label={t('overview.pendingCardLabel')}
                            value={String(kpis?.pending ?? 0)}
                            hint={kpis?.pendingHint ?? t('overview.pendingHint')}
                            icon={Calendar}
                            color="secondary"
                        />
                        <KpiCard
                            label={t('overview.revenueCardLabel')}
                            value={formatUsd(kpis?.revenue ?? 0)}
                            hint={kpis?.revenueHint ?? t('overview.revenueHint')}
                            icon={TrendingUp}
                            color="gold"
                        />
                        <KpiCard
                            label={t('overview.activeTechsCardLabel')}
                            value={String(kpis?.activeTechs ?? 0)}
                            hint={kpis?.activeTechsHint ?? t('overview.activeTechsHint')}
                            icon={Users}
                            color="tech"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <RevenueChart bookings={bookings} period={filterPeriod} />
                        </div>
                        <CategoryDistribution bookings={bookings} />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <StaffLeaderboard bookings={bookings} />
                        <PopularServices bookings={bookings} />
                    </div>

                    <RecentBookingsTable bookings={bookings} isLoading={bookingsLoading} />
                </>
            )}
        </div>
    );
}
