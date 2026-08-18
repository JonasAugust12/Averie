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

/** Visual themes only — quiet luxury color palette */
const variants = {
    pending: {
        card: 'border-stone-200/80 bg-white/90 text-stone-900',
        icon: 'bg-amber-50 text-amber-700 border border-amber-200/60',
        label: 'text-amber-800',
    },
    confirmed: {
        card: 'border-stone-200/80 bg-white/90 text-stone-900',
        icon: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
        label: 'text-emerald-800',
    },
    rejected: {
        card: 'border-stone-200/80 bg-white/90 text-stone-900',
        icon: 'bg-rose-50 text-rose-700 border border-rose-200/60',
        label: 'text-rose-800',
    },
    cancelled: {
        card: 'border-stone-200/80 bg-white/90 text-stone-900',
        icon: 'bg-stone-100 text-stone-600 border border-stone-200/60',
        label: 'text-stone-600',
    },
};

const cardBase =
    'group relative flex items-center gap-4 rounded-2xl border p-5 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-stone-300';

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
                    borderColor: staffColorAlpha(accentColor, 40),
                    boxShadow: `0 1px 3px rgba(0,0,0,0.02), 0 4px 14px ${staffColorAlpha(accentColor, 10)}`,
                }}
            >
                <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{
                        backgroundColor: staffColorAlpha(accentColor, 15),
                        border: `1px solid ${staffColorAlpha(accentColor, 35)}`,
                    }}
                >
                    <Icon className="h-5 w-5" style={{ color: accentColor }} />
                </div>
                <div className="flex min-w-0 flex-col">
                    <p
                        className="mb-1 font-sans text-xs font-bold uppercase tracking-wider"
                        style={{ color: staffColorAlpha(accentColor, 90) }}
                    >
                        {label}
                    </p>
                    <p className="font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                        {count}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(cardBase, v.card, className)}>
            <div
                className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
                    v.icon,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col">
                <p
                    className={cn(
                        'mb-1 font-sans text-xs font-bold uppercase tracking-wider',
                        v.label,
                    )}
                >
                    {label}
                </p>
                <p className="font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                    {count}
                </p>
            </div>
        </div>
    );
}
