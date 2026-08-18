function ServiceCardRowSkeleton() {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs">
            <div className="mr-6 min-w-0 flex-1 space-y-3">
                <div className="h-[15.5px] w-48 max-w-full rounded bg-stone-200" />
                <div className="space-y-2">
                    <div className="h-3.25 w-full rounded bg-stone-100" />
                    <div className="h-3.25 w-[85%] rounded bg-stone-100" />
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                    <div className="h-3.5 w-16 rounded bg-stone-100" />
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                    <div className="h-3.5 w-14 rounded bg-stone-100" />
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 border-l border-stone-200/50 pl-5">
                <div className="h-6 w-11 rounded-full bg-stone-300" />
                <div className="flex items-center gap-1.5">
                    <div className="h-9 w-9 rounded-lg border border-stone-200/60 bg-white shadow-xs" />
                    <div className="h-9 w-9 rounded-lg border border-stone-200/60 bg-white shadow-xs" />
                </div>
            </div>
        </div>
    );
}

function ServiceCategorySectionSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-stone-300 bg-[#f4f3f2] p-6">
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="h-6 w-18 shrink-0 rounded-lg border border-stone-200/50 bg-white" />
                    <div className="h-7 w-40 max-w-full rounded bg-stone-200" />
                    <div className="hidden h-4 w-24 shrink-0 rounded bg-stone-100 sm:block" />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden h-9 w-16 rounded-lg border border-stone-200/40 bg-white sm:block" />
                    <div className="h-9 w-9 rounded-lg border border-stone-200/60 bg-white shadow-xs" />
                    <div className="h-9 w-9 rounded-lg border border-red-200/60 bg-white shadow-xs" />
                    <div className="h-9 w-9 rounded-lg border border-stone-200/40 bg-white shadow-sm" />
                </div>
            </div>
            <div className="-mx-2 space-y-1.5">
                {Array.from({ length: rows }).map((_, i) => (
                    <ServiceCardRowSkeleton key={i} />
                ))}
            </div>
        </div>
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

export function ServicesGridSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-64 max-w-full rounded bg-stone-200" />
                    <div className="h-4 w-72 max-w-full rounded bg-stone-100" />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <div className="h-10 w-36 rounded-md border border-stone-200 bg-white" />
                    <div className="h-10 w-32 rounded-md bg-stone-200" />
                </div>
            </div>

            <SearchBarSkeleton />

            <div className="space-y-4">
                <ServiceCategorySectionSkeleton rows={3} />
                <ServiceCategorySectionSkeleton rows={2} />
                <ServiceCategorySectionSkeleton rows={2} />
            </div>
        </div>
    );
}
