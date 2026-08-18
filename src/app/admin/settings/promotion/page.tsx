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
import { PromotionSettingsSkeleton } from '@components/skeletons';
import { Button } from '@components/common';
import { Input } from '@components/ui';
import { cn } from '@utils/cn.util';
import { toastSuccess } from '@utils/toast.util';
import type { PromotionSettingsDto } from '@typings/promotion-settings.type';
import type { UpdatePromotionSettingsInput } from '@validations/promotion-settings.schema';

function buildSavePayload(
    form: PromotionSettingsDto,
    patch: Partial<UpdatePromotionSettingsInput> = {},
): UpdatePromotionSettingsInput {
    return {
        enabled: patch.enabled ?? form.enabled,
        title: patch.title ?? form.title,
        description: patch.description ?? form.description,
        startDate: patch.startDate !== undefined ? patch.startDate : form.startDate,
        endDate: patch.endDate !== undefined ? patch.endDate : form.endDate,
        hideAfterExpiry: patch.hideAfterExpiry ?? form.hideAfterExpiry,
        showBeforeStartDate: patch.showBeforeStartDate ?? form.showBeforeStartDate,
    };
}

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
        return <PromotionSettingsSkeleton />;
    }

    const isSaving = saveSettings.isPending;

    function updateForm(patch: Partial<PromotionSettingsDto>) {
        setForm((prev) => (prev ? { ...prev, ...patch } : prev));
    }

    async function persistSettings(
        payload: UpdatePromotionSettingsInput,
        successMessage: string,
    ): Promise<void> {
        const updated = await saveSettings.mutateAsync(payload);
        setForm(structuredClone(updated));
        toastSuccess(successMessage);
    }

    function runConfirmAction(options: {
        title: string;
        message: string;
        confirmText: string;
        type?: 'info' | 'danger';
        action: () => Promise<void>;
    }) {
        showConfirm({
            title: options.title,
            message: options.message,
            confirmText: options.confirmText,
            cancelText: t('promotion.confirmCancelBtn'),
            type: options.type ?? 'info',
            onConfirm: async () => {
                setConfirmLoading(true);
                try {
                    await options.action();
                    hideConfirm();
                } catch (error) {
                    console.error(error);
                } finally {
                    setConfirmLoading(false);
                }
            },
        });
    }

    function handleToggleEnabled() {
        if (isSaving || !form) return;
        const nextEnabled = !form.enabled;

        runConfirmAction({
            title: nextEnabled
                ? t('promotion.confirmEnableTitle')
                : t('promotion.confirmDisableTitle'),
            message: nextEnabled
                ? t('promotion.confirmEnableMsg')
                : t('promotion.confirmDisableMsg'),
            confirmText: t('promotion.confirmSaveBtn'),
            action: async () => {
                if (!form) return;
                await persistSettings(
                    buildSavePayload(form, { enabled: nextEnabled }),
                    nextEnabled ? t('toasts.promotionEnabled') : t('toasts.promotionDisabled'),
                );
            },
        });
    }

    function handleToggleHideAfterExpiry() {
        if (isSaving || !form) return;
        const nextHideAfterExpiry = !form.hideAfterExpiry;

        runConfirmAction({
            title: nextHideAfterExpiry
                ? t('promotion.confirmHideAfterExpiryOnTitle')
                : t('promotion.confirmHideAfterExpiryOffTitle'),
            message: nextHideAfterExpiry
                ? t('promotion.confirmHideAfterExpiryOnMsg')
                : t('promotion.confirmHideAfterExpiryOffMsg'),
            confirmText: t('promotion.confirmSaveBtn'),
            action: async () => {
                if (!form) return;
                await persistSettings(
                    buildSavePayload(form, { hideAfterExpiry: nextHideAfterExpiry }),
                    t('toasts.promotionSaved'),
                );
            },
        });
    }

    function handleToggleShowBeforeStartDate() {
        if (isSaving || !form) return;
        const nextShowBeforeStartDate = !form.showBeforeStartDate;

        runConfirmAction({
            title: nextShowBeforeStartDate
                ? t('promotion.confirmShowBeforeStartOnTitle')
                : t('promotion.confirmShowBeforeStartOffTitle'),
            message: nextShowBeforeStartDate
                ? t('promotion.confirmShowBeforeStartOnMsg')
                : t('promotion.confirmShowBeforeStartOffMsg'),
            confirmText: t('promotion.confirmSaveBtn'),
            action: async () => {
                if (!form) return;
                await persistSettings(
                    buildSavePayload(form, { showBeforeStartDate: nextShowBeforeStartDate }),
                    t('toasts.promotionSaved'),
                );
            },
        });
    }

    function handleSave() {
        if (isSaving || !form) return;
        const payload = buildSavePayload(form);

        runConfirmAction({
            title: t('promotion.confirmSaveTitle'),
            message: t('promotion.confirmSaveMsg'),
            confirmText: t('promotion.confirmSaveBtn'),
            action: async () => {
                await persistSettings(payload, t('toasts.promotionSaved'));
            },
        });
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || uploadImage.isPending) return;

        runConfirmAction({
            title: t('promotion.confirmUploadImageTitle'),
            message: t('promotion.confirmUploadImageMsg', { name: file.name }),
            confirmText: t('promotion.uploadImage'),
            action: async () => {
                const formData = new FormData();
                formData.set('file', file);
                const updated = await uploadImage.mutateAsync(formData);
                setForm(structuredClone(updated));
                toastSuccess(t('toasts.promotionImageUploaded'));
            },
        });
    }

    function handleRemoveImage() {
        if (removeImage.isPending) return;

        runConfirmAction({
            title: t('promotion.confirmRemoveImageTitle'),
            message: t('promotion.confirmRemoveImageMsg'),
            confirmText: t('promotion.confirmRemoveImageBtn'),
            type: 'danger',
            action: async () => {
                const updated = await removeImage.mutateAsync();
                setForm(structuredClone(updated));
                toastSuccess(t('toasts.promotionImageRemoved'));
            },
        });
    }

    function renderToggle(options: {
        checked: boolean;
        onToggle: () => void;
        disabled?: boolean;
        loading?: boolean;
        ariaLabel: string;
    }) {
        return (
            <button
                type="button"
                onClick={options.onToggle}
                disabled={options.disabled}
                className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden active:scale-95 disabled:cursor-not-allowed disabled:opacity-60',
                    options.checked ? 'bg-stone-900' : 'bg-stone-200',
                )}
                role="switch"
                aria-checked={options.checked}
                aria-label={options.ariaLabel}
            >
                {options.loading ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    </span>
                ) : (
                    <span
                        className={cn(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5',
                            options.checked ? 'translate-x-5.5' : 'translate-x-0.5',
                        )}
                    />
                )}
            </button>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900">
                    {t('promotion.pageTitle') || 'Promotions & Banner'}
                </h1>
                <p className="mt-1 font-sans text-xs text-stone-500">
                    {t('promotion.subtitle') ||
                        'Configure promotional banners and special discounts displayed on the client site'}
                </p>
            </div>

            {/* Toggle Card */}
            <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 md:p-8 shadow-2xs backdrop-blur-xs transition-all duration-300">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="font-display text-base font-bold text-stone-900">
                            {t('promotion.enabledLabel') || 'Enable Promotion Banner'}
                        </h2>
                        <p className="max-w-xl font-sans text-xs text-stone-500 leading-relaxed">
                            {t('promotion.enabledHint') ||
                                'When enabled, the banner and promo details will be shown to visitors'}
                        </p>
                    </div>
                    {renderToggle({
                        checked: form.enabled,
                        onToggle: handleToggleEnabled,
                        disabled: isSaving || uploadImage.isPending || removeImage.isPending,
                        loading: isSaving,
                        ariaLabel: t('promotion.enabledLabel') || 'Enable Promotion Banner',
                    })}
                </div>
            </section>

            {/* Promotion Details */}
            <section className="space-y-6 rounded-3xl border border-stone-200/80 bg-white/90 p-6 md:p-8 shadow-2xs backdrop-blur-xs">
                <div>
                    <h2 className="font-display text-lg font-bold text-stone-900">
                        {t('promotion.contentTitle') || 'Promotion Content'}
                    </h2>
                    <p className="mt-0.5 font-sans text-xs text-stone-500">
                        Customize the text and scheduled timeframe for the promotion
                    </p>
                </div>

                <div className="space-y-1.5">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                        {t('promotion.titleLabel') || 'Title'}
                    </label>
                    <Input
                        value={form.title}
                        onChange={(event) => updateForm({ title: event.target.value })}
                        placeholder={
                            t('promotion.titlePlaceholder') || 'e.g. Summer Special 20% Off'
                        }
                        maxLength={120}
                        disabled={isSaving}
                        className="rounded-xl border-stone-200/80 bg-stone-50/70 focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                        {t('promotion.descriptionLabel') || 'Description'}
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(event) => updateForm({ description: event.target.value })}
                        placeholder={
                            t('promotion.descriptionPlaceholder') || 'Enter promo terms or details…'
                        }
                        maxLength={500}
                        rows={4}
                        disabled={isSaving}
                        className="w-full rounded-xl border border-stone-200/80 bg-stone-50/70 p-3.5 font-sans text-sm text-stone-900 outline-hidden transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('promotion.startDateLabel') || 'Start Date'}
                        </label>
                        <Input
                            type="date"
                            value={form.startDate ?? ''}
                            onChange={(event) =>
                                updateForm({
                                    startDate: event.target.value || null,
                                })
                            }
                            disabled={isSaving}
                            className="rounded-xl border-stone-200/80 bg-stone-50/70 focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all"
                        />
                        <p className="font-sans text-[11px] text-stone-400">
                            {t('promotion.optionalDateHint') ||
                                'Leave blank for no start restriction'}
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('promotion.endDateLabel') || 'End Date'}
                        </label>
                        <Input
                            type="date"
                            value={form.endDate ?? ''}
                            onChange={(event) =>
                                updateForm({
                                    endDate: event.target.value || null,
                                })
                            }
                            disabled={isSaving}
                            className="rounded-xl border-stone-200/80 bg-stone-50/70 focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all"
                        />
                        <p className="font-sans text-[11px] text-stone-400">
                            {t('promotion.optionalDateHint') ||
                                'Leave blank for no expiration date'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-0.5">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                            {t('promotion.showBeforeStartDateLabel') || 'Show Before Start Date'}
                        </h3>
                        <p className="max-w-xl font-sans text-xs text-stone-500">
                            {t('promotion.showBeforeStartDateHint') ||
                                'Display an upcoming teaser banner before the start date begins'}
                        </p>
                    </div>
                    {renderToggle({
                        checked: form.showBeforeStartDate,
                        onToggle: handleToggleShowBeforeStartDate,
                        disabled: isSaving || uploadImage.isPending || removeImage.isPending,
                        loading: isSaving,
                        ariaLabel:
                            t('promotion.showBeforeStartDateLabel') || 'Show Before Start Date',
                    })}
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-0.5">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                            {t('promotion.hideAfterExpiryLabel') || 'Hide After Expiry'}
                        </h3>
                        <p className="max-w-xl font-sans text-xs text-stone-500">
                            {t('promotion.hideAfterExpiryHint') ||
                                'Automatically hide promotion once the end date passes'}
                        </p>
                    </div>
                    {renderToggle({
                        checked: form.hideAfterExpiry,
                        onToggle: handleToggleHideAfterExpiry,
                        disabled: isSaving || uploadImage.isPending || removeImage.isPending,
                        loading: isSaving,
                        ariaLabel: t('promotion.hideAfterExpiryLabel') || 'Hide After Expiry',
                    })}
                </div>

                <div>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || uploadImage.isPending}
                        className="rounded-full bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider shadow-xs active:scale-98 transition-all"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('promotion.saving') || 'Saving…'}
                            </>
                        ) : (
                            t('promotion.save') || 'Save Changes'
                        )}
                    </Button>
                </div>
            </section>

            {/* Banner Image Card */}
            <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 shadow-2xs backdrop-blur-xs">
                <div className="border-b border-stone-100/80 bg-linear-to-r from-stone-50/80 to-stone-100/40 px-6 py-5">
                    <div className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-2xs">
                            <Megaphone className="h-5 w-5 text-sand-300" />
                        </span>
                        <div>
                            <h2 className="font-display text-lg font-bold text-stone-900">
                                {t('promotion.imageTitle') || 'Promotion Banner Image'}
                            </h2>
                            <p className="mt-0.5 font-sans text-xs text-stone-500">
                                {t('promotion.imageHint') ||
                                    'Upload a high-quality banner image (recommended 16:9 ratio, JPG/PNG/WebP)'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-6 md:p-8">
                    {form.imageUrl ? (
                        <div className="relative mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50/80 p-2 shadow-2xs">
                            <Image
                                src={form.imageUrl}
                                alt={
                                    form.title ||
                                    t('promotion.imagePreviewAlt') ||
                                    'Promotion preview'
                                }
                                fill
                                className="object-contain p-1"
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </div>
                    ) : (
                        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200/80 bg-stone-50/50 px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-2xs border border-stone-200/60">
                                <ImageIcon className="h-6 w-6 text-stone-400" />
                            </div>
                            <p className="mt-3 font-sans text-xs font-semibold text-stone-600">
                                {t('promotion.noImage') || 'No promotion banner uploaded'}
                            </p>
                            <p className="mt-0.5 font-sans text-[11px] text-stone-400">
                                Upload an image to make your promotion stand out
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

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadImage.isPending || isSaving}
                            className="rounded-full bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider shadow-xs active:scale-98 transition-all"
                        >
                            {uploadImage.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('promotion.uploading') || 'Uploading…'}
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    {form.imageUrl
                                        ? t('promotion.replaceImage') || 'Replace Image'
                                        : t('promotion.uploadImage') || 'Upload Image'}
                                </>
                            )}
                        </Button>

                        {form.imageUrl ? (
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleRemoveImage}
                                disabled={removeImage.isPending || isSaving}
                                className="rounded-full border-rose-200 bg-rose-50/50 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-100/70 hover:border-rose-300 shadow-2xs active:scale-98 transition-all"
                            >
                                {removeImage.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('promotion.removingImage') || 'Removing…'}
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {t('promotion.removeImage') || 'Remove Image'}
                                    </>
                                )}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    );
}
