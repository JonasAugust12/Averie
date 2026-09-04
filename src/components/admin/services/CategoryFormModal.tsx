'use client';

import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Input } from '@components/ui';
import { Button } from '@components/common';
import { LucideIconPicker } from './LucideIconPicker';
import type { ServiceCategoryDto } from '@typings/service-category.type';
import { useAdminFormModalLock } from '@hooks/useAdminFormModalLock';
import { slugifyCategoryName } from '@utils/service-category.util';

interface CategoryFormModalProps {
    initial?: ServiceCategoryDto | null;
    existingIds: string[];
    onSave: (category: ServiceCategoryDto) => Promise<void>;
    onClose: () => void;
    isSaving?: boolean;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-500">
                {label}
            </label>
            {children}
        </div>
    );
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
    const [slug, setSlug] = useState(initial?.slug ?? '');
    const [subtitle, setSubtitle] = useState(initial?.subtitle ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [note, setNote] = useState(initial?.note ?? '');
    const [featured, setFeatured] = useState(initial?.featured ?? false);
    const [icon, setIcon] = useState<string | null>(initial?.icon ?? 'Sparkles');

    useEffect(() => {
        setName(initial?.name ?? '');
        setSlug(initial?.slug ?? '');
        setSubtitle(initial?.subtitle ?? '');
        setDescription(initial?.description ?? '');
        setNote(initial?.note ?? '');
        setFeatured(initial?.featured ?? false);
        setIcon(initial?.icon ?? 'Sparkles');
    }, [initial]);

    useEffect(() => {
        if (isNew && name.trim() && !slug.trim()) {
            setSlug(slugifyCategoryName(name));
        }
    }, [isNew, name, slug]);

    const handleSave = async () => {
        const trimmed = name.trim();
        const trimmedSlug = slug.trim();
        if (!trimmed || (isNew && !trimmedSlug)) return;

        await onSave({
            id: initial?.id ?? '',
            name: trimmed,
            slug: trimmedSlug || initial?.slug || slugifyCategoryName(trimmed),
            icon,
            subtitle: subtitle.trim(),
            description: description.trim(),
            note: note.trim(),
            featured,
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

                <div className="min-h-0 flex-1 space-y-4.5 overflow-y-auto p-6">
                    <Field label={t('services.categoryName')}>
                        <Input
                            placeholder={t('services.categoryNamePlaceholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-stone-200/80 bg-stone-50/60 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                        />
                    </Field>

                    {isNew ? (
                        <Field label={t('services.categorySlug')}>
                            <Input
                                placeholder={t('services.categorySlugPlaceholder')}
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="border-stone-200/80 bg-stone-50/60 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                            />
                        </Field>
                    ) : (
                        <Field label={t('services.categorySlug')}>
                            <Input
                                value={slug}
                                readOnly
                                className="border-stone-200/80 bg-stone-100/80 rounded-xl text-stone-500"
                            />
                        </Field>
                    )}

                    <Field label={t('services.categorySubtitle')}>
                        <Input
                            placeholder={t('services.categorySubtitlePlaceholder')}
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="border-stone-200/80 bg-stone-50/60 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                        />
                    </Field>

                    <Field label={t('services.categoryDescription')}>
                        <textarea
                            placeholder={t('services.categoryDescriptionPlaceholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-xl border border-stone-200/80 bg-stone-50/60 px-3 py-2.5 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-100"
                        />
                    </Field>

                    <Field label={t('services.categoryNote')}>
                        <textarea
                            placeholder={t('services.categoryNotePlaceholder')}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            className="w-full resize-none rounded-xl border border-stone-200/80 bg-stone-50/60 px-3 py-2.5 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-100"
                        />
                    </Field>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200/80 bg-stone-50/60 px-3 py-2.5">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="size-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
                        />
                        <span className="font-sans text-sm font-medium text-stone-700">
                            {t('services.categoryFeatured')}
                        </span>
                    </label>

                    <LucideIconPicker
                        value={icon}
                        onChange={(next) => setIcon(next)}
                        label={t('services.categoryIcon')}
                        searchPlaceholder={t('services.iconSearch')}
                        noneLabel={t('services.iconNone')}
                        selectedLabel={t('services.iconSelected')}
                    />
                </div>

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
                        disabled={!name.trim() || (isNew && !slug.trim()) || isSaving}
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
