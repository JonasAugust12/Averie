function ToggleSectionSkeleton() {
    return (
        <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-56 max-w-full rounded bg-stone-200" />
                    <div className="h-3.5 w-full max-w-xl rounded bg-stone-100" />
                    <div className="h-3.5 w-4/5 max-w-md rounded bg-stone-100" />
                </div>
                <div className="h-7 w-12 shrink-0 rounded-full bg-stone-200" />
            </div>
        </section>
    );
}

function PeriodCardSkeleton({ slotCount = 4 }: { slotCount?: number }) {
    return (
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-stone-200" />
                    <div className="h-4 w-20 rounded bg-stone-200" />
                </div>
                <div className="h-3 w-32 rounded bg-stone-100" />
            </div>
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: slotCount }).map((_, i) => (
                    <div
                        key={i}
                        className="h-8 w-22 rounded-full border border-stone-200 bg-stone-50"
                    />
                ))}
            </div>
            <div className="mt-3 flex gap-2">
                <div className="h-10 w-40 max-w-40 rounded-xl border border-stone-200 bg-stone-50" />
                <div className="h-9 w-28 rounded-md border border-stone-200 bg-stone-50" />
            </div>
        </div>
    );
}

export function ScheduleSettingsSkeleton() {
    return (
        <div className="mx-auto max-w-3xl animate-pulse space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-64 max-w-full rounded bg-stone-200" />
                    <div className="h-4 w-80 max-w-full rounded bg-stone-100" />
                </div>
                <div className="h-10 w-32 rounded-md bg-stone-200" />
            </div>

            <ToggleSectionSkeleton />
            <ToggleSectionSkeleton />

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                    <div className="h-6 w-48 rounded bg-stone-200" />
                    <div className="h-3.5 w-full max-w-lg rounded bg-stone-100" />
                </div>

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-9 rounded-full border px-4 py-2 ${
                                i === 0
                                    ? 'w-14 border-stone-300 bg-stone-300'
                                    : 'w-12 border-stone-200 bg-stone-50'
                            }`}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-stone-100 bg-stone-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="h-4 w-12 rounded bg-stone-200" />
                        <div className="h-3 w-48 rounded bg-stone-100" />
                    </div>
                    <div className="h-7 w-12 shrink-0 rounded-full bg-stone-200" />
                </div>

                <div className="space-y-4">
                    <PeriodCardSkeleton slotCount={6} />
                    <PeriodCardSkeleton slotCount={8} />
                    <PeriodCardSkeleton slotCount={3} />
                </div>
            </section>

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                    <div className="h-6 w-32 rounded bg-stone-200" />
                    <div className="h-3.5 w-full max-w-md rounded bg-stone-100" />
                </div>

                <div className="mt-4 h-16 rounded-xl border border-stone-100 bg-stone-50/50" />

                <div className="mt-4 flex flex-wrap items-end gap-3">
                    <div className="space-y-2">
                        <div className="h-3 w-12 rounded bg-stone-100" />
                        <div className="h-10 w-40 rounded-xl border border-stone-200 bg-stone-50" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-16 rounded bg-stone-100" />
                        <div className="h-10 w-44 rounded-xl border border-stone-200 bg-stone-50" />
                    </div>
                    <div className="h-10 w-36 rounded-md bg-stone-300" />
                </div>
            </section>
        </div>
    );
}
