'use client';

import { Sparkles } from 'lucide-react';
import { useStaff } from '@services/staff.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { StaffGridSkeleton } from '@components/skeletons';
import { formatUserName, getUserInitials } from '@utils/staff.util';
import { cn } from '@utils/cn.util';

export function EmployeeStep() {
    const t = useBookingTranslations();
    const { staffPreference, staffId, setStaffPreference, setStep } = useBookingStore();
    const { data: staff, isLoading } = useStaff();

    if (isLoading) {
        return <StaffGridSkeleton />;
    }

    const hasSelection = staffPreference === 'any' || Boolean(staffId);

    return (
        <div className="w-full space-y-6 sm:space-y-10">
            <p className="font-sans text-[15px] sm:text-[16px] text-stone-700 font-medium leading-relaxed max-w-md">
                Select your preferred technician, or let us match you with whoever is best suited to
                your services.
            </p>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 sm:gap-5">
                <li className="animate-fade-in-up">
                    <button
                        type="button"
                        onClick={() => {
                            setStaffPreference('any');
                            setStep(3);
                        }}
                        className={cn(
                            'group flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-md',
                            staffPreference === 'any'
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-stone-300 bg-white/70 backdrop-blur-sm hover:border-secondary-400 hover:bg-white/90',
                        )}
                    >
                        <div className="flex flex-col items-center">
                            <span
                                className={cn(
                                    'flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full transition-all duration-500 shadow-xs',
                                    staffPreference === 'any'
                                        ? 'bg-primary text-neutral scale-105 shadow-md shadow-primary/25'
                                        : 'bg-tertiary/70 text-primary group-hover:bg-tertiary',
                                )}
                            >
                                <Sparkles className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden />
                            </span>
                            <h3 className="mt-3 sm:mt-4 font-display text-base sm:text-xl font-bold text-primary tracking-wide leading-tight">
                                {t('anyTechnician')}
                            </h3>
                            <p className="mt-1 font-sans text-xs sm:text-sm font-semibold text-stone-600 line-clamp-2">
                                {t('anyTechnicianHint')}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'mt-4 w-full rounded-full py-2 text-center font-sans text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-xs',
                                staffPreference === 'any'
                                    ? 'bg-primary text-neutral'
                                    : 'border border-stone-400 text-stone-700 group-hover:border-primary group-hover:text-primary',
                            )}
                        >
                            {staffPreference === 'any' ? '✓ Selected' : 'Select'}
                        </div>
                    </button>
                </li>

                {(staff ?? []).map((member, i) => {
                    const selected = staffPreference === 'specific' && staffId === member.id;
                    const displayName = formatUserName(member);
                    const initials = getUserInitials(member);
                    const role = member.specialties[0] ?? t('defaultRole');

                    return (
                        <li
                            key={member.id}
                            style={{ animationDelay: `${(i + 1) * 60}ms` }}
                            className="animate-fade-in-up"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setStaffPreference('specific', member.id);
                                    setStep(3);
                                }}
                                className={cn(
                                    'group flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-md',
                                    selected
                                        ? 'border-primary bg-primary/10 shadow-sm'
                                        : 'border-stone-300 bg-white/70 backdrop-blur-sm hover:border-secondary-400 hover:bg-white/90',
                                )}
                            >
                                <div className="flex flex-col items-center">
                                    <span
                                        className={cn(
                                            'flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full font-sans text-lg sm:text-2xl font-bold transition-all duration-500',
                                            selected
                                                ? 'bg-primary text-neutral scale-105 shadow-md shadow-primary/25'
                                                : 'bg-secondary-100 text-primary group-hover:bg-secondary-200',
                                        )}
                                    >
                                        {initials}
                                    </span>
                                    <h3 className="mt-3 sm:mt-4 font-display text-base sm:text-xl font-bold text-primary tracking-wide leading-tight">
                                        {displayName}
                                    </h3>
                                    <p className="mt-1 font-sans text-xs sm:text-sm font-semibold text-stone-600">
                                        {role}
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        'mt-4 w-full rounded-full py-2 text-center font-sans text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-xs',
                                        selected
                                            ? 'bg-primary text-neutral'
                                            : 'border border-stone-400 text-stone-700 group-hover:border-primary group-hover:text-primary',
                                    )}
                                >
                                    {selected ? '✓ Selected' : 'Select'}
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-t sm:border-stone-200/60 sm:bg-transparent sm:p-0 sm:pt-4 sm:shadow-none sm:backdrop-blur-none">
                <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="group inline-flex cursor-pointer items-center gap-2 sm:gap-3 rounded-full border border-stone-300 bg-background px-3.5 py-2 sm:px-4 sm:py-2 font-sans text-xs sm:text-sm font-semibold tracking-wider text-stone-700 uppercase transition-all hover:border-primary hover:text-primary hover:bg-tertiary/40 active:scale-95 duration-200 shadow-xs"
                    >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 group-hover:bg-primary/10">
                            ←
                        </span>
                        <span className="hidden xs:inline sm:inline">{t('backToServices')}</span>
                        <span className="xs:hidden sm:hidden">{t('back')}</span>
                    </button>
                    <Button
                        className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3 font-sans text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all duration-200"
                        disabled={!hasSelection}
                        onClick={() => setStep(3)}
                    >
                        {t('continue')} →
                    </Button>
                </div>
            </div>
        </div>
    );
}
