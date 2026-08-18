'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Eye, EyeOff, Shield, Mail, AlertCircle, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@validations/auth.schema';
import { useAccountTranslations } from '@i18n/use-app-translations';
import { useLogin } from '@services/auth.service';
import { Button } from '@components/common';
import { loginStaticText } from '@components/landing/styles';

export default function AdminLoginPage() {
    const t = useAccountTranslations();
    const router = useRouter();
    const { update: updateSession } = useSession();
    const login = useLogin();
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    function onSubmit(data: LoginSchema) {
        login.mutate(data, {
            onSuccess: async () => {
                await updateSession();
                router.refresh();
                router.push('/admin');
            },
        });
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
                <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] p-8 border border-white/60 ring-1 ring-black/5 md:p-10">
                    <header className="mb-8 text-center">
                        {/* Interactive Rotating Logo Badge */}
                        <div className="mx-auto h-14 w-14 bg-stone-900 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-stone-900/25 transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default group">
                            <Shield className="h-6 w-6 text-neutral-100 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex justify-center mb-2">
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
                            {t('adminSubtitle')}
                        </p>
                    </header>

                    <h1
                        className={`mb-6 text-center font-display text-2xl font-bold tracking-wide text-stone-950 ${loginStaticText}`}
                    >
                        {t('adminTitle')}
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Field label={t('email')} error={errors.email?.message}>
                            <div className="relative flex items-center bg-white/75 border border-stone-300 rounded-2xl overflow-hidden transition-all duration-300 focus-within:bg-white focus-within:border-stone-800 focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                                <Mail
                                    className="absolute left-4 h-5 w-5 text-stone-500 pointer-events-none"
                                    aria-hidden
                                />
                                <input
                                    type="email"
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 font-sans text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400 rounded-[inherit]"
                                    {...register('email')}
                                />
                            </div>
                        </Field>

                        <Field label={t('password')} error={errors.password?.message}>
                            <div className="relative flex items-center bg-white/75 border border-stone-300 rounded-2xl overflow-hidden transition-all duration-300 focus-within:bg-white focus-within:border-stone-800 focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                                <KeyRound
                                    className="absolute left-4 h-5 w-5 text-stone-500 pointer-events-none"
                                    aria-hidden
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 pr-12 font-sans text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400 rounded-[inherit]"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 cursor-pointer text-stone-500 transition-colors duration-200 hover:text-stone-950"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
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
                                className="h-5 w-5 rounded-md border-stone-400 text-stone-900 focus:ring-stone-800 accent-stone-900 cursor-pointer"
                            />
                            <label
                                htmlFor="remember-me"
                                className="font-sans text-sm font-semibold tracking-wide text-stone-800 select-none cursor-pointer hover:text-stone-950 transition-colors"
                            >
                                {t('rememberMe')}
                            </label>
                        </div>

                        {login.error ? (
                            <div
                                className={`flex items-center text-rose-700 text-xs pl-1.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 font-medium ${loginStaticText}`}
                            >
                                <AlertCircle className="h-4 w-4 mr-1 text-rose-700 shrink-0" />
                                <span>{login.error.message || t('invalidAdmin')}</span>
                            </div>
                        ) : null}

                        <Button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full rounded-2xl py-4 tracking-[0.2em] text-xs font-bold uppercase hover:shadow-[0_12px_24px_rgba(43,38,35,0.25)] hover:-translate-y-0.5 transition-all duration-300 bg-stone-900 text-white"
                        >
                            {t('adminAccess')}
                        </Button>
                    </form>
                </div>

                {/* Footer Copyright block */}
                <p
                    className={`text-center mt-6 text-white/90 text-xs font-semibold tracking-wider drop-shadow-sm uppercase ${loginStaticText}`}
                >
                    &copy; {new Date().getFullYear()} {t('brand')} Admin Portal. All rights
                    reserved.
                </p>

                <Link
                    href="/"
                    className="mt-6 block text-center font-sans text-xs tracking-[0.15em] font-bold text-white/90 hover:text-white uppercase transition-colors"
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
        <div className="space-y-1.5 text-left">
            <label
                className={`block font-sans text-xs font-bold tracking-[0.15em] text-stone-950 uppercase ${loginStaticText}`}
            >
                {label}
            </label>
            {children}
            {error ? (
                <div
                    className={`flex items-center text-rose-700 text-xs pl-1.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 font-medium ${loginStaticText}`}
                >
                    <AlertCircle className="h-4 w-4 mr-1 text-rose-700 shrink-0" />
                    <span>{error}</span>
                </div>
            ) : null}
        </div>
    );
}
