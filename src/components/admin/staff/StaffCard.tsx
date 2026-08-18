'use client';

import Link from 'next/link';
import { CalendarDays, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor, getUserInitials, staffColorAlpha } from '@utils/staff.util';

interface StaffCardProps {
    staff: UserDto;
    onEdit: (staff: UserDto) => void;
    onToggle: (staff: UserDto) => void;
    onDelete: (staff: UserDto) => void;
}

export function StaffCard({ staff, onEdit, onToggle, onDelete }: StaffCardProps) {
    const t = useAdminTranslations();
    const accent = getUserColor(staff);
    const displayName = formatUserName(staff);
    const initials = getUserInitials(staff);
    const role = staff.specialties[0] ?? 'Technician';

    return (
        <article
            className={cn(
                'group flex flex-col justify-between rounded-3xl border transition-all duration-300 overflow-hidden bg-white',
                staff.visible
                    ? 'border-stone-200/80 shadow-2xs hover:shadow-md hover:border-stone-300/90 hover:-translate-y-0.5'
                    : 'border-stone-200/50 bg-stone-50/40 opacity-75 hover:opacity-95',
            )}
        >
            <div className="flex items-start gap-4 p-5 sm:p-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <span
                        className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl font-sans text-base font-bold text-white shadow-2xs transition-transform duration-300 group-hover:scale-105"
                        style={{
                            backgroundColor: accent,
                            boxShadow: `0 4px 14px ${staffColorAlpha(accent, 35)}`,
                        }}
                    >
                        {initials}
                    </span>
                    <span
                        className={cn(
                            'absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white',
                            staff.visible ? 'bg-emerald-500' : 'bg-stone-300',
                        )}
                        title={staff.visible ? 'Active' : 'Inactive'}
                    />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <h3
                            className={cn(
                                'font-sans text-base font-bold leading-tight truncate',
                                staff.visible ? 'text-stone-900' : 'text-stone-500',
                            )}
                        >
                            {displayName}
                        </h3>
                        {!staff.visible ? (
                            <span className="rounded-md border border-stone-200/80 bg-stone-100 px-2 py-0.5 font-sans text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                                {t('staff.hidden') || 'Hidden'}
                            </span>
                        ) : null}
                    </div>

                    <p className="mt-0.5 font-sans text-xs font-semibold uppercase tracking-wider text-stone-500">
                        {role}
                    </p>

                    {/* Specialties */}
                    {staff.specialties.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {staff.specialties.slice(0, 3).map((spec) => (
                                <span
                                    key={spec}
                                    className="rounded-lg bg-stone-50 border border-stone-200/70 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-stone-700 shadow-3xs"
                                >
                                    {spec}
                                </span>
                            ))}
                            {staff.specialties.length > 3 ? (
                                <span className="rounded-lg bg-stone-100 px-2 py-0.5 font-sans text-[10px] font-bold text-stone-500">
                                    +{staff.specialties.length - 3}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {/* Contact Info */}
                    <div className="mt-3.5 space-y-1.5 pt-2 border-t border-stone-100">
                        {staff.phone ? (
                            <p className="flex items-center gap-2 font-sans text-xs text-stone-600">
                                <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                <span className="truncate">{staff.phone}</span>
                            </p>
                        ) : null}
                        {staff.email ? (
                            <p className="flex items-center gap-2 font-sans text-xs text-stone-600">
                                <Mail className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                <span className="truncate">{staff.email}</span>
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-stone-100 bg-stone-50/50 px-5 py-3.5">
                <Link
                    href={`/admin/staff/${staff.id}/schedule`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-stone-700 shadow-3xs transition-all hover:border-stone-300 hover:bg-stone-50 active:scale-95 cursor-pointer"
                >
                    <CalendarDays className="h-3.5 w-3.5 text-stone-500" />
                    <span>{t('staff.viewCalendar') || 'Schedule'}</span>
                </Link>

                <div className="flex items-center gap-3">
                    {/* Active toggle */}
                    <button
                        type="button"
                        onClick={() => onToggle(staff)}
                        className={cn(
                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-3xs',
                            staff.visible ? 'bg-stone-900' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={staff.visible}
                        title={
                            staff.visible
                                ? t('staff.hideStaff') || 'Hide staff'
                                : t('staff.showStaff') || 'Show staff'
                        }
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                                staff.visible ? 'translate-x-5' : 'translate-x-0',
                            )}
                        />
                    </button>

                    {/* Edit and Delete */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onEdit(staff)}
                            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-600 shadow-3xs transition-all hover:border-stone-300 hover:bg-stone-50 active:scale-95 cursor-pointer"
                            title={t('staff.edit') || 'Edit'}
                        >
                            <Pencil className="h-3.5 w-3.5 text-stone-600" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(staff)}
                            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-red-200/60 bg-white text-red-600 shadow-3xs transition-all hover:border-red-300 hover:bg-red-50 active:scale-95 cursor-pointer"
                            title={t('staff.delete') || 'Delete'}
                        >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
