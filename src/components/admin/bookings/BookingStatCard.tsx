import type { LucideIcon } from 'lucide-react';
import { cn } from '@utils/cn.util';

interface BookingStatCardProps {
    label: string;
    count: number;
    icon: LucideIcon;
    variant: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
    className?: string;
}

const variants = {
    pending: {
        card: 'bg-amber-50/40 border-amber-100 text-amber-800',
        icon: 'bg-amber-100/60 text-amber-600',
    },
    confirmed: {
        card: 'bg-sky-50/40 border-sky-100 text-sky-800',
        icon: 'bg-sky-100/60 text-sky-600',
    },
    rejected: {
        card: 'bg-red-50/40 border-red-100 text-red-800',
        icon: 'bg-red-100/60 text-red-600',
    },
    cancelled: {
        card: 'bg-stone-50/60 border-stone-100 text-stone-700',
        icon: 'bg-stone-100/60 text-stone-500',
    },
};

export function BookingStatCard({
    label,
    count,
    icon: Icon,
    variant,
    className,
}: BookingStatCardProps) {
    const v = variants[variant];
    return (
        <div
            className={cn(
                'flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group',
                v.card,
                className,
            )}
        >
            <div
                className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110',
                    v.icon,
                )}
            >
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 leading-tight mb-0.5">
                    {label}
                </p>
                <p className="text-2xl font-black leading-none">{count}</p>
            </div>
        </div>
    );
}
