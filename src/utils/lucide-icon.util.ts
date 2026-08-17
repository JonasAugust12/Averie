import { icons, type LucideIcon } from 'lucide-react';

export type LucideIconName = keyof typeof icons;

/** Curated icons for salon service categories — shown first in the picker. */
export const SALON_CATEGORY_ICON_OPTIONS = [
    'Sparkles',
    'Sparkle',
    'Scissors',
    'Hand',
    'Footprints',
    'Eye',
    'ScanFace',
    'Smile',
    'Palette',
    'Paintbrush',
    'PaintBucket',
    'Brush',
    'PenLine',
    'Pencil',
    'Eraser',
    'Blend',
    'Layers',
    'Pipette',
    'Aperture',
    'Gem',
    'Diamond',
    'Crown',
    'Award',
    'Medal',
    'Trophy',
    'Ribbon',
    'Gift',
    'PartyPopper',
    'Wand',
    'WandSparkles',
    'Flame',
    'Bath',
    'ShowerHead',
    'Droplets',
    'Droplet',
    'Wind',
    'Waves',
    'Flower2',
    'Flower',
    'Clover',
    'Leaf',
    'LeafyGreen',
    'Sprout',
    'Cherry',
    'Sun',
    'Sunrise',
    'Sunset',
    'Moon',
    'CloudSun',
    'Rainbow',
    'Snowflake',
    'Heart',
    'HeartHandshake',
    'HeartPulse',
    'Activity',
    'Zap',
    'Infinity',
    'Star',
    'CircleDot',
    'Hexagon',
    'Plus',
    'CirclePlus',
    'Package',
    'ShoppingBag',
    'Store',
    'Tag',
    'Percent',
    'Clock',
    'Timer',
    'CalendarHeart',
    'MapPin',
    'Users',
    'UserRound',
    'Baby',
    'Coffee',
    'CupSoda',
    'Wine',
    'GlassWater',
    'Feather',
    'Shell',
    'ShieldCheck',
    'BadgeCheck',
    'ThumbsUp',
    'Handshake',
    'Music2',
    'Bell',
    'Lightbulb',
] as const satisfies readonly LucideIconName[];

export const ALL_LUCIDE_ICON_NAMES = Object.keys(icons) as LucideIconName[];

export function isValidLucideIconName(name: string): name is LucideIconName {
    return name in icons;
}

export function resolveLucideIcon(name: string | null | undefined): LucideIcon | null {
    if (!name || !isValidLucideIconName(name)) {
        return null;
    }

    return icons[name];
}
