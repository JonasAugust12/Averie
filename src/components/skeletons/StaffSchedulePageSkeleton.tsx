import { StaffCalendarSkeleton } from './StaffCalendarSkeleton';

export function StaffSchedulePageSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div>
                <div className="h-5 w-44 rounded bg-stone-100" />

                <div className="relative mt-4 overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">
                    <div className="absolute inset-x-0 top-0 h-1 bg-stone-200" />

                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 rounded-2xl bg-stone-200 sm:h-16 sm:w-16" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="h-8 w-44 max-w-full rounded bg-stone-200 sm:h-9 sm:w-52" />
                                <div className="h-5 w-20 rounded bg-stone-100" />
                            </div>
                            <div className="h-4 w-64 max-w-full rounded bg-stone-100" />
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="h-5 w-16 rounded-full bg-stone-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]"
                    >
                        <div className="h-11 w-11 shrink-0 rounded-xl bg-stone-200" />
                        <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-stone-100" />
                            <div className="h-7 w-10 rounded bg-stone-200" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <StaffCalendarSkeleton />

                <aside className="flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                    <div className="border-b border-stone-100 bg-stone-50/40 px-5 py-4">
                        <div className="h-5 w-28 rounded bg-stone-200" />
                        <div className="mt-1.5 h-3 w-40 rounded bg-stone-100" />
                    </div>
                    <div className="space-y-2 p-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 rounded-xl border border-stone-100 bg-stone-50/40 p-3"
                            >
                                <div className="h-12 w-13 shrink-0 rounded-xl bg-stone-200" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="h-4 w-3/4 rounded bg-stone-200" />
                                            <div className="h-3 w-1/2 rounded bg-stone-100" />
                                        </div>
                                        <div className="h-5 w-16 shrink-0 rounded-full bg-stone-200" />
                                    </div>
                                    <div className="h-3 w-32 rounded bg-stone-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
