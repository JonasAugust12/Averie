'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Eye, EyeOff, KeyRound, Mail, Shield } from 'lucide-react';
import { useAdminTranslations, useAccountTranslations } from '@i18n/use-app-translations';
import { LanguageSwitcher } from '@components/shared/LanguageSwitcher';
import { Button } from '@components/common';
import { loginStaticText } from '@components/landing/styles';

interface StaffPortalLoginProps {
    onLogin: (email: string, password: string) => Promise<void>;
}

export function StaffPortalLogin({ onLogin }: StaffPortalLoginProps) {
    const t = useAdminTranslations();
    const tAccount = useAccountTranslations();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onLogin(email.trim(), password);
        } catch {
            setError(t('staffPortal.loginFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/background/LoginBG.png')" }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
                <LanguageSwitcher variant="pill" />
            </div>

            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="rounded-3xl border border-white/60 bg-white/50 p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] ring-1 ring-black/5 backdrop-blur-xl md:p-10">
                    <header className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 shadow-lg shadow-stone-900/25 transition-transform duration-300 hover:rotate-0 rotate-3">
                            <Shield className="h-6 w-6 text-neutral-100" />
                        </div>
                        <div className="mb-2 flex justify-center">
                            <Image
                                src="/salon/figma/logo.svg"
                                alt="Averie Logo"
                                width={150}
                                height={48}
                                className="h-11 w-auto object-contain"
                                priority
                            />
                        </div>
                        <p
                            className={`mt-2.5 font-sans text-xs font-bold tracking-[0.2em] text-stone-700 uppercase ${loginStaticText}`}
                        >
                            {t('staffPortal.subtitle') ||
                                'Enter your technician credentials to view your schedule'}
                        </p>
                    </header>

                    <h1
                        className={`mb-6 text-center font-display text-2xl font-bold tracking-wide text-stone-950 ${loginStaticText}`}
                    >
                        {t('staffPortal.title') || 'Staff Portal'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Field label={tAccount('email') || 'Email'}>
                            <div className="relative flex items-center overflow-hidden rounded-2xl border border-stone-200/90 bg-white/80 transition-all duration-300 focus-within:border-stone-900 focus-within:bg-white focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                                <Mail className="pointer-events-none absolute left-4 h-5 w-5 text-stone-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    placeholder="technician@averie.vn"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 font-sans text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                                />
                            </div>
                        </Field>

                        <Field label={tAccount('password') || 'Password'}>
                            <div className="relative flex items-center overflow-hidden rounded-2xl border border-stone-200/90 bg-white/80 transition-all duration-300 focus-within:border-stone-900 focus-within:bg-white focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                                <KeyRound className="pointer-events-none absolute left-4 h-5 w-5 text-stone-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 pr-12 font-sans text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 cursor-pointer text-stone-500 transition-colors duration-200 hover:text-stone-950"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={
                                        showPassword
                                            ? t('staffPortal.hidePassword') || 'Hide password'
                                            : t('staffPortal.showPassword') || 'Show password'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </Field>

                        {error && (
                            <div className="flex items-start gap-1 pl-1 font-sans text-xs font-semibold text-rose-700">
                                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-stone-900 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(43,38,35,0.25)] cursor-pointer"
                        >
                            {isSubmitting
                                ? t('staffPortal.signingIn') || 'Signing in...'
                                : t('staffPortal.lookupButton') || 'Sign In'}
                        </Button>
                    </form>
                </div>

                <Link
                    href="/"
                    className="mt-6 block text-center font-sans text-xs font-bold uppercase tracking-[0.15em] text-white/90 transition-colors hover:text-white"
                >
                    {t('staffPortal.backToHome') || 'Back to main site'}
                </Link>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5 text-left">
            <label
                className={`block font-sans text-xs font-bold tracking-[0.15em] text-stone-950 uppercase ${loginStaticText}`}
            >
                {label}
            </label>
            {children}
        </div>
    );
}
