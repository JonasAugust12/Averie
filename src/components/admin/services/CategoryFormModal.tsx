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
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/20 p-3 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-5">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-stone-900">
                            {isNew
                                ? t('services.addCategoryTitle')
                                : t('services.editCategoryTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-400">
                            {isNew
                                ? t('services.addCategorySubtitle')
                                : t('services.editCategorySubtitle')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-100 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-stone-50 active:scale-95"
                    >
                        <X className="h-4 w-4 text-stone-400" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                            {t('services.categoryName')}
                        </label>
                        <Input
                            placeholder={t('services.categoryNamePlaceholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-neutral-200 bg-stone-50 focus:bg-white"
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

                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-neutral-100 bg-stone-50/50 px-6 py-4">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        className="border-neutral-200 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                    >
                        {t('services.cancel')}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!name.trim() || isSaving}
                        className="transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
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
