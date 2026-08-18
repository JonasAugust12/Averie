export function StaffGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-neutral-100 bg-white p-5 flex gap-4"
                >
                    <div className="h-14 w-14 rounded-full bg-stone-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-stone-200 rounded w-1/2" />
                        <div className="h-3 bg-stone-100 rounded w-3/4" />
                        <div className="h-3 bg-stone-100 rounded w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
