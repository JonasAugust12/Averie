'use client';

import React from 'react';
import { Award, CalendarClock } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { SalonBooking, SalonStaff } from '@typings/salon.type';

interface StaffLeaderboardProps {
    bookings: SalonBooking[] | undefined;
    staff: SalonStaff[] | undefined;
}

export function StaffLeaderboard({ bookings, staff }: StaffLeaderboardProps) {
    const t = useAdminTranslations();
    if (!staff || staff.length === 0) {
        return (
            <div className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-md backdrop-blur-md text-center text-muted font-sans text-sm">
                {t('overview.staffNoData')}
            </div>
        );
    }

    // Let's compute statistics dynamically based on real data
    const computedStaffStats = staff.map((s) => {
        const staffBookings = bookings?.filter((b) => b.staffId === s.id) ?? [];
        const total = staffBookings.length;

        // Count upcoming bookings (status pending or confirmed)
        const upcoming = staffBookings.filter(
            (b) => b.status === 'pending' || b.status === 'confirmed',
        ).length;

        return {
            id: s.id,
            name: s.name,
            role: s.role || t('overview.technician'),
            initials: s.initials || 'ST',
            total,
            upcoming,
        };
    });

    // Sort by total bookings descending
    const leaderboard = [...computedStaffStats].sort((a, b) => b.total - a.total);

    return (
        <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md backdrop-blur-md transition-all">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                        <Award className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-base text-neutral-900 font-semibold">
                            {t('overview.staffLeaderboardTitle')}
                        </h3>
                        <p className="font-sans text-[11px] text-neutral-500">
                            {t('overview.staffLeaderboardSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/40 bg-neutral/20">
                <table className="w-full font-sans text-xs sm:text-sm">
                    <thead className="border-b border-border/40 bg-white/50 text-left text-neutral-600">
                        <tr>
                            <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                                {t('overview.staffHeaderStaff')}
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider text-center">
                                {t('overview.staffHeaderTotalBookings')}
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider text-center">
                                {t('overview.staffHeaderUpcoming')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {leaderboard.map((member) => (
                            <tr key={member.id} className="hover:bg-white/30 transition-colors">
                                <td className="px-3.5 py-3 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral font-display text-xs font-semibold text-neutral-800">
                                        {member.initials}
                                    </div>
                                    <div>
                                        <p className="font-sans text-xs font-semibold text-neutral-800">
                                            {member.name}
                                        </p>
                                        <p className="font-sans text-[10px] text-neutral-600">
                                            {member.role}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-3.5 py-3 text-center font-sans text-xs font-semibold text-neutral-800">
                                    {member.total}
                                </td>
                                <td className="px-3.5 py-3 text-center">
                                    {member.upcoming > 0 ? (
                                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 font-sans text-[10px] font-bold text-amber-700">
                                            <CalendarClock className="h-2.5 w-2.5" />
                                            {member.upcoming}
                                        </span>
                                    ) : (
                                        <span className="font-sans text-xs text-neutral-400">
                                            —
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
