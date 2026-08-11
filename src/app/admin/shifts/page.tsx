'use client';

import { Loader2 } from 'lucide-react';
import { useSalonStaff, useStaffShifts } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';

export default function AdminShiftsPage() {
    const t = useAdminTranslations();
    const { data: staff } = useSalonStaff();
    const { data: shifts, isLoading } = useStaffShifts();

    return (
        <div className="space-y-6">
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-130 font-sans text-sm">
                        <thead className="border-b border-border bg-tertiary text-left text-muted">
                            <tr>
                                <th className="px-4 py-3">{t('overview.technician')}</th>
                                <th className="px-4 py-3">Day</th>
                                <th className="px-4 py-3">Start</th>
                                <th className="px-4 py-3">End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(shifts ?? []).map((sh) => {
                                const member = staff?.find((s) => s.id === sh.staffId);
                                return (
                                    <tr
                                        key={sh.id}
                                        className="border-b border-border last:border-0"
                                    >
                                        <td className="px-4 py-3 text-primary">
                                            {member?.name ?? sh.staffId}
                                        </td>
                                        <td className="px-4 py-3 text-muted">{sh.day}</td>
                                        <td className="px-4 py-3 text-muted">{sh.start}</td>
                                        <td className="px-4 py-3 text-muted">{sh.end}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
