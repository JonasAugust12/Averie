import { type ReactNode } from 'react';
import { cn } from '@utils/cn.util';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-start gap-2 rounded-lg border border-dashed border-border bg-neutral p-6',
                className,
            )}
        >
            <p className="font-display text-lg text-primary">{title}</p>
            {description ? <p className="font-sans text-sm text-muted">{description}</p> : null}
            {action}
        </div>
    );
}
