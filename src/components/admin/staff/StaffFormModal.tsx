'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
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
            <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {label}
            </label>
            {children}
        </div>
    );
}

function normalizeSpecialty(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
}

function dedupeSpecialties(items: string[]): string[] {
    const seen = new Set<string>();
    return items
        .map(normalizeSpecialty)
        .filter(Boolean)
        .filter((item) => {
            const key = item.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function SpecialtiesEditor({
    specialties,
    onChange,
    labels,
}: {
    specialties: string[];
    onChange: (next: string[]) => void;
    labels: {
        placeholder: string;
        add: string;
        remove: string;
        empty: string;
    };
}) {
    const [draft, setDraft] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState('');

    function addSpecialty() {
        const value = normalizeSpecialty(draft);
        if (!value) return;
        onChange(dedupeSpecialties([...specialties, value]));
        setDraft('');
    }

    function removeSpecialty(index: number) {
        onChange(specialties.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditDraft('');
        }
    }

    function startEdit(index: number) {
        setEditingIndex(index);
        setEditDraft(specialties[index]);
    }

    function commitEdit() {
        if (editingIndex === null) return;
        const value = normalizeSpecialty(editDraft);
        const next = [...specialties];
        if (!value) {
            next.splice(editingIndex, 1);
        } else {
            next[editingIndex] = value;
        }
        onChange(dedupeSpecialties(next));
        setEditingIndex(null);
        setEditDraft('');
    }

    return (
        <div className="space-y-3">
            {specialties.length === 0 ? (
                <p className="font-sans text-xs text-stone-400 italic py-1">{labels.empty}</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty, index) =>
                        editingIndex === index ? (
                            <Input
                                key={`edit-${index}`}
                                autoFocus
                                value={editDraft}
                                onChange={(e) => setEditDraft(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        commitEdit();
                                    }
                                    if (e.key === 'Escape') {
                                        setEditingIndex(null);
                                        setEditDraft('');
                                    }
                                }}
                                className="h-9 w-40 rounded-xl border-stone-300 bg-white text-xs font-semibold shadow-3xs"
                            />
                        ) : (
                            <span
                                key={`${specialty}-${index}`}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-stone-50 pl-3 pr-1.5 py-1 font-sans text-xs font-semibold text-stone-700 shadow-3xs transition-all hover:bg-stone-100"
                            >
                                <button
                                    type="button"
                                    onClick={() => startEdit(index)}
                                    className="cursor-pointer hover:text-stone-900"
                                >
                                    {specialty}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeSpecialty(index)}
                                    className="rounded-lg p-0.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                    aria-label={labels.remove}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ),
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <Input
                    placeholder={labels.placeholder}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addSpecialty();
                        }
                    }}
                    className="rounded-xl border-stone-200/80 bg-stone-50/60 focus:bg-white text-stone-800 text-xs sm:text-sm shadow-3xs"
                />
                <Button
                    type="button"
                    variant="outlined"
                    size="sm"
                    onClick={addSpecialty}
                    disabled={!draft.trim()}
                    className="shrink-0 rounded-xl border-stone-200/80 bg-white px-3 font-sans text-xs font-semibold shadow-3xs hover:bg-stone-50 active:scale-95 transition-all"
                >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    {labels.add}
                </Button>
            </div>
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

    useEffect(() => {
        const base = initial ?? emptyForm();
        setForm({
            ...base,
            specialties: dedupeSpecialties(base.specialties ?? []),
        });
    }, [initial]);

    const patch = (partial: Partial<StaffFormValues>) => setForm((f) => ({ ...f, ...partial }));

    const handleSave = async () => {
        if (!form.firstName.trim() || !form.lastName.trim()) return;
        await onSave({
            ...form,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            specialties: dedupeSpecialties(form.specialties),
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-stone-900/40 p-3 backdrop-blur-xs sm:items-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-6 py-5">
                    <div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                            {isNew ? t('staff.addTitle') : t('staff.editTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
                            {isNew ? t('staff.addSubtitle') : t('staff.editSubtitle')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 bg-stone-50 text-stone-500 shadow-3xs transition-all hover:bg-stone-100 hover:text-stone-800 active:scale-95 cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body Form */}
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label={t('staff.firstName')}>
                            <Input
                                value={form.firstName}
                                onChange={(e) => patch({ firstName: e.target.value })}
                                className="rounded-xl border-stone-200/80 bg-stone-50/60 focus:bg-white text-stone-900 shadow-3xs text-sm"
                            />
                        </Field>
                        <Field label={t('staff.lastName')}>
                            <Input
                                value={form.lastName}
                                onChange={(e) => patch({ lastName: e.target.value })}
                                className="rounded-xl border-stone-200/80 bg-stone-50/60 focus:bg-white text-stone-900 shadow-3xs text-sm"
                            />
                        </Field>
                    </div>

                    <Field label={t('staff.email')}>
                        <Input
                            type="email"
                            placeholder="name@averie.local"
                            value={form.email}
                            onChange={(e) => patch({ email: e.target.value })}
                            className="rounded-xl border-stone-200/80 bg-stone-50/60 focus:bg-white text-stone-900 shadow-3xs text-sm"
                        />
                    </Field>

                    {isNew && (
                        <Field label={t('staff.password')}>
                            <Input
                                type="password"
                                value={form.password ?? ''}
                                onChange={(e) => patch({ password: e.target.value })}
                                className="rounded-xl border-stone-200/80 bg-stone-50/60 focus:bg-white text-stone-900 shadow-3xs text-sm"
                            />
                        </Field>
                    )}

                    <Field label={t('staff.phone')}>
                        <Input
                            placeholder="(781) 555-0100"
                            value={form.phone}
                            onChange={(e) => patch({ phone: e.target.value })}
                            className="rounded-xl border-stone-200/80 bg-stone-50/60 focus:bg-white text-stone-900 shadow-3xs text-sm"
                        />
                    </Field>

                    <Field label={t('staff.specialties')}>
                        <SpecialtiesEditor
                            specialties={form.specialties}
                            onChange={(specialties) => patch({ specialties })}
                            labels={{
                                placeholder: t('staff.specialtiesPlaceholder'),
                                add: t('staff.specialtiesAdd'),
                                remove: t('staff.specialtiesRemove'),
                                empty: t('staff.specialtiesEmpty'),
                            }}
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

                    {/* Visibility Switch */}
                    <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-3.5 shadow-3xs">
                        <div>
                            <p className="font-sans text-sm font-bold text-stone-800">
                                {t('staff.visible')}
                            </p>
                            <p className="font-sans text-xs text-stone-500">
                                {t('staff.visibleHint')}
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
                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/50 px-6 py-4">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        className="rounded-xl border-stone-200/80 bg-white font-semibold text-xs sm:text-sm text-stone-600 shadow-3xs hover:bg-stone-50 active:scale-95 transition-all"
                    >
                        {t('staff.cancel')}
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 shadow-2xs active:scale-95 transition-all"
                        disabled={
                            !form.firstName.trim() ||
                            !form.lastName.trim() ||
                            !form.email.trim() ||
                            (isNew && !form.password?.trim()) ||
                            isSaving
                        }
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                        {t('staff.save')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
