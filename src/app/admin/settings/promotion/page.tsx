'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Loader2, Megaphone, Trash2, Upload } from 'lucide-react';
import {
    usePromotionSettings,
    useRemovePromotionImage,
    useUpdatePromotionSettings,
    useUploadPromotionImage,
} from '@services/promotion.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useUIStore } from '@stores/ui.store';
import { Button } from '@components/common';
import { Input } from '@components/ui';
import { cn } from '@utils/cn.util';
import { toastSuccess } from '@utils/toast.util';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';

export default function PromotionSettingsPage() {
    const t = useAdminTranslations();
    const { data: settings, isLoading } = usePromotionSettings();
    const saveSettings = useUpdatePromotionSettings();
    const uploadImage = useUploadPromotionImage();
    const removeImage = useRemovePromotionImage();
    const { showConfirm, hideConfirm, setConfirmLoading } = useUIStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<PromotionSettingsDto | null>(null);

    useEffect(() => {
        if (!settings) return;
        setForm(structuredClone(settings));
    }, [settings]);

    if (isLoading || !form) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            </div>
        );
    }

    function updateForm(patch: Partial<PromotionSettingsDto>) {
        setForm((prev) => (prev ? { ...prev, ...patch } : prev));
    }

    async function handleSave() {
        if (!form) return;
        const payload = {
            enabled: form.enabled,
            title: form.title,
            description: form.description,
            startDate: form.startDate,
            endDate: form.endDate,
            hideAfterExpiry: form.hideAfterExpiry,
        };

        showConfirm({
            title: t('promotion.confirmSaveTitle'),
            message: t('promotion.confirmSaveMsg'),
            confirmText: t('promotion.confirmSaveBtn'),
            cancelText: t('promotion.confirmCancelBtn'),
            type: 'info',
            onConfirm: async () => {
                setConfirmLoading(true);
                try {
                    await saveSettings.mutateAsync(payload);
                    toastSuccess(t('toasts.promotionSaved'));
                    hideConfirm();
                } finally {
                    setConfirmLoading(false);
                }
            },
        });
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.set('file', file);
        await uploadImage.mutateAsync(formData);
        toastSuccess(t('toasts.promotionImageUploaded'));
        event.target.value = '';
    }

    async function handleRemoveImage() {
        showConfirm({
            title: t('promotion.confirmRemoveImageTitle'),
            message: t('promotion.confirmRemoveImageMsg'),
            confirmText: t('promotion.confirmRemoveImageBtn'),
            cancelText: t('promotion.confirmCancelBtn'),
            type: 'danger',
            onConfirm: async () => {
                setConfirmLoading(true);
                try {
                    await removeImage.mutateAsync();
                    toastSuccess(t('toasts.promotionImageRemoved'));
                    hideConfirm();
                } finally {
                    setConfirmLoading(false);
                }
            },
        });
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="font-display text-2xl font-semibold text-stone-900">
                    {t('promotion.pageTitle')}
                </h1>
                <p className="mt-1 font-sans text-sm text-stone-500">{t('promotion.subtitle')}</p>
            </header>

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="font-display text-lg font-bold text-stone-900">
                            {t('promotion.enabledLabel')}
                        </h2>
                        <p className="font-sans text-xs text-stone-400 max-w-xl">
                            {t('promotion.enabledHint')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => updateForm({ enabled: !form.enabled })}
                        className={cn(
                            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-hidden hover:scale-105 active:scale-95',
                            form.enabled ? 'bg-stone-800' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={form.enabled}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5',
                                form.enabled ? 'translate-x-6' : 'translate-x-0.5',
                            )}
                        />
                    </button>
                </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-bold text-stone-900">
                    {t('promotion.contentTitle')}
                </h2>

                <div className="space-y-1.5">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                        {t('promotion.titleLabel')}
                    </label>
                    <Input
                        value={form.title}
                        onChange={(event) => updateForm({ title: event.target.value })}
                        placeholder={t('promotion.titlePlaceholder')}
                        maxLength={120}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                        {t('promotion.descriptionLabel')}
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(event) => updateForm({ description: event.target.value })}
                        placeholder={t('promotion.descriptionPlaceholder')}
                        maxLength={500}
                        rows={4}
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-sans text-sm text-stone-900 outline-hidden transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('promotion.startDateLabel')}
                        </label>
                        <Input
                            type="date"
                            value={form.startDate ?? ''}
                            onChange={(event) =>
                                updateForm({
                                    startDate: event.target.value || null,
                                })
                            }
                        />
                        <p className="font-sans text-xs text-stone-400">
                            {t('promotion.optionalDateHint')}
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('promotion.endDateLabel')}
                        </label>
                        <Input
                            type="date"
                            value={form.endDate ?? ''}
                            onChange={(event) =>
                                updateForm({
                                    endDate: event.target.value || null,
                                })
                            }
                        />
                        <p className="font-sans text-xs text-stone-400">
                            {t('promotion.optionalDateHint')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-stone-100 bg-stone-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h3 className="font-display text-sm font-bold text-stone-900">
                            {t('promotion.hideAfterExpiryLabel')}
                        </h3>
                        <p className="font-sans text-xs text-stone-400 max-w-xl">
                            {t('promotion.hideAfterExpiryHint')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => updateForm({ hideAfterExpiry: !form.hideAfterExpiry })}
                        className={cn(
                            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-hidden hover:scale-105 active:scale-95',
                            form.hideAfterExpiry ? 'bg-stone-800' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={form.hideAfterExpiry}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5',
                                form.hideAfterExpiry ? 'translate-x-6' : 'translate-x-0.5',
                            )}
                        />
                    </button>
                </div>

                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={saveSettings.isPending}
                    className="w-full sm:w-auto"
                >
                    {saveSettings.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('promotion.saving')}
                        </>
                    ) : (
                        t('promotion.save')
                    )}
                </Button>
            </section>

            <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                <div className="border-b border-stone-100 bg-linear-to-r from-stone-50 to-secondary-50/40 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
                            <Megaphone className="h-5 w-5" />
                        </span>
                        <div>
                            <h2 className="font-display text-xl font-semibold text-stone-900">
                                {t('promotion.imageTitle')}
                            </h2>
                            <p className="mt-0.5 font-sans text-sm text-stone-500">
                                {t('promotion.imageHint')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-6">
                    {form.imageUrl ? (
                        <div className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                            <Image
                                src={form.imageUrl}
                                alt={form.title || t('promotion.imagePreviewAlt')}
                                fill
                                className="object-contain"
                                sizes="400px"
                            />
                        </div>
                    ) : (
                        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/80 px-6 py-10 text-center">
                            <ImageIcon className="h-10 w-10 text-stone-300" />
                            <p className="mt-3 font-sans text-sm text-stone-500">
                                {t('promotion.noImage')}
                            </p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadImage.isPending}
                        >
                            {uploadImage.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('promotion.uploading')}
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    {form.imageUrl
                                        ? t('promotion.replaceImage')
                                        : t('promotion.uploadImage')}
                                </>
                            )}
                        </Button>

                        {form.imageUrl ? (
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleRemoveImage}
                                disabled={removeImage.isPending}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('promotion.removeImage')}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    );
}
