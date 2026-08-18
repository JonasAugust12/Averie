'use client';

import { useMemo } from 'react';
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
} from '@components/staff';
import { StaffCalendarSkeleton } from '@components/skeletons';
import { buildStaffBookingsCalendarEvents, parseSalonTime } from '@utils/staff-calendar.util';
import { getUserColor } from '@utils/staff.util';

export default function StaffLookupPage() {
    const t = useAdminTranslations();
    const tCommon = useCommonTranslations();
    const showLoading = useUIStore((state) => state.showLoading);
    const hideLoading = useUIStore((state) => state.hideLoading);
    const { data: session, status, update } = useSession();
    const staffId = session?.user?.id ?? '';
    const { data: allStaff, isLoading: staffLoading } = useAllStaff();
    const { data: staffBookings, isLoading: bookingsLoading } = useStaffBookings(staffId);

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

    if (status === 'loading' || (session?.user && (staffLoading || bookingsLoading))) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <StaffCalendarSkeleton />
            </div>
        );
    }

    if (!session?.user || session.user.role !== 'staff' || !staffProfile) {
        return <StaffPortalLogin onLogin={handleLogin} />;
    }

    const staffColor = getUserColor(staffProfile);

    return (
        <div className="min-h-screen bg-stone-50">
            <StaffNavbar staff={staffProfile} onBack={() => signOut({ callbackUrl: '/staff' })} />

            <main className="max-w-3xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-5">
                <StaffProfileCard staff={staffProfile} />

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <StatChip label={t('staff.statsBookings')} count={stats.total} color="stone" />
                    <StatChip label={t('staff.statsUpcoming')} count={stats.upcoming} color="sky" />
                    <StatChip
                        label={t('bookings.stats.cancelled')}
                        count={stats.cancelled}
                        color="amber"
                    />
                </div>

                <div className="rounded-2xl border border-stone-200/80 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-stone-100 bg-stone-50/70 px-4 py-3">
                        <h3 className="font-display text-base sm:text-lg font-bold text-stone-950">
                            {t('staff.schedule')}
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
                        <StaffCalendar events={calendarEvents} />
                    </div>
                </div>

                <StaffUpcomingList
                    bookings={upcomingBookings}
                    staffColor={staffColor}
                    onBack={() => signOut({ callbackUrl: '/staff' })}
                />
            </main>
        </div>
    );
}
