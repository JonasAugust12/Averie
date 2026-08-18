export function TimeSlotsSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-11 rounded-xl bg-stone-100 border border-neutral-100" />
            ))}
        </div>
    );
}
