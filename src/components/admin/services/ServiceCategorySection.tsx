'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import { ServiceCard } from './ServiceCard';
import { resolveLucideIcon } from '@utils/lucide-icon.util';
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

export function ServiceCategorySection({
    categoryId,
    label,
    icon,
    services,
    onAdd,
    onEdit,
    onToggle,
    onDelete,
}: ServiceCategorySectionProps) {
    const t = useAdminTranslations();
    const [open, setOpen] = useState(true);

    const activeCount = services.filter((s) => s.visible).length;
    const totalCount = services.length;
    const colorClass =
        CATEGORY_COLORS[categoryId] ?? 'bg-stone-50/60 text-stone-800 border-stone-100/50';
    const categoryTag = CATEGORY_TAGS[categoryId] || 'Service';
    const CategoryIcon = resolveLucideIcon(icon);

    return (
        <div className="rounded-2xl border border-stone-300 bg-[#f4f3f2] p-6 flex flex-col gap-6 transition-all duration-200 hover:border-stone-400">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="flex items-center gap-2 text-stone-850 hover:text-stone-950 transition-colors"
                    >
                        <span
                            className={cn(
                                'flex items-center gap-1.5 rounded-lg border px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs shrink-0',
                                colorClass,
                            )}
                        >
                            {CategoryIcon ? <CategoryIcon className="h-3 w-3" /> : null}
                            {categoryTag}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl font-bold tracking-wide text-stone-900 text-left">
                            {label}
                        </h3>
                    </button>
                    <span className="font-sans text-sm text-stone-400 font-semibold shrink-0">
                        {activeCount}/{totalCount} {t('services.visibleCount')}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onAdd(categoryId)}
                        className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-stone-200/40 bg-white hover:border-stone-300 hover:bg-stone-50 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out text-xs font-bold text-stone-700 shadow-sm"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{t('services.addToCategory')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="h-9 w-9 rounded-lg flex items-center justify-center border border-stone-200/40 bg-white hover:border-stone-300 hover:bg-stone-50 hover:scale-105 active:scale-95 text-stone-500 transition-all duration-300 ease-in-out shadow-sm"
                    >
                        {open ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Services List */}
            {open && (
                <div className="flex flex-col">
                    {services.length === 0 ? (
                        <div className="py-8 text-center bg-white rounded-xl border border-stone-200/40">
                            <p className="font-sans text-sm text-stone-400">
                                {t('services.emptyCategory')}
                            </p>
                            <button
                                onClick={() => onAdd(categoryId)}
                                className="mt-2 font-sans text-xs font-bold text-stone-500 hover:text-stone-800 underline underline-offset-2 transition-colors"
                            >
                                {t('services.addFirst')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-1.5 -mx-2">
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
