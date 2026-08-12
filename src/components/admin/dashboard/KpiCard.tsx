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
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-blue-500/10 text-blue-600',
        gold: 'bg-yellow-500/10 text-yellow-700',
        tech: 'bg-emerald-500/10 text-emerald-700',
    };

    return (
        <article className="rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-start gap-4">
            <div className={`p-3 rounded-xl ${colorClasses[color]} shrink-0`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
                <p className="font-sans text-[10px] font-bold tracking-widest text-neutral-700 uppercase">
                    {label}
                </p>
                <p className="font-display text-2xl font-bold text-neutral-900">{value}</p>
                <p className="font-sans text-xs text-neutral-800 font-bold">{hint}</p>
            </div>
        </article>
    );
}
