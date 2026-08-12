'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface BlurTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    stagger?: number;
    animateBy?: 'words' | 'characters';
    direction?: 'top' | 'bottom';
    once?: boolean;
}

/**
 * BlurText — blur-to-focus word-by-word reveal animation.
 * Inspired by ReactBits (reactbits.dev/text-animations/blur-text).
 * Uses framer-motion for smooth staggered blur animations.
 */
export function BlurText({
    text,
    className = '',
    delay = 0,
    duration = 0.7,
    stagger = 0.06,
    animateBy = 'words',
    direction = 'bottom',
    once = true,
}: BlurTextProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const controls = useAnimation();
    const inView = useInView(ref, { once, margin: '-10% 0px' });

    const yOffset = direction === 'bottom' ? 16 : -16;

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [inView, controls]);

    const tokens = animateBy === 'words' ? text.split(' ') : text.split('');

    return (
        <span ref={ref} className={className} aria-label={text}>
            {tokens.map((token, i) => (
                <motion.span
                    key={i}
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: {
                            opacity: 0,
                            filter: 'blur(8px)',
                            y: yOffset,
                        },
                        visible: {
                            opacity: 1,
                            filter: 'blur(0px)',
                            y: 0,
                            transition: {
                                duration,
                                delay: delay + i * stagger,
                                ease: [0.22, 1, 0.36, 1],
                            },
                        },
                    }}
                    style={{ display: 'inline-block' }}
                >
                    {animateBy === 'words'
                        ? token + (i < tokens.length - 1 ? '\u00A0' : '')
                        : token}
                </motion.span>
            ))}
        </span>
    );
}
