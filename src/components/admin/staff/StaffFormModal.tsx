'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Input } from '@components/ui';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';
import { STAFF_COLOR_OPTIONS } from '@utils/staff-calendar.util';
import { StaffColorPicker } from './StaffColorPicker';
import { useAdminFormModalLock } from '@hooks/useAdminFormModalLock';

export type StaffFormValues = {
    id?: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: string;
    note?: string;
    specialties: string[];
    visible: boolean;
    color?: string;
};

interface StaffFormModalProps {
    initial?: StaffFormValues | null;
    onSave: (staff: StaffFormValues) => Promise<void>;
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

const emptyForm = (): StaffFormValues => ({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    note: '',
    specialties: [],
    visible: true,
    color: STAFF_COLOR_OPTIONS[0],
});

export function StaffFormModal({ initial, onSave, onClose, isSaving }: StaffFormModalProps) {
    const t = useAdminTranslations();
    const isNew = !initial?.id;
    useAdminFormModalLock();

    const [form, setForm] = useState<StaffFormValues>(initial ?? emptyForm());
    const [specialtiesInput, setSpecialtiesInput] = useState('');

    useEffect(() => {
        const base = initial ?? emptyForm();
        setForm(base);
        setSpecialtiesInput((base.specialties ?? []).join(', '));
    }, [initial]);

    const patch = (partial: Partial<StaffFormValues>) => setForm((f) => ({ ...f, ...partial }));

    const handleSave = async () => {
        if (!form.firstName.trim() || !form.lastName.trim()) return;
        const specialties = specialtiesInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        await onSave({
            ...form,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            specialties,
        });
    };

    return (
        <div
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/20 p-3 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-5">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-stone-900">
                            {isNew ? t('staff.addTitle') : t('staff.editTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-400">
                            {isNew ? t('staff.addSubtitle') : t('staff.editSubtitle')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-100 transition-colors hover:bg-stone-50"
                    >
                        <X className="h-4 w-4 text-stone-400" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label={t('staff.firstName') || 'First name'}>
                            <Input
                                value={form.firstName}
                                onChange={(e) => patch({ firstName: e.target.value })}
                                className="border-neutral-200 bg-stone-50 focus:bg-white"
                            />
                        </Field>
                        <Field label={t('staff.lastName') || 'Last name'}>
                            <Input
                                value={form.lastName}
                                onChange={(e) => patch({ lastName: e.target.value })}
                                className="border-neutral-200 bg-stone-50 focus:bg-white"
                            />
                        </Field>
                    </div>

                    <Field label={t('staff.email')}>
                        <Input
                            type="email"
                            placeholder="name@averie.local"
                            value={form.email}
                            onChange={(e) => patch({ email: e.target.value })}
                            className="border-neutral-200 bg-stone-50 focus:bg-white"
                        />
                    </Field>

                    {isNew && (
                        <Field label={t('staff.password') || 'Password'}>
                            <Input
                                type="password"
                                value={form.password ?? ''}
                                onChange={(e) => patch({ password: e.target.value })}
                                className="border-neutral-200 bg-stone-50 focus:bg-white"
                            />
                        </Field>
                    )}

                    <Field label={t('staff.phone')}>
                        <Input
                            placeholder="(781) 555-0100"
                            value={form.phone}
                            onChange={(e) => patch({ phone: e.target.value })}
                            className="border-neutral-200 bg-stone-50 focus:bg-white"
                        />
                    </Field>

                    <Field label={t('staff.specialties')}>
                        <Input
                            placeholder={t('staff.specialtiesPlaceholder')}
                            value={specialtiesInput}
                            onChange={(e) => setSpecialtiesInput(e.target.value)}
                            className="border-neutral-200 bg-stone-50 focus:bg-white"
                        />
                    </Field>

                    <Field label={t('staff.color')}>
                        <StaffColorPicker
                            key={form.id ?? 'new'}
                            value={form.color}
                            onChange={(color) => patch({ color })}
                            customLabel={t('staff.colorCustom')}
                        />
                    </Field>

                    <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-stone-50 px-4 py-3">
                        <div>
                            <p className="font-sans text-sm font-semibold text-stone-800">
                                {t('staff.visible')}
                            </p>
                            <p className="font-sans text-xs text-stone-400">
                                {t('staff.visibleHint')}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => patch({ visible: !form.visible })}
                            className={cn(
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                form.visible ? 'bg-[#2b2623]' : 'bg-[#e3e2e1]',
                            )}
                            role="switch"
                            aria-checked={form.visible}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none mt-0.5 ml-0.5 inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
                                    form.visible ? 'translate-x-5' : 'translate-x-0',
                                )}
                            />
                        </button>
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-neutral-100 bg-stone-50/50 px-6 py-4">
                    <Button variant="outlined" onClick={onClose} className="border-neutral-200">
                        {t('staff.cancel')}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={
                            !form.firstName.trim() ||
                            !form.lastName.trim() ||
                            !form.email.trim() ||
                            (isNew && !form.password?.trim()) ||
                            isSaving
                        }
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('staff.save')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
