function KpiCardSkeleton() {
    return (
        <article className="flex items-start gap-4 rounded-2xl border border-stone-200/50 bg-white p-5 shadow-xs">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-stone-200 p-3" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-stone-100" />
                <div className="h-8 w-16 rounded bg-stone-200" />
                <div className="h-3.5 w-32 rounded bg-stone-100" />
            </div>
        </article>
    );
}

function PanelHeaderSkeleton({ iconClass = 'bg-stone-200' }: { iconClass?: string }) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <div className={`h-10 w-10 shrink-0 rounded-xl ${iconClass}`} />
            <div className="space-y-2">
                <div className="h-5 w-44 max-w-full rounded bg-stone-200" />
                <div className="h-3.5 w-56 max-w-full rounded bg-stone-100" />
            </div>
        </div>
    );
}

function LeaderboardRowSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-stone-200/50 bg-white px-3.5 py-3 shadow-xs">
            <div className="h-8 w-8 shrink-0 rounded-full bg-stone-900/20" />
            <div className="h-10 w-10 shrink-0 rounded-xl bg-stone-100" />
            <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-28 rounded bg-stone-200" />
                <div className="h-3 w-20 rounded bg-stone-100" />
            </div>
            <div className="space-y-1.5 text-right">
                <div className="ml-auto h-4 w-6 rounded bg-stone-200" />
                <div className="ml-auto h-3 w-14 rounded bg-stone-100" />
            </div>
        </div>
    );
}

function PopularServiceRowSkeleton() {
    return (
        <tr>
            <td className="px-3.5 py-2.5">
                <div className="h-4 w-36 rounded bg-stone-200" />
            </td>
            <td className="px-3.5 py-2.5">
                <div className="mx-auto h-4 w-16 rounded bg-stone-100" />
            </td>
            <td className="px-3.5 py-2.5">
                <div className="ml-auto h-4 w-14 rounded bg-stone-200" />
            </td>
        </tr>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <KpiCardSkeleton key={i} />
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="flex flex-col rounded-2xl border border-stone-200/50 bg-white p-5 shadow-xs lg:col-span-2">
                    <PanelHeaderSkeleton iconClass="bg-primary/20" />
                    <div className="relative h-64 sm:h-72">
                        <div className="absolute top-2 right-4 flex gap-4">
                            <div className="h-3 w-20 rounded bg-stone-100" />
                            <div className="h-3 w-24 rounded bg-stone-100" />
                        </div>
                        <div className="flex h-full items-end gap-3 border-t border-stone-100 pt-6">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full max-w-8 rounded-t-md bg-stone-100"
                                        style={{ height: `${40 + (i % 4) * 28}px` }}
                                    />
                                    <div className="h-2.5 w-8 rounded bg-stone-100" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 h-14 rounded-xl border border-primary-200/30 bg-primary-50/20" />
                </section>

                <section className="flex flex-col rounded-2xl border border-stone-200/50 bg-white p-5 shadow-xs">
                    <PanelHeaderSkeleton iconClass="bg-primary/20" />
                    <div className="space-y-4 pt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between gap-3">
                                    <div className="h-3.5 w-32 rounded bg-stone-200" />
                                    <div className="h-3.5 w-20 rounded bg-stone-100" />
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-stone-100">
                                    <div
                                        className="h-2.5 rounded-full bg-stone-200"
                                        style={{ width: `${72 - i * 10}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto h-14 rounded-xl border border-primary-200/30 bg-primary-50/20" />
                </section>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md">
                    <PanelHeaderSkeleton iconClass="bg-amber-500/20" />
                    <div className="space-y-2.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <LeaderboardRowSkeleton key={i} />
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-5 shadow-md">
                    <PanelHeaderSkeleton iconClass="bg-purple-500/20" />
                    <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white">
                        <div className="grid grid-cols-3 gap-3 border-b border-stone-200/65 bg-stone-50/50 px-3.5 py-2.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-3 rounded bg-stone-200" />
                            ))}
                        </div>
                        <table className="w-full">
                            <tbody>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <PopularServiceRowSkeleton key={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <section className="rounded-2xl border border-neutral-200/50 bg-white/95 p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="space-y-2">
                        <div className="h-6 w-40 rounded bg-stone-200" />
                        <div className="h-3.5 w-56 rounded bg-stone-100" />
                    </div>
                    <div className="h-4 w-16 rounded bg-stone-100" />
                </div>
                <div className="overflow-hidden rounded-xl border border-stone-200/60">
                    <div className="grid grid-cols-5 gap-4 border-b border-stone-100 bg-stone-50/80 px-4 py-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-3 rounded bg-stone-200" />
                        ))}
                    </div>
                    {Array.from({ length: 5 }).map((_, row) => (
                        <div
                            key={row}
                            className="grid grid-cols-5 gap-4 border-b border-stone-100 px-4 py-4 last:border-b-0"
                        >
                            {Array.from({ length: 5 }).map((_, col) => (
                                <div key={col} className="h-4 rounded bg-stone-100" />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="mt-4 h-12 rounded-xl border border-primary-200/30 bg-primary-50/50" />
            </section>
        </div>
    );
}
