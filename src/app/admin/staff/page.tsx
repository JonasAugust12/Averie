'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Loader2, Users, UserCheck, UserX } from 'lucide-react';
import { useAllSalonStaff, useSaveMockStaff, useDeleteMockStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Input } from '@components/ui';
import { Button } from '@components/common/Button';
import { StaffCard, StaffFormModal } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings/BookingStatCard';
import type { SalonStaff } from '@typings/salon.type';

export default function AdminStaffPage() {
    const t = useAdminTranslations();
    const { data: staff, isLoading } = useAllSalonStaff();
    const saveStaff = useSaveMockStaff();
    const deleteStaff = useDeleteMockStaff();

    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState<SalonStaff | null | 'new'>(null);
    const [pendingDelete, setPendingDelete] = useState<SalonStaff | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return staff ?? [];
        return (staff ?? []).filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.role.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q),
        );
    }, [staff, query]);

    const totalActive = (staff ?? []).filter((s) => s.active).length;
    const totalAll = (staff ?? []).length;
    const totalHidden = totalAll - totalActive;

    function openAdd() {
        setEditing('new');
    }

    function openEdit(member: SalonStaff) {
        setEditing(member);
    }

    async function handleSave(member: SalonStaff) {
        await saveStaff.mutateAsync(member);
        setEditing(null);
    }

    async function handleToggle(member: SalonStaff) {
        await saveStaff.mutateAsync({ ...member, active: !member.active });
    }

    async function confirmDelete() {
        if (!pendingDelete) return;
        await deleteStaff.mutateAsync(pendingDelete.id);
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-stone-900">
                        {t('staff.title')}
                    </h1>
                    <p className="mt-1 font-sans text-sm text-stone-500">
                        {t('staff.subtitle')} —{' '}
                        <span className="font-semibold text-stone-700">
                            {totalActive}/{totalAll}
                        </span>{' '}
                        {t('staff.visibleCount')}
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    className="flex shrink-0 items-center gap-2 tracking-wide"
                >
                    <Plus className="h-4 w-4" />
                    {t('staff.add')}
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <BookingStatCard
                    label={t('staff.statsTotal')}
                    count={totalAll}
                    icon={Users}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('staff.statsActive')}
                    count={totalActive}
                    icon={UserCheck}
                    variant="pending"
                />
                <BookingStatCard
                    label={t('staff.statsHidden')}
                    count={totalHidden}
                    icon={UserX}
                    variant="cancelled"
                />
            </div>

            <div className="relative max-w-md">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                    placeholder={t('staff.search')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-neutral-200 bg-white pl-9 placeholder:text-neutral-400"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center">
                    <p className="font-sans text-sm text-stone-500">{t('staff.emptyState')}</p>
                    <Button onClick={openAdd} className="mt-4">
                        {t('staff.addFirst')}
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                    {filtered.map((member) => (
                        <StaffCard
                            key={member.id}
                            staff={member}
                            onEdit={openEdit}
                            onToggle={handleToggle}
                            onDelete={setPendingDelete}
                        />
                    ))}
                </div>
            )}

            {editing !== null && (
                <StaffFormModal
                    initial={editing === 'new' ? null : editing}
                    onSave={handleSave}
                    onClose={() => setEditing(null)}
                    isSaving={saveStaff.isPending}
                />
            )}

            {pendingDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setPendingDelete(null)}
                >
                    <div className="animate-in zoom-in-95 w-full max-w-sm space-y-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xl duration-200">
                        <div>
                            <h3 className="font-display text-lg font-semibold text-stone-900">
                                {t('staff.confirmDeleteTitle')}
                            </h3>
                            <p className="mt-1 font-sans text-sm text-stone-500">
                                {t('staff.confirmDeleteDesc')}{' '}
                                <span className="font-semibold text-stone-800">
                                    &quot;{pendingDelete.name}&quot;
                                </span>
                                ?
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outlined"
                                onClick={() => setPendingDelete(null)}
                                className="border-neutral-200"
                            >
                                {t('staff.cancel')}
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                disabled={deleteStaff.isPending}
                                className="border-red-600 bg-red-600 hover:bg-red-700"
                            >
                                {deleteStaff.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    t('staff.delete')
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
