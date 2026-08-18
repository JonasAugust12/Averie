import type { LucideIcon } from 'lucide-react';
import { cn } from '@utils/cn.util';
import { staffColorAlpha } from '@utils/staff.util';

interface BookingStatCardProps {
    label: string;
    count: number;
    icon: LucideIcon;
    variant: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
    className?: string;
    accentColor?: string;
}

/** Visual themes only — not booking status labels. */
const variants = {
    pending: {
        card: 'border-amber-200/90 text-amber-950 ring-amber-100/60',
        icon: 'bg-amber-100 text-amber-700',
    },
    confirmed: {
        card: 'border-sky-200/90 text-sky-950 ring-sky-100/60',
        icon: 'bg-sky-100 text-sky-700',
    },
    rejected: {
        card: 'border-red-200/90 text-red-950 ring-red-100/60',
        icon: 'bg-red-100 text-red-700',
    },
    cancelled: {
        card: 'border-stone-200/90 text-stone-800 ring-stone-100/60',
        icon: 'bg-stone-100 text-stone-600',
    },
};

const cardBase =
    'group flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md';

export function BookingStatCard({
    label,
    count,
    icon: Icon,
    variant,
    className,
    accentColor,
}: BookingStatCardProps) {
    const v = variants[variant];

    if (accentColor) {
        return (
            <div
                className={cn(cardBase, className)}
                style={{
                    borderColor: staffColorAlpha(accentColor, 45),
                    boxShadow: `0 1px 2px rgba(0,0,0,0.05), 0 4px 14px ${staffColorAlpha(accentColor, 14)}`,
                }}
            >
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: staffColorAlpha(accentColor, 22) }}
                >
                    <Icon className="h-5 w-5" style={{ color: accentColor }} />
                </div>
                <div className="flex min-w-0 flex-col">
                    <p
                        className="mb-0.5 text-[11px] font-bold uppercase leading-tight tracking-wider"
                        style={{ color: staffColorAlpha(accentColor, 90) }}
                    >
                        {label}
                    </p>
                    <p className="text-2xl font-black leading-none text-stone-900">{count}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(cardBase, v.card, className)}>
            <div
                className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                    v.icon,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col">
                <p className="mb-0.5 text-[11px] font-bold uppercase leading-tight tracking-wider opacity-80">
                    {label}
                </p>
                <p className="text-2xl font-black leading-none">{count}</p>
            </div>
        </div>
    );
}
