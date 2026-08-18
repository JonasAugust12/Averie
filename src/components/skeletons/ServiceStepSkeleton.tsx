function ServiceRowSkeleton() {
    return (
        <li className="border-l-4 border-transparent px-5 py-5">
            <div className="flex items-start gap-4">
                <div className="mt-1 h-7 w-7 shrink-0 rounded-md border-2 border-stone-400 bg-white shadow-sm" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="h-7 w-2/3 max-w-xs rounded bg-stone-200" />
                        <div className="h-8 w-16 shrink-0 rounded bg-stone-200" />
                    </div>
                    <div className="mt-2 space-y-2">
                        <div className="h-4 w-full rounded bg-stone-100" />
                        <div className="h-4 w-[85%] rounded bg-stone-100" />
                    </div>
                    <div className="mt-3.5 inline-flex h-8 items-center gap-2 rounded-full border border-primary/5 bg-secondary-100/60 px-3.5">
                        <div className="h-4 w-4 rounded bg-stone-200" />
                        <div className="h-3.5 w-20 rounded bg-stone-200" />
                    </div>
                </div>
            </div>
        </li>
    );
}

function CategorySectionSkeleton({ itemCount = 2 }: { itemCount?: number }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border/50 bg-white/70 shadow-md shadow-black/5 backdrop-blur-sm">
            <div className="flex items-center justify-between bg-linear-to-r from-secondary-50 to-tertiary-100/50 px-5 py-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-white/80 shadow-sm ring-1 ring-stone-100" />
                    <div className="space-y-2">
                        <div className="h-8 w-44 rounded bg-stone-200" />
                        <div className="h-4 w-24 rounded bg-stone-100" />
                    </div>
                </div>
                <div className="h-5 w-5 rounded bg-stone-200" />
            </div>
            <ul className="divide-y divide-border/30 border-t border-border/30">
                {Array.from({ length: itemCount }).map((_, i) => (
                    <ServiceRowSkeleton key={i} />
                ))}
            </ul>
        </section>
    );
}

export function ServiceStepSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="space-y-2">
                <div className="h-5 w-full max-w-2xl rounded bg-stone-100" />
                <div className="h-5 w-[92%] max-w-xl rounded bg-stone-100" />
            </div>
            <CategorySectionSkeleton itemCount={3} />
            <CategorySectionSkeleton itemCount={2} />
            <CategorySectionSkeleton itemCount={2} />
        </div>
    );
}
