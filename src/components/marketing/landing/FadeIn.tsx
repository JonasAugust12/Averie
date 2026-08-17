'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { AppLink } from '@components/shared';
import { cn } from '@utils/cn.util';
import { landingInteractive } from '@components/marketing/landing/styles';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let animationFrame = 0;

        const reveal = () => {
            setAnimate(true);
        };

        const isInView = () => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
        };

        const checkVisibility = () => {
            if (isInView()) reveal();
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) reveal();
            },
            { threshold: 0.08, rootMargin: '0px 0px 5% 0px' },
        );

        observer.observe(el);
        window.addEventListener('scroll', checkVisibility, { passive: true });
        window.addEventListener('resize', checkVisibility);

        // Apply the keyframe only after the initially visible HTML has painted.
        animationFrame = window.requestAnimationFrame(checkVisibility);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
            window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={cn(animate && 'animate-landing-fade-in-up', className)}
            style={animate && delay > 0 ? { animationDelay: `${delay}s` } : undefined}
        >
            {children}
        </div>
    );
}

export function PillLink({
    href,
    children,
    variant = 'solid',
    className,
}: {
    href: string;
    children: ReactNode;
    variant?: 'solid' | 'outline';
    className?: string;
}) {
    return (
        <AppLink
            href={href}
            className={cn(
                landingInteractive,
                'inline-flex h-12.5 w-full max-w-sm items-center justify-center rounded-full px-8 font-sans text-sm font-medium uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 md:w-auto md:min-w-64 md:max-w-none',
                variant === 'solid'
                    ? 'bg-third text-cream hover:bg-primary-800'
                    : 'border border-third bg-transparent text-third hover:bg-third hover:text-cream',
                className,
            )}
        >
            {children}
        </AppLink>
    );
}
