import type { BookingDisplayStatus } from '@typings/salon-common.type';
import { cn } from '@utils/cn.util';

const badgeStyles: Record<BookingDisplayStatus, string> = {
    upcoming: 'border-emerald-200/80 bg-emerald-50/80 text-emerald-800',
    completed: 'border-sky-200/80 bg-sky-50/80 text-sky-800',
    cancelled: 'border-stone-200/80 bg-stone-100/90 text-stone-600',
};

const dotStyles: Record<BookingDisplayStatus, string> = {
    upcoming: 'bg-emerald-500 animate-pulse',
    completed: 'bg-sky-500',
    cancelled: 'bg-stone-400',
};

export function BookingStatusBadge({
    status,
    label,
    className,
}: {
    status: BookingDisplayStatus;
    label: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-bold tracking-wider uppercase shadow-2xs border transition-colors',
                badgeStyles[status],
                className,
            )}
        >
            <span
                className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotStyles[status])}
                aria-hidden
            />
            {label}
        </span>
    );
}
