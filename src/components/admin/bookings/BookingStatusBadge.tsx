import type { BookingStatus } from '@typings/salon-common.type';
import { cn } from '@utils/cn.util';

export function BookingStatusBadge({
    status,
    label,
    className,
}: {
    status: BookingStatus;
    label: string;
    className?: string;
}) {
    const isUpcoming = status === 'upcoming';

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-bold tracking-wider uppercase shadow-2xs border transition-colors',
                isUpcoming
                    ? 'border-emerald-200/80 bg-emerald-50/80 text-emerald-800'
                    : 'border-stone-200/80 bg-stone-100/90 text-stone-600',
                className,
            )}
        >
            <span
                className={cn(
                    'h-1.5 w-1.5 rounded-full shrink-0',
                    isUpcoming ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400',
                )}
                aria-hidden
            />
            {label}
        </span>
    );
}
