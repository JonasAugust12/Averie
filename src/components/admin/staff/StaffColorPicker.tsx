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
            <div className="flex flex-wrap gap-2">
                {STAFF_COLOR_OPTIONS.map((color) => {
                    const selected = !showCustom && hex === color.toLowerCase();
                    return (
                        <button
                            key={color}
                            type="button"
                            onClick={() => selectPreset(color)}
                            className={cn(
                                'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                                selected
                                    ? 'border-stone-900 ring-2 ring-stone-300'
                                    : 'border-transparent',
                            )}
                            style={{ backgroundColor: color }}
                            aria-label={color}
                            aria-pressed={selected}
                        />
                    );
                })}
                <button
                    type="button"
                    onClick={() => setShowCustom(true)}
                    className={cn(
                        'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110',
                        showCustom || !isPreset
                            ? 'border-stone-900 ring-2 ring-stone-300'
                            : 'border-dashed border-stone-300 bg-white',
                    )}
                    style={showCustom || !isPreset ? { backgroundColor: hex } : undefined}
                    aria-label={customLabel}
                    aria-pressed={showCustom}
                >
                    <Pipette
                        className={cn(
                            'h-3.5 w-3.5',
                            showCustom || !isPreset
                                ? isLightHex(hex)
                                    ? 'text-stone-800'
                                    : 'text-white drop-shadow'
                                : 'text-stone-500',
                        )}
                    />
                </button>
            </div>

            {showCustom ? (
                <div className="space-y-3 rounded-xl border border-neutral-100 bg-stone-50 p-3">
                    <HexColorPicker
                        color={hex}
                        onChange={onChange}
                        className="h-[22vh]! w-full! sm:h-[28vh]! md:h-[32vh]!"
                    />
                    <div className="flex items-center gap-2">
                        <span
                            className="h-8 w-8 shrink-0 rounded-lg border border-neutral-200"
                            style={{ backgroundColor: hex }}
                            aria-hidden
                        />
                        <HexColorInput
                            prefixed
                            color={hex}
                            onChange={onChange}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 font-mono text-sm uppercase text-stone-900 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                            aria-label={customLabel}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
