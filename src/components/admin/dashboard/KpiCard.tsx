'use client';

import React from 'react';

interface KpiCardProps {
    label: string;
    value: string;
    hint: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: 'primary' | 'secondary' | 'gold' | 'tech';
}

export function KpiCard({ label, value, hint, icon: Icon, color = 'primary' }: KpiCardProps) {
    const themeStyles = {
        primary: {
            iconBg: 'bg-stone-900 text-stone-100 shadow-stone-900/20',
            accentBg: 'from-stone-900/5 to-transparent',
            badgeBg: 'bg-stone-100 text-stone-700',
        },
        secondary: {
            iconBg: 'bg-indigo-900/90 text-indigo-50 shadow-indigo-900/20',
            accentBg: 'from-indigo-500/5 to-transparent',
            badgeBg: 'bg-indigo-50 text-indigo-700',
        },
        gold: {
            iconBg: 'bg-amber-800/90 text-amber-50 shadow-amber-900/20',
            accentBg: 'from-amber-500/5 to-transparent',
            badgeBg: 'bg-amber-50 text-amber-800',
        },
        tech: {
            iconBg: 'bg-emerald-800/90 text-emerald-50 shadow-emerald-900/20',
            accentBg: 'from-emerald-500/5 to-transparent',
            badgeBg: 'bg-emerald-50 text-emerald-700',
        },
    };

    const theme = themeStyles[color];

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-white/90 p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300/90 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] flex flex-col justify-between">
            {/* Subtle luxury ambient gradient */}
            <div
                className={`pointer-events-none absolute inset-0 bg-linear-to-br ${theme.accentBg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="font-sans text-[11.5px] font-bold tracking-[0.14em] text-stone-500 uppercase">
                        {label}
                    </p>
                    <p className="font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                        {value}
                    </p>
                </div>
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <div className="relative z-10 mt-3.5 flex items-center gap-1.5 border-t border-stone-100 pt-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300 transition-colors duration-300 group-hover:bg-primary" />
                <p className="font-sans text-xs font-medium text-stone-500 leading-tight">{hint}</p>
            </div>
        </article>
    );
}
