'use client';

import type { ReactNode } from 'react';
import { DevToolsGuard } from '@components/shared/DevToolsGuard';
import { LoadingOverlay } from '@components/shared/LoadingOverlay';
import { RouteTransitionLoadingProvider } from '@components/shared/RouteTransitionLoadingProvider';
import { PublicRouteTransitionLoader } from '@components/shared/RouteTransitionLoader';

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <RouteTransitionLoadingProvider>
            <DevToolsGuard />
            <LoadingOverlay />
            <PublicRouteTransitionLoader />
            {children}
        </RouteTransitionLoadingProvider>
    );
}
