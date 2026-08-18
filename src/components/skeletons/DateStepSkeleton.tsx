const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function DateStepSkeleton() {
    return (
        <div className="w-full max-w-xl animate-pulse space-y-8">
            <div className="rounded-lg border border-border/60 bg-neutral p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="h-12 w-12 rounded-full bg-stone-200" />
                    <div className="h-7 w-40 rounded bg-stone-200" />
                    <div className="h-12 w-12 rounded-full bg-stone-200" />
                </div>

                <div className="mb-3 grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((day) => (
                        <div key={day} className="flex justify-center">
                            <div className="h-4 w-8 rounded bg-stone-100" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="flex aspect-square items-center justify-center">
                            <div className="h-9 w-9 rounded-full bg-stone-100" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden items-center justify-between gap-3 sm:flex">
                <div className="h-10 w-28 rounded-full bg-stone-100" />
                <div className="h-5 w-32 rounded bg-stone-100" />
                <div className="h-10 w-32 rounded-full bg-stone-200" />
            </div>
        </div>
    );
}
