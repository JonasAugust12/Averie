import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@utils/cn.util';

type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-neutral hover:bg-primary-800',
    secondary: 'bg-secondary-200 text-primary hover:bg-secondary',
    inverted: 'bg-primary text-neutral hover:bg-primary-800',
    outlined: 'border border-primary bg-transparent text-primary hover:bg-tertiary',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
    icon: 'h-10 w-10 p-0',
};

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    type = 'button',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
                'disabled:pointer-events-none disabled:opacity-50',
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
