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

    const rankStyles = (index: number) => {
        if (index === 0) {
            return 'bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs';
        }
        if (index === 1) {
            return 'bg-stone-200 text-stone-800 border border-stone-300/80';
        }
        if (index === 2) {
            return 'bg-orange-100 text-orange-900 border border-orange-300/80';
        }
        return 'bg-stone-100 text-stone-600 border border-stone-200/60';
    };

    return (
        <section className="flex h-full flex-col justify-between rounded-2xl border border-stone-200/70 bg-white/90 p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xs">
            <div>
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-700 shadow-sm">
                        <Award className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-stone-900 md:text-xl">
                            {t('overview.staffLeaderboardTitle')}
                        </h3>
                        <p className="mt-0.5 font-sans text-xs font-medium text-stone-500">
                            {t('overview.staffLeaderboardSubtitle')}
                        </p>
                    </div>
                </div>

                <div className="space-y-2.5">
                    {leaderboard.slice(0, 5).map((member, idx) => (
                        <div
                            key={member.id}
                            className="group flex items-center gap-3 rounded-xl border border-stone-200/60 bg-white p-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-xs"
                        >
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${rankStyles(idx)}`}
                            >
                                #{idx + 1}
                            </span>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-sans text-xs font-bold text-stone-700 ring-1 ring-stone-200/60">
                                {member.initials}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-sans text-[13.5px] font-bold text-stone-900">
                                    {member.name}
                                </p>
                                <p className="truncate font-sans text-[11.5px] font-medium text-stone-500">
                                    {member.role}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="font-sans text-[13.5px] font-bold text-stone-900">
                                    {member.total} {t('overview.countBookings')}
                                </p>
                                <p className="mt-0.5 flex items-center justify-end gap-1 font-sans text-[11px] font-semibold text-stone-500">
                                    <CalendarClock className="h-3 w-3 text-stone-400" />
                                    {member.upcoming} {t('overview.upcomingShort')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
