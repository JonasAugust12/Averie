'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_REDIRECT_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const DOCK_THRESHOLD_PX = 160;
const DEBUGGER_DELAY_MS = 100;
const POLL_INTERVAL_MS = 500;

const REDIRECT_URL = process.env.NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL?.trim() || DEFAULT_REDIRECT_URL;

function isGuardEnabled(): boolean {
    return (
        process.env.NODE_ENV === 'production' &&
        process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD === 'true'
    );
}

function isDevToolsDockOpen(): boolean {
    const widthGap = window.outerWidth - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    return widthGap > DOCK_THRESHOLD_PX || heightGap > DOCK_THRESHOLD_PX;
}

function isDebuggerPaused(): boolean {
    const start = performance.now();

    debugger;
    return performance.now() - start > DEBUGGER_DELAY_MS;
}

function isBlockedShortcut(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();

    if (key === 'f12') return true;

    if (!event.ctrlKey && !event.metaKey) return false;

    if (event.shiftKey && (key === 'i' || key === 'j' || key === 'c')) return true;
    if (key === 'u') return true;

    return false;
}

/**
 * Client-side deterrent only — does not replace server-side API auth.
 * Enabled in production when NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD=true.
 */
export function DevToolsGuard() {
    const redirectedRef = useRef(false);

    useEffect(() => {
        if (!isGuardEnabled()) return;

        const redirect = () => {
            if (redirectedRef.current) return;
            redirectedRef.current = true;
            window.location.replace(REDIRECT_URL);
        };

        const checkDevTools = () => {
            if (redirectedRef.current) return;
            if (isDevToolsDockOpen() || isDebuggerPaused()) {
                redirect();
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (isBlockedShortcut(event)) {
                event.preventDefault();
                redirect();
            }
        };

        const onContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        checkDevTools();
        const intervalId = window.setInterval(checkDevTools, POLL_INTERVAL_MS);
        window.addEventListener('resize', checkDevTools);
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('contextmenu', onContextMenu);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('resize', checkDevTools);
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('contextmenu', onContextMenu);
        };
    }, []);

    return null;
}
