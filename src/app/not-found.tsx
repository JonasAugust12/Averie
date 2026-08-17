'use client';

import Link from 'next/link';
import { Gem, Home, MoveLeft } from 'lucide-react';
import { useCommonTranslations } from '@i18n/use-app-translations';
import { AmbientBackground } from '@components/shared/AmbientBackground';
import { Button } from '@components/common';

export default function NotFound() {
    const t = useCommonTranslations();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
            <AmbientBackground variant="prominent" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
                <div className="relative mb-8">
                    <div
                        className="select-none font-display text-[8rem] font-black leading-none text-primary/10 sm:text-[10rem]"
                        aria-hidden
                    >
                        404
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <div className="animate-bounce">
                                <Gem
                                    className="h-24 w-24 text-secondary-600 drop-shadow-lg sm:h-28 sm:w-28"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 h-4 w-24 -translate-x-1/2 rounded-[100%] bg-secondary-600/25 blur-sm animate-pulse" />
                        </div>
                    </div>
                </div>

                <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {t('notFound.title')}
                </h1>

                <p className="mx-auto mb-10 max-w-lg font-sans text-base text-muted sm:text-lg">
                    {t('notFound.description')}
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href="/">
                        <Button
                            size="lg"
                            className="min-w-[200px] shadow-md shadow-primary/10 transition-all hover:-translate-y-0.5"
                        >
                            <Home className="h-5 w-5" />
                            {t('notFound.home')}
                        </Button>
                    </Link>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex h-11 min-w-[200px] items-center justify-center gap-2 rounded-md border border-primary bg-transparent px-5 text-sm font-medium text-primary transition-all hover:bg-tertiary"
                    >
                        <MoveLeft className="h-5 w-5" />
                        {t('notFound.back')}
                    </button>
                </div>
            </div>

            <p className="absolute bottom-8 font-sans text-xs text-muted/70">
                {t('notFound.code')}
            </p>
        </div>
    );
}
