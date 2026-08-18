export function StaffCalendarSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            <div className="border-b border-stone-100 bg-linear-to-r from-stone-50 to-white px-4 py-3">
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-6 w-24 rounded-md bg-stone-100" />
                    ))}
                </div>
            </div>
            <div className="border-b border-stone-100 bg-stone-50 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                        <div className="h-8 w-16 rounded-full bg-stone-200" />
                        <div className="h-8 w-16 rounded-full bg-stone-200" />
                        <div className="h-8 w-14 rounded-full bg-stone-100" />
                    </div>
                    <div className="h-6 w-36 rounded bg-stone-200" />
                    <div className="flex gap-2">
                        <div className="h-8 w-16 rounded-full bg-stone-100" />
                        <div className="h-8 w-16 rounded-full bg-stone-100" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-stone-100 p-3">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-md bg-white" />
                ))}
            </div>
        </div>
    );
}
