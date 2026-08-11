'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useSalonStaff } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';

export default function AdminStaffPage() {
    const t = useAdminTranslations();
    const { data: staff, isLoading } = useSalonStaff();

    return (
        <div className="space-y-6">
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {(staff ?? []).map((member) => (
                        <article
                            key={member.id}
                            className="flex items-center justify-between rounded-xl border border-border bg-neutral p-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-200 font-sans text-sm font-medium text-primary">
                                    {member.initials}
                                </span>
                                <div>
                                    <p className="font-display text-base text-primary">
                                        {member.name}
                                    </p>
                                    <p className="font-sans text-sm text-muted">{member.role}</p>
                                </div>
                            </div>
                            <Link href={`/admin/staff/${member.id}/schedule`}>
                                <Button size="sm" variant="outlined">
                                    {t('staff.schedule')}
                                </Button>
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
