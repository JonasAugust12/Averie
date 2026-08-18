'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Lock, Mail, Shield } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { loginStaticText } from '@components/landing/styles';

interface StaffPortalLoginProps {
    onLogin: (email: string, password: string) => Promise<void>;
}

export function StaffPortalLogin({ onLogin }: StaffPortalLoginProps) {
    const t = useAdminTranslations();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/background/LoginBG.png')" }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in duration-500">
                <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] p-7 border border-white/60 ring-1 ring-black/5">
                    <header className="mb-7 text-center">
                        <div className="mx-auto h-14 w-14 bg-stone-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-stone-900/25">
                            <Shield className="h-6 w-6 text-neutral-100" />
                        </div>
                        <div className="flex justify-center mb-2">
                            <Image
                                src="/salon/figma/logo.svg"
                                alt="Averie Logo"
                                width={140}
                                height={44}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                        </div>
                        <p
                            className={`mt-2.5 font-sans text-xs font-bold tracking-[0.2em] text-stone-700 uppercase ${loginStaticText}`}
                        >
                            {t('staffPortal.subtitle')}
                        </p>
                    </header>

                    <h1
                        className={`mb-6 text-center font-display text-xl font-bold tracking-wide text-stone-950 ${loginStaticText}`}
                    >
                        {t('staffPortal.title')}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5 text-left">
                            <label className="block font-sans text-xs font-bold tracking-[0.15em] text-stone-950 uppercase">
                                Email
                            </label>
                            <div className="relative flex items-center bg-white/75 border border-stone-300 rounded-2xl overflow-hidden">
                                <Mail className="absolute left-4 h-5 w-5 text-stone-500 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 font-sans text-base font-semibold text-stone-950 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 text-left">
                            <label className="block font-sans text-xs font-bold tracking-[0.15em] text-stone-950 uppercase">
                                Password
                            </label>
                            <div className="relative flex items-center bg-white/75 border border-stone-300 rounded-2xl overflow-hidden">
                                <Lock className="absolute left-4 h-5 w-5 text-stone-500 pointer-events-none" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 font-sans text-base font-semibold text-stone-950 outline-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start text-rose-700 text-xs pl-1 font-semibold gap-1">
                                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl py-4 tracking-[0.2em] text-xs font-bold uppercase bg-stone-900 text-white"
                        >
                            {isSubmitting ? 'Signing in…' : t('staffPortal.lookupButton')}
                        </Button>
                    </form>
                </div>

                <Link
                    href="/"
                    className="mt-4 block text-center font-sans text-xs tracking-[0.15em] font-bold text-white/90 hover:text-white uppercase transition-colors"
                >
                    {t('staffPortal.backToHome')}
                </Link>
            </div>
        </div>
    );
}
