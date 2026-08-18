'use client';

import Image from 'next/image';
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
            <Image
                src="/animations/loading.gif"
                alt=""
                fill
                unoptimized
                priority
                sizes="(max-width: 640px) 224px, 256px"
                className="object-contain"
            />
            <Image
                src="/icons/icon.png"
                alt=""
                width={97}
                height={97}
                className={cn(
                    'absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full object-contain',
                    ICON_BOX,
                    iconClassName,
                )}
            />
        </div>
    );
}
