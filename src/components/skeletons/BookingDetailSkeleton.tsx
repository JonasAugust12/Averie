export function BookingDetailSkeleton() {
    return (
        <div className="space-y-6 animate-pulse max-w-2xl">
            <div className="h-8 bg-stone-200 rounded w-48" />
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 space-y-4">
                <div className="h-4 bg-stone-100 rounded w-full" />
                <div className="h-4 bg-stone-100 rounded w-5/6" />
                <div className="h-4 bg-stone-100 rounded w-2/3" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-16 bg-stone-50 rounded-xl" />
                    <div className="h-16 bg-stone-50 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
