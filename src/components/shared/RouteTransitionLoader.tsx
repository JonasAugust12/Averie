'use client';

import { usePathname } from 'next/navigation';
import { useCommonTranslations } from '@i18n/use-app-translations';
import {
    isAdminAppRoute,
    ROUTE_LOADING_MIN_MS,
    useRouteTransitionLoading,
} from './RouteTransitionLoadingProvider';
import { RouteLoadingScreen } from './RouteLoadingScreen';

/** Full-page loading overlay for public / user routes. */
export function PublicRouteTransitionLoader() {
    const pathname = usePathname();
    const t = useCommonTranslations();
    const { phase } = useRouteTransitionLoading();

    if (phase === 'idle' || ROUTE_LOADING_MIN_MS <= 0 || isAdminAppRoute(pathname)) return null;

    return (
        <RouteLoadingScreen
            overlay="fullscreen"
            exiting={phase === 'exiting'}
            message={t('status.routeLoading')}
            hint={t('status.routeLoadingHint')}
        />
    );
}

/** Loading overlay scoped to admin main content (sidebar + header stay visible). */
export function AdminRouteTransitionLoader() {
    const t = useCommonTranslations();
    const { phase } = useRouteTransitionLoading();

    if (phase === 'idle' || ROUTE_LOADING_MIN_MS <= 0) return null;

    return (
        <RouteLoadingScreen
            overlay="contained"
            exiting={phase === 'exiting'}
            message={t('status.routeLoading')}
            hint={t('status.routeLoadingHint')}
        />
    );
}
