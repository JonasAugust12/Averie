'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAllStaff, useStaffBookings } from '@services/staff.service';
import { useAdminTranslations, useCommonTranslations } from '@i18n/use-app-translations';
import { useUIStore } from '@stores/ui.store';
import { StaffCalendar } from '@components/admin/staff';
import {
    StaffPortalLogin,
    StaffProfileCard,
    StaffNavbar,
    StatChip,
    StaffUpcomingList,
    StaffChangePasswordModal,
} from '@components/staff';
import { StaffPortalPageSkeleton } from '@components/skeletons';
import {
    buildStaffBookingsCalendarEvents,
    getDefaultCalendarRange,
    parseSalonTime,
    type CalendarDateRange,
} from '@utils/staff-calendar.util';
import { getUserColor, staffColorAlpha } from '@utils/staff.util';
import { toastSuccess } from '@utils/toast.util';

export default function StaffLookupPage() {
    const t = useAdminTranslations();
    const tCommon = useCommonTranslations();
    const showLoading = useUIStore((state) => state.showLoading);
    const hideLoading = useUIStore((state) => state.hideLoading);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [range, setRange] = useState<CalendarDateRange>(() => getDefaultCalendarRange());
    const handleRangeChange = useCallback((next: CalendarDateRange) => {
        setRange((prev) =>
            prev.dateFrom === next.dateFrom && prev.dateTo === next.dateTo ? prev : next,
        );
    }, []);
    const { data: session, status, update } = useSession();
    const staffId = session?.user?.id ?? '';
    const { data: allStaff, isLoading: staffLoading } = useAllStaff();
    const {
        data: staffBookings,
        isLoading: bookingsLoading,
        isFetching: bookingsFetching,
    } = useStaffBookings(staffId, range);

    const staffProfile = allStaff?.find((s) => s.id === staffId);
    const bookingItems = staffBookings;

    const calendarEvents = useMemo(() => {
        if (!staffId) return [];
        return buildStaffBookingsCalendarEvents(
            bookingItems ?? [],
            staffId,
            staffProfile ? getUserColor(staffProfile) : undefined,
        );
    }, [staffId, bookingItems, staffProfile]);

    const upcomingBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [...(bookingItems ?? [])]
            .filter((b) => b.status !== 'cancelled' && parseSalonTime(b.date, b.time) >= today)
            .sort(
                (a, b) =>
                    parseSalonTime(a.date, a.time).getTime() -
                    parseSalonTime(b.date, b.time).getTime(),
            )
            .slice(0, 15);
    }, [bookingItems]);

    const stats = useMemo(() => {
        const items = bookingItems ?? [];
        return {
            total: items.filter((b) => b.status !== 'cancelled').length,
            upcoming: items.filter((b) => b.status === 'upcoming').length,
            cancelled: items.filter((b) => b.status === 'cancelled').length,
        };
    }, [bookingItems]);

    const handleLogin = async (email: string, password: string) => {
        showLoading(tCommon('status.loading'));
        try {
            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.error) {
                throw new Error(result.error);
            }
            await update();
        } finally {
            hideLoading();
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
        } catch (error) {
            console.error('[handleSignOut]', error);
        }
        toastSuccess(t('toasts.signOutSuccess'));
        window.location.href = '/staff';
    };

    if (status === 'loading' || (session?.user && (staffLoading || bookingsLoading))) {
        return <StaffPortalPageSkeleton />;
    }

    if (!session?.user || session.user.role !== 'staff' || !staffProfile) {
        return <StaffPortalLogin onLogin={handleLogin} />;
    }

    const staffColor = getUserColor(staffProfile);

    return (
        <div
            className="min-h-screen bg-stone-50"
            style={{
                background: `linear-gradient(180deg, ${staffColorAlpha(staffColor, 16)} 0%, #fafaf9 180px, #fafaf9 100%)`,
            }}
        >
            <StaffNavbar
                staff={staffProfile}
                onBack={handleSignOut}
                onChangePassword={() => setPasswordModalOpen(true)}
            />

            <StaffChangePasswordModal
                open={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />

            <main className="mx-auto max-w-3xl space-y-5 px-3 py-5 sm:px-6 sm:py-8">
                <StaffProfileCard staff={staffProfile} />

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <StatChip
                        label={t('staff.statsBookings')}
                        count={stats.total}
                        color="stone"
                        accentColor={staffColor}
                    />
                    <StatChip label={t('staff.statsUpcoming')} count={stats.upcoming} color="sky" />
                    <StatChip
                        label={t('staffPortal.statsCancelled')}
                        count={stats.cancelled}
                        color="amber"
                    />
                </div>

                <div
                    className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm"
                    style={{ borderColor: staffColorAlpha(staffColor, 40) }}
                >
                    <div
                        className="border-b border-stone-100 px-4 py-3"
                        style={{ backgroundColor: staffColorAlpha(staffColor, 14) }}
                    >
                        <h3 className="font-display text-base font-bold text-stone-950 sm:text-lg">
                            {t('staffPortal.mySchedule')}
                        </h3>
                    </div>
                    <div
                        className="p-2 sm:p-4"
                        style={
                            {
                                '--fc-button-bg-color': staffColor,
                                '--fc-button-border-color': staffColor,
                            } as React.CSSProperties
                        }
                    >
                        <StaffCalendar
                            events={calendarEvents}
                            onRangeChange={handleRangeChange}
                            isLoadingEvents={bookingsFetching}
                        />
                    </div>
                </div>

                <StaffUpcomingList
                    bookings={upcomingBookings}
                    staffColor={staffColor}
                    onBack={handleSignOut}
                />
            </main>
        </div>
    );
}
