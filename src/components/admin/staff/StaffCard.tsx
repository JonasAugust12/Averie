'use client';

import Link from 'next/link';
import { CalendarDays, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import type { SalonStaff } from '@typings/salon.type';

interface StaffCardProps {
    staff: SalonStaff;
    onEdit: (staff: SalonStaff) => void;
    onToggle: (staff: SalonStaff) => void;
    onDelete: (staff: SalonStaff) => void;
}

export function StaffCard({ staff, onEdit, onToggle, onDelete }: StaffCardProps) {
    const t = useAdminTranslations();
    const accent = staff.color ?? '#78716c';

    return (
        <article
            className={cn(
                'group flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden',
                staff.active
                    ? 'bg-white border-stone-200/80 shadow-xs hover:shadow-md hover:border-stone-300'
                    : 'bg-stone-50/60 border-stone-200/45 opacity-65',
            )}
        >
            <div className="flex items-start gap-4 p-5">
                <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-sans text-sm font-semibold text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                >
                    {staff.initials}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4
                            className={cn(
                                'font-sans text-sm font-bold leading-tight',
                                staff.active ? 'text-stone-900' : 'text-stone-500 line-through',
                            )}
                        >
                            {staff.name}
                        </h4>
                        {!staff.active && (
                            <span className="rounded-md border border-stone-200/45 bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-400">
                                {t('staff.hidden')}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 font-sans text-xs text-stone-500">{staff.role}</p>
                    {staff.specialties && staff.specialties.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {staff.specialties.slice(0, 3).map((spec) => (
                                <span
                                    key={spec}
                                    className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500"
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="mt-2 space-y-0.5">
                        {staff.phone && (
                            <p className="flex items-center gap-1.5 font-sans text-[11px] text-stone-400">
                                <Phone className="h-3 w-3" />
                                {staff.phone}
                            </p>
                        )}
                        {staff.email && (
                            <p className="flex items-center gap-1.5 font-sans text-[11px] text-stone-400">
                                <Mail className="h-3 w-3" />
                                {staff.email}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/50 px-5 py-3">
                <Link
                    href={`/admin/staff/${staff.id}/schedule`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200/60 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-stone-600 shadow-xs transition-colors hover:border-stone-300 hover:bg-stone-50"
                >
                    <CalendarDays className="h-3.5 w-3.5" />
                    {t('staff.viewCalendar')}
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onToggle(staff)}
                        className={cn(
                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                            staff.active ? 'bg-[#2b2623]' : 'bg-[#e3e2e1]',
                        )}
                        role="switch"
                        aria-checked={staff.active}
                        title={staff.active ? t('staff.hide') : t('staff.show')}
                    >
                        <span
                            className={cn(
                                'pointer-events-none mt-0.5 ml-0.5 inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
                                staff.active ? 'translate-x-5' : 'translate-x-0',
                            )}
                        />
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEdit(staff)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200/60 bg-white shadow-xs transition-colors hover:border-stone-300 hover:bg-stone-50"
                            title={t('staff.edit')}
                        >
                            <Pencil className="h-3.5 w-3.5 text-stone-500" />
                        </button>
                        <button
                            onClick={() => onDelete(staff)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200/60 bg-white shadow-xs transition-colors hover:border-red-200 hover:bg-red-50"
                            title={t('staff.delete')}
                        >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
