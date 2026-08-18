function StatCardSkeleton({ cardClass, iconClass }: { cardClass: string; iconClass: string }) {
    return (
        <div className={`flex items-start gap-4 rounded-2xl border p-5 ${cardClass}`}>
            <div className={`h-11 w-11 shrink-0 rounded-xl ${iconClass}`} />
            <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-stone-100/80" />
                <div className="h-8 w-10 rounded bg-stone-200" />
            </div>
        </div>
    );
}

function StaffCardSkeleton() {
    return (
        <article className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
            <div className="flex items-start gap-4 p-5 sm:p-6">
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-stone-200 shadow-sm" />
                <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-5 w-40 rounded bg-stone-200" />
                    <div className="h-4 w-24 rounded bg-stone-100" />
                    <div className="flex flex-wrap gap-1.5">
                        <div className="h-7 w-20 rounded-lg border border-stone-200/60 bg-stone-100/90" />
                        <div className="h-7 w-24 rounded-lg border border-stone-200/60 bg-stone-100/90" />
                    </div>
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2">
                            <div className="h-3.5 w-3.5 rounded bg-stone-200" />
                            <div className="h-3.5 w-28 rounded bg-stone-100" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3.5 w-3.5 rounded bg-stone-200" />
                            <div className="h-3.5 w-36 rounded bg-stone-100" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/60 px-5 py-3.5">
                <div className="flex h-9 items-center gap-2 rounded-xl border border-stone-200/80 bg-white px-3.5 shadow-xs">
                    <div className="h-4 w-4 rounded bg-stone-200" />
                    <div className="h-3.5 w-24 rounded bg-stone-100" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden h-4 w-10 rounded bg-stone-100 sm:block" />
                    <div className="h-6 w-11 rounded-full bg-emerald-200" />
                    <div className="flex items-center gap-1.5">
                        <div className="h-9 w-9 rounded-xl border border-stone-200/80 bg-white shadow-xs" />
                        <div className="h-9 w-9 rounded-xl border border-red-200/60 bg-white shadow-xs" />
                    </div>
                </div>
            </div>
        </article>
    );
}

function SearchBarSkeleton() {
    return (
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-stone-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md md:flex-row">
            <div className="relative w-full md:max-w-xl">
                <div className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded bg-stone-200" />
                <div className="h-10.5 w-full rounded-xl border border-stone-200/80 bg-stone-50/50 pl-10" />
            </div>
        </div>
    );
}

export function StaffGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="animate-pulse space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-56 max-w-full rounded bg-stone-200" />
                    <div className="h-4 w-64 max-w-full rounded bg-stone-100" />
                </div>
                <div className="h-10 w-40 shrink-0 rounded-full bg-stone-200" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCardSkeleton
                    cardClass="bg-sky-50/40 border-sky-100"
                    iconClass="bg-sky-100/60"
                />
                <StatCardSkeleton
                    cardClass="bg-amber-50/40 border-amber-100"
                    iconClass="bg-amber-100/60"
                />
                <StatCardSkeleton
                    cardClass="bg-stone-50/60 border-stone-100"
                    iconClass="bg-stone-100/60"
                />
            </div>

            <SearchBarSkeleton />

            <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: count }).map((_, i) => (
                    <StaffCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
