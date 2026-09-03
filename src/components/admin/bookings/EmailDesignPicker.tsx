'use client';

import { EMAIL_PALETTES, type EmailColorTheme, type EmailDesignVariant } from '@email/themes';
import { cn } from '@utils/cn.util';

type EmailDesignPickerProps = {
    design: EmailDesignVariant;
    theme: EmailColorTheme;
    onDesignChange: (design: EmailDesignVariant) => void;
    onThemeChange: (theme: EmailColorTheme) => void;
    designLabels: Record<EmailDesignVariant, string>;
    themeLabels: Record<EmailColorTheme, string>;
    designLabel: string;
    themeLabel: string;
    livePreviewLabel: string;
};

const DESIGNS: EmailDesignVariant[] = ['classic', 'elegant', 'modern'];
const THEMES: EmailColorTheme[] = ['averie', 'rose', 'sage', 'midnight'];

function MiniDesignPreview({
    design,
    palette,
}: {
    design: EmailDesignVariant;
    palette: (typeof EMAIL_PALETTES)[EmailColorTheme];
}) {
    if (design === 'elegant') {
        return (
            <div
                className="overflow-hidden rounded-lg border shadow-xs transition-all"
                style={{ borderColor: palette.secondary, backgroundColor: palette.background }}
            >
                <div
                    className="px-3 py-2 text-center"
                    style={{
                        borderBottom: `1px solid ${palette.secondary}`,
                        backgroundColor: palette.background,
                    }}
                >
                    <div
                        className="font-display text-[9px] tracking-[0.25em]"
                        style={{ color: palette.primary }}
                    >
                        AVERIE
                    </div>
                    <div
                        className="text-[6px] tracking-widest uppercase opacity-75 mt-0.5 font-sans"
                        style={{ color: palette.accent }}
                    >
                        Nail Salon
                    </div>
                </div>
                <div className="space-y-1 p-2" style={{ backgroundColor: palette.card }}>
                    <div
                        className="h-1.5 w-1/2 rounded-full"
                        style={{ backgroundColor: palette.secondary }}
                    />
                    <div
                        className="h-6 rounded-md border p-1"
                        style={{
                            borderColor: palette.secondary,
                            backgroundColor: palette.background,
                        }}
                    >
                        <div
                            className="h-1.5 w-3/4 rounded"
                            style={{ backgroundColor: palette.primary, opacity: 0.3 }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (design === 'modern') {
        return (
            <div
                className="overflow-hidden rounded-lg border bg-white shadow-xs transition-all"
                style={{
                    borderColor: palette.secondary,
                    borderLeftWidth: 4,
                    borderLeftColor: palette.primary,
                }}
            >
                <div
                    className="px-2.5 py-1.5 border-b"
                    style={{ borderColor: palette.secondary, backgroundColor: palette.background }}
                >
                    <div
                        className="text-[7px] font-bold uppercase tracking-widest"
                        style={{ color: palette.accent }}
                    >
                        Averie
                    </div>
                    <div
                        className="text-[9px] font-bold text-stone-900 leading-none mt-0.5"
                        style={{ color: palette.primary }}
                    >
                        Nail Salon
                    </div>
                </div>
                <div className="space-y-1 p-2">
                    <div
                        className="h-1.5 w-2/3 rounded"
                        style={{ backgroundColor: palette.muted, opacity: 0.3 }}
                    />
                    <div
                        className="h-5 rounded border"
                        style={{ borderColor: palette.secondary, backgroundColor: palette.card }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            className="overflow-hidden rounded-lg border shadow-xs transition-all"
            style={{ borderColor: palette.secondary }}
        >
            <div className="px-2.5 py-2" style={{ backgroundColor: palette.primary }}>
                <div
                    className="font-display text-[9px] tracking-wider"
                    style={{ color: palette.onPrimary }}
                >
                    AVERIE
                </div>
                <div
                    className="text-[6px] tracking-wide text-stone-300 opacity-80"
                    style={{ color: palette.secondary }}
                >
                    Nail Salon &amp; Facials
                </div>
            </div>
            <div className="space-y-1 p-2" style={{ backgroundColor: palette.card }}>
                <div
                    className="h-1.5 w-1/2 rounded-full"
                    style={{ backgroundColor: palette.secondary }}
                />
                <div
                    className="h-5 rounded border"
                    style={{ borderColor: palette.secondary, backgroundColor: palette.background }}
                />
            </div>
        </div>
    );
}

export function EmailDesignPicker({
    design,
    theme,
    onDesignChange,
    onThemeChange,
    designLabels,
    themeLabels,
    designLabel,
    themeLabel,
    livePreviewLabel,
}: EmailDesignPickerProps) {
    const activePalette = EMAIL_PALETTES[theme];

    return (
        <div className="space-y-5">
            {/* Design Variant Selection */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                        {designLabel}
                    </p>
                    <span className="font-sans text-xs text-stone-500 font-medium">
                        {designLabels[design]}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                    {DESIGNS.map((item) => {
                        const selected = design === item;
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onDesignChange(item)}
                                className={cn(
                                    'group relative rounded-2xl border-2 p-2 text-left transition-all cursor-pointer shadow-3xs hover:scale-[1.02]',
                                    selected
                                        ? 'border-stone-900 ring-2 ring-stone-300 bg-white shadow-xs'
                                        : 'border-stone-200 bg-stone-50/70 hover:border-stone-400 hover:bg-white',
                                )}
                            >
                                <MiniDesignPreview design={item} palette={EMAIL_PALETTES[theme]} />
                                <p
                                    className={cn(
                                        'mt-2 font-sans text-[11px] font-bold text-center transition-colors',
                                        selected
                                            ? 'text-stone-950'
                                            : 'text-stone-600 group-hover:text-stone-900',
                                    )}
                                >
                                    {designLabels[item]}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Theme Swatch Selection (Inspired by PromotionColorPicker) */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                        {themeLabel}
                    </p>
                    <span className="font-sans text-xs text-stone-500 font-medium">
                        {themeLabels[theme]}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {THEMES.map((item) => {
                        const palette = EMAIL_PALETTES[item];
                        const selected = theme === item;
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onThemeChange(item)}
                                className={cn(
                                    'group relative flex items-center gap-2 rounded-full border-2 px-3 py-1.5 transition-all cursor-pointer shadow-3xs',
                                    selected
                                        ? 'border-stone-900 ring-2 ring-stone-300 scale-105 bg-white'
                                        : 'border-stone-200 bg-stone-50/80 hover:border-stone-400 hover:scale-105 hover:bg-white',
                                )}
                                aria-label={themeLabels[item]}
                                aria-pressed={selected}
                            >
                                {/* Circular dual-tone color swatch ring */}
                                <span className="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-stone-300 shadow-2xs">
                                    <span
                                        className="h-full w-1/2"
                                        style={{ backgroundColor: palette.primary }}
                                    />
                                    <span
                                        className="h-full w-1/2"
                                        style={{ backgroundColor: palette.accent }}
                                    />
                                </span>
                                <span
                                    className={cn(
                                        'font-sans text-[12px] font-semibold transition-colors',
                                        selected
                                            ? 'text-stone-900'
                                            : 'text-stone-600 group-hover:text-stone-900',
                                    )}
                                >
                                    {themeLabels[item]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Live Preview Box */}
            <div
                className="rounded-2xl border border-stone-200/90 p-3.5 shadow-3xs transition-all"
                style={{
                    borderColor: activePalette.secondary,
                    backgroundColor: activePalette.background,
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <p
                        className="font-sans text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: activePalette.muted }}
                    >
                        {livePreviewLabel}
                    </p>
                    <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border"
                        style={{
                            borderColor: activePalette.secondary,
                            color: activePalette.primary,
                            backgroundColor: activePalette.card,
                        }}
                    >
                        {themeLabels[theme]} • {designLabels[design]}
                    </span>
                </div>
                <div className="mx-auto max-w-56">
                    <MiniDesignPreview design={design} palette={activePalette} />
                </div>
            </div>
        </div>
    );
}
