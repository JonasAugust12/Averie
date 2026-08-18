export function ServicesGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-neutral-100 bg-white p-5 space-y-3"
                >
                    <div className="h-5 bg-stone-200 rounded w-2/3" />
                    <div className="h-4 bg-stone-100 rounded w-full" />
                    <div className="h-4 bg-stone-100 rounded w-4/5" />
                    <div className="flex justify-between pt-2">
                        <div className="h-4 bg-stone-200 rounded w-16" />
                        <div className="h-4 bg-stone-200 rounded w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}
