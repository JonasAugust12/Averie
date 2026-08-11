'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { salonLoginSchema, type SalonLoginInput } from '@validations/booking.schema';
import { useAccountTranslations } from '@i18n/use-app-translations';
import { setAdminMockAuthed } from '@stores/booking.store';
import { Button } from '@components/common';

const ADMIN_EMAIL = 'admin@avere.local';
const ADMIN_PASSWORD = 'password';

const fieldClass =
    'w-full border-0 border-b border-border/80 bg-transparent py-3 pr-10 font-sans text-sm text-primary outline-none focus:border-primary';

export default function AdminLoginPage() {
    const t = useAccountTranslations();
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SalonLoginInput>({
        resolver: zodResolver(salonLoginSchema),
        defaultValues: { email: '', password: '' },
    });

    function onSubmit(data: SalonLoginInput) {
        if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
            setAdminMockAuthed(true);
            router.push('/admin');
            return;
        }
        setAuthError(t('invalidAdmin'));
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
            <div
                className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-secondary/40 blur-3xl"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -right-16 -bottom-24 h-80 w-80 rounded-full bg-tertiary blur-3xl"
                aria-hidden
            />

            <div className="relative w-full max-w-md rounded-xl border border-border/50 bg-neutral/80 p-8 shadow-[0_20px_60px_rgba(43,38,35,0.08)] backdrop-blur-md md:p-10">
                <header className="mb-8 text-center">
                    <p className="font-display text-3xl tracking-widest text-primary uppercase">
                        {t('brand')}
                    </p>
                    <h1 className="mt-3 font-display text-xl text-primary">{t('adminTitle')}</h1>
                    <p className="mt-1 font-sans text-xs tracking-widest text-muted uppercase">
                        {t('adminSubtitle')}
                    </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Field label={t('email')} error={errors.email?.message}>
                        <input type="email" className={fieldClass} {...register('email')} />
                    </Field>
                    <Field label={t('password')} error={errors.password?.message}>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={fieldClass}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-muted hover:text-primary"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </Field>

                    <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-muted">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="accent-primary"
                        />
                        {t('rememberMe')}
                    </label>

                    <p className="font-sans text-xs text-muted">{t('adminHint')}</p>
                    {authError ? (
                        <p className="font-sans text-xs text-danger">{authError}</p>
                    ) : null}

                    <Button type="submit" className="w-full tracking-widest uppercase">
                        {t('adminAccess')}
                    </Button>
                </form>

                <p className="mt-6 flex items-center justify-center gap-2 font-sans text-xs text-muted">
                    <Shield className="h-3.5 w-3.5" aria-hidden />
                    {t('securityNote')}
                </p>

                <Link
                    href="/"
                    className="mt-6 block text-center font-sans text-sm text-muted hover:text-primary"
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
