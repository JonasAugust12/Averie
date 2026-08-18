export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-28 rounded-2xl bg-stone-100 border border-neutral-100"
                    />
                ))}
            </div>
            <div className="h-80 rounded-2xl bg-stone-100 border border-neutral-100" />
        </div>
    );
}
