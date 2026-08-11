'use client';

import { CheckCircle2, Database, Loader2, Server } from 'lucide-react';
import { useHealthCheck } from '@services/health.service';
import { useTodos, useCreateTodo } from '@services/todo.service';
import { useCommonTranslations, usePageTranslations } from '@i18n/use-app-translations';
import { useUIStore } from '@stores/ui.store';
import { Button } from '@components/common';
import { useState } from 'react';

export default function HomePage() {
    const t = usePageTranslations();
    const common = useCommonTranslations();
    const { data: health, isLoading: isHealthLoading } = useHealthCheck();
    const { data: todos, isLoading: isTodosLoading } = useTodos();
    const createTodo = useCreateTodo();
    const showLoading = useUIStore((s) => s.showLoading);
    const hideLoading = useUIStore((s) => s.hideLoading);
    const [title, setTitle] = useState('');

    async function handleCreateTodo(event: React.FormEvent) {
        event.preventDefault();
        if (!title.trim()) return;

        showLoading(common('status.loading'));
        try {
            await createTodo.mutateAsync({ title: title.trim() });
            setTitle('');
        } finally {
            hideLoading();
        }
    }

    return (
        <main className="flex min-h-screen flex-col gap-8 py-12 sm:py-16">
            <header className="space-y-3">
                <p className="font-sans text-sm font-medium tracking-wide text-secondary-600 uppercase">
                    {t('home.eyebrow')}
                </p>
                <h1 className="font-display text-4xl text-primary sm:text-5xl">
                    {t('home.title')}
                </h1>
                <p className="max-w-2xl font-sans text-base text-muted">{t('home.description')}</p>
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
                                {health?.status ?? 'unknown'}
                            </p>
                            <p className="text-muted">
                                MongoDB:{' '}
                                <span className="text-primary">{health?.mongo ?? 'unknown'}</span>
                            </p>
                        </div>
                    )}
                </article>

                <article className="rounded-xl border border-border bg-surface p-5">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                        <Database className="h-5 w-5" />
                        <h2 className="font-display text-lg font-medium">{t('home.stackTitle')}</h2>
                    </div>
                    <ul className="space-y-1 font-sans text-sm text-muted">
                        <li>Next.js App Router + Route Handlers</li>
                        <li>Zustand · TanStack Query · Axios</li>
                        <li>Tailwind CSS · Lucide · next-intl</li>
                        <li>MongoDB (Mongoose) on Vercel serverless</li>
                    </ul>
                </article>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 font-display text-xl text-primary">{t('home.todosTitle')}</h2>

                <form onSubmit={handleCreateTodo} className="mb-4 flex flex-col gap-2 sm:flex-row">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('home.todoPlaceholder')}
                        className="flex-1 rounded-md border border-border bg-neutral px-3 py-2 font-sans text-sm text-primary outline-none focus:border-primary"
                    />
                    <Button type="submit" disabled={createTodo.isPending || !title.trim()}>
                        {common('actions.save')}
                    </Button>
                </form>

                {isTodosLoading ? (
                    <p className="flex items-center gap-2 font-sans text-sm text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {common('status.loading')}
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {(todos ?? []).length === 0 ? (
                            <li className="font-sans text-sm text-muted">{t('home.emptyTodos')}</li>
                        ) : (
                            (todos ?? []).map((todo) => (
                                <li
                                    key={todo._id}
                                    className="rounded-md border border-border bg-neutral px-3 py-2 font-sans text-sm text-primary"
                                >
                                    {todo.title}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </section>
        </main>
    );
}
