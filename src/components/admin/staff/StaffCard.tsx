'use client';

import Link from 'next/link';
import { CalendarDays, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor, getUserInitials } from '@utils/staff.util';

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
                'group flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden',
                staff.visible
                    ? 'bg-white border-stone-200/80 shadow-xs hover:shadow-md hover:border-stone-300 hover:-translate-y-0.5'
                    : 'bg-stone-50/70 border-stone-200/50 opacity-70 hover:opacity-90',
            )}
        >
            <div className="flex items-start gap-4 p-5 sm:p-6">
                <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-sans text-base font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: accent }}
                >
                    {initials}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3
                            className={cn(
                                'font-sans text-base font-bold leading-tight',
                                staff.visible ? 'text-stone-900' : 'text-stone-500 line-through',
                            )}
                        >
                            {displayName}
                        </h3>
                        {!staff.visible && (
                            <span className="rounded-md border border-stone-200 bg-stone-200/60 px-2 py-0.5 font-sans text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                                {t('staff.hidden') || 'Tạm ẩn'}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 font-sans text-sm font-medium text-stone-500">{role}</p>

                    {staff.specialties.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {staff.specialties.slice(0, 4).map((spec) => (
                                <span
                                    key={spec}
                                    className="rounded-lg bg-stone-100/90 border border-stone-200/60 px-2.5 py-1 font-sans text-xs font-semibold text-stone-600"
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 space-y-1">
                        <p className="flex items-center gap-2 font-sans text-xs font-medium text-stone-600">
                            <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                            <span>{staff.phone}</span>
                        </p>
                        <p className="flex items-center gap-2 font-sans text-xs font-medium text-stone-600">
                            <Mail className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                            <span className="truncate">{staff.email}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/60 px-5 py-3.5">
                <Link
                    href={`/admin/staff/${staff.id}/schedule`}
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white px-3.5 py-2 font-sans text-xs font-bold text-stone-700 shadow-xs transition-all hover:border-stone-300 hover:bg-stone-100 hover:scale-103 active:scale-97 cursor-pointer"
                >
                    <CalendarDays className="h-4 w-4 text-stone-500" />
                    <span>{t('staff.viewCalendar') || 'Xem lịch làm'}</span>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="font-sans text-xs font-semibold text-stone-500 hidden sm:inline">
                            {staff.visible ? t('staff.show') || 'Hiện' : t('staff.hide') || 'Ẩn'}
                        </span>
                        <button
                            type="button"
                            onClick={() => onToggle(staff)}
                            className={cn(
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner',
                                staff.visible ? 'bg-emerald-600' : 'bg-stone-300',
                            )}
                            role="switch"
                            aria-checked={staff.visible}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none mt-0.5 ml-0.5 inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
                                    staff.visible ? 'translate-x-5' : 'translate-x-0',
                                )}
                            />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => onEdit(staff)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-600 shadow-xs transition-all hover:border-stone-300 hover:bg-stone-100 hover:scale-105 active:scale-95 cursor-pointer"
                            title={t('staff.edit') || 'Sửa'}
                        >
                            <Pencil className="h-4 w-4 text-stone-600" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(staff)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200/60 bg-white text-red-600 shadow-xs transition-all hover:border-red-300 hover:bg-red-50 hover:scale-105 active:scale-95 cursor-pointer"
                            title={t('staff.delete') || 'Xóa'}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
