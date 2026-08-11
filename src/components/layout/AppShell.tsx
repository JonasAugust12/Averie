import { type ReactNode } from 'react';
import { cn } from '@utils/cn.util';

interface AppShellProps {
    children: ReactNode;
    className?: string;
    /** Extra classes for the inner max-width container */
    contentClassName?: string;
}

/**
 * Global app chrome: centers content and caps width at 1280px
 * so ultra-wide screens don't stretch the UI.
 */
export function AppShell({ children, className, contentClassName }: AppShellProps) {
    return (
        <div className={cn('min-h-screen w-full bg-background text-foreground', className)}>
            <div
                className={cn(
                    'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8',
                    contentClassName,
                )}
            >
                {children}
            </div>
        </div>
    );
}
