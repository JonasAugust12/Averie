'use client';

import { useEffect, useRef } from 'react';

const SCROLL_LOCK_ROOT_SELECTOR = '[data-scroll-lock-root]';

let scrollLockCount = 0;
let originalStyles: {
    bodyOverflow: string;
    htmlOverflow: string;
    bodyPosition: string;
    bodyTop: string;
    bodyWidth: string;
    bodyPaddingRight: string;
    scrollY: number;
    fixedStyles: Array<{ element: Element; paddingRight: string }>;
    rootStyles: Array<{ element: HTMLElement; overflow: string; overflowY: string }>;
} | null = null;

function lockScrollRoots() {
    const roots = Array.from(document.querySelectorAll<HTMLElement>(SCROLL_LOCK_ROOT_SELECTOR));
    return roots.map((element) => {
        const prev = {
            element,
            overflow: element.style.overflow,
            overflowY: element.style.overflowY,
        };
        element.style.setProperty('overflow', 'hidden', 'important');
        element.style.setProperty('overflow-y', 'hidden', 'important');
        return prev;
    });
}

function restoreScrollRoots(
    rootStyles: Array<{ element: HTMLElement; overflow: string; overflowY: string }>,
) {
    rootStyles.forEach(({ element, overflow, overflowY }) => {
        element.style.overflow = overflow;
        element.style.overflowY = overflowY;
    });
}

export const usePreventScroll = (isOpen: boolean) => {
    const isActiveRef = useRef(false);

    useEffect(() => {
        if (isOpen && !isActiveRef.current) {
            scrollLockCount++;
            isActiveRef.current = true;

            if (scrollLockCount === 1) {
                const body = document.body;
                const html = document.documentElement;

                const scrollY = window.scrollY;
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

                const fixedElements = document.querySelectorAll(
                    '[style*="position: fixed"], .fixed',
                );
                const fixedStyles: Array<{ element: Element; paddingRight: string }> = [];

                fixedElements.forEach((element) => {
                    const el = element as HTMLElement;
                    fixedStyles.push({
                        element: el,
                        paddingRight: el.style.paddingRight || '',
                    });
                    el.style.paddingRight = `${scrollbarWidth}px`;
                });

                originalStyles = {
                    bodyOverflow: body.style.overflow,
                    htmlOverflow: html.style.overflow,
                    bodyPosition: body.style.position,
                    bodyTop: body.style.top,
                    bodyWidth: body.style.width,
                    bodyPaddingRight: body.style.paddingRight,
                    scrollY,
                    fixedStyles,
                    rootStyles: lockScrollRoots(),
                };

                body.style.setProperty('position', 'fixed', 'important');
                body.style.setProperty('top', `-${scrollY}px`, 'important');
                body.style.setProperty('width', '100%', 'important');
                body.style.setProperty('overflow', 'hidden', 'important');
                body.style.setProperty('padding-right', `${scrollbarWidth}px`, 'important');
                html.style.setProperty('overflow', 'hidden', 'important');
            }
        } else if (!isOpen && isActiveRef.current) {
            scrollLockCount--;
            isActiveRef.current = false;

            if (scrollLockCount <= 0 && originalStyles) {
                const body = document.body;
                const html = document.documentElement;

                originalStyles.fixedStyles.forEach(({ element, paddingRight }) => {
                    (element as HTMLElement).style.paddingRight = paddingRight;
                });
                restoreScrollRoots(originalStyles.rootStyles);

                body.style.position = originalStyles.bodyPosition;
                body.style.top = originalStyles.bodyTop;
                body.style.width = originalStyles.bodyWidth;
                body.style.overflow = originalStyles.bodyOverflow;
                body.style.paddingRight = originalStyles.bodyPaddingRight;
                html.style.overflow = originalStyles.htmlOverflow;

                window.scrollTo(0, originalStyles.scrollY);

                scrollLockCount = 0;
                originalStyles = null;
            }
        }

        return () => {
            if (isActiveRef.current) {
                scrollLockCount--;
                isActiveRef.current = false;

                if (scrollLockCount <= 0 && originalStyles) {
                    const body = document.body;
                    const html = document.documentElement;

                    originalStyles.fixedStyles.forEach(({ element, paddingRight }) => {
                        (element as HTMLElement).style.paddingRight = paddingRight;
                    });
                    restoreScrollRoots(originalStyles.rootStyles);

                    body.style.position = originalStyles.bodyPosition;
                    body.style.top = originalStyles.bodyTop;
                    body.style.width = originalStyles.bodyWidth;
                    body.style.overflow = originalStyles.bodyOverflow;
                    body.style.paddingRight = originalStyles.bodyPaddingRight;
                    html.style.overflow = originalStyles.htmlOverflow;

                    window.scrollTo(0, originalStyles.scrollY);

                    scrollLockCount = 0;
                    originalStyles = null;
                }
            }
        };
    }, [isOpen]);
};
