'use client';

import Image from 'next/image';
import { CalendarHeart, MapPin, Sparkles } from 'lucide-react';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { usePromotionSettings } from '@services/promotion.service';
import { shouldRenderPromotionSection } from '@utils/promotion.util';
import { cn } from '@utils/cn.util';
import { FadeIn, PillLink } from '@components/landing';
import {
    landingBody,
    landingEyebrow,
    landingImage,
    landingImageFrame,
    landingStaticText,
    landingTitle,
} from '@components/landing/styles';

const promotionGridBg =
    'before:bg-[linear-gradient(to_right,rgba(120,113,108,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,113,108,0.06)_1px,transparent_1px)] before:bg-size-[24px_24px]';

export function LandingPromotion() {
    const t = useSalonTranslations();
    const { data: promotion } = usePromotionSettings();

    if (!promotion || !shouldRenderPromotionSection(promotion)) {
        return null;
    }

    const imageAlt = promotion.title.trim() || t('landing.promotion.eyebrow');

    return (
        <section
            id="promotion"
            className={cn(
                'relative isolate py-12 md:py-24',
                "before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:content-['']",
                promotionGridBg,
            )}
        >
            <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
                <FadeIn className="md:col-span-5 md:pr-4">
                    <div className={landingEyebrow}>
                        <Sparkles className="h-3.5 w-3.5" aria-hidden />
                        <span>{t('landing.promotion.eyebrow')}</span>
                    </div>

                    <h2 className={cn('mt-4', landingTitle)}>
                        {promotion.title || t('landing.promotion.fallbackTitle')}
                    </h2>

                    {promotion.description ? (
                        <p className={cn('mt-4 max-w-lg', landingBody, 'text-secondary-600')}>
                            {promotion.description}
                        </p>
                    ) : null}

                    <ul className={cn('mt-6 space-y-3', landingStaticText)}>
                        <li className="flex items-start gap-3 font-sans text-sm text-secondary-600 md:text-base">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-nude" aria-hidden />
                            <span>{t('landing.promotion.contextOffer')}</span>
                        </li>
                        <li className="flex items-start gap-3 font-sans text-sm text-secondary-600 md:text-base">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-nude" aria-hidden />
                            <span>{t('landing.promotion.contextLocation')}</span>
                        </li>
                        <li className="flex items-start gap-3 font-sans text-sm text-secondary-600 md:text-base">
                            <CalendarHeart
                                className="mt-0.5 h-4 w-4 shrink-0 text-nude"
                                aria-hidden
                            />
                            <span>{t('landing.promotion.contextBooking')}</span>
                        </li>
                    </ul>

                    <PillLink href="/book" className="mt-8">
                        {t('landing.promotion.cta')}
                    </PillLink>
                </FadeIn>

                <FadeIn delay={0.1} className="md:col-span-7">
                    <div
                        className={cn(
                            'relative min-h-70 overflow-hidden rounded-4xl border border-stone-200/80 bg-white/70 p-3 shadow-[0_16px_36px_-10px_rgba(58,48,39,0.12)] md:min-h-90 md:p-4',
                            landingImageFrame,
                        )}
                    >
                        <div className="relative h-full min-h-63 w-full overflow-hidden rounded-3xl bg-stone-50 md:min-h-82">
                            {promotion.imageUrl ? (
                                <Image
                                    src={promotion.imageUrl}
                                    alt={imageAlt}
                                    fill
                                    draggable={false}
                                    sizes="(max-width: 768px) 100vw, 720px"
                                    className={cn('object-contain', landingImage)}
                                />
                            ) : null}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
