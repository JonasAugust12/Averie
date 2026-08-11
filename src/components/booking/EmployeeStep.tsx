'use client';

import { ArrowLeft, Loader2, Users } from 'lucide-react';
import { useSalonStaff } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';

export function EmployeeStep() {
    const t = useBookingTranslations();
    const { staffId, setStaffId, setStep } = useBookingStore();
    const { data: staff, isLoading } = useSalonStaff();

    if (isLoading) {
        return (
            <p className="flex items-center gap-2 font-sans text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
            </p>
        );
    }

    return (
        <div className="w-full space-y-8">
            <button
                type="button"
                onClick={() => {
                    setStaffId('any');
                    setStep(3);
                }}
                className={cn(
                    'flex w-full cursor-pointer flex-col items-stretch gap-4 rounded-lg border p-6 text-left transition-colors sm:flex-row sm:items-center sm:justify-between',
                    staffId === 'any'
                        ? 'border-primary bg-tertiary/60'
                        : 'border-border/70 bg-neutral hover:border-secondary-400',
                )}
            >
                <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-200 text-primary">
                        <Users className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                        <p className="font-display text-lg text-primary">{t('anyTechnician')}</p>
                        <p className="font-sans text-sm text-muted">{t('anyTechnicianHint')}</p>
                    </div>
                </div>
                <span className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3 font-sans text-xs tracking-widest text-neutral uppercase">
                    {t('select')}
                </span>
            </button>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(staff ?? []).map((member) => {
                    const selected = staffId === member.id;
                    return (
                        <li key={member.id}>
                            <div
                                className={cn(
                                    'flex h-full flex-col rounded-lg border p-6 text-center transition-colors',
                                    selected
                                        ? 'border-primary bg-tertiary/60'
                                        : 'border-border/70 bg-neutral',
                                )}
                            >
                                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary-200 font-sans text-lg font-medium text-primary grayscale transition-[filter] hover:grayscale-0">
                                    {member.initials}
                                </span>
                                <h3 className="mt-4 font-display text-lg text-primary">
                                    {member.name}
                                </h3>
                                <p className="mt-1 font-sans text-sm text-muted">{member.role}</p>
                                <Button
                                    variant="outlined"
                                    className="mt-auto w-full rounded-sm tracking-widest uppercase"
                                    onClick={() => {
                                        setStaffId(member.id);
                                        setStep(3);
                                    }}
                                >
                                    {t('select')}
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex cursor-pointer items-center gap-2 font-sans text-xs tracking-widest text-muted uppercase transition-colors hover:text-primary"
            >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {t('backToServices')}
            </button>
        </div>
    );
}
