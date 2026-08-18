export function BookingsTableSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white animate-pulse">
            <div className="h-12 bg-stone-100/80" />
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 px-6 py-4 border-t border-neutral-100">
                    <div className="h-4 bg-stone-200 rounded w-24" />
                    <div className="h-4 bg-stone-200 rounded flex-1" />
                    <div className="h-4 bg-stone-200 rounded w-32" />
                    <div className="h-4 bg-stone-200 rounded w-20" />
                </div>
            ))}
        </div>
    );
}
