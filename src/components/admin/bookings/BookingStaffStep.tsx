'use client';

import { Check, Plus, Sparkles } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { AdminBookingStaffStepSkeleton } from '@components/skeletons';
import { cn } from '@utils/cn.util';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor, getUserInitials } from '@utils/staff.util';

interface BookingStaffStepProps {
    staff: UserDto[] | undefined;
    isLoading: boolean;
    staffPreference: 'any' | 'specific';
    staffId: string | null;
    onSelectAny: () => void;
    onSelectStaff: (id: string) => void;
}

export function BookingStaffStep({
    staff,
    isLoading,
    staffPreference,
    staffId,
    onSelectAny,
    onSelectStaff,
}: BookingStaffStepProps) {
    const tBook = useBookingTranslations();
    const tAdmin = useAdminTranslations();

    if (isLoading) {
        return <AdminBookingStaffStepSkeleton />;
    }

    return (
        <div className="space-y-4">
            <p className="font-sans text-sm font-medium text-stone-600">
                {tAdmin('booking.staff.subtitle')}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div
                    onClick={onSelectAny}
                    className={cn(
                        'flex flex-col items-center justify-between rounded-2xl border-2 p-5 text-center transition-all cursor-pointer',
                        staffPreference === 'any'
                            ? 'border-stone-900 bg-stone-900/5 shadow-sm'
                            : 'border-stone-200/80 bg-white hover:border-stone-400',
                    )}
                >
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                'h-14 w-14 rounded-full flex items-center justify-center mb-3 transition-transform',
                                staffPreference === 'any'
                                    ? 'bg-stone-900 text-white scale-105'
                                    : 'bg-stone-100 text-stone-700',
                            )}
                        >
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h4 className="font-display text-base font-bold text-stone-900">
                            {tBook('anyTechnician')}
                        </h4>
                    </div>
                    <div
                        className={cn(
                            'mt-4 w-full py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1',
                            staffPreference === 'any'
                                ? 'bg-stone-900 text-white'
                                : 'border border-stone-300 text-stone-600',
                        )}
                    >
                        {staffPreference === 'any' ? (
                            <>
                                <Check className="h-3 w-3" /> {tAdmin('booking.staff.selected')}
                            </>
                        ) : (
                            <>
                                <Plus className="h-3 w-3" /> {tAdmin('booking.staff.select')}
                            </>
                        )}
                    </div>
                </div>

                {(staff ?? [])
                    .filter((s) => s.visible)
                    .map((member) => {
                        const isSelected = staffPreference === 'specific' && staffId === member.id;
                        return (
                            <div
                                key={member.id}
                                onClick={() => onSelectStaff(member.id)}
                                className={cn(
                                    'flex flex-col items-center justify-between rounded-2xl border-2 p-5 text-center transition-all cursor-pointer',
                                    isSelected
                                        ? 'border-stone-900 bg-stone-900/5 shadow-sm'
                                        : 'border-stone-200/80 bg-white hover:border-stone-400',
                                )}
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-black text-white mb-3 shadow-sm"
                                        style={{ backgroundColor: getUserColor(member) }}
                                    >
                                        {getUserInitials(member)}
                                    </div>
                                    <h4 className="font-display text-base font-bold text-stone-900">
                                        {formatUserName(member)}
                                    </h4>
                                    <p className="font-sans text-xs font-semibold text-stone-500 mt-0.5">
                                        {member.specialties[0] ?? 'Technician'}
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        'mt-4 w-full py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1',
                                        isSelected
                                            ? 'bg-stone-900 text-white'
                                            : 'border border-stone-300 text-stone-600',
                                    )}
                                >
                                    {isSelected ? (
                                        <>
                                            <Check className="h-3 w-3" />{' '}
                                            {tAdmin('booking.staff.selected')}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-3 w-3" />{' '}
                                            {tAdmin('booking.staff.select')}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
