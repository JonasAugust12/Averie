'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Loader2, FolderPlus } from 'lucide-react';
import {
    useAllSalonServices,
    useSaveMockService,
    useDeleteMockService,
    useSalonCategories,
    useSaveMockCategory,
} from '@services/salon.service';
import { useAdminTranslations, useBookingTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { useUIStore } from '@stores/ui.store';
import {
    ServiceFormModal,
    ServiceCategorySection,
    CategoryFormModal,
} from '@components/admin/services';
import type { SalonService, SalonServiceCategory, ServiceCategoryId } from '@typings/salon.type';

export default function AdminServicesPage() {
    const t = useAdminTranslations();
    const bt = useBookingTranslations();

    const { data: services, isLoading } = useAllSalonServices();
    const { data: categories } = useSalonCategories();
    const saveService = useSaveMockService();
    const deleteService = useDeleteMockService();
    const saveCategory = useSaveMockCategory();
    const { showConfirm, hideConfirm } = useUIStore();

    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState<SalonService | null | 'new'>(null);
    const [defaultCategoryId, setDefaultCategoryId] = useState<ServiceCategoryId | undefined>();
    const [categoryModal, setCategoryModal] = useState<SalonServiceCategory | null | 'new'>(null);

    // Group by category, filtered by search
    const grouped = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? (services ?? []).filter(
                  (s) =>
                      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
              )
            : (services ?? []);

        return (categories ?? []).map((cat) => ({
            cat,
            items: list.filter((s) => s.categoryId === cat.id),
        }));
    }, [services, query, categories]);

    const totalActive = (services ?? []).filter((s) => s.active).length;
    const totalAll = (services ?? []).length;

    // Handlers
    function openAdd(categoryId?: ServiceCategoryId) {
        setDefaultCategoryId(categoryId);
        setEditing('new');
    }

    function openEdit(svc: SalonService) {
        setDefaultCategoryId(undefined);
        setEditing(svc);
    }

    async function handleSave(svc: SalonService) {
        await saveService.mutateAsync(svc);
        setEditing(null);
    }

    async function handleSaveCategory(category: SalonServiceCategory) {
        await saveCategory.mutateAsync(category);
        setCategoryModal(null);
    }

    async function handleToggle(svc: SalonService) {
        await saveService.mutateAsync({ ...svc, active: !svc.active });
    }

    function handleDelete(svc: SalonService) {
        showConfirm({
            title: t('services.confirmDeleteTitle') || 'Xóa dịch vụ',
            message: `${t('services.confirmDeleteDesc') || 'Bạn có chắc muốn xóa'} "${svc.name}"?`,
            confirmText: t('services.delete') || 'Xóa',
            cancelText: t('services.cancel') || 'Hủy',
            type: 'danger',
            onConfirm: async () => {
                await deleteService.mutateAsync(svc.id);
                hideConfirm();
            },
        });
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                        {t('services.title')}
                    </h1>
                    <p className="mt-1 font-sans text-sm text-stone-500">
                        {t('services.subtitle')} —{' '}
                        <span className="font-semibold text-stone-700">
                            {totalActive}/{totalAll}
                        </span>{' '}
                        {t('services.visibleCount')}
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <Button
                        variant="outlined"
                        onClick={() => setCategoryModal('new')}
                        className="flex items-center gap-2 tracking-wide shadow-xs transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                    >
                        <FolderPlus className="h-4 w-4" />
                        {t('services.addCategory')}
                    </Button>
                    <Button
                        onClick={() => openAdd()}
                        className="flex items-center gap-2 tracking-wide shadow-xs transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        {t('services.add')}
                    </Button>
                </div>
            </div>

            {/* Search/Filter Bar */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/60 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-xl">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 font-bold" />
                    <input
                        type="text"
                        placeholder={t('services.search') || 'Search by service...'}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full bg-stone-50/50 hover:bg-stone-50 focus:bg-white rounded-xl border border-stone-200/80 focus:border-stone-300 focus:ring-2 focus:ring-stone-100 transition-all font-sans text-sm outline-none placeholder:text-stone-400 text-stone-800"
                    />
                </div>
                <div className="text-xs font-semibold text-stone-500 hidden md:block pr-2">
                    💡{' '}
                    {t('services.searchTip') ||
                        'Type a service name or description to filter instantly.'}
                </div>
            </div>

            {/* Category sections */}
            <div className="space-y-4">
                {grouped.map(({ cat, items }) => (
                    <ServiceCategorySection
                        key={cat.id}
                        categoryId={cat.id}
                        label={
                            cat.labelKey
                                ? bt(cat.labelKey as 'categories.manicurePedicure')
                                : cat.name
                        }
                        icon={cat.icon}
                        services={items}
                        onAdd={openAdd}
                        onEdit={openEdit}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Form Modal */}
            {editing !== null && (
                <ServiceFormModal
                    initial={editing === 'new' ? null : editing}
                    defaultCategoryId={defaultCategoryId}
                    onSave={handleSave}
                    onClose={() => setEditing(null)}
                    isSaving={saveService.isPending}
                />
            )}

            {categoryModal !== null && (
                <CategoryFormModal
                    initial={categoryModal === 'new' ? null : categoryModal}
                    existingIds={(categories ?? []).map((c) => c.id)}
                    onSave={handleSaveCategory}
                    onClose={() => setCategoryModal(null)}
                    isSaving={saveCategory.isPending}
                />
            )}
        </div>
    );
}
