import type { BookingStatus } from '@typings/salon.type';
import { cn } from '@utils/cn.util';

export function BookingStatusBadge({ status, label }: { status: BookingStatus; label: string }) {
    const statusClasses: Record<BookingStatus, string> = {
        upcoming: 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/20',
        completed: 'bg-stone-500/10 text-stone-700 border border-stone-500/25',
        cancelled: 'bg-red-500/10 text-red-800 border border-red-500/20',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-bold tracking-wide uppercase',
                statusClasses[status],
            )}
        >
            {label}
        </span>
    );
}
