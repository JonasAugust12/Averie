'use client';

import { cn } from '@utils/cn.util';

interface LoadingGifProps {
    /** Outer box — tweak size here */
    className?: string;
    /** Center logo — tweak size here */
    iconClassName?: string;
}

/** Spinner GIF size (adjust freely). */
const LOADER_BOX = 'h-56 w-56 sm:h-64 sm:w-64';

/** Averie logo centered inside the spinner (adjust freely). */
const ICON_BOX = 'h-[38%] w-[38%]';

export function LoadingGif({ className, iconClassName }: LoadingGifProps) {
    return (
        <div className={cn('relative shrink-0', LOADER_BOX, className)} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF */}
            <img src="/animations/loading.gif" alt="" className="h-full w-full object-contain" />
            {/* eslint-disable-next-line @next/next/no-img-element -- centered brand mark over spinner */}
            <img
                src="/icons/icon.png"
                alt=""
                className={cn(
                    'absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full object-contain',
                    ICON_BOX,
                    iconClassName,
                )}
            />
        </div>
    );
}
