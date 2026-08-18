function ToggleSectionSkeleton() {
    return (
        <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-56 max-w-full rounded bg-stone-200" />
                    <div className="h-3.5 w-full max-w-xl rounded bg-stone-100" />
                </div>
                <div className="h-7 w-12 shrink-0 rounded-full bg-stone-200" />
            </div>
        </section>
    );
}

export function PromotionSettingsSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="space-y-2">
                <div className="h-8 w-56 rounded bg-stone-200" />
                <div className="h-4 w-96 max-w-full rounded bg-stone-100" />
            </div>

            <ToggleSectionSkeleton />

            <section className="space-y-4 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <div className="h-6 w-40 rounded bg-stone-200" />
                <div className="h-10 w-full rounded-xl bg-stone-100" />
                <div className="h-24 w-full rounded-xl bg-stone-100" />
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-10 rounded-xl bg-stone-100" />
                    <div className="h-10 rounded-xl bg-stone-100" />
                </div>
                <ToggleSectionSkeleton />
                <div className="h-10 w-32 rounded-md bg-stone-200" />
            </section>

            <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                <div className="border-b border-stone-100 px-6 py-5">
                    <div className="h-6 w-40 rounded bg-stone-200" />
                    <div className="mt-2 h-4 w-72 max-w-full rounded bg-stone-100" />
                </div>
                <div className="space-y-4 p-6">
                    <div className="mx-auto aspect-4/3 w-full max-w-md rounded-2xl bg-stone-100" />
                    <div className="flex gap-3">
                        <div className="h-10 w-36 rounded-md bg-stone-200" />
                    </div>
                </div>
            </section>
        </div>
    );
}
