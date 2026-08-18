'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { resolveLucideIconWithFallback } from '@utils/lucide-icon.util';
import { ServiceCard } from './ServiceCard';
import type { ServiceDto } from '@typings/service.type';

interface ServiceCategorySectionProps {
    categoryId: string;
    label: string;
    icon?: string | null;
    services: ServiceDto[];
    onAdd: (categoryId: string) => void;
    onEdit: (svc: ServiceDto) => void;
    onToggle: (svc: ServiceDto) => void;
    onDelete: (svc: ServiceDto) => void;
    onEditCategory: () => void;
    onDeleteCategory: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
    'manicure-pedicure': 'bg-rose-50 text-rose-800 border-rose-200/60',
    'gel-polish': 'bg-purple-50 text-purple-800 border-purple-200/60',
    'nail-enhancements': 'bg-sky-50 text-sky-800 border-sky-200/60',
    'add-ons': 'bg-amber-50 text-amber-850 border-amber-200/60',
    waxing: 'bg-orange-50 text-orange-900 border-orange-200/60',
    facials: 'bg-emerald-50 text-emerald-850 border-emerald-200/60',
};

const CATEGORY_TAGS: Record<string, string> = {
    'manicure-pedicure': 'Nails',
    'gel-polish': 'Gel',
    'nail-enhancements': 'Enhance',
    'add-ons': 'Add-on',
    waxing: 'Waxing',
    facials: 'Facial',
};

function categoryBadgeLabel(categoryId: string, label: string): string {
    if (CATEGORY_TAGS[categoryId]) return CATEGORY_TAGS[categoryId];
    const firstWord = label.trim().split(/\s+/)[0];
    if (!firstWord) return 'Service';
    return firstWord.length > 10 ? `${firstWord.slice(0, 9)}…` : firstWord;
}

export function ServiceCategorySection({
    categoryId,
    label,
    icon,
    services,
    onAdd,
    onEdit,
    onToggle,
    onDelete,
    onEditCategory,
    onDeleteCategory,
}: ServiceCategorySectionProps) {
    const t = useAdminTranslations();
    const [open, setOpen] = useState(true);

    const activeCount = services.filter((s) => s.visible).length;
    const totalCount = services.length;
    const colorClass =
        CATEGORY_COLORS[categoryId] ?? 'bg-stone-100/70 text-stone-800 border-stone-200/70';
    const categoryTag = categoryBadgeLabel(categoryId, label);
    const CategoryIcon = resolveLucideIconWithFallback(icon);

    return (
        <div className="flex flex-col gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-stone-50/50 p-4 sm:p-6 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-stone-300">
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-4">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="group flex min-w-0 items-center gap-2.5 text-stone-900 transition-colors text-left cursor-pointer"
                    >
                        <span
                            className={cn(
                                'flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider shadow-3xs',
                                colorClass,
                            )}
                        >
                            <CategoryIcon className="h-3 w-3" aria-hidden />
                            {categoryTag}
                        </span>
                        <h3 className="truncate font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                            {label}
                        </h3>
                    </button>
                    <span className="shrink-0 font-sans text-xs sm:text-sm font-semibold text-stone-500">
                        {activeCount}/{totalCount} {t('services.visibleCount')}
                    </span>
                </div>

                {/* Header action controls */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={() => onAdd(categoryId)}
                        className="flex h-8.5 items-center gap-1.5 rounded-xl border border-stone-200/80 bg-white px-3 text-xs font-bold text-stone-700 shadow-3xs hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span className="inline">{t('services.addToCategory')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onEditCategory}
                        className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-600 shadow-3xs hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all duration-200 cursor-pointer"
                        title={t('services.editCategory')}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={onDeleteCategory}
                        className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-400 shadow-3xs hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all duration-200 cursor-pointer"
                        title={t('services.deleteCategory')}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-500 shadow-3xs hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all duration-200 cursor-pointer"
                        aria-expanded={open}
                        title={
                            open
                                ? t('services.collapse') || 'Collapse'
                                : t('services.expand') || 'Expand'
                        }
                    >
                        {open ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Service list or empty state */}
            {open && (
                <div className="flex flex-col">
                    {services.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-stone-200 bg-white/60 py-8 px-4 text-center">
                            <p className="font-sans text-sm text-stone-400">
                                {t('services.emptyCategory')}
                            </p>
                            <button
                                type="button"
                                onClick={() => onAdd(categoryId)}
                                className="mt-2 font-sans text-xs font-bold text-stone-600 hover:text-stone-900 underline underline-offset-4 transition-colors cursor-pointer"
                            >
                                {t('services.addFirst')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {services.map((svc) => (
                                <ServiceCard
                                    key={svc.id}
                                    service={svc}
                                    onEdit={onEdit}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
