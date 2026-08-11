'use client';

import { Clock } from 'lucide-react';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useSalonServices, useSalonStaff } from '@services/salon.service';
import { useBookingStore } from '@stores/booking.store';
import { formatDisplayDate, formatUsd } from '@utils/format.util';

export function BookingSummary() {
    const t = useBookingTranslations();
    const { serviceId, staffId, date, time, customer } = useBookingStore();
    const { data: services } = useSalonServices();
    const { data: staff } = useSalonStaff();

    const service = services?.find((s) => s.id === serviceId);
    const employee =
        staffId === 'any' ? t('anyTechnician') : staff?.find((s) => s.id === staffId)?.name;

    const hasSelection = Boolean(service);

    return (
        <aside className="rounded-lg border border-border/60 bg-neutral p-6 lg:sticky lg:top-36">
            <h2 className="border-b border-border/60 pb-4 font-display text-xl text-primary">
                {t('yourBooking')}
            </h2>

            {!hasSelection ? (
                <p className="mt-6 font-sans text-sm text-muted italic">{t('selectToBegin')}</p>
            ) : (
                <dl className="mt-6 space-y-4 font-sans text-sm">
                    {service ? (
                        <div>
                            <dt className="text-xs tracking-widest text-muted uppercase">
                                {t('review.service')}
                            </dt>
                            <dd className="mt-1 text-primary">{service.name}</dd>
                            <dd className="mt-1 flex items-center gap-1 text-muted">
                                <Clock className="h-3.5 w-3.5" aria-hidden />
                                {t('duration', { min: service.durationMin })}
                            </dd>
                        </div>
                    ) : null}
                    {employee ? <SummaryRow label={t('review.employee')} value={employee} /> : null}
                    {date ? (
                        <SummaryRow label={t('review.date')} value={formatDisplayDate(date)} />
                    ) : null}
                    {time ? <SummaryRow label={t('review.time')} value={time} /> : null}
                    {customer ? (
                        <SummaryRow
                            label={t('review.customer')}
                            value={`${customer.firstName} ${customer.lastName}`}
                        />
                    ) : null}
                </dl>
            )}

            {service ? (
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="font-sans text-xs tracking-widest text-muted uppercase">
                        {t('total')}
                    </span>
                    <span className="font-display text-xl text-primary">
                        {formatUsd(service.price)}
                    </span>
                </div>
            ) : null}
        </aside>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs tracking-widest text-muted uppercase">{label}</dt>
            <dd className="mt-1 text-primary">{value}</dd>
        </div>
    );
}
