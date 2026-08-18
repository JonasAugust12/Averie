'use client';

import Image from 'next/image';
import { ArrowLeft, Award, Mail, Phone, Sparkles } from 'lucide-react';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor, getUserInitials } from '@utils/staff.util';

interface StaffNavbarProps {
    staff: UserDto;
    onBack: () => void;
}

export function StaffNavbar({ staff, onBack }: StaffNavbarProps) {
    const staffColor = getUserColor(staff);
    const displayName = formatUserName(staff);
    const initials = getUserInitials(staff);

    return (
        <nav className="h-14 bg-white/85 backdrop-blur-xl border-b border-stone-200/80 sticky top-0 z-40 px-3 sm:px-6">
            <div className="max-w-3xl mx-auto h-full flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={onBack}
                        className="rounded-full p-2 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer shrink-0 active:scale-95"
                        aria-label="Back"
                    >
                        <ArrowLeft className="h-4 w-4 text-stone-600" />
                    </button>
                    <Image
                        src="/salon/figma/logo.svg"
                        alt="Averie Logo"
                        width={90}
                        height={28}
                        className="h-6 w-auto object-contain"
                    />
                </div>

                <div className="flex items-center gap-2 bg-stone-100/70 border border-stone-200/50 px-2 py-1 rounded-full max-w-[55%] overflow-hidden">
                    <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
                        style={{ backgroundColor: staffColor }}
                    >
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="font-sans text-[11px] font-bold text-stone-800 leading-tight truncate">
                            {displayName}
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    );
}

interface StaffProfileCardProps {
    staff: UserDto;
}

export function StaffProfileCard({ staff }: StaffProfileCardProps) {
    const staffColor = getUserColor(staff);
    const displayName = formatUserName(staff);
    const initials = getUserInitials(staff);
    const role = staff.specialties[0] ?? 'Technician';

    return (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/4 opacity-5 pointer-events-none">
                <Sparkles className="h-28 w-28 text-stone-900" />
            </div>

            <div className="flex items-center gap-3.5">
                <div
                    className="h-14 w-14 sm:h-18 sm:w-18 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-md shrink-0"
                    style={{ backgroundColor: staffColor }}
                >
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <h1 className="font-display text-lg sm:text-2xl font-black text-stone-900 leading-none">
                            {displayName}
                        </h1>
                        <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-[9px] sm:text-[11px] uppercase font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded border border-stone-200/50 shrink-0">
                            <Award className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                            {role}
                        </span>
                    </div>
                    <p className="font-sans text-[11px] sm:text-sm text-stone-500 flex items-center gap-1 flex-wrap leading-relaxed">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{staff.phone}</span>
                        <span className="text-stone-300">·</span>
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{staff.email}</span>
                    </p>
                </div>
            </div>

            {staff.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-stone-100">
                    {staff.specialties.map((spec) => (
                        <span
                            key={spec}
                            className="text-[9px] sm:text-xs font-bold uppercase tracking-wide bg-secondary-50 text-secondary-800 border border-secondary-200/40 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                        >
                            {spec}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

interface StatChipProps {
    label: string;
    count: number;
    color: 'sky' | 'amber' | 'stone';
}

export function StatChip({ label, count, color }: StatChipProps) {
    const styles = {
        sky: 'bg-sky-50 border-sky-100 text-sky-800',
        amber: 'bg-amber-50 border-amber-100 text-amber-800',
        stone: 'bg-stone-50 border-stone-200 text-stone-600',
    };
    return (
        <div
            className={`flex flex-col items-center justify-center rounded-xl border py-3 px-2 text-center ${styles[color]}`}
        >
            <span className="font-sans text-2xl font-black leading-none">{count}</span>
            <span className="font-sans text-[9px] font-bold uppercase tracking-wide mt-1 opacity-70 leading-tight">
                {label}
            </span>
        </div>
    );
}
