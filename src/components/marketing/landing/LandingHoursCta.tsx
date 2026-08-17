'use client';

import Image from 'next/image';
import { Phone, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { AppLink } from '@components/shared';
import { useSalonTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { FadeIn, PillLink } from '@components/marketing/landing';
import {
    landingBleedRight,
    landingBody,
    landingImage,
    landingOrnamentDesktopOnly,
    landingInteractive,
    landingStaticText,
    landingTitle,
} from '@components/marketing/landing/styles';

function HoursSparkleRule() {
    return (
        <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px flex-1 bg-secondary-600/30" />
            <svg
                viewBox="0 0 12 12"
                className="size-2.5 shrink-0 text-nude/80"
                fill="currentColor"
                aria-hidden
            >
                <path d="M6 0 7.15 4.85 12 6 7.15 7.15 6 12 4.85 7.15 0 6 4.85 4.85Z" />
            </svg>
            <span className="h-px flex-1 bg-secondary-600/30" />
        </div>
    );
}

function HoursSlot({ day, time }: { day: string; time: string }) {
    return (
        <div className={landingStaticText}>
            <p className="font-sans text-xs sm:text-sm font-normal text-secondary-600/80 uppercase tracking-wider">
                {day}
            </p>
            <p className="mt-1 font-sans text-base sm:text-lg font-semibold text-secondary-600">
                {time}
            </p>
        </div>
    );
}

export function LandingHoursCta() {
    const t = useSalonTranslations();

    return (
        <section
            id="hours"
            className="relative grid gap-6 py-12 md:grid-cols-12 md:py-24 md:items-stretch"
        >
            <div
                className={cn(
                    'absolute bottom-0 z-0 aspect-3/4 w-56 translate-y-1/2 md:w-72',
                    landingBleedRight,
                    landingOrnamentDesktopOnly,
                )}
            >
                <Image
                    src="/salon/figma/hero01.svg"
                    alt=""
                    draggable={false}
                    width={450}
                    height={750}
                    className={`h-full w-full object-cover ${landingImage}`}
                />
            </div>
            <div
                className={cn(
                    'absolute bottom-12 z-0 aspect-3/4 w-48 translate-y-1/2 md:w-56',
                    landingBleedRight,
                    landingOrnamentDesktopOnly,
                )}
            >
                <Image
                    src="/salon/figma/hero03.svg"
                    alt=""
                    draggable={false}
                    width={350}
                    height={750}
                    className={`h-full w-full object-cover ${landingImage}`}
                />
            </div>
            <FadeIn className="relative z-10 flex flex-col justify-center overflow-hidden rounded-4xl md:rounded-card border border-stone-200/80 px-6 py-10 text-center shadow-[0_16px_36px_-10px_rgba(58,48,39,0.08)] md:col-span-4 md:px-8">
                <Image
                    src="/salon/figma/hours-marble.png"
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={`object-cover ${landingImage}`}
                />
                <div className={`relative z-10 flex flex-col ${landingStaticText}`}>
                    <h2 className="font-display text-xl font-semibold tracking-wider text-secondary-600 uppercase">
                        {t('landing.hours.title')}
                    </h2>
                    <div className="mx-auto mt-4 h-px w-full bg-secondary-600/30" />
                    <div className="mt-6 flex flex-col gap-5">
                        <HoursSlot
                            day={t('landing.hours.monFri')}
                            time={t('landing.hours.monFriHours')}
                        />
                        <HoursSparkleRule />
                        <HoursSlot
                            day={t('landing.hours.saturday')}
                            time={t('landing.hours.saturdayHours')}
                        />
                        <HoursSparkleRule />
                        <HoursSlot
                            day={t('landing.hours.sunday')}
                            time={t('landing.hours.sundayHours')}
                        />
                    </div>
                    <p className="mt-5 font-sans text-xs leading-relaxed text-secondary-600/75 italic sm:text-sm">
                        {t('landing.hours.bookingNote')}
                    </p>
                </div>
            </FadeIn>

            <FadeIn
                delay={0.1}
                className="relative z-10 flex flex-col items-center justify-center rounded-4xl border border-stone-200/80 bg-white/95 px-6 py-10 text-center shadow-[0_16px_36px_-10px_rgba(58,48,39,0.08)] sm:py-12 md:col-span-8 md:rounded-card"
            >
                <h2 className={landingTitle}>{t('landing.cta.title')}</h2>

                <p className={`mt-4 max-w-lg ${landingBody}`}>{t('landing.cta.body')}</p>

                <div className="mt-8 flex w-full flex-col items-center gap-3 lg:flex-row lg:justify-center">
                    <PillLink
                        href="/book"
                        className="flex items-center justify-center gap-2 lg:max-w-none"
                    >
                        <Calendar className="size-4" />
                        <span>{t('landing.cta.book')}</span>
                    </PillLink>
                    <PillLink
                        href="tel:+17819231955"
                        variant="outline"
                        className="flex items-center justify-center gap-2 lg:max-w-none"
                    >
                        <Phone className="size-4" />
                        <span>{t('landing.cta.call')}: 781-923-1955</span>
                    </PillLink>
                </div>
                <div className="mt-7 flex items-center justify-center border-t border-stone-200/70 pt-6">
                    <AppLink
                        href="https://maps.app.goo.gl/YCtZW533i3x6BB5QA"
                        className={`group flex items-center gap-2.5 text-sm text-stone-500 transition-colors hover:text-stone-800 ${landingInteractive}`}
                    >
                        <MapPin className="size-4 shrink-0 text-stone-400 transition-colors group-hover:text-stone-700" />
                        <span className="underline decoration-stone-300 underline-offset-4 group-hover:decoration-stone-500">
                            {t('landing.cta.address')}
                        </span>
                        <ExternalLink className="size-3.5 text-stone-400 opacity-70 transition-opacity group-hover:opacity-100" />
                    </AppLink>
                </div>
            </FadeIn>
        </section>
    );
}
