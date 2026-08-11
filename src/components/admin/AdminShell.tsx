'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Bell,
    Calendar,
    CalendarClock,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Scissors,
    Settings,
    Users,
} from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared';
import { isAdminMockAuthed, setAdminMockAuthed } from '@stores/booking.store';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';

const navItems = [
    { href: '/admin', icon: LayoutDashboard, key: 'dashboard' as const },
    { href: '/admin/bookings', icon: ClipboardList, key: 'bookings' as const },
    { href: '/admin/services', icon: Scissors, key: 'services' as const },
    { href: '/admin/staff', icon: Users, key: 'employees' as const },
    { href: '/admin/schedule', icon: Calendar, key: 'schedule' as const },
    { href: '/admin/shifts', icon: CalendarClock, key: 'shifts' as const },
    { href: '/admin/settings/schedule', icon: Settings, key: 'settings' as const },
];

interface AdminShellProps {
    children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
    const t = useAdminTranslations();
    const pathname = usePathname();
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        const ok = isAdminMockAuthed();
        setAuthed(ok);
        setReady(true);
        if (!ok) router.replace('/admin/login');
    }, [router]);

    function handleSignOut() {
        setAdminMockAuthed(false);
        router.replace('/admin/login');
    }

    if (!ready) return null;
    if (!authed) return null;

    const pageTitle = titleForPath(pathname, t);

    return (
        <div className="flex h-screen min-h-0 overflow-hidden bg-background text-foreground">
            <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border/60 bg-tertiary/40 lg:flex">
                <div className="px-6 py-8">
                    <p className="font-display text-xl tracking-widest text-primary uppercase">
                        {t('brand')}
                    </p>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
                    {navItems.map(({ href, icon: Icon, key }) => {
                        const active =
                            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 font-sans text-sm transition-colors',
                                    active
                                        ? 'bg-primary text-neutral'
                                        : 'text-muted hover:bg-neutral hover:text-primary',
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {t(`nav.${key}`)}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-border/60 p-4">
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full cursor-pointer items-center gap-2 px-2 py-2 font-sans text-sm text-muted transition-colors hover:text-primary"
                    >
                        <LogOut className="h-4 w-4" />
                        {t('signOut')}
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-border/50 bg-neutral px-4 sm:px-6 lg:h-24 lg:px-8">
                    <div>
                        <p className="font-display text-lg text-primary lg:hidden">{t('brand')}</p>
                        <h1 className="font-display text-xl text-primary md:text-2xl">
                            {pageTitle}
                        </h1>
                        <p className="hidden font-sans text-xs text-muted sm:block">{t('title')}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <LanguageSwitcher />
                        <button
                            type="button"
                            className="relative cursor-pointer rounded-full p-2 text-muted hover:text-primary"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="hidden items-center gap-2 sm:flex">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-200 font-sans text-xs font-medium text-primary">
                                EV
                            </span>
                            <div className="leading-tight">
                                <p className="font-sans text-sm text-primary">Eleanor Vance</p>
                                <p className="font-sans text-xs text-muted">Admin</p>
                            </div>
                        </div>
                        <Link href="/book" className="hidden md:inline-flex">
                            <Button size="sm" className="tracking-wide uppercase">
                                {t('newBooking')}
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="flex gap-2 overflow-x-auto border-b border-border/40 px-4 py-2 lg:hidden">
                    {navItems.map(({ href, key }) => {
                        const active =
                            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'shrink-0 rounded-full px-3 py-1.5 font-sans text-xs',
                                    active ? 'bg-primary text-neutral' : 'bg-tertiary text-muted',
                                )}
                            >
                                {t(`nav.${key}`)}
                            </Link>
                        );
                    })}
                </div>

                <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-app">{children}</div>
                </main>
            </div>
        </div>
    );
}

function titleForPath(pathname: string, t: ReturnType<typeof useAdminTranslations>): string {
    if (pathname.startsWith('/admin/bookings/')) return t('bookings.detail');
    if (pathname.startsWith('/admin/bookings')) return t('bookings.title');
    if (pathname.startsWith('/admin/services')) return t('services.title');
    if (pathname.startsWith('/admin/staff') && pathname.includes('/schedule')) {
        return t('staff.schedule');
    }
    if (pathname.startsWith('/admin/staff')) return t('staff.title');
    if (pathname.startsWith('/admin/schedule')) return t('schedule.title');
    if (pathname.startsWith('/admin/shifts')) return t('schedule.shifts');
    if (pathname.startsWith('/admin/settings')) return t('schedule.settings');
    return t('overview.heading');
}
