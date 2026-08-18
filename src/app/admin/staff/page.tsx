'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Users, UserCheck, UserX } from 'lucide-react';
import {
    useAllStaff,
    useCreateStaff,
    useUpdateStaff,
    useDeleteStaff,
} from '@services/staff.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common/Button';
import { StaffGridSkeleton } from '@components/skeletons';
import { useUIStore } from '@stores/ui.store';
import { StaffCard, StaffFormModal } from '@components/admin/staff';
import { BookingStatCard } from '@components/admin/bookings';
import type { UserDto } from '@typings/salon-user.type';
import type { CreateStaffInput, UpdateStaffInput } from '@validations/staff.schema';

import type { StaffFormValues } from '@components/admin/staff/StaffFormModal';

export default function AdminStaffPage() {
    const t = useAdminTranslations();
    const { data: staff, isLoading } = useAllStaff();
    const createStaff = useCreateStaff();
    const updateStaff = useUpdateStaff();
    const deleteStaff = useDeleteStaff();
    const { showConfirm, hideConfirm } = useUIStore();

    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState<StaffFormValues | null | 'new'>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return staff ?? [];
        return (staff ?? []).filter((s) => {
            const name = `${s.firstName} ${s.lastName}`.toLowerCase();
            return (
                name.includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.phone.toLowerCase().includes(q) ||
                s.specialties.some((spec) => spec.toLowerCase().includes(q))
            );
        });
    }, [staff, query]);

    const totalVisible = (staff ?? []).filter((s) => s.visible).length;
    const totalAll = (staff ?? []).length;
    const totalHidden = totalAll - totalVisible;

    function userToForm(user: UserDto): StaffFormValues {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            note: user.note,
            specialties: user.specialties,
            visible: user.visible,
            color: user.staffProfile?.color,
        };
    }

    function openAdd() {
        setEditing('new');
    }

    function openEdit(member: UserDto) {
        setEditing(userToForm(member));
    }

    async function handleSave(values: StaffFormValues) {
        if (editing === 'new' || !values.id) {
            const input: CreateStaffInput = {
                email: values.email,
                password: values.password ?? '',
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                note: values.note,
                specialties: values.specialties,
                visible: values.visible,
                staffProfile: values.color ? { color: values.color } : undefined,
            };
            await createStaff.mutateAsync(input);
        } else {
            const input: UpdateStaffInput = {
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                note: values.note,
                specialties: values.specialties,
                visible: values.visible,
                staffProfile: values.color ? { color: values.color } : undefined,
            };
            await updateStaff.mutateAsync({ id: values.id, input });
        }
        setEditing(null);
    }

    function handleToggle(member: UserDto) {
        showConfirm({
            title: member.visible
                ? t('staff.confirmHideTitle') || 'Hide staff'
                : t('staff.confirmShowTitle') || 'Show staff',
            message: `${member.firstName} ${member.lastName}`,
            confirmText: t('staff.save') || 'Confirm',
            cancelText: t('staff.cancel') || 'Cancel',
            type: 'info',
            onConfirm: async () => {
                await updateStaff.mutateAsync({
                    id: member.id,
                    input: { visible: !member.visible },
                });
                hideConfirm();
            },
        });
    }

    function handleDelete(member: UserDto) {
        showConfirm({
            title: t('staff.confirmDeleteTitle') || 'Xóa nhân viên',
            message: `${t('staff.confirmDeleteDesc') || 'Bạn có chắc muốn xóa'} "${member.firstName} ${member.lastName}"?`,
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
        return <StaffGridSkeleton />;
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
                            {totalVisible}/{totalAll}
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

            <div className="grid gap-4 sm:grid-cols-3">
                <BookingStatCard
                    label={t('staff.statsTotal')}
                    count={totalAll}
                    icon={Users}
                    variant="confirmed"
                />
                <BookingStatCard
                    label={t('staff.statsActive')}
                    count={totalVisible}
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
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-16 text-center">
                    <Users className="mx-auto mb-4 h-10 w-10 text-stone-300" />
                    <p className="font-sans text-base font-semibold text-stone-600">
                        {t('staff.emptyState')}
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
                    isSaving={createStaff.isPending || updateStaff.isPending}
                />
            )}
        </div>
    );
}
