import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@utils/cn.util';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    function Input({ className, ...props }, ref) {
        return (
            <input
                ref={ref}
                className={cn(
                    'w-full rounded-md border border-border bg-neutral px-3 py-2 font-sans text-sm text-primary',
                    'outline-none transition-colors placeholder:text-muted',
                    'focus:border-primary focus:ring-1 focus:ring-primary/20',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                {...props}
            />
        );
    },
);
