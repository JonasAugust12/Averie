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
    'manicure-pedicure': 'bg-rose-50/60 text-rose-800 border-rose-100/50',
    'gel-polish': 'bg-purple-50/60 text-purple-800 border-purple-100/50',
    'nail-enhancements': 'bg-blue-50/60 text-blue-800 border-blue-100/50',
    'add-ons': 'bg-amber-50/60 text-amber-800 border-amber-100/50',
    waxing: 'bg-orange-50/60 text-orange-850 border-orange-100/50',
    facials: 'bg-teal-50/60 text-teal-850 border-teal-100/50',
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
        CATEGORY_COLORS[categoryId] ?? 'bg-stone-50/60 text-stone-800 border-stone-100/50';
    const categoryTag = categoryBadgeLabel(categoryId, label);
    const CategoryIcon = resolveLucideIconWithFallback(icon);

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-stone-300 bg-[#f4f3f2] p-6 transition-all duration-200 hover:border-stone-400">
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-4">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="flex min-w-0 items-center gap-2 text-stone-850 transition-colors hover:text-stone-950"
                    >
                        <span
                            className={cn(
                                'flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs',
                                colorClass,
                            )}
                        >
                            <CategoryIcon className="h-3 w-3" aria-hidden />
                            {categoryTag}
                        </span>
                        <h3 className="truncate text-left font-serif text-xl font-bold tracking-wide text-stone-900 md:text-2xl">
                            {label}
                        </h3>
                    </button>
                    <span className="shrink-0 font-sans text-sm font-semibold text-stone-400">
                        {activeCount}/{totalCount} {t('services.visibleCount')}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onAdd(categoryId)}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-stone-200/40 bg-white px-3.5 text-xs font-bold text-stone-700 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:border-stone-300 hover:bg-stone-50 active:scale-95"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t('services.addToCategory')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onEditCategory}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200/60 bg-white shadow-xs transition-all duration-300 ease-in-out hover:scale-110 hover:border-stone-400 hover:bg-stone-100 active:scale-90"
                        title={t('services.editCategory')}
                    >
                        <Pencil className="h-3.5 w-3.5 text-stone-500" />
                    </button>
                    <button
                        type="button"
                        onClick={onDeleteCategory}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200/60 bg-white shadow-xs transition-all duration-300 ease-in-out hover:scale-110 hover:border-red-300 hover:bg-red-50 active:scale-90"
                        title={t('services.deleteCategory')}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200/40 bg-white text-stone-500 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:border-stone-300 hover:bg-stone-50 active:scale-95"
                        aria-expanded={open}
                    >
                        {open ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {open && (
                <div className="flex flex-col">
                    {services.length === 0 ? (
                        <div className="rounded-xl border border-stone-200/40 bg-white py-8 text-center">
                            <p className="font-sans text-sm text-stone-400">
                                {t('services.emptyCategory')}
                            </p>
                            <button
                                type="button"
                                onClick={() => onAdd(categoryId)}
                                className="mt-2 font-sans text-xs font-bold text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-800"
                            >
                                {t('services.addFirst')}
                            </button>
                        </div>
                    ) : (
                        <div className="-mx-2 space-y-1.5">
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
