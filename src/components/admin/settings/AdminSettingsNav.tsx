'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarClock, Shield } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';

const tabs = [
    { href: '/admin/settings', icon: Shield, key: 'account' as const, exact: true },
    {
        href: '/admin/settings/schedule',
        icon: CalendarClock,
        key: 'schedule' as const,
        exact: false,
    },
];

export function AdminSettingsNav() {
    const t = useAdminTranslations();
    const pathname = usePathname();

    return (
        <nav className="mb-6 flex flex-wrap gap-2">
            {tabs.map(({ href, icon: Icon, key, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-all',
                            active
                                ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50',
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {t(`settingsNav.${key}`)}
                    </Link>
                );
            })}
        </nav>
    );
}
