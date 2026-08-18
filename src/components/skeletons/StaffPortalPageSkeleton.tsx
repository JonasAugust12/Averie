import { StaffCalendarSkeleton } from './StaffCalendarSkeleton';

export function StaffPortalPageSkeleton() {
    return (
        <div className="min-h-screen animate-pulse bg-stone-50">
            <div className="h-14 border-b border-stone-200/80 bg-white/85 px-3 sm:px-6">
                <div className="mx-auto flex h-full max-w-3xl items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-stone-200" />
                        <div className="h-6 w-20 rounded bg-stone-200" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-stone-200" />
                        <div className="h-8 w-8 rounded-full bg-stone-200" />
                        <div className="h-8 w-28 rounded-full bg-stone-200" />
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-3xl space-y-5 px-3 py-5 sm:px-6 sm:py-8">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5">
                    <div className="flex items-center gap-3.5">
                        <div className="h-14 w-14 shrink-0 rounded-2xl bg-stone-200 sm:h-18 sm:w-18" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-6 w-40 rounded bg-stone-200" />
                            <div className="h-4 w-56 max-w-full rounded bg-stone-100" />
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-stone-100 pt-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-6 w-16 rounded-full bg-stone-100" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center rounded-xl border border-stone-200 bg-white py-3"
                        >
                            <div className="h-7 w-8 rounded bg-stone-200" />
                            <div className="mt-2 h-3 w-14 rounded bg-stone-100" />
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                    <div className="border-b border-stone-100 bg-stone-50/70 px-4 py-3">
                        <div className="h-5 w-32 rounded bg-stone-200" />
                    </div>
                    <div className="p-2 sm:p-4">
                        <StaffCalendarSkeleton />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/70 px-4 py-3">
                        <div className="space-y-1.5">
                            <div className="h-5 w-28 rounded bg-stone-200" />
                            <div className="h-3 w-40 rounded bg-stone-100" />
                        </div>
                        <div className="h-6 w-8 rounded-full bg-stone-200" />
                    </div>
                    <div className="space-y-2 p-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 rounded-xl border border-stone-100 bg-stone-50/40 p-3"
                            >
                                <div className="h-12 w-13 shrink-0 rounded-xl bg-stone-200" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-stone-200" />
                                    <div className="h-3 w-1/2 rounded bg-stone-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
