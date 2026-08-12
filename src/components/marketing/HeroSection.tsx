'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SplitText } from '@components/ui/SplitText';
import { BlurText } from '@components/ui/BlurText';
import { useSalonTranslations } from '@i18n/use-app-translations';

export function HeroSection() {
    const t = useSalonTranslations();

    return (
        <section className="relative flex min-h-[85vh] items-center overflow-hidden py-16 md:py-24">
            {/* Ambient Background Blur Elements */}
            <div className="absolute top-1/4 left-1/4 -z-10 h-112.5 w-112.5 rounded-full bg-tertiary-200/40 opacity-35 blur-3xl animate-ambient-pulse pointer-events-none" />
            <div
                className="absolute -right-20 top-1/3 -z-10 h-125 w-125 rounded-full bg-secondary-200/20 opacity-25 blur-3xl pointer-events-none"
                style={{ animationDelay: '2s' }}
            />

            <div className="relative z-10 grid w-full items-center gap-12 md:grid-cols-12">
                <div className="flex flex-col items-start gap-6 md:col-span-6">
                    {/* Eyebrow */}
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="font-sans text-xs font-semibold tracking-[0.3em] text-muted uppercase"
                    >
                        {t('hero.subtitle')}
                    </motion.span>

                    {/* Main title — character-reveal via SplitText */}
                    <h1 className="font-display font-normal text-7xl leading-tight tracking-[0.04em] text-primary md:text-8xl lg:text-[96px] lg:leading-none">
                        <SplitText
                            text={t('hero.title')}
                            delay={0.2}
                            duration={0.7}
                            stagger={0.06}
                            from="bottom"
                        />
                    </h1>

                    {/* Body — blur-to-focus via BlurText */}
                    <p className="max-w-md font-sans text-base leading-relaxed text-muted/90">
                        <BlurText
                            text={t('hero.body')}
                            delay={0.5}
                            duration={0.6}
                            stagger={0.05}
                            animateBy="words"
                            direction="bottom"
                        />
                    </p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-4"
                    >
                        <Link
                            href="/book"
                            className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-primary px-10 py-4 font-sans text-xs font-semibold tracking-[0.2em] text-neutral uppercase transition-all duration-300 hover:bg-muted hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(43,38,35,0.18)]"
                        >
                            {t('hero.cta')}
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>

                <div className="relative mt-8 md:col-span-6 md:mt-0 animate-fade-in-up animation-delay-200 flex justify-center lg:justify-end">
                    <div className="relative aspect-3/4 w-full max-w-105 overflow-hidden rounded-3xl border border-secondary/15 p-2 bg-neutral-50/50 backdrop-blur-sm shadow-[0_24px_50px_rgba(43,38,35,0.06)] transition-all duration-700 hover:border-secondary/40 hover:shadow-[0_32px_75px_rgba(43,38,35,0.14)] luxury-frame">
                        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/salon/hero.jpg"
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-[2.5s] hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>
                    {/* Decorative Offset Boundary Frame */}
                    <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full max-w-105 rounded-3xl border border-secondary/10 pointer-events-none hidden sm:block translate-x-8 -translate-y-2" />
                    <div className="absolute -bottom-8 -left-8 -z-20 h-72 w-72 rounded-full bg-secondary/15 opacity-30 blur-3xl pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
