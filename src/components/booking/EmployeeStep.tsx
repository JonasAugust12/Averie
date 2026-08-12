'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { useSalonStaff } from '@services/salon.service';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { cn } from '@utils/cn.util';

export function EmployeeStep() {
    const t = useBookingTranslations();
    const { staffId, setStaffId, setStep } = useBookingStore();
    const { data: staff, isLoading } = useSalonStaff();

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 font-sans text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="tracking-widest uppercase text-xs">Loading…</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10">
            <p className="font-sans text-sm text-muted leading-relaxed max-w-md">
                Select your preferred technician, or let us match you with whoever is best suited to
                your services.
            </p>

            {/* Any Technician */}
            <button
                type="button"
                onClick={() => {
                    setStaffId('any');
                    setStep(3);
                }}
                className={cn(
                    'group w-full cursor-pointer rounded-2xl border p-6 text-left transition-all duration-300 hover:shadow-sm',
                    staffId === 'any'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border/70 bg-background hover:border-secondary-400 hover:bg-neutral/30',
                )}
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border/60 bg-tertiary/60 text-primary">
                            <Sparkles className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                            <p className="font-display text-lg text-primary tracking-wide">
                                {t('anyTechnician')}
                            </p>
                            <p className="mt-0.5 font-sans text-sm text-muted">
                                {t('anyTechnicianHint')}
                            </p>
                        </div>
                    </div>
                    <div
                        className={cn(
                            'h-4 w-4 shrink-0 rounded-full border-2 transition-all duration-300',
                            staffId === 'any' ? 'border-primary bg-primary' : 'border-border/60',
                        )}
                    />
                </div>
            </button>

            {/* Staff grid */}
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(staff ?? []).map((member, i) => {
                    const selected = staffId === member.id;
                    return (
                        <li
                            key={member.id}
                            style={{ animationDelay: `${i * 80}ms` }}
                            className="animate-fade-in-up"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setStaffId(member.id);
                                    setStep(3);
                                }}
                                className={cn(
                                    'group flex h-full w-full cursor-pointer flex-col items-center rounded-2xl border p-8 text-center transition-all duration-300 hover:shadow-sm',
                                    selected
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border/70 bg-white/70 backdrop-blur-sm hover:border-secondary-400 hover:bg-white/90',
                                )}
                            >
                                {/* Avatar — larger for visibility */}
                                <span
                                    className={cn(
                                        'flex h-24 w-24 items-center justify-center rounded-full font-sans text-2xl font-bold transition-all duration-500',
                                        selected
                                            ? 'bg-primary text-neutral scale-105 shadow-md shadow-primary/20'
                                            : 'bg-secondary-100 text-primary group-hover:bg-secondary-200',
                                    )}
                                >
                                    {member.initials}
                                </span>
                                <h3 className="mt-5 font-display text-xl text-primary tracking-wide">
                                    {member.name}
                                </h3>
                                <p className="mt-1 font-sans text-sm text-muted">{member.role}</p>
                                {/* Selected badge or CTA */}
                                <div
                                    className={cn(
                                        'mt-6 rounded-full px-6 py-2.5 font-sans text-sm font-semibold tracking-widest uppercase transition-all duration-300',
                                        selected
                                            ? 'bg-primary text-neutral'
                                            : 'border border-border/60 text-muted group-hover:border-primary group-hover:text-primary',
                                    )}
                                >
                                    {selected ? '✓ Selected' : 'Select'}
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <button
                type="button"
                onClick={() => setStep(1)}
                className="group inline-flex cursor-pointer items-center gap-2 font-sans text-xs tracking-widest text-muted uppercase transition-colors hover:text-primary"
            >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border/60 text-muted transition-all group-hover:border-primary group-hover:text-primary">
                    ←
                </span>
                {t('backToServices')}
            </button>
        </div>
    );
}
