'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSalonStaff, useStaffShifts } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { EmptyState } from '@components/ui';

export default function StaffSchedulePage() {
    const t = useAdminTranslations();
    const params = useParams<{ id: string }>();
    const { data: staff, isLoading: staffLoading } = useSalonStaff();
    const { data: shifts, isLoading: shiftsLoading } = useStaffShifts();

    const member = staff?.find((s) => s.id === params.id);
    const memberShifts = (shifts ?? []).filter((sh) => sh.staffId === params.id);

    if (staffLoading || shiftsLoading) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted" />;
    }

    if (!member) {
        return <EmptyState title="Staff member not found" />;
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/staff"
                    className="font-sans text-sm text-muted hover:text-primary"
                >
                    ← {t('staff.title')}
                </Link>
                <h2 className="mt-2 font-display text-xl text-primary">{member.name}</h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-100 font-sans text-sm">
                    <thead className="border-b border-border bg-tertiary text-left text-muted">
                        <tr>
                            <th className="px-4 py-3">Day</th>
                            <th className="px-4 py-3">Start</th>
                            <th className="px-4 py-3">End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberShifts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center text-muted">
                                    No shifts assigned
                                </td>
                            </tr>
                        ) : (
                            memberShifts.map((sh) => (
                                <tr key={sh.id} className="border-b border-border last:border-0">
                                    <td className="px-4 py-3 text-primary">{sh.day}</td>
                                    <td className="px-4 py-3 text-muted">{sh.start}</td>
                                    <td className="px-4 py-3 text-muted">{sh.end}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
