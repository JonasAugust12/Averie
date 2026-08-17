import { cn } from '@utils/cn.util';

interface AmbientBackgroundProps {
    className?: string;
    variant?: 'subtle' | 'prominent';
}

/** Soft blurred circles used behind loading and error screens. */
export function AmbientBackground({ className, variant = 'subtle' }: AmbientBackgroundProps) {
    if (variant === 'prominent') {
        return (
            <div
                className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
                aria-hidden
            >
                <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-secondary-600/45 blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-tertiary-400/60 blur-3xl animate-pulse delay-700" />
            </div>
        );
    }

    return (
        <div
            className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
            aria-hidden
        >
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-secondary/40 blur-3xl animate-ambient-pulse" />
            <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-tertiary blur-3xl animate-ambient-pulse animation-delay-200" />
            <div className="absolute -bottom-16 left-1/4 h-96 w-96 rounded-full bg-secondary-200/50 blur-3xl animate-ambient-pulse animation-delay-300" />
        </div>
    );
}
