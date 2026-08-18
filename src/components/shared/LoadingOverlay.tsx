'use client';

import { useUIStore } from '@stores/ui.store';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { useCommonTranslations } from '@i18n/use-app-translations';
import { LoadingGif } from './LoadingGif';

export function LoadingOverlay() {
    const isLoading = useUIStore((state) => state.isLoading);
    const loadingMessage = useUIStore((state) => state.loadingMessage);
    const t = useCommonTranslations();

    usePreventScroll(isLoading);

    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="alert"
            aria-busy="true"
            aria-live="assertive"
        >
            <div className="flex flex-col items-center rounded-3xl border border-white/20 bg-background/95 px-10 py-8 shadow-2xl backdrop-blur-xl">
                <LoadingGif className="h-40 w-40 sm:h-48 sm:w-48" />
                <p className="mt-4 max-w-xs text-center font-sans text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    {loadingMessage ?? t('status.loading')}
                </p>
            </div>
        </div>
    );
}
