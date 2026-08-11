'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { salonLoginSchema, type SalonLoginInput } from '@validations/booking.schema';
import { useAccountTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';

const fieldClass =
    'w-full border-0 border-b border-border bg-transparent py-3 pr-10 font-sans text-sm text-primary outline-none focus:border-primary';

export function ClientLoginView() {
    const t = useAccountTranslations();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SalonLoginInput>({
        resolver: zodResolver(salonLoginSchema),
        defaultValues: { email: '', password: '' },
    });

    function onSubmit() {
        router.push('/');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
            <div className="w-full max-w-md">
                <header className="mb-10 text-center">
                    <p className="font-display text-4xl tracking-tighter text-primary uppercase md:text-5xl">
                        {t('brand')}
                    </p>
                    <p className="mt-2 font-sans text-xs tracking-widest text-muted uppercase">
                        {t('clientSubtitle')}
                    </p>
                </header>

                <section className="rounded-lg border border-border/60 bg-neutral p-8 shadow-[0_12px_40px_rgba(43,38,35,0.06)] md:p-12">
                    <h1 className="mb-8 text-center font-display text-2xl text-primary">
                        {t('clientTitle')}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Field label={t('email')} error={errors.email?.message}>
                            <div className="relative">
                                <input
                                    type="email"
                                    autoComplete="email"
                                    className={fieldClass}
                                    {...register('email')}
                                />
                                <Mail
                                    className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-muted"
                                    aria-hidden
                                />
                            </div>
                        </Field>
                        <Field label={t('password')} error={errors.password?.message}>
                            <div className="relative">
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    className={fieldClass}
                                    {...register('password')}
                                />
                                <Lock
                                    className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-muted"
                                    aria-hidden
                                />
                            </div>
                            <div className="mt-2 text-right">
                                <span className="font-sans text-xs text-muted">{t('forgot')}</span>
                            </div>
                        </Field>
                        <p className="font-sans text-xs text-muted">{t('clientHint')}</p>
                        <Button
                            type="submit"
                            className="w-full rounded-sm py-4 tracking-widest uppercase"
                        >
                            {t('submit')}
                        </Button>
                    </form>
                    <p className="mt-6 text-center font-sans text-sm text-muted">
                        {t('noAccount')}{' '}
                        <span className="text-primary underline-offset-2 hover:underline">
                            {t('createAccount')}
                        </span>
                    </p>
                </section>

                <Link
                    href="/"
                    className="mt-8 block text-center font-sans text-sm text-muted transition-colors hover:text-primary"
                >
                    {t('backHome')}
                </Link>
            </div>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block font-sans text-xs tracking-widest text-muted uppercase">
                {label}
            </label>
            {children}
            {error ? <p className="mt-1 font-sans text-xs text-danger">{error}</p> : null}
        </div>
    );
}
