'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Minimum overlay duration (ms). Overlay stays until navigation finishes AND at least this long. Set 0 to disable. */
export const ROUTE_LOADING_MIN_MS = Number(process.env.NEXT_PUBLIC_ROUTE_LOADING_MIN_MS ?? 1200);

/** Fade-out duration when revealing the next page. */
export const ROUTE_LOADING_FADE_MS = 280;

export type RouteTransitionPhase = 'idle' | 'active' | 'exiting';

export function isAdminAppRoute(pathname: string): boolean {
    return pathname.startsWith('/admin') && pathname !== '/admin/login';
}

function isInternalNavigation(href: string, pathname: string): boolean {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
    }

    try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return false;
        return url.pathname !== pathname || url.search !== window.location.search;
    } catch {
        return false;
    }
}

interface RouteTransitionLoadingContextValue {
    phase: RouteTransitionPhase;
}

const RouteTransitionLoadingContext = createContext<RouteTransitionLoadingContextValue>({
    phase: 'idle',
});

export function useRouteTransitionLoading(): RouteTransitionLoadingContextValue {
    return useContext(RouteTransitionLoadingContext);
}

export function RouteTransitionLoadingProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [phase, setPhase] = useState<RouteTransitionPhase>('idle');
    const navigationStartRef = useRef<number | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearHideTimers = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        if (fadeTimeoutRef.current) {
            clearTimeout(fadeTimeoutRef.current);
            fadeTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        if (ROUTE_LOADING_MIN_MS <= 0) return;

        const handleClick = (event: MouseEvent) => {
            if (event.defaultPrevented) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const anchor = (event.target as Element).closest('a');
            if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

            const href = anchor.getAttribute('href');
            if (!href || !isInternalNavigation(href, pathname)) return;

            clearHideTimers();
            navigationStartRef.current = Date.now();
            setPhase('active');
        };

        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [pathname]);

    useEffect(() => {
        if (ROUTE_LOADING_MIN_MS <= 0 || navigationStartRef.current === null) return;

        const elapsed = Date.now() - navigationStartRef.current;
        const remaining = Math.max(0, ROUTE_LOADING_MIN_MS - elapsed);

        clearHideTimers();
        hideTimeoutRef.current = setTimeout(() => {
            // Let the new route paint behind the overlay before fading out.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setPhase('exiting');
                    fadeTimeoutRef.current = setTimeout(() => {
                        setPhase('idle');
                        navigationStartRef.current = null;
                    }, ROUTE_LOADING_FADE_MS);
                });
            });
        }, remaining);

        return clearHideTimers;
    }, [pathname]);

    return (
        <RouteTransitionLoadingContext.Provider value={{ phase }}>
            {children}
        </RouteTransitionLoadingContext.Provider>
    );
}
