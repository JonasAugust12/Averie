'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, FolderPlus, X } from 'lucide-react';
import {
    useAllServices,
    useServiceCategories,
    useCreateService,
    useUpdateService,
    useDeleteService,
    useToggleServiceVisibility,
    useCreateServiceCategory,
    useUpdateServiceCategory,
    useDeleteServiceCategory,
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
import { toastSuccess } from '@utils/toast.util';
import { cn } from '@utils/cn.util';

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
    const deleteCategory = useDeleteServiceCategory();
    const { showConfirm, hideConfirm } = useUIStore();

    const [query, setQuery] = useState('');
    const [selectedCatId, setSelectedCatId] = useState<string | 'all'>('all');
    const [editing, setEditing] = useState<ServiceDto | null | 'new'>(null);
    const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>();
    const [categoryModal, setCategoryModal] = useState<ServiceCategoryDto | null | 'new'>(null);

    const filteredCategories = useMemo(() => {
        if (selectedCatId === 'all') return categories ?? [];
        return (categories ?? []).filter((c) => c.id === selectedCatId);
    }, [categories, selectedCatId]);

    const grouped = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? (services ?? []).filter(
                  (s) =>
                      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
              )
            : (services ?? []);

        return filteredCategories.map((cat) => ({
            cat,
            items: list.filter((s) => s.categoryId === cat.id),
        }));
    }, [services, query, filteredCategories]);

    const totalVisible = (services ?? []).filter((s) => s.visible).length;
    const totalAll = (services ?? []).length;
    const totalMatched = grouped.reduce((sum, g) => sum + g.items.length, 0);

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
            toastSuccess(t('toasts.serviceCreated'));
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
            toastSuccess(t('toasts.serviceUpdated'));
        }
        setEditing(null);
    }

    async function handleSaveCategory(category: ServiceCategoryDto) {
        if (categoryModal === 'new' || !category.id) {
            await createCategory.mutateAsync({
                name: category.name,
                slug: category.slug,
                sortOrder: category.sortOrder,
                icon: category.icon ?? undefined,
                subtitle: category.subtitle || undefined,
                description: category.description || undefined,
                note: category.note || undefined,
                featured: category.featured,
            });
            toastSuccess(t('toasts.categoryCreated'));
        } else {
            await updateCategory.mutateAsync({
                id: category.id,
                input: {
                    name: category.name,
                    sortOrder: category.sortOrder,
                    icon: category.icon,
                    subtitle: category.subtitle,
                    description: category.description,
                    note: category.note,
                    featured: category.featured,
                },
            });
            toastSuccess(t('toasts.categoryUpdated'));
        }
        setCategoryModal(null);
    }

    function handleToggle(svc: ServiceDto) {
        const hiding = svc.visible;
        showConfirm({
            title: hiding ? t('services.confirmHideTitle') : t('services.confirmShowTitle'),
            message: hiding
                ? t('services.confirmHideMsg', { name: svc.name })
                : t('services.confirmShowMsg', { name: svc.name }),
            confirmText: hiding ? t('services.confirmHideBtn') : t('services.confirmShowBtn'),
            cancelText: t('services.cancel'),
            type: 'info',
            onConfirm: async () => {
                await toggleVisibility.mutateAsync({ id: svc.id, visible: !svc.visible });
                toastSuccess(hiding ? t('toasts.serviceHidden') : t('toasts.serviceShown'));
                hideConfirm();
            },
        });
    }

    function handleDelete(svc: ServiceDto) {
        showConfirm({
            title: t('services.confirmDeleteTitle'),
            message: t('services.confirmDeleteMsg', { name: svc.name }),
            confirmText: t('services.delete'),
            cancelText: t('services.cancel'),
            type: 'danger',
            onConfirm: async () => {
                await deleteService.mutateAsync(svc.id);
                toastSuccess(t('toasts.serviceDeleted'));
                hideConfirm();
            },
        });
    }

    function openEditCategory(cat: ServiceCategoryDto) {
        setCategoryModal(cat);
    }

    function handleDeleteCategory(cat: ServiceCategoryDto) {
        const serviceCount = (services ?? []).filter((s) => s.categoryId === cat.id).length;

        if (serviceCount > 0) {
            showConfirm({
                title: t('services.confirmDeleteCategoryBlockedTitle'),
                message: t('services.confirmDeleteCategoryBlockedMsg', {
                    name: cat.name,
                    count: serviceCount,
                }),
                confirmText: t('services.confirmDeleteCategoryBlockedBtn'),
                cancelText: t('services.cancel'),
                type: 'info',
                onConfirm: hideConfirm,
            });
            return;
        }

        showConfirm({
            title: t('services.confirmDeleteCategoryTitle'),
            message: t('services.confirmDeleteCategoryMsg', { name: cat.name }),
            confirmText: t('services.delete'),
            cancelText: t('services.cancel'),
            type: 'danger',
            onConfirm: async () => {
                await deleteCategory.mutateAsync(cat.id);
                toastSuccess(t('toasts.categoryDeleted'));
                hideConfirm();
            },
        });
    }

    if (isLoading) {
        return <ServicesGridSkeleton />;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                        {t('services.title')}
                    </h1>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <span className="font-sans text-sm text-stone-500">
                            {t('services.subtitle')}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200/80 text-xs font-semibold text-stone-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {totalVisible}/{totalAll} {t('services.visibleCount')}
                        </span>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={() => setCategoryModal('new')}
                        className="flex items-center gap-2 rounded-xl border-stone-200/80 bg-white shadow-2xs hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all text-xs sm:text-sm font-semibold text-stone-700"
                    >
                        <FolderPlus className="h-4 w-4 text-stone-500" />
                        {t('services.addCategory')}
                    </Button>
                    <Button
                        onClick={() => openAdd()}
                        className="flex items-center gap-2 rounded-xl shadow-2xs active:scale-95 transition-all text-xs sm:text-sm font-semibold"
                    >
                        <Plus className="h-4 w-4" />
                        {t('services.add')}
                    </Button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-stone-200/80 p-4 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder={
                                t('services.search') || 'Search by service name or description...'
                            }
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 pr-10 py-2.5 w-full bg-stone-50/60 hover:bg-stone-50 focus:bg-white rounded-xl border border-stone-200/80 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-sans text-sm outline-none placeholder:text-stone-400 text-stone-900 shadow-3xs"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category quick tabs */}
                {(categories ?? []).length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setSelectedCatId('all')}
                            className={cn(
                                'shrink-0 px-3 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all duration-200 cursor-pointer',
                                selectedCatId === 'all'
                                    ? 'bg-stone-900 text-white shadow-3xs'
                                    : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900',
                            )}
                        >
                            {t('services.allCategories') || 'All'} ({totalAll})
                        </button>
                        {(categories ?? []).map((cat) => {
                            const count = (services ?? []).filter(
                                (s) => s.categoryId === cat.id,
                            ).length;
                            const isSelected = selectedCatId === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCatId(cat.id)}
                                    className={cn(
                                        'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all duration-200 cursor-pointer',
                                        isSelected
                                            ? 'bg-stone-900 text-white shadow-3xs'
                                            : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900',
                                    )}
                                >
                                    <span>{cat.name}</span>
                                    <span
                                        className={cn(
                                            'px-1.5 py-0.2 rounded-md text-[10px] font-bold',
                                            isSelected
                                                ? 'bg-stone-800 text-stone-300'
                                                : 'bg-stone-200/70 text-stone-500',
                                        )}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Category Groups List */}
            {totalMatched === 0 && query ? (
                <div className="rounded-3xl border border-dashed border-stone-200 bg-white/70 py-16 px-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                        <Search className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-stone-800">
                        {t('services.emptySearchTitle') || 'No services found'}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-stone-500 max-w-sm mx-auto">
                        {t('services.emptySearchSubtitle', { query }) ||
                            `No services match "${query}". Try searching with different keywords.`}
                    </p>
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="mt-4 px-4 py-2 rounded-xl bg-stone-900 text-white font-sans text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs"
                    >
                        {t('services.clearSearch') || 'Clear search'}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
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
                            onEditCategory={() => openEditCategory(cat)}
                            onDeleteCategory={() => handleDeleteCategory(cat)}
                        />
                    ))}
                </div>
            )}

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
