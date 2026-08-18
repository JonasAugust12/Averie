'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Users, UserCheck, UserX, X } from 'lucide-react';
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
import { toastSuccess } from '@utils/toast.util';
import { cn } from '@utils/cn.util';

type FilterTab = 'all' | 'active' | 'hidden';

export default function AdminStaffPage() {
    const t = useAdminTranslations();
    const { data: staff, isLoading } = useAllStaff();
    const createStaff = useCreateStaff();
    const updateStaff = useUpdateStaff();
    const deleteStaff = useDeleteStaff();
    const { showConfirm, hideConfirm } = useUIStore();

    const [query, setQuery] = useState('');
    const [filterTab, setFilterTab] = useState<FilterTab>('all');
    const [editing, setEditing] = useState<StaffFormValues | null | 'new'>(null);

    const totalVisible = (staff ?? []).filter((s) => s.visible).length;
    const totalAll = (staff ?? []).length;
    const totalHidden = totalAll - totalVisible;

    const filtered = useMemo(() => {
        let list = staff ?? [];

        // Tab filter
        if (filterTab === 'active') {
            list = list.filter((s) => s.visible);
        } else if (filterTab === 'hidden') {
            list = list.filter((s) => !s.visible);
        }

        // Query filter
        const q = query.trim().toLowerCase();
        if (!q) return list;

        return list.filter((s) => {
            const name = `${s.firstName} ${s.lastName}`.toLowerCase();
            return (
                name.includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.phone.toLowerCase().includes(q) ||
                s.specialties.some((spec) => spec.toLowerCase().includes(q))
            );
        });
    }, [staff, query, filterTab]);

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
            toastSuccess(t('toasts.staffCreated'));
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
            toastSuccess(t('toasts.staffUpdated'));
        }
        setEditing(null);
    }

    function handleToggle(member: UserDto) {
        const hiding = member.visible;
        const displayName = `${member.firstName} ${member.lastName}`.trim();
        showConfirm({
            title: hiding ? t('staff.confirmHideTitle') : t('staff.confirmShowTitle'),
            message: hiding
                ? t('staff.confirmHideMsg', { name: displayName })
                : t('staff.confirmShowMsg', { name: displayName }),
            confirmText: hiding ? t('staff.confirmHideBtn') : t('staff.confirmShowBtn'),
            cancelText: t('staff.cancel'),
            type: 'info',
            onConfirm: async () => {
                await updateStaff.mutateAsync({
                    id: member.id,
                    input: { visible: !member.visible },
                });
                toastSuccess(hiding ? t('toasts.staffHidden') : t('toasts.staffShown'));
                hideConfirm();
            },
        });
    }

    function handleDelete(member: UserDto) {
        const displayName = `${member.firstName} ${member.lastName}`.trim();
        showConfirm({
            title: t('staff.confirmDeleteTitle'),
            message: t('staff.confirmDeleteMsg', { name: displayName }),
            confirmText: t('staff.delete'),
            cancelText: t('staff.cancel'),
            type: 'danger',
            onConfirm: async () => {
                await deleteStaff.mutateAsync(member.id);
                toastSuccess(t('toasts.staffDeleted'));
                hideConfirm();
            },
        });
    }

    if (isLoading) {
        return <StaffGridSkeleton />;
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                        {t('staff.title')}
                    </h1>
                    <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500">
                        {t('staff.subtitle')} —{' '}
                        <span className="font-semibold text-stone-800">
                            {totalVisible}/{totalAll}
                        </span>{' '}
                        {t('staff.visibleCount')}
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    className="shrink-0 flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 shadow-2xs hover:bg-stone-800 active:scale-95 transition-all text-xs sm:text-sm font-semibold"
                >
                    <Plus className="h-4 w-4" />
                    {t('staff.add')}
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
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

            {/* Controls Bar */}
            <div className="flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-white p-3 sm:p-4 shadow-3xs">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder={
                                t('staff.search') || 'Search staff by name, role or email...'
                            }
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-xl border border-stone-200/80 bg-stone-50/60 pl-10 pr-9 py-2.5 font-sans text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100 shadow-3xs"
                        />
                        {query ? (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                                title={t('services.clearSearch') || 'Clear search'}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setFilterTab('all')}
                            className={cn(
                                'shrink-0 rounded-xl px-3.5 py-2 font-sans text-xs font-semibold transition-all cursor-pointer shadow-3xs',
                                filterTab === 'all'
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/70',
                            )}
                        >
                            {t('staff.filterAll') || 'All'} ({totalAll})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('active')}
                            className={cn(
                                'shrink-0 rounded-xl px-3.5 py-2 font-sans text-xs font-semibold transition-all cursor-pointer shadow-3xs',
                                filterTab === 'active'
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/70',
                            )}
                        >
                            {t('staff.filterActive') || 'Active'} ({totalVisible})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('hidden')}
                            className={cn(
                                'shrink-0 rounded-xl px-3.5 py-2 font-sans text-xs font-semibold transition-all cursor-pointer shadow-3xs',
                                filterTab === 'hidden'
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/70',
                            )}
                        >
                            {t('staff.filterHidden') || 'Hidden'} ({totalHidden})
                        </button>
                    </div>
                </div>

                {/* Status indicator bar */}
                {(query || filterTab !== 'all') && (
                    <div className="flex items-center justify-between border-t border-stone-100 pt-2.5 px-1">
                        <span className="font-sans text-xs text-stone-500">
                            {t('staff.showingFiltered', { count: filtered.length }) ||
                                `Showing ${filtered.length} matching members`}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setFilterTab('all');
                            }}
                            className="font-sans text-xs font-semibold text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
                        >
                            {t('staff.resetFilters') || 'Reset filters'}
                        </button>
                    </div>
                )}
            </div>

            {/* Grid or Empty state */}
            {filtered.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-200/80 bg-stone-50/50 px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-stone-200/80 shadow-3xs text-stone-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <p className="font-display text-lg font-bold text-stone-800">
                        {t('staff.emptyState')}
                    </p>
                    <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500">
                        {query || filterTab !== 'all'
                            ? t('staff.emptyFiltered') ||
                              'No staff members found matching current filters.'
                            : t('staff.emptyInitial') ||
                              'Start by adding the first staff member to your salon.'}
                    </p>
                    <Button
                        onClick={openAdd}
                        className="mt-5 rounded-2xl px-6 py-2.5 shadow-2xs hover:bg-stone-800 active:scale-95 transition-all text-xs sm:text-sm font-semibold"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('staff.addFirst')}
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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

            {/* Form Modal */}
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
