'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useAdminFormModalLock } from '@hooks/useAdminFormModalLock';
import { Input } from '@components/ui';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';
import type { ServiceDto } from '@typings/service.type';
import type { ServiceCategoryDto } from '@typings/service-category.type';

interface ServiceFormModalProps {
    initial?: ServiceDto | null;
    defaultCategoryId?: string;
    categories: ServiceCategoryDto[];
    onSave: (svc: ServiceDto) => Promise<void>;
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

export function ServiceFormModal({
    initial,
    defaultCategoryId,
    categories,
    onSave,
    onClose,
    isSaving,
}: ServiceFormModalProps) {
    const t = useAdminTranslations();
    const isNew = !initial?.id;
    useAdminFormModalLock();

    const [form, setForm] = useState<ServiceDto>(
        () =>
            initial ?? {
                id: '',
                categoryId: defaultCategoryId ?? categories[0]?.id ?? '',
                name: '',
                description: '',
                price: 0,
                estimatedMinutes: 30,
                visible: true,
                createdAt: '',
                updatedAt: '',
            },
    );

    useEffect(() => {
        setForm(
            initial ?? {
                id: '',
                categoryId: defaultCategoryId ?? categories[0]?.id ?? '',
                name: '',
                description: '',
                price: 0,
                estimatedMinutes: 30,
                visible: true,
                createdAt: '',
                updatedAt: '',
            },
        );
    }, [initial, defaultCategoryId, categories]);

    const patch = (partial: Partial<ServiceDto>) => setForm((f) => ({ ...f, ...partial }));

    const handleSave = async () => {
        if (!form.name.trim()) return;
        await onSave(form);
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-stone-900/40 p-3 backdrop-blur-xs sm:items-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Panel */}
            <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-6 py-5">
                    <div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                            {isNew ? t('services.addTitle') : t('services.editTitle')}
                        </h2>
                        <p className="font-sans text-xs text-stone-500 mt-0.5">
                            {isNew ? t('services.addSubtitle') : t('services.editSubtitle')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8.5 w-8.5 rounded-xl flex items-center justify-center border border-stone-200/80 text-stone-400 hover:text-stone-700 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="min-h-0 flex-1 space-y-4.5 overflow-y-auto p-6">
                    <Field label={t('services.name')}>
                        <Input
                            placeholder="VD: Classic Manicure"
                            value={form.name}
                            onChange={(e) => patch({ name: e.target.value })}
                            className="bg-stone-50/60 border-stone-200/80 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                        />
                    </Field>

                    <Field label={t('services.description')}>
                        <textarea
                            rows={2}
                            placeholder={t('services.descriptionPlaceholder')}
                            value={form.description}
                            onChange={(e) => patch({ description: e.target.value })}
                            className="w-full rounded-xl border border-stone-200/80 bg-stone-50/60 px-3 py-2 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100 focus:outline-none resize-none transition-all"
                        />
                    </Field>

                    <Field label={t('services.category')}>
                        <select
                            value={form.categoryId}
                            onChange={(e) => patch({ categoryId: e.target.value })}
                            className="w-full rounded-xl border border-stone-200/80 bg-stone-50/60 px-3 py-2.5 font-sans text-sm text-stone-900 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 focus:bg-white transition-all cursor-pointer"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label={`${t('services.price')} (USD)`}>
                            <Input
                                type="number"
                                min={0}
                                step={1}
                                value={form.price}
                                onChange={(e) => patch({ price: Number(e.target.value) })}
                                className="bg-stone-50/60 border-stone-200/80 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                            />
                        </Field>
                        <Field label={`${t('services.duration')} (min)`}>
                            <Input
                                type="number"
                                min={5}
                                step={5}
                                value={form.estimatedMinutes}
                                onChange={(e) =>
                                    patch({ estimatedMinutes: Number(e.target.value) })
                                }
                                className="bg-stone-50/60 border-stone-200/80 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                            />
                        </Field>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-stone-50/80 border border-stone-200/70">
                        <div>
                            <p className="font-sans text-sm font-semibold text-stone-800">
                                {t('services.visible')}
                            </p>
                            <p className="font-sans text-xs text-stone-500">
                                {t('services.visibleHint')}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => patch({ visible: !form.visible })}
                            className={cn(
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-3xs',
                                form.visible ? 'bg-stone-900' : 'bg-stone-200',
                            )}
                            role="switch"
                            aria-checked={form.visible}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                                    form.visible ? 'translate-x-5' : 'translate-x-0',
                                )}
                            />
                        </button>
                    </div>
                </div>

                {/* Footer */}
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
                        disabled={!form.name.trim() || isSaving}
                        className="rounded-xl shadow-2xs active:scale-95 transition-all text-xs sm:text-sm font-semibold"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            t('services.save')
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
