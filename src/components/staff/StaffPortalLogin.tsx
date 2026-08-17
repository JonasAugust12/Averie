'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Phone, Shield } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { loginStaticText } from '@components/marketing/landing/styles';

interface StaffPortalLoginProps {
    phoneSearch: string;
    searchError: string | null;
    onPhoneChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function StaffPortalLogin({
    phoneSearch,
    searchError,
    onPhoneChange,
    onSubmit,
}: StaffPortalLoginProps) {
    const t = useAdminTranslations();

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
                        <div className="mx-auto h-14 w-14 bg-stone-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-stone-900/25 transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default group">
                            <Shield className="h-6 w-6 text-neutral-100 transition-transform duration-500 group-hover:scale-110" />
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

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-1.5 text-left">
                            <label
                                className={`block font-sans text-xs font-bold tracking-[0.15em] text-stone-950 uppercase ${loginStaticText}`}
                            >
                                {t('staffPortal.phoneLabel')}
                            </label>
                            <div className="relative flex items-center bg-white/75 border border-stone-300 rounded-2xl overflow-hidden focus-within:bg-white focus-within:border-stone-800 focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300">
                                <Phone
                                    className="absolute left-4 h-5 w-5 text-stone-500 pointer-events-none"
                                    aria-hidden
                                />
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    value={phoneSearch}
                                    onChange={(e) => onPhoneChange(e.target.value)}
                                    placeholder="0901234567"
                                    className="w-full bg-transparent px-4 py-3.5 pl-12 font-sans text-base font-semibold text-stone-950 outline-none placeholder:text-stone-400 rounded-[inherit]"
                                />
                            </div>
                            <p
                                className={`font-sans text-xs font-medium text-stone-700 pl-1 ${loginStaticText}`}
                            >
                                {t('staffPortal.inputHint')}
                            </p>
                        </div>

                        {searchError && (
                            <div
                                className={`flex items-start text-rose-700 text-xs pl-1 animate-in fade-in slide-in-from-top-1 duration-200 font-semibold gap-1 ${loginStaticText}`}
                            >
                                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span>{searchError}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full rounded-2xl py-4 tracking-[0.2em] text-xs font-bold uppercase hover:shadow-[0_12px_24px_rgba(43,38,35,0.25)] hover:-translate-y-0.5 transition-all duration-300 bg-stone-900 text-white"
                        >
                            {t('staffPortal.lookupButton')}
                        </Button>
                    </form>
                </div>

                <p
                    className={`text-center mt-6 text-white/90 text-xs font-semibold tracking-wider drop-shadow-sm uppercase ${loginStaticText}`}
                >
                    &copy; {new Date().getFullYear()} {t('brand')} Staff Portal
                </p>
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
