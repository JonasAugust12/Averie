'use client';

import { Star } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';

export function TestimonialsSection() {
    const t = useSalonTranslations();

    return (
        <section
            id="testimonials"
            className="-mx-4 bg-neutral-100/30 px-4 py-24 sm:-mx-6 sm:px-6 md:py-32 lg:-mx-8 lg:px-8 border-t border-border/10 backdrop-blur-xs"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center md:mb-20 animate-fade-in-up">
                    <span className="mb-4 block font-sans text-xs font-semibold tracking-[0.3em] text-muted uppercase">
                        {t('brand')} Community
                    </span>
                    <h2 className="mb-4 font-display text-4xl text-primary md:text-5xl tracking-tight">
                        {t('testimonials.title')}
                    </h2>
                    <p className="mx-auto max-w-lg font-sans text-base text-muted/90">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {(['rev1', 'rev2', 'rev3'] as const).map((key, i) => (
                        <div
                            key={key}
                            className="flex flex-col justify-between rounded-3xl bg-background p-8 border border-secondary/15 shadow-[0_12px_32px_-4px_rgba(43,38,35,0.03)] hover:shadow-[0_20px_48px_rgba(43,38,35,0.08)] transition-all duration-500 hover:-translate-y-1 hover:border-secondary/35 animate-fade-in-up"
                            style={{ animationDelay: `${(i + 1) * 150}ms` }}
                        >
                            <div>
                                <div className="mb-6 flex gap-1 text-[#C5B49E]">
                                    {[...Array(5)].map((_, starIndex) => (
                                        <Star
                                            key={starIndex}
                                            className="h-4 w-4 fill-current stroke-none"
                                        />
                                    ))}
                                </div>
                                <p className="font-sans text-base leading-relaxed text-primary/95 italic">
                                    "{t(`testimonials.reviews.${key}.text`)}"
                                </p>
                            </div>
                            <div className="mt-8 border-t border-secondary/10 pt-5 flex items-center gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 border border-secondary/20 text-xs font-semibold tracking-wider text-muted uppercase">
                                    {t(`testimonials.reviews.${key}.author`)
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-sans text-xs font-bold tracking-[0.2em] text-primary uppercase">
                                        {t(`testimonials.reviews.${key}.author`)}
                                    </h4>
                                    <span className="font-sans text-[10px] tracking-wider text-muted uppercase mt-0.5">
                                        {t(`testimonials.reviews.${key}.role`)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
