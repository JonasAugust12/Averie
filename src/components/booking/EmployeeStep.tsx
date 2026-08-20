'use client';

import { Sparkles, Users } from 'lucide-react';
import { useStaff } from '@services/staff.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { EmployeeStepSkeleton } from '@components/skeletons';
import { formatUserName, getUserColor, getUserInitials, staffColorAlpha } from '@utils/staff.util';
import { cn } from '@utils/cn.util';

export function EmployeeStep() {
    const t = useBookingTranslations();
    const { staffPreference, staffId, setStaffPreference, setStep } = useBookingStore();
    const { data: staff, isLoading } = useStaff();

    if (isLoading) {
        return <EmployeeStepSkeleton />;
    }

    const hasSelection = staffPreference === 'any' || Boolean(staffId);

    return (
        <div className="w-full space-y-6 sm:space-y-10">
            <p className="font-sans text-[15px] sm:text-[16px] text-stone-700 font-medium leading-relaxed max-w-md">
                {t('employeeStep.subtitle')}
            </p>

            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
                {/* Any Available Technician Card */}
                <li className="animate-fade-in-up">
                    <button
                        type="button"
                        onClick={() => {
                            setStaffPreference('any');
                            setStep(3);
                        }}
                        className={cn(
                            'group flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-2xl sm:rounded-3xl border-2 p-3.5 sm:p-5 md:p-6 text-center transition-all duration-300 hover:shadow-lg',
                            staffPreference === 'any'
                                ? 'border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20'
                                : 'border-stone-300 bg-white/80 backdrop-blur-sm hover:border-stone-400 hover:bg-white',
                        )}
                    >
                        <div className="flex w-full flex-col items-center">
                            <span
                                className={cn(
                                    'flex h-13 w-13 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center rounded-full transition-all duration-500 shadow-xs',
                                    staffPreference === 'any'
                                        ? 'bg-primary text-neutral scale-105 shadow-md shadow-primary/25'
                                        : 'bg-tertiary text-primary group-hover:bg-tertiary/80 group-hover:scale-105',
                                )}
                            >
                                <Sparkles
                                    className="h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9"
                                    aria-hidden
                                />
                            </span>
                            <h3 className="mt-2.5 sm:mt-4 font-display text-sm sm:text-base md:text-xl font-bold text-primary tracking-wide leading-tight line-clamp-1">
                                {t('anyTechnician')}
                            </h3>
                            <p className="mt-1 font-sans text-[11px] sm:text-xs md:text-sm font-medium text-stone-600 line-clamp-2">
                                {t('anyTechnicianHint')}
                            </p>
                            <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-stone-600">
                                <Users className="size-2.5 sm:size-3 text-stone-400" />
                                <span className="truncate max-w-22.5 sm:max-w-none">
                                    {t('staffSpecialist.allServices')}
                                </span>
                            </div>
                        </div>
                        <div
                            className={cn(
                                'mt-3.5 sm:mt-5 w-full rounded-full py-1.5 sm:py-2.5 text-center font-sans text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xs',
                                staffPreference === 'any'
                                    ? 'bg-primary text-neutral'
                                    : 'border border-stone-300 text-stone-700 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5',
                            )}
                        >
                            {staffPreference === 'any' ? `✓ ${t('selected')}` : t('select')}
                        </div>
                    </button>
                </li>

                {/* Individual Staff Cards with API Color Accents */}
                {(staff ?? []).map((member, i) => {
                    const selected = staffPreference === 'specific' && staffId === member.id;
                    const displayName = formatUserName(member);
                    const initials = getUserInitials(member);
                    const userColor = getUserColor(member);
                    const primarySpecialty = member.specialties?.[0];

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
                                    'group relative flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-2xl sm:rounded-3xl border-2 p-3.5 sm:p-5 md:p-6 text-center transition-all duration-300 hover:shadow-lg',
                                    selected
                                        ? 'border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20'
                                        : 'border-stone-300 bg-white/80 backdrop-blur-sm hover:border-stone-400 hover:bg-white',
                                )}
                            >
                                <div className="flex w-full flex-col items-center">
                                    {/* Avatar with personalized userColor styling */}
                                    <div className="relative">
                                        <span
                                            className={cn(
                                                'flex h-13 w-13 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center rounded-full font-sans text-base sm:text-lg md:text-2xl font-bold transition-all duration-500 shadow-xs',
                                                selected
                                                    ? 'bg-primary text-neutral scale-105 shadow-md shadow-primary/25'
                                                    : 'group-hover:scale-105',
                                            )}
                                            style={
                                                selected
                                                    ? undefined
                                                    : {
                                                          backgroundColor: staffColorAlpha(
                                                              userColor,
                                                              14,
                                                          ),
                                                          color: userColor,
                                                          borderWidth: 2,
                                                          borderColor: staffColorAlpha(
                                                              userColor,
                                                              40,
                                                          ),
                                                      }
                                            }
                                        >
                                            {initials}
                                        </span>
                                        {/* Little color indicator dot */}
                                        <span
                                            className="absolute bottom-0 right-0 size-3 sm:size-3.5 md:size-4 rounded-full border-2 border-white shadow-xs"
                                            style={{ backgroundColor: userColor }}
                                            title={`Artist color: ${userColor}`}
                                        />
                                    </div>

                                    <h3 className="mt-2.5 sm:mt-4 font-display text-sm sm:text-base md:text-xl font-bold text-primary tracking-wide leading-tight line-clamp-1">
                                        {displayName}
                                    </h3>

                                    {/* Nuanced Specialist Badge */}
                                    <div className="mt-2 sm:mt-2.5 flex flex-col items-center gap-0.5 sm:gap-1">
                                        {primarySpecialty ? (
                                            <span
                                                className="inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5 font-sans text-[9px] sm:text-[11px] font-bold tracking-wide max-w-32.5 sm:max-w-none truncate"
                                                style={{
                                                    backgroundColor: staffColorAlpha(userColor, 10),
                                                    color: userColor,
                                                    borderWidth: 1,
                                                    borderColor: staffColorAlpha(userColor, 30),
                                                }}
                                            >
                                                <Sparkles className="size-2 sm:size-2.5 shrink-0" />
                                                <span className="truncate">
                                                    {t('staffSpecialist.specializesIn', {
                                                        specialty: primarySpecialty,
                                                    })}
                                                </span>
                                            </span>
                                        ) : (
                                            <span className="font-sans text-[11px] sm:text-xs font-semibold text-stone-600">
                                                {t('defaultRole')}
                                            </span>
                                        )}
                                        <span className="font-sans text-[9px] sm:text-[10px] font-medium text-stone-600">
                                            {t('staffSpecialist.allServices')}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        'mt-3.5 sm:mt-5 w-full rounded-full py-1.5 sm:py-2.5 text-center font-sans text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xs',
                                        selected
                                            ? 'bg-primary text-neutral'
                                            : 'border border-stone-300 text-stone-700 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5',
                                    )}
                                >
                                    {selected ? `✓ ${t('selected')}` : t('select')}
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Bottom Step Actions */}
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
