'use client';

import { CheckCircle2, Loader2, Server } from 'lucide-react';
import { useHealthCheck } from '@services/health.service';
import { useCommonTranslations, usePageTranslations } from '@i18n/use-app-translations';
import { AppShell } from '@components/common';

export default function DemoPage() {
    const t = usePageTranslations();
    const common = useCommonTranslations();
    const { data: health, isLoading: isHealthLoading } = useHealthCheck();

    return (
        <AppShell>
            <main className="flex min-h-screen flex-col gap-8 py-12 sm:py-16">
                <header className="space-y-3">
                    <p className="font-sans text-sm font-medium tracking-wide text-secondary-600 uppercase">
                        {t('home.eyebrow')}
                    </p>
                    <h1 className="font-display text-4xl text-primary sm:text-5xl">
                        {t('home.title')}
                    </h1>
                    <p className="max-w-2xl font-sans text-base text-muted">
                        {t('home.description')}
                    </p>
                </header>

                <section className="grid gap-4 sm:grid-cols-2">
                    <article className="rounded-xl border border-border bg-surface p-5">
                        <div className="mb-3 flex items-center gap-2 text-primary">
                            <Server className="h-5 w-5" />
                            <h2 className="font-display text-lg font-medium">
                                {t('home.healthTitle')}
                            </h2>
                        </div>
                        {isHealthLoading ? (
                            <p className="flex items-center gap-2 font-sans text-sm text-muted">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {common('status.loading')}
                            </p>
                        ) : (
                            <div className="space-y-1 font-sans text-sm">
                                <p className="flex items-center gap-2 text-success">
                                    <CheckCircle2 className="h-4 w-4" />
                                    {health?.health ?? 'unknown'}
                                </p>
                                <p className="text-muted">
                                    MongoDB:{' '}
                                    <span className="text-primary">
                                        {health?.mongo ?? 'unknown'}
                                    </span>
                                </p>
                            </div>
                        )}
                    </article>

                    <article className="rounded-xl border border-border bg-surface p-5">
                        <div className="mb-3 flex items-center gap-2 text-primary">
                            <Server className="h-5 w-5" />
                            <h2 className="font-display text-lg font-medium">
                                {t('home.stackTitle')}
                            </h2>
                        </div>
                        <ul className="space-y-1 font-sans text-sm text-muted">
                            <li>GET → Route Handler · Mutations → Server Actions</li>
                            <li>API envelope: status · message · data</li>
                            <li>Zustand · TanStack Query · Axios · RHF · Zod</li>
                            <li>MongoDB (Mongoose) on Vercel serverless</li>
                        </ul>
                    </article>
                </section>
            </main>
        </AppShell>
    );
}
