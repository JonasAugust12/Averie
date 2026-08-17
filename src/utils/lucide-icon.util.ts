import { icons, type LucideIcon } from 'lucide-react';

export type LucideIconName = keyof typeof icons;

/** Curated icons for salon service categories — shown first in the picker. */
export const SALON_CATEGORY_ICON_OPTIONS = [
    'Sparkles',
    'Scissors',
    'Hand',
    'Palette',
    'Gem',
    'Plus',
    'Flame',
    'Smile',
    'Heart',
    'Star',
    'Flower2',
    'Droplets',
    'Brush',
    'Crown',
    'Leaf',
    'Sun',
    'Moon',
    'Package',
    'WandSparkles',
    'Ribbon',
] as const satisfies readonly LucideIconName[];

export function isValidLucideIconName(name: string): name is LucideIconName {
    return name in icons;
}

export function resolveLucideIcon(name: string | null | undefined): LucideIcon | null {
    if (!name || !isValidLucideIconName(name)) {
        return null;
    }

    return icons[name];
}
