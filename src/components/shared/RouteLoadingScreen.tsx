'use client';

import { AmbientBackground } from './AmbientBackground';
import { LoadingGif } from './LoadingGif';
import { cn } from '@utils/cn.util';

interface RouteLoadingScreenProps {
    message: string;
    hint?: string;
    variant?: 'full' | 'inline';
    overlay?: false | 'fullscreen' | 'contained';
    exiting?: boolean;
}

export function RouteLoadingScreen({
    message,
    hint,
    variant = 'full',
    overlay = false,
    exiting = false,
}: RouteLoadingScreenProps) {
    return (
        <div
            className={cn(
                'relative flex w-full flex-col items-center justify-center overflow-hidden bg-background px-4',
                'transition-opacity duration-300 ease-out motion-reduce:transition-none',
                exiting ? 'pointer-events-none opacity-0' : 'opacity-100',
                overlay === 'fullscreen' && 'fixed inset-0 z-[100] min-h-screen',
                overlay === 'contained' &&
                    'absolute inset-0 z-50 min-h-full bg-background/95 backdrop-blur-[2px]',
                !overlay && variant === 'full' && 'min-h-screen',
                !overlay && variant === 'inline' && 'min-h-[50vh] py-16',
            )}
            role="status"
            aria-live="polite"
            aria-busy={!exiting}
        >
            <AmbientBackground variant="prominent" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <LoadingGif />

                <p className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    {message}
                </p>

                {hint ? (
                    <p className="mt-2 max-w-xs font-sans text-sm text-muted animate-fade-in">
                        {hint}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
