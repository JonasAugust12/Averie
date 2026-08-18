'use client';

import { Award, CalendarClock } from 'lucide-react';
import { useAllStaff } from '@services/staff.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import type { BookingListItemDto } from '@typings/booking.type';
import { formatUserName, getUserInitials } from '@utils/staff.util';

interface StaffLeaderboardProps {
    bookings: BookingListItemDto[];
}

export function StaffLeaderboard({ bookings }: StaffLeaderboardProps) {
    const t = useAdminTranslations();
    const { data: staff } = useAllStaff();

    if (!staff || staff.length === 0) {
        return (
            <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                        <Award className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-semibold text-stone-900 md:text-[19px]">
                            {t('overview.staffLeaderboardTitle')}
                        </h3>
                        <p className="mt-0.5 font-sans text-[13px] font-medium text-stone-500">
                            {t('overview.staffLeaderboardSubtitle')}
                        </p>
                    </div>
                </div>
                <p className="py-8 text-center font-sans text-sm text-stone-500">
                    {t('overview.staffNoData')}
                </p>
            </section>
        );
    }

    const computedStaffStats = staff.map((s) => {
        const staffBookings = bookings.filter((b) => b.staffId === s.id);
        const total = staffBookings.length;
        const upcoming = staffBookings.filter((b) => b.status === 'upcoming').length;

        return {
            id: s.id,
            name: formatUserName(s),
            role: s.specialties[0] ?? t('overview.technician'),
            initials: getUserInitials(s),
            total,
            upcoming,
        };
    });

    const leaderboard = [...computedStaffStats].sort((a, b) => b.total - a.total);

    return (
        <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md backdrop-blur-md transition-all">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                        <Award className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg md:text-[19px] text-stone-900 font-semibold">
                            {t('overview.staffLeaderboardTitle')}
                        </h3>
                        <p className="font-sans text-[13px] text-stone-500 font-medium mt-0.5">
                            {t('overview.staffLeaderboardSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2.5">
                {leaderboard.slice(0, 5).map((member, idx) => (
                    <div
                        key={member.id}
                        className="flex items-center gap-3 rounded-xl border border-stone-200/50 bg-white px-3.5 py-3 shadow-xs hover:shadow-sm transition-all"
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 font-sans text-xs font-bold text-white">
                            {idx + 1}
                        </span>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-sans text-sm font-bold text-stone-700">
                            {member.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-sans text-sm font-bold text-stone-900">
                                {member.name}
                            </p>
                            <p className="truncate font-sans text-xs text-stone-500">
                                {member.role}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="font-sans text-sm font-bold text-stone-800">
                                {member.total}
                            </p>
                            <p className="flex items-center justify-end gap-1 font-sans text-[10px] text-stone-500">
                                <CalendarClock className="h-3 w-3" />
                                {member.upcoming} {t('overview.upcomingShort')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
