'use client';

import type { ReactNode } from 'react';
import { RouteTransitionLoadingProvider } from '@components/shared/RouteTransitionLoadingProvider';
import { PublicRouteTransitionLoader } from '@components/shared/RouteTransitionLoader';

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <RouteTransitionLoadingProvider>
            <PublicRouteTransitionLoader />
            {children}
        </RouteTransitionLoadingProvider>
    );
}
