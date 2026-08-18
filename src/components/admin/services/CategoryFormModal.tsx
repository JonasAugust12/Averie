'use client';

import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Input } from '@components/ui';
import { Button } from '@components/common';
import { LucideIconPicker } from './LucideIconPicker';
import type { ServiceCategoryDto } from '@typings/service-category.type';
import { useAdminFormModalLock } from '@hooks/useAdminFormModalLock';

interface CategoryFormModalProps {
    initial?: ServiceCategoryDto | null;
    existingIds: string[];
    onSave: (category: ServiceCategoryDto) => Promise<void>;
    onClose: () => void;
    isSaving?: boolean;
}

export function CategoryFormModal({
    initial,
    existingIds,
    onSave,
    onClose,
    isSaving,
}: CategoryFormModalProps) {
    const t = useAdminTranslations();
    const isNew = !initial?.id;
    useAdminFormModalLock();

    const [name, setName] = useState(initial?.name ?? '');
    const [icon, setIcon] = useState<string | null>(initial?.icon ?? 'Sparkles');

    useEffect(() => {
        setName(initial?.name ?? '');
        setIcon(initial?.icon ?? 'Sparkles');
    }, [initial]);

    const handleSave = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        await onSave({
            id: initial?.id ?? '',
            name: trimmed,
            icon,
            sortOrder: initial?.sortOrder ?? existingIds.length,
            createdAt: initial?.createdAt ?? '',
            updatedAt: initial?.updatedAt ?? '',
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-stone-900/40 p-3 backdrop-blur-xs sm:items-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-6 py-5">
                    <div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                            {isNew
                                ? t('services.addCategoryTitle')
                                : t('services.editCategoryTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
                            {isNew
                                ? t('services.addCategorySubtitle')
                                : t('services.editCategorySubtitle')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-stone-200/80 text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-all active:scale-95 cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="min-h-0 flex-1 space-y-4.5 overflow-y-auto p-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                            {t('services.categoryName')}
                        </label>
                        <Input
                            placeholder={t('services.categoryNamePlaceholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-stone-200/80 bg-stone-50/60 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                        />
                    </div>

                    <LucideIconPicker
                        value={icon}
                        onChange={(next) => setIcon(next)}
                        label={t('services.categoryIcon')}
                        searchPlaceholder={t('services.iconSearch')}
                        noneLabel={t('services.iconNone')}
                        selectedLabel={t('services.iconSelected')}
                    />
                </div>

                {/* Modal Footer */}
                <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-stone-100 bg-stone-50/50 px-6 py-4">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        className="rounded-xl border-stone-200/80 bg-white hover:bg-stone-50 active:scale-95 transition-all text-xs sm:text-sm font-semibold text-stone-700"
                    >
                        {t('services.cancel')}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!name.trim() || isSaving}
                        className="rounded-xl shadow-2xs active:scale-95 transition-all text-xs sm:text-sm font-semibold"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            t('services.saveCategory')
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
