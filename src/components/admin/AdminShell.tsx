'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Bell,
    Calendar,
    ChevronLeft,
    ChevronRight,
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
    const [isCollapsed, setIsCollapsed] = useState(false);

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
            <aside
                className={cn(
                    'relative hidden h-full shrink-0 flex-col border-r border-neutral-200/80 bg-white shadow-md lg:flex animate-in slide-in-from-left duration-300 transition-all ease-in-out z-30',
                    isCollapsed ? 'w-20' : 'w-64',
                )}
            >
                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex z-50 absolute top-27 right-0 translate-x-1/2 h-9 w-9 items-center justify-center bg-white border border-neutral-200/90 rounded-full shadow-md text-neutral-800 hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4.5 w-4.5" />
                    ) : (
                        <ChevronLeft className="h-4.5 w-4.5" />
                    )}
                </button>

                <div className="px-6 py-7 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 text-white font-display text-base font-bold shadow-sm shrink-0">
                            A
                        </div>
                        {!isCollapsed && (
                            <div className="animate-in fade-in duration-200">
                                <p className="font-display text-lg tracking-widest text-stone-800 font-semibold uppercase leading-none">
                                    {t('brand')}
                                </p>
                                <p className="font-sans text-[10px] text-stone-500 tracking-wider uppercase mt-1 font-bold">
                                    Cơ sở quản trị
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <nav className="flex-1 space-y-1.5 overflow-y-auto px-2 py-4">
                    {navItems.map(({ href, icon: Icon, key }) => {
                        const active =
                            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={isCollapsed ? t(`nav.${key}`) : undefined}
                                className={cn(
                                    'flex cursor-pointer items-center transition-all duration-150',
                                    isCollapsed
                                        ? 'justify-center h-11 w-11 mx-auto rounded-xl'
                                        : 'gap-3 py-2.5 font-sans text-sm pl-2.25 pr-3 rounded-md',
                                    active
                                        ? isCollapsed
                                            ? 'bg-stone-100 text-stone-900 font-bold'
                                            : 'bg-stone-100 text-stone-900 border-l-2 border-stone-700 font-bold rounded-r-md pl-2 pr-3'
                                        : isCollapsed
                                          ? 'text-stone-500 font-semibold hover:bg-stone-50 hover:text-stone-800'
                                          : 'text-stone-500 font-semibold hover:bg-stone-50 hover:text-stone-800 pl-2.25 pr-3 rounded-md',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'h-4 w-4 shrink-0 transition-transform',
                                        active ? 'text-stone-800 scale-105' : 'text-stone-400',
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="truncate animate-in fade-in duration-200">
                                        {t(`nav.${key}`)}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-neutral-200/80 p-3 space-y-3">
                    {isCollapsed ? (
                        <div className="flex flex-col items-center gap-4 py-2">
                            <div className="scale-90" title="Ngôn ngữ / Language">
                                <LanguageSwitcher />
                            </div>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-800 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                title={t('signOut')}
                            >
                                <LogOut className="h-4 w-4 text-neutral-700" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between border border-neutral-200/80 bg-neutral-50 rounded-xl p-2 shadow-sm animate-in fade-in duration-200">
                                <span className="text-[11px] text-neutral-700 font-sans font-bold pl-1">
                                    Ngôn ngữ / Language:
                                </span>
                                <div className="scale-90 origin-right">
                                    <LanguageSwitcher />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-sm text-neutral-850 font-semibold transition-colors hover:bg-red-50 hover:text-red-700 animate-in fade-in duration-200"
                            >
                                <LogOut className="h-4 w-4 text-neutral-700" />
                                <span>{t('signOut')}</span>
                            </button>
                        </>
                    )}
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-neutral-100 bg-white/95 shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:h-24 lg:px-8 z-20">
                    <div>
                        <p className="font-display text-lg text-stone-700 lg:hidden">
                            {t('brand')}
                        </p>
                        <h1 className="font-display text-xl text-stone-900 md:text-2xl font-bold">
                            {pageTitle}
                        </h1>
                        <p className="hidden font-sans text-xs text-stone-400 sm:block font-bold">
                            {t('title')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            className="relative cursor-pointer rounded-full p-2 text-stone-400 hover:text-stone-700 transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="hidden items-center gap-2 sm:flex">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-700 font-sans text-xs font-bold text-white shadow-sm">
                                EV
                            </span>
                            <div className="leading-tight">
                                <p className="font-sans text-sm text-stone-800 font-bold">
                                    Eleanor Vance
                                </p>
                                <p className="font-sans text-xs text-stone-500 font-semibold">
                                    Admin
                                </p>
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

                <main className="relative min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-transparent">
                    <div className="fixed inset-0 pointer-events-none z-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22] transition-opacity duration-300"
                            style={{
                                backgroundImage: "url('/background/DashboardBG.png')",
                                filter: 'blur(3px)',
                            }}
                        />
                        <div className="absolute inset-0 bg-neutral-50/15" />
                        <div className="absolute inset-0 bg-primary/4" />
                    </div>
                    <div className="relative mx-auto w-full max-w-app z-10">{children}</div>
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
    if (pathname.startsWith('/admin/settings')) return t('schedule.settings');
    return t('overview.heading');
}
