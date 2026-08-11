import { type HTMLAttributes } from 'react';
import { cn } from '@utils/cn.util';

type BadgeTone = 'neutral' | 'peach' | 'taupe' | 'outline';

const tones: Record<BadgeTone, string> = {
    neutral: 'bg-neutral-200 text-primary',
    peach: 'bg-tertiary text-primary',
    taupe: 'bg-secondary-600 text-neutral',
    outline: 'border border-border bg-transparent text-muted',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: BadgeTone;
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-medium tracking-wide uppercase',
                tones[tone],
                className,
            )}
            {...props}
        />
    );
}
