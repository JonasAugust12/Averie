'use client';

import Image from 'next/image';
import { ArrowLeft, Award, KeyRound, Mail, Phone, Sparkles } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor, getUserInitials, staffColorAlpha } from '@utils/staff.util';

interface StaffNavbarProps {
    staff: UserDto;
    onBack: () => void;
    onChangePassword?: () => void;
}

export function StaffNavbar({ staff, onBack, onChangePassword }: StaffNavbarProps) {
    const t = useAdminTranslations();
    const staffColor = getUserColor(staff);
    const displayName = formatUserName(staff);
    const initials = getUserInitials(staff);

    return (
        <nav
            className="sticky top-0 z-40 h-14 border-b border-stone-200/80 bg-white/85 px-3 backdrop-blur-xl sm:px-6"
            style={{ borderBottomColor: staffColorAlpha(staffColor, 40) }}
        >
            <div className="mx-auto flex h-full max-w-3xl items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={onBack}
                        className="shrink-0 cursor-pointer rounded-full bg-stone-100 p-2 transition-colors hover:bg-stone-200 active:scale-95"
                        aria-label={t('staffPortal.signOutAria')}
                        title={t('staffPortal.signOutAria')}
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

                <div className="flex shrink-0 items-center gap-2">
                    <LanguageSwitcher variant="pill" />
                    {onChangePassword ? (
                        <button
                            type="button"
                            onClick={onChangePassword}
                            className="cursor-pointer rounded-full bg-stone-100 p-2 transition-colors hover:bg-stone-200 active:scale-95"
                            aria-label={t('staffPortal.changePasswordAria')}
                            title={t('staffPortal.changePasswordAria')}
                        >
                            <KeyRound className="h-4 w-4 text-stone-600" />
                        </button>
                    ) : null}
                    <div className="flex max-w-[55%] items-center gap-2 overflow-hidden rounded-full border border-stone-200/50 bg-stone-100/70 px-2 py-1">
                        <div
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                            style={{ backgroundColor: staffColor }}
                        >
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-sans text-[11px] font-bold leading-tight text-stone-800">
                                {displayName}
                            </p>
                        </div>
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
    const t = useAdminTranslations();
    const staffColor = getUserColor(staff);
    const displayName = formatUserName(staff);
    const initials = getUserInitials(staff);
    const role = staff.specialties[0] ?? t('staffPortal.defaultRole');

    return (
        <div
            className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5"
            style={{
                borderColor: staffColorAlpha(staffColor, 45),
                background: `linear-gradient(135deg, ${staffColorAlpha(staffColor, 18)} 0%, #ffffff 55%, #ffffff 100%)`,
            }}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: staffColor }}
            />

            <div className="pointer-events-none absolute right-0 top-0 translate-x-1/3 -translate-y-1/4 opacity-[0.12]">
                <Sparkles className="h-28 w-28" style={{ color: staffColor }} />
            </div>

            <div className="flex items-center gap-3.5">
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-md sm:h-18 sm:w-18 sm:text-2xl"
                    style={{
                        backgroundColor: staffColor,
                        boxShadow: `0 8px 20px ${staffColorAlpha(staffColor, 45)}`,
                    }}
                >
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <h1 className="font-display text-lg font-black leading-none text-stone-900 sm:text-2xl">
                            {displayName}
                        </h1>
                        <span
                            className="inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase sm:px-2.5 sm:py-1 sm:text-[11px]"
                            style={{
                                backgroundColor: staffColorAlpha(staffColor, 22),
                                borderColor: staffColorAlpha(staffColor, 40),
                                color: staffColor,
                            }}
                        >
                            <Award className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                            {role}
                        </span>
                    </div>
                    <p className="flex flex-wrap items-center gap-1 font-sans text-[11px] leading-relaxed text-stone-500 sm:text-sm">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{staff.phone}</span>
                        <span className="text-stone-300">·</span>
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{staff.email}</span>
                    </p>
                </div>
            </div>

            {staff.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-stone-100/80 pt-3">
                    {staff.specialties.map((spec) => (
                        <span
                            key={spec}
                            className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:px-3 sm:py-1 sm:text-xs"
                            style={{
                                backgroundColor: staffColorAlpha(staffColor, 18),
                                borderColor: staffColorAlpha(staffColor, 38),
                                color: staffColor,
                            }}
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
    accentColor?: string;
}

export function StatChip({ label, count, color, accentColor }: StatChipProps) {
    const styles = {
        sky: 'border-sky-200/90 text-sky-800 ring-sky-100/60',
        amber: 'border-amber-200/90 text-amber-800 ring-amber-100/60',
        stone: 'border-stone-200/90 text-stone-600 ring-stone-100/60',
    };

    if (accentColor && color === 'stone') {
        return (
            <div
                className="flex flex-col items-center justify-center rounded-xl border bg-white py-3 px-2 text-center shadow-sm ring-1 ring-black/3 transition-shadow hover:shadow-md"
                style={{
                    borderColor: staffColorAlpha(accentColor, 40),
                    boxShadow: `0 1px 2px rgba(0,0,0,0.05), 0 3px 10px ${staffColorAlpha(accentColor, 12)}`,
                }}
            >
                <span className="font-sans text-2xl font-black leading-none text-stone-900">
                    {count}
                </span>
                <span
                    className="mt-1 font-sans text-[9px] font-bold uppercase leading-tight tracking-wide"
                    style={{ color: staffColorAlpha(accentColor, 88) }}
                >
                    {label}
                </span>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col items-center justify-center rounded-xl border bg-white py-3 px-2 text-center shadow-sm ring-1 transition-shadow hover:shadow-md ${styles[color]}`}
        >
            <span className="font-sans text-2xl font-black leading-none">{count}</span>
            <span className="mt-1 font-sans text-[9px] font-bold uppercase leading-tight tracking-wide opacity-70">
                {label}
            </span>
        </div>
    );
}
