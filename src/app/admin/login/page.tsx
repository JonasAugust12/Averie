'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Shield, Mail, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { salonLoginSchema, type SalonLoginInput } from '@validations/booking.schema';
import { useAccountTranslations } from '@i18n/use-app-translations';
import { setAdminMockAuthed } from '@stores/booking.store';
import { Button } from '@components/common';

const ADMIN_EMAIL = 'admin@averie.local';
const ADMIN_PASSWORD = 'password';

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
                            <Shield className="h-6 w-6 text-neutral-100 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h2 className="font-display text-4xl tracking-[0.15em] text-primary uppercase">
                            {t('brand')}
                        </h2>
                        <p className="mt-2.5 font-sans text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
                            {t('adminSubtitle')}
                        </p>
                    </header>

                    <h1 className="mb-6 text-center font-display text-xl tracking-wide text-primary">
                        {t('adminTitle')}
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
                                    placeholder="admin@averie.local"
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
                        </Field>

                        <div className="flex items-center gap-3">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4.5 w-4.5 rounded-md border-secondary-300 text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                            />
                            <label
                                htmlFor="remember-me"
                                className="font-sans text-xs tracking-wide text-muted select-none cursor-pointer hover:text-primary transition-colors"
                            >
                                {t('rememberMe')}
                            </label>
                        </div>

                        <p className="font-sans text-[11px] leading-relaxed text-muted/70">
                            {t('adminHint')}
                        </p>

                        {authError ? (
                            <div className="flex items-center text-rose-700 text-xs pl-1.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 font-medium">
                                <AlertCircle className="h-3.5 w-3.5 mr-1 text-rose-700 shrink-0" />
                                <span>{authError}</span>
                            </div>
                        ) : null}

                        <Button
                            type="submit"
                            className="w-full rounded-2xl py-3.5 tracking-[0.2em] text-xs font-semibold uppercase hover:shadow-[0_12px_24px_rgba(43,38,35,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {t('adminAccess')}
                        </Button>
                    </form>

                    <p className="mt-6 flex items-center justify-center gap-2 font-sans text-[10px] font-bold tracking-widest text-muted uppercase">
                        <Shield className="h-4 w-4 text-secondary-400" aria-hidden />
                        {t('securityNote')}
                    </p>
                </div>

                {/* Footer Copyright block */}
                <p className="text-center mt-6 text-white/80 text-xs font-medium tracking-wider drop-shadow-sm uppercase">
                    &copy; {new Date().getFullYear()} {t('brand')} Admin Portal. All rights
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
