'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSalonBookings, useAllSalonServices, useAllSalonStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { StaffCalendar } from '@components/admin/staff';
import {
    StaffPortalLogin,
    StaffProfileCard,
    StaffNavbar,
    StatChip,
    StaffUpcomingList,
} from '@components/staff';
import { buildStaffBookingsCalendarEvents, parseSalonTime } from '@utils/staff-calendar.util';
import type { SalonStaff } from '@typings/salon.type';

export default function StaffLookupPage() {
    const t = useAdminTranslations();
    const { data: bookings, isLoading: bookingsLoading } = useSalonBookings();
    const { data: services, isLoading: servicesLoading } = useAllSalonServices();
    const { data: staff, isLoading: staffLoading } = useAllSalonStaff();

    const [phoneSearch, setPhoneSearch] = useState('');
    const [searchError, setSearchError] = useState<string | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<SalonStaff | null>(null);

    const normalizePhone = (p: string) => p.replace(/\D/g, '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchError(null);
        const clean = normalizePhone(phoneSearch);
        if (!clean) {
            setSearchError(t('staffPortal.inputHint') || 'Vui lòng nhập SĐT hợp lệ');
            return;
        }
        if (!staff || staff.length === 0) return;
        const found = staff.find((s) => s.phone && normalizePhone(s.phone) === clean);
        // Fallback to first staff member as demo
        setSelectedStaff(found ?? staff[0]);
    };

    const handleBack = () => {
        setSelectedStaff(null);
        setPhoneSearch('');
        setSearchError(null);
    };

    const staffBookings = useMemo(() => {
        if (!selectedStaff || !bookings) return [];
        return bookings.filter((b) => b.staffId === selectedStaff.id);
    }, [selectedStaff, bookings]);

    const calendarEvents = useMemo(() => {
        if (!selectedStaff || !services) return [];
        return buildStaffBookingsCalendarEvents(
            bookings ?? [],
            services,
            selectedStaff.id,
            selectedStaff.color,
        );
    }, [selectedStaff, bookings, services]);

    const upcomingBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [...staffBookings]
            .filter((b) => b.status !== 'cancelled' && parseSalonTime(b.date, b.time) >= today)
            .sort(
                (a, b) =>
                    parseSalonTime(a.date, a.time).getTime() -
                    parseSalonTime(b.date, b.time).getTime(),
            )
            .slice(0, 15);
    }, [staffBookings]);

    const stats = useMemo(
        () => ({
            total: staffBookings.filter((b) => b.status !== 'cancelled').length,
            upcoming: staffBookings.filter((b) => b.status === 'upcoming').length,
            completed: staffBookings.filter((b) => b.status === 'completed').length,
        }),
        [staffBookings],
    );

    const serviceMap = useMemo(
        () => new Map((services ?? []).map((s) => [s.id, s.name])),
        [services],
    );

    const isLoading = bookingsLoading || servicesLoading || staffLoading;

    /* ─── Loading ─── */
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <div className="text-center space-y-3">
                    <Loader2 className="h-10 w-10 animate-spin text-stone-400 mx-auto" />
                    <p className="font-sans text-sm font-semibold text-stone-500">
                        Loading portal…
                    </p>
                </div>
            </div>
        );
    }

    /* ─── Login view ─── */
    if (!selectedStaff) {
        return (
            <StaffPortalLogin
                phoneSearch={phoneSearch}
                searchError={searchError}
                onPhoneChange={setPhoneSearch}
                onSubmit={handleSearch}
            />
        );
    }

    const staffColor = selectedStaff.color || '#78716c';

    /* ─── Schedule view ─── */
    return (
        <div className="min-h-screen bg-stone-50">
            <StaffNavbar staff={selectedStaff} onBack={handleBack} />

            <main className="max-w-3xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-5">
                {/* Profile Card */}
                <StaffProfileCard staff={selectedStaff} />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <StatChip
                        label={t('staff.statsBookings') || 'Total'}
                        count={stats.total}
                        color="stone"
                    />
                    <StatChip
                        label={t('staff.statsUpcoming') || 'Upcoming'}
                        count={stats.upcoming}
                        color="sky"
                    />
                    <StatChip
                        label={t('overview.appointments') || 'Completed'}
                        count={stats.completed}
                        color="amber"
                    />
                </div>

                {/* Calendar */}
                <div className="rounded-2xl border border-stone-200/80 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-stone-100 bg-stone-50/70 px-4 py-3">
                        <h3 className="font-display text-base sm:text-lg font-bold text-stone-950">
                            {t('staff.schedule') || 'Schedule'}
                        </h3>
                        <p className="font-sans text-[10px] sm:text-xs text-stone-500 mt-0.5">
                            {t('staffPortal.scheduleFor', { name: selectedStaff.name })}
                        </p>
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

                {/* Upcoming bookings list */}
                <StaffUpcomingList
                    bookings={upcomingBookings}
                    serviceMap={serviceMap}
                    staffColor={staffColor}
                    onBack={handleBack}
                />
            </main>
        </div>
    );
}
