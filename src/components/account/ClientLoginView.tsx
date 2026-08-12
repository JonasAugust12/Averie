'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { salonLoginSchema, type SalonLoginInput } from '@validations/booking.schema';
import { useAccountTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';

export function ClientLoginView() {
    const t = useAccountTranslations();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
            {/* Background Image with Overlay Scrim */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/background/LoginBG.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Inner Content Wrapper */}
            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 md:p-10">
                    <header className="mb-8 text-center">
                        {/* Interactive Rotating Logo Badge (BKB pattern) */}
                        <div className="mx-auto h-14 w-14 bg-primary rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-primary/25 transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default group">
                            <Sparkles className="h-6 w-6 text-neutral-100 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h2 className="font-display text-4xl tracking-[0.15em] text-primary uppercase">
                            {t('brand')}
                        </h2>
                        <p className="mt-2.5 font-sans text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
                            {t('clientSubtitle')}
                        </p>
                    </header>

                    <h1 className="mb-6 text-center font-display text-xl tracking-wide text-primary">
                        {t('clientTitle')}
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Field label={t('email')} error={errors.email?.message}>
                            <div className="relative flex items-center bg-neutral-50/50 border border-secondary-200/50 rounded-2xl transition-all duration-300 focus-within:bg-white focus-within:border-secondary focus-within:shadow-[0_4px_16px_rgba(212,197,185,0.15)]">
                                <Mail
                                    className="absolute left-4 h-4.5 w-4.5 text-secondary-400 pointer-events-none"
                                    aria-hidden
                                />
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="yourname@domain.com"
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 font-sans text-sm text-primary outline-none placeholder:text-muted/40"
                                    {...register('email')}
                                />
                            </div>
                        </Field>

                        <Field label={t('password')} error={errors.password?.message}>
                            <div className="relative flex items-center bg-neutral-50/50 border border-secondary-200/50 rounded-2xl transition-all duration-300 focus-within:bg-white focus-within:border-secondary focus-within:shadow-[0_4px_16px_rgba(212,197,185,0.15)]">
                                <div className="absolute left-4 h-4.5 w-4.5 flex items-center justify-center text-secondary-400">
                                    <span className="font-sans text-[10px] font-bold tracking-widest">
                                        🔑
                                    </span>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 pr-12 font-sans text-sm text-primary outline-none placeholder:text-muted/40"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 cursor-pointer text-secondary-400 transition-colors duration-200 hover:text-primary"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4.5 w-4.5" />
                                    ) : (
                                        <Eye className="h-4.5 w-4.5" />
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="font-sans text-[11px] font-medium tracking-wide text-muted hover:text-primary transition-colors cursor-pointer select-none">
                                    {t('forgot')}
                                </span>
                            </div>
                        </Field>

                        <p className="font-sans text-[11px] leading-relaxed text-muted/70 pt-1">
                            {t('clientHint')}
                        </p>

                        <Button
                            type="submit"
                            className="w-full rounded-2xl py-3.5 tracking-[0.2em] text-xs font-semibold uppercase hover:shadow-[0_12px_24px_rgba(43,38,35,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {t('submit')}
                        </Button>
                    </form>

                    <p className="mt-6 text-center font-sans text-xs text-muted">
                        {t('noAccount')}{' '}
                        <span className="font-semibold text-primary underline-offset-2 hover:underline cursor-pointer">
                            {t('createAccount')}
                        </span>
                    </p>
                </div>

                {/* Footer Copyright block */}
                <p className="text-center mt-6 text-white/80 text-xs font-medium tracking-wider drop-shadow-sm uppercase">
                    &copy; {new Date().getFullYear()} {t('brand')} Luxury Salon. All rights
                    reserved.
                </p>

                <Link
                    href="/"
                    className="mt-6 block text-center font-sans text-xs tracking-[0.15em] font-semibold text-white/80 hover:text-white uppercase transition-colors"
                >
                    {t('backHome')}
                </Link>
            </div>
        </div>
    );
}

interface FieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
    return (
        <div className="space-y-1 text-left">
            <label className="block font-sans text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
                {label}
            </label>
            {children}
            {error ? (
                <div className="flex items-center text-rose-700 text-xs pl-1.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 mr-1 text-rose-700 shrink-0" />
                    <span>{error}</span>
                </div>
            ) : null}
        </div>
    );
}
