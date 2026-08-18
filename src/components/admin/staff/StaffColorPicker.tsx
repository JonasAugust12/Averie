'use client';

import { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { Pipette } from 'lucide-react';
import { cn } from '@utils/cn.util';
import {
    STAFF_COLOR_OPTIONS,
    isStaffPresetColor,
    normalizeStaffHex,
} from '@utils/staff-calendar.util';

function isLightHex(hex: string): boolean {
    const value = hex.replace('#', '');
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

interface StaffColorPickerProps {
    value?: string;
    onChange: (color: string) => void;
    customLabel: string;
}

export function StaffColorPicker({ value, onChange, customLabel }: StaffColorPickerProps) {
    const hex = normalizeStaffHex(value);
    const isPreset = isStaffPresetColor(hex);
    const [showCustom, setShowCustom] = useState(!isPreset);

    const selectPreset = (color: string) => {
        onChange(color);
        setShowCustom(false);
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
                {STAFF_COLOR_OPTIONS.map((color) => {
                    const selected = !showCustom && hex === color.toLowerCase();
                    return (
                        <button
                            key={color}
                            type="button"
                            onClick={() => selectPreset(color)}
                            className={cn(
                                'h-8.5 w-8.5 rounded-full border-2 transition-all hover:scale-110 cursor-pointer shadow-3xs',
                                selected
                                    ? 'border-stone-900 ring-2 ring-stone-400 scale-105'
                                    : 'border-white/80 hover:border-stone-300',
                            )}
                            style={{ backgroundColor: color }}
                            aria-label={color}
                            aria-pressed={selected}
                        />
                    );
                })}
                <button
                    type="button"
                    onClick={() => setShowCustom((prev) => !prev)}
                    className={cn(
                        'relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-2 transition-all hover:scale-110 cursor-pointer shadow-3xs',
                        showCustom || !isPreset
                            ? 'border-stone-900 ring-2 ring-stone-400 scale-105'
                            : 'border-dashed border-stone-300 bg-white hover:border-stone-400',
                    )}
                    style={showCustom || !isPreset ? { backgroundColor: hex } : undefined}
                    aria-label={customLabel}
                    aria-pressed={showCustom}
                >
                    <Pipette
                        className={cn(
                            'h-3.5 w-3.5 transition-transform duration-200',
                            showCustom || !isPreset
                                ? isLightHex(hex)
                                    ? 'text-stone-800'
                                    : 'text-white drop-shadow-sm'
                                : 'text-stone-500',
                        )}
                    />
                </button>
            </div>

            {showCustom ? (
                <div className="space-y-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 shadow-3xs animate-in fade-in zoom-in-95 duration-200">
                    <HexColorPicker
                        color={hex}
                        onChange={onChange}
                        className="h-[20vh]! w-full! sm:h-[24vh]! rounded-xl overflow-hidden"
                    />
                    <div className="flex items-center gap-2">
                        <span
                            className="h-9 w-9 shrink-0 rounded-xl border border-stone-200/80 shadow-3xs"
                            style={{ backgroundColor: hex }}
                            aria-hidden
                        />
                        <HexColorInput
                            prefixed
                            color={hex}
                            onChange={onChange}
                            className="w-full rounded-xl border border-stone-200/80 bg-white px-3.5 py-2 font-mono text-sm uppercase text-stone-900 shadow-3xs outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                            aria-label={customLabel}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
