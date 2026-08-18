'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@utils/cn.util';
import {
    ALL_LUCIDE_ICON_NAMES,
    SALON_CATEGORY_ICON_OPTIONS,
    resolveLucideIcon,
    type LucideIconName,
} from '@utils/lucide-icon.util';

interface LucideIconPickerProps {
    value: string | null;
    onChange: (icon: LucideIconName | null) => void;
    label?: string;
    className?: string;
    searchPlaceholder?: string;
    noneLabel?: string;
    selectedLabel?: string;
}

export function LucideIconPicker({
    value,
    onChange,
    label,
    className,
    searchPlaceholder = 'Search icons...',
    noneLabel = 'No icon',
    selectedLabel = 'Selected',
}: LucideIconPickerProps) {
    const [query, setQuery] = useState('');

    const filteredIcons = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [...SALON_CATEGORY_ICON_OPTIONS];

        return ALL_LUCIDE_ICON_NAMES.filter((name) => name.toLowerCase().includes(q)).slice(0, 80);
    }, [query]);

    return (
        <div className={cn('min-w-0 space-y-2.5 overflow-hidden', className)}>
            {label ? (
                <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                    {label}
                </label>
            ) : null}

            <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-xl border border-stone-200/80 bg-stone-50/60 py-2.5 pr-4 pl-10 font-sans text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100 shadow-3xs"
                />
            </div>

            <div className="grid min-w-0 grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1 overscroll-none sm:grid-cols-8">
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className={cn(
                        'flex h-10 items-center justify-center rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                        value === null
                            ? 'border-stone-900 bg-stone-900 text-white shadow-3xs'
                            : 'border-stone-200/80 bg-stone-50/50 text-stone-500 hover:border-stone-300 hover:bg-white',
                    )}
                    title={noneLabel}
                >
                    —
                </button>

                {filteredIcons.map((iconName) => {
                    const Icon = resolveLucideIcon(iconName);
                    if (!Icon) return null;

                    const selected = value === iconName;

                    return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => onChange(iconName)}
                            className={cn(
                                'flex h-10 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer',
                                selected
                                    ? 'border-stone-900 bg-stone-900 text-white shadow-3xs'
                                    : 'border-stone-200/80 bg-stone-50/50 text-stone-600 hover:border-stone-300 hover:bg-white',
                            )}
                            title={iconName}
                        >
                            <Icon className="h-4.5 w-4.5" />
                        </button>
                    );
                })}
            </div>

            {value ? (
                <p className="font-sans text-xs text-stone-500">
                    {selectedLabel}: <span className="font-semibold text-stone-800">{value}</span>
                </p>
            ) : null}
        </div>
    );
}
