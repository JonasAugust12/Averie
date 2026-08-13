import { type ReactNode } from 'react';
import { cn } from '@utils/cn.util';

interface AppShellProps {
    children: ReactNode;
    className?: string;
    /** Extra classes for the inner max-width container */
    contentClassName?: string;
    /** Full viewport width with horizontal padding only (no max-width cap). */
    fullWidth?: boolean;
    /** Content max-width preset. Ignored when `fullWidth` is true. */
    maxWidth?: 'app' | 'landing';
}

const maxWidthClass = {
    app: 'max-w-app',
    landing: 'max-w-landing',
} as const;

/**
 * Global app chrome: centers content. By default caps width at 1280px
 * so ultra-wide screens don't stretch dense app UIs (booking, admin).
 */
export function AppShell({
    children,
    className,
    contentClassName,
    fullWidth = false,
    maxWidth = 'app',
}: AppShellProps) {
    return (
        <div className={cn('min-h-screen w-full bg-background text-foreground', className)}>
            <div
                className={cn(
                    'mx-auto w-full px-4 sm:px-6 lg:px-8',
                    !fullWidth && maxWidthClass[maxWidth],
                    contentClassName,
                )}
            >
                {children}
            </div>
        </div>
    );
}
