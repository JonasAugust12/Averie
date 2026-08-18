'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, FolderPlus } from 'lucide-react';
import {
    useAllServices,
    useServiceCategories,
    useCreateService,
    useUpdateService,
    useDeleteService,
    useToggleServiceVisibility,
    useCreateServiceCategory,
    useUpdateServiceCategory,
} from '@services/service-catalog.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { ServicesGridSkeleton } from '@components/skeletons';
import { useUIStore } from '@stores/ui.store';
import {
    ServiceFormModal,
    ServiceCategorySection,
    CategoryFormModal,
} from '@components/admin/services';
import type { ServiceDto } from '@typings/service.type';
import type { ServiceCategoryDto } from '@typings/service-category.type';

export default function AdminServicesPage() {
    const t = useAdminTranslations();

    const { data: services, isLoading } = useAllServices();
    const { data: categories } = useServiceCategories();
    const createService = useCreateService();
    const updateService = useUpdateService();
    const deleteService = useDeleteService();
    const toggleVisibility = useToggleServiceVisibility();
    const createCategory = useCreateServiceCategory();
    const updateCategory = useUpdateServiceCategory();
    const { showConfirm, hideConfirm } = useUIStore();

    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState<ServiceDto | null | 'new'>(null);
    const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>();
    const [categoryModal, setCategoryModal] = useState<ServiceCategoryDto | null | 'new'>(null);

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

    const totalVisible = (services ?? []).filter((s) => s.visible).length;
    const totalAll = (services ?? []).length;

    function openAdd(categoryId?: string) {
        setDefaultCategoryId(categoryId);
        setEditing('new');
    }

    function openEdit(svc: ServiceDto) {
        setDefaultCategoryId(undefined);
        setEditing(svc);
    }

    async function handleSave(svc: ServiceDto) {
        if (editing === 'new' || !svc.id) {
            await createService.mutateAsync({
                categoryId: svc.categoryId,
                name: svc.name,
                description: svc.description,
                price: svc.price,
                estimatedMinutes: svc.estimatedMinutes,
                visible: svc.visible,
            });
        } else {
            await updateService.mutateAsync({
                id: svc.id,
                input: {
                    categoryId: svc.categoryId,
                    name: svc.name,
                    description: svc.description,
                    price: svc.price,
                    estimatedMinutes: svc.estimatedMinutes,
                    visible: svc.visible,
                },
            });
        }
        setEditing(null);
    }

    async function handleSaveCategory(category: ServiceCategoryDto) {
        if (categoryModal === 'new' || !category.id) {
            await createCategory.mutateAsync({
                name: category.name,
                sortOrder: category.sortOrder,
                icon: category.icon ?? undefined,
            });
        } else {
            await updateCategory.mutateAsync({
                id: category.id,
                input: {
                    name: category.name,
                    sortOrder: category.sortOrder,
                    icon: category.icon,
                },
            });
        }
        setCategoryModal(null);
    }

    function handleToggle(svc: ServiceDto) {
        showConfirm({
            title: svc.visible
                ? t('services.confirmHideTitle') || 'Hide service'
                : t('services.confirmShowTitle') || 'Show service',
            message: `"${svc.name}"`,
            confirmText: t('services.save') || 'Confirm',
            cancelText: t('services.cancel') || 'Cancel',
            type: 'info',
            onConfirm: async () => {
                await toggleVisibility.mutateAsync({ id: svc.id, visible: !svc.visible });
                hideConfirm();
            },
        });
    }

    function handleDelete(svc: ServiceDto) {
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
        return <ServicesGridSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                        {t('services.title')}
                    </h1>
                    <p className="mt-1 font-sans text-sm text-stone-500">
                        {t('services.subtitle')} —{' '}
                        <span className="font-semibold text-stone-700">
                            {totalVisible}/{totalAll}
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
            </div>

            <div className="space-y-4">
                {grouped.map(({ cat, items }) => (
                    <ServiceCategorySection
                        key={cat.id}
                        categoryId={cat.id}
                        label={cat.name}
                        icon={cat.icon}
                        services={items}
                        onAdd={openAdd}
                        onEdit={openEdit}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {editing !== null && (
                <ServiceFormModal
                    initial={editing === 'new' ? null : editing}
                    defaultCategoryId={defaultCategoryId}
                    categories={categories ?? []}
                    onSave={handleSave}
                    onClose={() => setEditing(null)}
                    isSaving={createService.isPending || updateService.isPending}
                />
            )}

            {categoryModal !== null && (
                <CategoryFormModal
                    initial={categoryModal === 'new' ? null : categoryModal}
                    existingIds={(categories ?? []).map((c) => c.id)}
                    onSave={handleSaveCategory}
                    onClose={() => setCategoryModal(null)}
                    isSaving={createCategory.isPending || updateCategory.isPending}
                />
            )}
        </div>
    );
}
