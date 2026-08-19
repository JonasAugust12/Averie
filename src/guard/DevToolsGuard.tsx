'use client';

import { useEffect, useRef } from 'react';
import DisableDevtool from 'disable-devtool';

const DEFAULT_REDIRECT_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
// Threshold for detecting detached/undocked DevTools window on desktop
const DOCK_THRESHOLD_PX = 300;
// Consecutive "open" polls required before redirect (grace period, avoids transient resize triggers)
const STRIKE_THRESHOLD = 4;
const POLL_INTERVAL_MS = 1500;

const REDIRECT_URL = process.env.NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL?.trim() || DEFAULT_REDIRECT_URL;

function isGuardEnabled(): boolean {
    return (
        process.env.NODE_ENV === 'production' &&
        process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD === 'true'
    );
}

/**
 * Returns true on touch-primary devices (phones/tablets).
 * Mobile browsers cannot open DevTools from the device itself,
 * so active polling would only risk false positives for booking customers.
 */
function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
}

/**
 * Detects DevTools docked to the side or bottom (desktop only).
 * A high threshold avoids false positives from browser chrome (bookmarks bar, etc.)
 */
function isDevToolsDockOpen(): boolean {
    const widthGap = window.outerWidth - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    return widthGap > DOCK_THRESHOLD_PX || heightGap > DOCK_THRESHOLD_PX;
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
 *
 * Two-layer strategy:
 * Layer 1 — disable-devtool (npm): uses multiple detection probes
 *   (RegToString, DefineId, Size, DateToString, FuncToString, Debugger, Performance).
 * Layer 2 — custom guard: window size gap polling + keyboard shortcut blocking + console warning.
 *   Mobile devices skip active polling to avoid false positives from natural resize gestures.
 */
export function DevToolsGuard() {
    const redirectedRef = useRef(false);
    const strikeCountRef = useRef(0);

    useEffect(() => {
        if (!isGuardEnabled()) return;

        // ── Layer 1: disable-devtool ──────────────────────────────────────────
        // Uses multiple browser probes (regex, DOM id, size, date/func toString,
        // debugger timing, performance). Complementary to our custom layer below.
        DisableDevtool({
            url: REDIRECT_URL,
            disableMenu: false, // right-click handled by Layer 2 to avoid double-listener
            interval: 1000,
            clearIntervalWhenDevOpenTrigger: true,
        });

        // ── Layer 2: custom guard ─────────────────────────────────────────────

        // Console deterrent — only fires when DevTools is open (console is active).
        // Targets curious non-tech users who might try pasting scripts.
        console.log('%cStop!', 'font-size:40px;font-weight:bold;color:#c0392b;');
        console.log(
            '%cIf someone told you to paste something here, they are scamming you.',
            'font-size:15px;color:#333;line-height:1.6;',
        );

        const redirect = () => {
            if (redirectedRef.current) return;
            redirectedRef.current = true;
            window.location.replace(REDIRECT_URL);
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

        // Always attach passive-safe listeners (no false positive risk)
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('contextmenu', onContextMenu);

        // Only run active polling on desktop — mobile polling would risk false positives
        // for booking customers who scroll/resize the browser naturally
        let intervalId: number | null = null;

        if (!isMobileDevice()) {
            const checkDevTools = () => {
                if (redirectedRef.current) return;

                if (isDevToolsDockOpen()) {
                    strikeCountRef.current += 1;
                    if (strikeCountRef.current >= STRIKE_THRESHOLD) {
                        redirect();
                    }
                } else {
                    strikeCountRef.current = 0;
                }
            };

            intervalId = window.setInterval(checkDevTools, POLL_INTERVAL_MS);
            window.addEventListener('resize', checkDevTools);
        }

        return () => {
            if (intervalId !== null) {
                window.clearInterval(intervalId);
                window.removeEventListener('resize', () => {});
            }
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('contextmenu', onContextMenu);
        };
    }, []);

    return null;
}
