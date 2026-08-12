'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    stagger?: number;
    from?: 'bottom' | 'top' | 'left' | 'right';
    once?: boolean;
}

/**
 * SplitText — character-by-character reveal animation.
 * Inspired by ReactBits (reactbits.dev/text-animations/split-text).
 * Uses framer-motion for smooth staggered animations.
 */
export function SplitText({
    text,
    className = '',
    delay = 0,
    duration = 0.6,
    stagger = 0.04,
    from = 'bottom',
    once = true,
}: SplitTextProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const controls = useAnimation();
    const inView = useInView(ref, { once, margin: '-10% 0px' });

    const hidden = {
        bottom: { opacity: 0, y: 40 },
        top: { opacity: 0, y: -40 },
        left: { opacity: 0, x: -40 },
        right: { opacity: 0, x: 40 },
    }[from];

    const visible = {
        opacity: 1,
        y: 0,
        x: 0,
    };

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [inView, controls]);

    const chars = text.split('');

    return (
        <span ref={ref} className={className} aria-label={text}>
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden,
                        visible: {
                            ...visible,
                            transition: {
                                duration,
                                delay: delay + i * stagger,
                                ease: [0.22, 1, 0.36, 1],
                            },
                        },
                    }}
                    style={{
                        display: 'inline-block',
                        whiteSpace: char === ' ' ? 'pre' : undefined,
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}
