'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarClock, Megaphone, Shield, Sparkles } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';

const settingsTabs = [
    {
        href: '/admin/settings',
        icon: Shield,
        key: 'account' as const,
        exact: true,
        fallbackTitle: 'Account & Security',
        fallbackDesc: 'Admin credentials & access controls',
    },
    {
        href: '/admin/settings/schedule',
        icon: CalendarClock,
        key: 'schedule' as const,
        exact: false,
        fallbackTitle: 'Operating Schedule',
        fallbackDesc: 'Business hours, breaks & staff rules',
    },
    {
        href: '/admin/settings/promotion',
        icon: Megaphone,
        key: 'promotion' as const,
        exact: false,
        fallbackTitle: 'Promotions & Banner',
        fallbackDesc: 'Homepage banner & booking perks',
        badge: 'LIVE',
    },
];

export function AdminSettingsNav() {
    const t = useAdminTranslations();
    const pathname = usePathname();

    return (
        <nav aria-label="Settings Navigation" className="mb-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {settingsTabs.map(
                    ({ href, icon: Icon, key, exact, fallbackTitle, fallbackDesc, badge }) => {
                        const active = exact ? pathname === href : pathname.startsWith(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition-all duration-300',
                                    active
                                        ? 'border-stone-900 bg-stone-900 text-white shadow-lg shadow-stone-900/10 ring-1 ring-stone-900'
                                        : 'border-stone-200/80 bg-white/90 text-stone-700 shadow-xs hover:border-sand-300 hover:bg-stone-50/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
                                )}
                            >
                                {/* Active subtle nude/sand ambient glow */}
                                {active && (
                                    <div
                                        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sand-400/20 blur-xl"
                                        aria-hidden
                                    />
                                )}

                                <div className="relative flex items-start justify-between gap-3">
                                    {/* Icon Container */}
                                    <span
                                        className={cn(
                                            'flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border transition-colors duration-200 shadow-2xs',
                                            active
                                                ? 'border-stone-700 bg-stone-800 text-sand-300'
                                                : 'border-stone-200/80 bg-stone-100/90 text-stone-600 group-hover:border-sand-300 group-hover:bg-sand-50/80 group-hover:text-stone-900',
                                        )}
                                    >
                                        <Icon className="size-4.5 sm:size-5" />
                                    </span>

                                    {/* Subtle Nude Badge */}
                                    {badge && (
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
                                                active
                                                    ? 'border border-sand-400/30 bg-sand-400/15 text-sand-300'
                                                    : 'border border-sand-300/60 bg-sand-50/80 text-secondary-800 group-hover:bg-sand-100/80',
                                            )}
                                        >
                                            <Sparkles className="size-2.5 text-sand-400" />
                                            {badge}
                                        </span>
                                    )}
                                </div>

                                {/* Text content */}
                                <div className="relative mt-3 sm:mt-4">
                                    <h3
                                        className={cn(
                                            'font-display text-base sm:text-lg font-bold leading-snug transition-colors',
                                            active
                                                ? 'text-white'
                                                : 'text-stone-900 group-hover:text-stone-950',
                                        )}
                                    >
                                        {t(`settingsNav.${key}`) || fallbackTitle}
                                    </h3>
                                    <p
                                        className={cn(
                                            'mt-1 font-sans text-xs leading-relaxed font-normal',
                                            active
                                                ? 'text-stone-300'
                                                : 'text-stone-500 group-hover:text-stone-600',
                                        )}
                                    >
                                        {t(`settingsNav.${key}Desc`) || fallbackDesc}
                                    </p>
                                </div>

                                {/* Active bottom quiet luxury sand line */}
                                {active && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-sand-400 via-sand-200 to-sand-400" />
                                )}
                            </Link>
                        );
                    },
                )}
            </div>
        </nav>
    );
}
