const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function DateStepSkeleton() {
    return (
        <div className="w-full animate-pulse space-y-6">
            {/* Top Notice Banner Skeleton */}
            <div className="flex items-start gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4">
                <div className="size-8 shrink-0 rounded-full bg-stone-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-44 rounded bg-stone-200" />
                    <div className="h-3.5 w-3/4 rounded bg-stone-200/70" />
                </div>
            </div>

            {/* Layout Grid: Calendar (Left) & Promotion Card (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* Calendar Card Skeleton */}
                <div className="lg:col-span-6 overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 p-5 sm:p-7 lg:p-8 shadow-xl shadow-stone-900/5 backdrop-blur-md flex flex-col justify-between">
                    <div>
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div className="size-11 rounded-full bg-stone-200" />
                            <div className="h-7 w-44 rounded-xl bg-stone-200" />
                            <div className="size-11 rounded-full bg-stone-200" />
                        </div>

                        {/* Weekdays */}
                        <div className="mb-3 grid grid-cols-7 gap-1">
                            {WEEKDAYS.map((day) => (
                                <div key={day} className="flex justify-center py-1">
                                    <div className="h-3.5 w-7 rounded bg-stone-200" />
                                </div>
                            ))}
                        </div>

                        {/* Date Grid */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex aspect-square items-center justify-center rounded-2xl bg-stone-100/90"
                                >
                                    <div className="h-4 w-5 rounded bg-stone-200" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend Skeleton */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-stone-200/60 pt-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className="size-2.5 rounded-full bg-stone-200" />
                                <div className="h-3 w-14 rounded bg-stone-200" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promotion Companion Card Skeleton */}
                <div className="lg:col-span-6 relative flex flex-col justify-between rounded-3xl border border-stone-200/90 bg-linear-to-b from-white via-white/95 to-stone-50/90 p-5 sm:p-7 lg:p-8 shadow-xl shadow-stone-900/5 backdrop-blur-md overflow-hidden">
                    {/* Top simulated badge & date pill */}
                    <div className="space-y-4 sm:space-y-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="h-6 w-36 rounded-full bg-rose-100/80" />
                            <div className="h-6 w-32 rounded-full bg-stone-200/70" />
                        </div>

                        {/* 16:9 Banner Image Skeleton */}
                        <div className="relative aspect-video sm:aspect-21/9 lg:aspect-video w-full overflow-hidden rounded-2xl bg-stone-200/80" />

                        {/* Title & Description Skeleton */}
                        <div className="space-y-2">
                            <div className="h-6 w-3/4 rounded-lg bg-stone-200" />
                            <div className="space-y-1.5 pt-1">
                                <div className="h-3.5 w-full rounded bg-stone-100" />
                                <div className="h-3.5 w-5/6 rounded bg-stone-100" />
                                <div className="h-3.5 w-2/3 rounded bg-stone-100" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Perks Box Skeleton */}
                    <div className="mt-6 rounded-2xl border border-stone-200/70 bg-stone-50/70 p-4 sm:p-5 space-y-2.5">
                        <div className="h-3.5 w-48 rounded bg-stone-200" />
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-stone-200 shrink-0" />
                                <div className="h-3 w-56 rounded bg-stone-200/80" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-stone-200 shrink-0" />
                                <div className="h-3 w-52 rounded bg-stone-200/80" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-stone-200 shrink-0" />
                                <div className="h-3 w-60 rounded bg-stone-200/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Skeleton */}
            <div className="flex items-center justify-between gap-3 pt-2">
                <div className="h-11 w-28 rounded-full bg-stone-200/80" />
                <div className="h-11 w-32 rounded-full bg-stone-300" />
            </div>
        </div>
    );
}
