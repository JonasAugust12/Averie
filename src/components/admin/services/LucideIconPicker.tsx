'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@utils/cn.util';
import {
    SALON_CATEGORY_ICON_OPTIONS,
    resolveLucideIcon,
    type LucideIconName,
} from '@utils/lucide-icon.util';

interface LucideIconPickerProps {
    value: string | null;
    onChange: (icon: LucideIconName | null) => void;
    label?: string;
    className?: string;
}

export function LucideIconPicker({ value, onChange, label, className }: LucideIconPickerProps) {
    const [query, setQuery] = useState('');

    const filteredIcons = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return SALON_CATEGORY_ICON_OPTIONS;

        return SALON_CATEGORY_ICON_OPTIONS.filter((name) => name.toLowerCase().includes(q));
    }, [query]);

    return (
        <div className={cn('space-y-3', className)}>
            {label ? (
                <label className="block font-sans text-sm font-semibold text-stone-700">
                    {label}
                </label>
            ) : null}

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full rounded-xl border border-stone-200/80 bg-stone-50/50 py-2.5 pl-10 pr-4 font-sans text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-stone-300 focus:bg-white focus:ring-2 focus:ring-stone-100"
                />
            </div>

            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className={cn(
                        'flex h-11 items-center justify-center rounded-xl border text-xs font-semibold transition-all',
                        value === null
                            ? 'border-stone-800 bg-stone-800 text-white shadow-sm'
                            : 'border-stone-200/80 bg-white text-stone-500 hover:border-stone-300 hover:bg-stone-50',
                    )}
                    title="No icon"
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
                                'flex h-11 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95',
                                selected
                                    ? 'border-stone-800 bg-stone-800 text-white shadow-sm'
                                    : 'border-stone-200/80 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50',
                            )}
                            title={iconName}
                        >
                            <Icon className="h-5 w-5" />
                        </button>
                    );
                })}
            </div>

            {value ? (
                <p className="font-sans text-xs text-stone-500">
                    Selected: <span className="font-semibold text-stone-700">{value}</span>
                </p>
            ) : null}
        </div>
    );
}
