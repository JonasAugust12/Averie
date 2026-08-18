'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarClock, Megaphone, Shield } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';

const tabs = [
    {
        href: '/admin/settings',
        icon: Shield,
        key: 'account' as const,
        exact: true,
        fallback: 'Account & Security',
    },
    {
        href: '/admin/settings/schedule',
        icon: CalendarClock,
        key: 'schedule' as const,
        exact: false,
        fallback: 'Schedule',
    },
    {
        href: '/admin/settings/promotion',
        icon: Megaphone,
        key: 'promotion' as const,
        exact: false,
        fallback: 'Promotion',
    },
];

export function AdminSettingsNav() {
    const t = useAdminTranslations();
    const pathname = usePathname();

    return (
        <nav className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200/80 bg-white/80 p-1.5 shadow-2xs backdrop-blur-md">
            {tabs.map(({ href, icon: Icon, key, exact, fallback }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200',
                            active
                                ? 'bg-stone-900 text-white shadow-xs'
                                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
                        )}
                    >
                        <Icon
                            className={cn(
                                'h-4 w-4 transition-colors',
                                active ? 'text-sand-300' : 'text-stone-400',
                            )}
                        />
                        {t(`settingsNav.${key}`) || fallback}
                    </Link>
                );
            })}
        </nav>
    );
}
