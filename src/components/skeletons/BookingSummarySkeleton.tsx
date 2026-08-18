export function BookingSummarySkeleton() {
    return (
        <aside className="hidden animate-pulse space-y-3 lg:block lg:sticky lg:top-40">
            <div className="overflow-hidden rounded-2xl border border-stone-200/60 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-md">
                <div className="border-b border-stone-200/40 px-5 py-4">
                    <div className="h-6 w-32 rounded bg-stone-200" />
                </div>
                <div className="space-y-4 px-5 py-6">
                    <div className="h-4 w-full rounded bg-stone-100" />
                    <div className="h-4 w-4/5 rounded bg-stone-100" />
                </div>
                <div className="border-t border-stone-200/40 px-5 py-4">
                    <div className="h-12 w-full rounded-full bg-stone-200" />
                </div>
            </div>
        </aside>
    );
}
