'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSalonServices, useSaveMockService } from '@services/salon.service';
import { useAdminTranslations, useBookingTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { Input } from '@components/ui';
import { formatUsd } from '@utils/format.util';
import { SERVICE_CATEGORIES } from '@/mocks/salon/data';
import type { SalonService, ServiceCategoryId } from '@typings/salon.type';

export default function AdminServicesPage() {
    const t = useAdminTranslations();
    const bt = useBookingTranslations();
    const { data: services, isLoading } = useSalonServices();
    const saveService = useSaveMockService();
    const [editing, setEditing] = useState<SalonService | null>(null);

    function startAdd() {
        setEditing({
            id: `svc-${Date.now()}`,
            categoryId: 'manicure-pedicure',
            name: '',
            description: '',
            price: 0,
            durationMin: 30,
            active: true,
        });
    }

    function startEdit(svc: SalonService) {
        setEditing({ ...svc });
    }

    async function handleSave() {
        if (!editing || !editing.name.trim()) return;
        await saveService.mutateAsync(editing);
        setEditing(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-end gap-3">
                <Button size="sm" className="tracking-wide uppercase" onClick={startAdd}>
                    {t('services.add')}
                </Button>
            </div>

            {editing ? (
                <div className="rounded-xl border border-border bg-tertiary p-4 space-y-3 max-w-lg">
                    <Field label={t('services.name')}>
                        <Input
                            value={editing.name}
                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        />
                    </Field>
                    <Field label={t('services.category')}>
                        <select
                            value={editing.categoryId}
                            onChange={(e) =>
                                setEditing({
                                    ...editing,
                                    categoryId: e.target.value as ServiceCategoryId,
                                })
                            }
                            className="w-full rounded-md border border-border bg-neutral px-3 py-2 font-sans text-sm"
                        >
                            {SERVICE_CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {bt(c.labelKey)}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label={t('services.price')}>
                            <Input
                                type="number"
                                min={0}
                                value={editing.price}
                                onChange={(e) =>
                                    setEditing({ ...editing, price: Number(e.target.value) })
                                }
                            />
                        </Field>
                        <Field label={t('services.duration')}>
                            <Input
                                type="number"
                                min={5}
                                value={editing.durationMin}
                                onChange={(e) =>
                                    setEditing({
                                        ...editing,
                                        durationMin: Number(e.target.value),
                                    })
                                }
                            />
                        </Field>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={saveService.isPending}>
                            {t('services.save')}
                        </Button>
                        <Button variant="outlined" onClick={() => setEditing(null)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : null}

            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-160 font-sans text-sm">
                        <thead className="border-b border-border bg-tertiary text-left text-muted">
                            <tr>
                                <th className="px-4 py-3">{t('services.name')}</th>
                                <th className="px-4 py-3">{t('services.category')}</th>
                                <th className="px-4 py-3">{t('services.price')}</th>
                                <th className="px-4 py-3">{t('services.duration')}</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {(services ?? []).map((svc) => (
                                <tr key={svc.id} className="border-b border-border last:border-0">
                                    <td className="px-4 py-3 text-primary">{svc.name}</td>
                                    <td className="px-4 py-3 text-muted">
                                        {bt(
                                            SERVICE_CATEGORIES.find((c) => c.id === svc.categoryId)
                                                ?.labelKey ?? 'categories.addOns',
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-primary">
                                        {formatUsd(svc.price)}
                                    </td>
                                    <td className="px-4 py-3 text-muted">{svc.durationMin} min</td>
                                    <td className="px-4 py-3">
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            onClick={() => startEdit(svc)}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="mb-1 block font-sans text-sm text-primary">{label}</label>
            {children}
        </div>
    );
}
