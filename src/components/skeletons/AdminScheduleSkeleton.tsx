function StatCardSkeleton() {
    return (
        <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ring-1 ring-black/3">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-stone-200" />
            <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-stone-100" />
                <div className="h-7 w-10 rounded bg-stone-200" />
            </div>
        </div>
    );
}

function CalendarPanelSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm ring-1 ring-black/3">
            <div className="border-b border-stone-100 bg-linear-to-r from-stone-50 to-white px-4 py-3">
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-6 w-24 rounded-md bg-stone-100" />
                    ))}
                </div>
            </div>
            <div className="border-b border-stone-100 bg-stone-50 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                        <div className="h-8 w-16 rounded-full bg-stone-200" />
                        <div className="h-8 w-16 rounded-full bg-stone-200" />
                        <div className="h-8 w-14 rounded-full bg-stone-100" />
                    </div>
                    <div className="h-6 w-36 rounded bg-stone-200" />
                    <div className="flex gap-2">
                        <div className="h-8 w-16 rounded-full bg-stone-100" />
                        <div className="h-8 w-16 rounded-full bg-stone-100" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-stone-100 p-3">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-md bg-white" />
                ))}
            </div>
        </div>
    );
}

function UpcomingSidebarSkeleton() {
    return (
        <aside className="flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm ring-1 ring-black/3">
            <div className="border-b border-stone-100 bg-linear-to-r from-stone-50/90 to-white px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                        <div className="h-5 w-28 rounded bg-stone-200" />
                        <div className="h-3 w-40 rounded bg-stone-100" />
                    </div>
                    <div className="h-6 w-8 rounded-full bg-stone-300" />
                </div>
            </div>
            <div className="space-y-2 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-stone-100 bg-stone-50/40 p-3"
                    >
                        <div className="h-12 w-13 shrink-0 rounded-xl bg-stone-200" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-stone-200" />
                                    <div className="h-3 w-1/2 rounded bg-stone-100" />
                                </div>
                                <div className="h-5 w-16 shrink-0 rounded-full bg-stone-200" />
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="h-3 w-24 rounded bg-stone-100" />
                                <div className="h-5 w-20 rounded-full bg-stone-100" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

function HeaderSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-stone-200" />
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-stone-300 sm:h-14 sm:w-14" />
                    <div className="space-y-2">
                        <div className="h-8 w-56 max-w-full rounded bg-stone-200" />
                        <div className="h-4 w-72 max-w-full rounded bg-stone-100" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-24 rounded-full bg-stone-200" />
                    <div className="h-9 w-32 rounded-full bg-stone-200" />
                </div>
            </div>
        </div>
    );
}

export function AdminScheduleSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <HeaderSkeleton />

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <CalendarPanelSkeleton />
                <UpcomingSidebarSkeleton />
            </div>
        </div>
    );
}
