function PeriodSectionSkeleton({ slotCount = 4 }: { slotCount?: number }) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2.5">
                <div className="h-4.5 w-4.5 rounded bg-stone-200" />
                <div className="h-6 w-28 rounded bg-stone-200" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: slotCount }).map((_, i) => (
                    <div
                        key={i}
                        className="h-13 rounded-xl border-2 border-stone-200 bg-stone-50"
                    />
                ))}
            </div>
        </section>
    );
}

export function TimeStepSkeleton() {
    return (
        <div className="animate-pulse space-y-10">
            <PeriodSectionSkeleton slotCount={4} />
            <PeriodSectionSkeleton slotCount={6} />
            <PeriodSectionSkeleton slotCount={3} />

            <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:pt-2 sm:shadow-none sm:backdrop-blur-none">
                <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 sm:justify-start">
                    <div className="h-10 w-28 rounded-full border border-stone-200 bg-stone-50 sm:h-11" />
                    <div className="h-10 w-36 rounded-full bg-stone-200 sm:h-11" />
                </div>
            </div>
        </div>
    );
}
