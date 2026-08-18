function StatCardSkeleton() {
    return (
        <div className="flex items-start gap-4 rounded-2xl border border-stone-100 bg-stone-50/60 p-5">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-stone-200" />
            <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-stone-100" />
                <div className="h-8 w-10 rounded bg-stone-200" />
            </div>
        </div>
    );
}

function TableRowSkeleton() {
    return (
        <tr className="border-t border-neutral-100">
            <td className="px-6 py-4.5">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-stone-100" />
                    <div className="h-6 w-20 rounded border border-stone-200 bg-stone-100" />
                </div>
            </td>
            <td className="px-6 py-4.5">
                <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-stone-200" />
                    <div className="h-3 w-24 rounded bg-stone-100" />
                    <div className="h-3 w-28 rounded bg-stone-100" />
                </div>
            </td>
            <td className="px-6 py-4.5">
                <div className="h-4 w-40 max-w-full rounded bg-stone-100" />
            </td>
            <td className="px-6 py-4.5">
                <div className="space-y-1.5">
                    <div className="h-4 w-24 rounded bg-stone-200" />
                    <div className="h-3 w-16 rounded bg-stone-100" />
                </div>
            </td>
            <td className="px-6 py-4.5 text-right">
                <div className="ml-auto h-5 w-16 rounded bg-stone-200" />
            </td>
            <td className="px-6 py-4.5">
                <div className="mx-auto h-7 w-24 rounded-full bg-stone-100" />
            </td>
            <td className="px-6 py-4.5">
                <div className="mx-auto h-8 w-8 rounded-lg bg-stone-100" />
            </td>
        </tr>
    );
}

export function BookingsTableSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="animate-pulse space-y-6">
            <div className="space-y-2">
                <div className="h-10 w-56 max-w-full rounded bg-stone-200" />
                <div className="h-4 w-80 max-w-full rounded bg-stone-100" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-neutral-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="h-10 flex-1 rounded-xl bg-stone-50" />
                    <div className="h-10 w-44 rounded-xl bg-stone-50" />
                </div>
                <div className="flex gap-1 rounded-xl border border-neutral-100 bg-neutral-100/60 p-1.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-8 w-24 rounded-lg bg-white/80" />
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-180 border-collapse">
                        <thead className="border-b border-neutral-100 bg-stone-50/60">
                            <tr>
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <th key={i} className="px-6 py-4">
                                        <div className="h-3.5 w-16 rounded bg-stone-200" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: rows }).map((_, i) => (
                                <TableRowSkeleton key={i} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white px-6 py-4 shadow-sm">
                <div className="h-4 w-48 rounded bg-stone-100" />
                <div className="flex items-center gap-2">
                    <div className="h-9 w-16 rounded-lg border border-stone-200 bg-stone-50" />
                    <div className="h-4 w-10 rounded bg-stone-100" />
                    <div className="h-9 w-16 rounded-lg border border-stone-200 bg-stone-50" />
                </div>
            </div>
        </div>
    );
}
