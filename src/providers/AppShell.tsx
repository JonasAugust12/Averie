'use client';

import type { ReactNode } from 'react';
import { DevToolsGuard } from '@guard/DevToolsGuard';
import {
    LoadingOverlay,
    RouteTransitionLoadingProvider,
    PublicRouteTransitionLoader,
} from '@components/shared';
import { GlobalConfirmPopup } from '@components/common';

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <RouteTransitionLoadingProvider>
            <DevToolsGuard />
            <LoadingOverlay />
            <PublicRouteTransitionLoader />
            <GlobalConfirmPopup />
            {children}
        </RouteTransitionLoadingProvider>
    );
}
