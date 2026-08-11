'use client';

import { Loader2 } from 'lucide-react';
import { useScheduleSettings } from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleSettingsPage() {
    const t = useAdminTranslations();
    const { data: settings, isLoading } = useScheduleSettings();

    return (
        <div className="max-w-lg space-y-6">
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
            ) : settings ? (
                <dl className="divide-y divide-border rounded-xl border border-border bg-neutral font-sans text-sm">
                    <Row label={t('schedule.open')} value={settings.openTime} />
                    <Row label={t('schedule.close')} value={settings.closeTime} />
                    <Row label={t('schedule.interval')} value={`${settings.intervalMin} min`} />
                    <Row
                        label="Closed weekdays"
                        value={
                            settings.closedWeekdays.map((d) => weekdayNames[d]).join(', ') || 'None'
                        }
                    />
                    <Row label="Days off" value={settings.daysOff.join(', ') || 'None'} />
                </dl>
            ) : null}

            <p className="font-sans text-xs text-muted">
                Mock settings — read-only in this UI pass.
            </p>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right text-primary">{value}</dd>
        </div>
    );
}
