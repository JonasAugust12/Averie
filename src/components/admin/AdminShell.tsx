'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Plus,
    Scissors,
    Settings,
    Users,
} from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher, AdminRouteTransitionLoader } from '@components/shared';
import { isAdminMockAuthed, setAdminMockAuthed } from '@stores/booking.store';
import { Button } from '@components/common';
import { AdminNewBookingModal } from '@components/admin';
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
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

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
                    className="hidden lg:flex z-50 absolute top-27 right-0 translate-x-1/2 h-9 w-9 items-center justify-center bg-white border border-stone-200/60 rounded-full shadow-xs text-stone-705 hover:bg-stone-50/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4.5 w-4.5" />
                    ) : (
                        <ChevronLeft className="h-4.5 w-4.5" />
                    )}
                </button>

                <div className="px-6 py-7 border-b border-neutral-105">
                    <Link href="/admin" className="flex items-center justify-center">
                        <Image
                            src="/salon/figma/logo.svg"
                            alt="Averie Logo"
                            width={113}
                            height={36}
                            className={cn(
                                'h-8 w-auto object-contain transition-transform hover:scale-105',
                                isCollapsed && 'h-6 w-auto',
                            )}
                            priority
                        />
                    </Link>
                </div>
                <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-6">
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
                                        ? 'justify-center h-12 w-12 mx-auto rounded-xl'
                                        : 'gap-4 py-3 font-sans text-base pl-3 pr-4 rounded-xl',
                                    active
                                        ? isCollapsed
                                            ? 'bg-stone-100 text-stone-900 font-bold'
                                            : 'bg-stone-100 text-stone-900 border-l-2 border-stone-705 font-bold rounded-r-xl pl-3 pr-4'
                                        : isCollapsed
                                          ? 'text-stone-500 font-semibold hover:bg-stone-50/80 hover:text-stone-800'
                                          : 'text-stone-500 font-semibold hover:bg-stone-50/80 hover:text-stone-800 pl-3 pr-4 rounded-xl',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'h-5 w-5 shrink-0 transition-transform',
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
                            <div className="flex items-center justify-between border border-stone-200/50 bg-stone-50/40 rounded-xl p-2 shadow-xs animate-in fade-in duration-200">
                                <span className="text-[13px] text-stone-605 font-sans font-medium pl-1">
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
                <header className="flex h-16 sm:h-20 lg:h-24 shrink-0 items-center justify-between gap-2 sm:gap-4 border-b border-neutral-100 bg-white/95 shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-3.5 sm:px-6 lg:px-8 z-20">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Link
                            href="/admin"
                            className="lg:hidden shrink-0 transition-opacity hover:opacity-75"
                        >
                            <Image
                                src="/salon/figma/logo.svg"
                                alt="Averie Logo"
                                width={92}
                                height={30}
                                className="h-6.5 sm:h-7 w-auto object-contain"
                                priority
                            />
                        </Link>
                        <div className="hidden xs:block lg:hidden h-4 w-px bg-stone-200 shrink-0" />
                        <div className="min-w-0">
                            <h1 className="font-display text-base sm:text-xl lg:text-2xl font-bold text-stone-900 truncate leading-tight">
                                {pageTitle}
                            </h1>
                            <p className="hidden font-sans text-xs font-bold text-stone-400 sm:block">
                                {t('title')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        {/* Language Switcher on mobile */}
                        <div className="lg:hidden scale-90">
                            <LanguageSwitcher />
                        </div>

                        {/* New Booking Button: accessible across mobile and desktop */}
                        <Button
                            size="sm"
                            onClick={() => setIsNewBookingOpen(true)}
                            className="rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold tracking-wide uppercase flex items-center gap-1 sm:gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                            <Plus className="h-3.5 w-3.5 shrink-0" />
                            <span className="hidden sm:inline">{t('newBooking')}</span>
                            <span className="sm:hidden">Booking</span>
                        </Button>

                        {/* Desktop Profile Info */}
                        <div className="hidden items-center gap-2 lg:flex">
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

                        {/* Mobile Sign Out Button */}
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex lg:hidden h-8.5 w-8.5 items-center justify-center rounded-full border border-stone-200/80 bg-stone-50/70 text-stone-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 active:scale-95 transition-all cursor-pointer"
                            title={t('signOut')}
                            aria-label={t('signOut')}
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-stone-200/60 bg-white/80 backdrop-blur-md px-3.5 py-2 lg:hidden shadow-2xs">
                    {navItems.map(({ href, icon: Icon, key }) => {
                        const active =
                            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs transition-all duration-150',
                                    active
                                        ? 'bg-stone-900 text-white font-bold shadow-xs'
                                        : 'bg-stone-100/90 text-stone-600 font-semibold hover:bg-stone-200/70 hover:text-stone-900',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'h-3.5 w-3.5',
                                        active ? 'text-amber-300' : 'text-stone-500',
                                    )}
                                />
                                <span>{t(`nav.${key}`)}</span>
                            </Link>
                        );
                    })}
                </div>

                <main className="relative min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-transparent">
                    <AdminRouteTransitionLoader />
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

            <AdminNewBookingModal
                isOpen={isNewBookingOpen}
                onClose={() => setIsNewBookingOpen(false)}
            />
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
