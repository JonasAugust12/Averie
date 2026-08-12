'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import {
    useAllSalonServices,
    useSaveMockService,
    useDeleteMockService,
} from '@services/salon.service';
import { useAdminTranslations, useBookingTranslations } from '@i18n/use-app-translations';
import { Input } from '@components/ui';
import { Button } from '@components/common/Button';
import { SERVICE_CATEGORIES } from '@/mocks/salon/data';
import { ServiceFormModal } from '@components/admin/services/ServiceFormModal';
import { ServiceCategorySection } from '@components/admin/services/ServiceCategorySection';
import type { SalonService, ServiceCategoryId } from '@typings/salon.type';

export default function AdminServicesPage() {
    const t = useAdminTranslations();
    const bt = useBookingTranslations();

    const { data: services, isLoading } = useAllSalonServices();
    const saveService = useSaveMockService();
    const deleteService = useDeleteMockService();

    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState<SalonService | null | 'new'>(null);
    const [defaultCategoryId, setDefaultCategoryId] = useState<ServiceCategoryId | undefined>();
    const [pendingDelete, setPendingDelete] = useState<SalonService | null>(null);

    // Group by category, filtered by search
    const grouped = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? (services ?? []).filter(
                  (s) =>
                      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
              )
            : (services ?? []);

        return SERVICE_CATEGORIES.map((cat) => ({
            cat,
            items: list.filter((s) => s.categoryId === cat.id),
        }));
    }, [services, query]);

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

    async function handleToggle(svc: SalonService) {
        await saveService.mutateAsync({ ...svc, active: !svc.active });
    }

    async function confirmDelete() {
        if (!pendingDelete) return;
        await deleteService.mutateAsync(pendingDelete.id);
        setPendingDelete(null);
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
                <Button
                    onClick={() => openAdd()}
                    className="shrink-0 flex items-center gap-2 tracking-wide"
                >
                    <Plus className="h-4 w-4" />
                    {t('services.add')}
                </Button>
            </div>

            {/* Search bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                    placeholder={t('services.search')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 bg-white border-neutral-200 placeholder:text-neutral-400"
                />
            </div>

            {/* Category sections */}
            <div className="space-y-4">
                {grouped.map(({ cat, items }) => (
                    <ServiceCategorySection
                        key={cat.id}
                        categoryId={cat.id as ServiceCategoryId}
                        label={bt(cat.labelKey)}
                        services={items}
                        onAdd={openAdd}
                        onEdit={openEdit}
                        onToggle={handleToggle}
                        onDelete={setPendingDelete}
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

            {/* Delete confirmation dialog */}
            {pendingDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setPendingDelete(null)}
                >
                    <div className="w-full max-w-sm bg-white rounded-2xl border border-neutral-100 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <div>
                            <h3 className="font-display text-lg font-semibold text-stone-900">
                                {t('services.confirmDeleteTitle')}
                            </h3>
                            <p className="font-sans text-sm text-stone-500 mt-1">
                                {t('services.confirmDeleteDesc')}{' '}
                                <span className="font-semibold text-stone-800">
                                    &quot;{pendingDelete.name}&quot;
                                </span>
                                ?
                            </p>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outlined"
                                onClick={() => setPendingDelete(null)}
                                className="border-neutral-200"
                            >
                                {t('services.cancel')}
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                disabled={deleteService.isPending}
                                className="bg-red-600 hover:bg-red-700 border-red-600"
                            >
                                {deleteService.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    t('services.delete')
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
