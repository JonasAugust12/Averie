export type DashboardPeriod = 'today' | 'week' | 'month' | 'year' | 'all';

export interface DashboardDateRange {
    dateFrom?: string;
    dateTo?: string;
}

function startOfLocalDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

/** Local calendar date as YYYY-MM-DD (matches booking.date storage). */
export function isoDateLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function getDashboardPeriodRange(
    period: DashboardPeriod,
    ref: Date = new Date(),
): DashboardDateRange {
    const today = startOfLocalDay(ref);
    const todayIso = isoDateLocal(today);

    switch (period) {
        case 'today':
            return { dateFrom: todayIso, dateTo: todayIso };
        case 'week': {
            const monday = new Date(today);
            const dow = monday.getDay();
            const offset = dow === 0 ? -6 : 1 - dow;
            monday.setDate(monday.getDate() + offset);
            return { dateFrom: isoDateLocal(monday), dateTo: todayIso };
        }
        case 'month': {
            const first = new Date(today.getFullYear(), today.getMonth(), 1, 12);
            return { dateFrom: isoDateLocal(first), dateTo: todayIso };
        }
        case 'year': {
            const first = new Date(today.getFullYear(), 0, 1, 12);
            return { dateFrom: isoDateLocal(first), dateTo: todayIso };
        }
        case 'all':
        default:
            return {};
    }
}

export function getPreviousDashboardPeriodRange(
    period: DashboardPeriod,
    ref: Date = new Date(),
): DashboardDateRange {
    const current = getDashboardPeriodRange(period, ref);
    if (!current.dateFrom || !current.dateTo || period === 'all') {
        return {};
    }

    const from = new Date(`${current.dateFrom}T12:00:00`);
    const to = new Date(`${current.dateTo}T12:00:00`);

    if (period === 'today') {
        from.setDate(from.getDate() - 1);
        const iso = isoDateLocal(from);
        return { dateFrom: iso, dateTo: iso };
    }

    const spanDays = Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const prevTo = new Date(from);
    prevTo.setDate(prevTo.getDate() - 1);
    const prevFrom = new Date(prevTo);
    prevFrom.setDate(prevFrom.getDate() - (spanDays - 1));

    return { dateFrom: isoDateLocal(prevFrom), dateTo: isoDateLocal(prevTo) };
}

export function formatFilterTodayLabel(ref: Date = new Date(), locale = 'en-US'): string {
    return ref.toLocaleDateString(locale, { month: '2-digit', day: '2-digit' });
}
