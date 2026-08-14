'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Loader2, Users, UserCheck, UserX } from 'lucide-react';
import { useAllSalonStaff, useSaveMockStaff, useDeleteMockStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common/Button';
import { useUIStore } from '@stores/ui.store';
import { StaffCard, StaffFormModal } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings/BookingStatCard';
import type { SalonStaff } from '@typings/salon.type';

export default function AdminStaffPage() {
    const t = useAdminTranslations();
    const { data: staff, isLoading } = useAllSalonStaff();
    const saveStaff = useSaveMockStaff();
    const deleteStaff = useDeleteMockStaff();
    const { showConfirm, hideConfirm } = useUIStore();

    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState<SalonStaff | null | 'new'>(null);

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

    function handleDelete(member: SalonStaff) {
        showConfirm({
            title: t('staff.confirmDeleteTitle') || 'Xóa nhân viên',
            message: `${t('staff.confirmDeleteDesc') || 'Bạn có chắc muốn xóa'} "${member.name}"?`,
            confirmText: t('staff.delete') || 'Xóa',
            cancelText: t('staff.cancel') || 'Hủy',
            type: 'danger',
            onConfirm: async () => {
                await deleteStaff.mutateAsync(member.id);
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
                    className="shrink-0 flex items-center gap-2 tracking-wide rounded-full px-5 py-2.5 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
                >
                    <Plus className="h-4 w-4" />
                    {t('staff.add')}
                </Button>
            </div>

            {/* Stats */}
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

            {/* Search Bar */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/60 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-xl">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder={t('staff.search') || 'Tìm theo tên, vai trò, email...'}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full bg-stone-50/50 hover:bg-stone-50 focus:bg-white rounded-xl border border-stone-200/80 focus:border-stone-300 focus:ring-2 focus:ring-stone-100 transition-all font-sans text-sm outline-none placeholder:text-stone-400 text-stone-800"
                    />
                </div>
                <div className="text-xs font-semibold text-stone-500 hidden md:block pr-2">
                    💡 {t('staff.searchTip') || 'Gõ tên hoặc vai trò để lọc danh sách nhân viên.'}
                </div>
            </div>

            {/* Staff Grid */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-16 text-center">
                    <Users className="mx-auto mb-4 h-10 w-10 text-stone-300" />
                    <p className="font-sans text-base font-semibold text-stone-600">
                        {t('staff.emptyState')}
                    </p>
                    <p className="mt-1 font-sans text-sm text-stone-400">
                        {t('staff.emptyStateSubtitle') ||
                            'Bắt đầu bằng cách thêm nhân viên đầu tiên của bạn.'}
                    </p>
                    <Button
                        onClick={openAdd}
                        className="mt-5 rounded-full px-6 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('staff.addFirst')}
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {filtered.map((member) => (
                        <StaffCard
                            key={member.id}
                            staff={member}
                            onEdit={openEdit}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
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
        </div>
    );
}
