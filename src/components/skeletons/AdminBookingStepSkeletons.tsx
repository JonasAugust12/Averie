function AdminBookingServiceCardSkeleton() {
    return (
        <div className="flex items-start justify-between gap-3 rounded-2xl border-2 border-stone-200/80 bg-white p-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-stone-300 bg-white" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-5 w-3/4 max-w-[220px] rounded bg-stone-200" />
                    <div className="h-3.5 w-full rounded bg-stone-100" />
                    <div className="h-3.5 w-[90%] rounded bg-stone-100" />
                    <div className="inline-flex h-6 w-[88px] items-center gap-1 rounded-full bg-stone-100 px-2" />
                </div>
            </div>
            <div className="h-7 w-16 shrink-0 rounded bg-stone-200" />
        </div>
    );
}

export function AdminBookingServiceStepSkeleton() {
    return (
        <div className="animate-pulse space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <div className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded bg-stone-200" />
                    <div className="h-[42px] w-full rounded-xl border border-stone-200 bg-white pl-10 shadow-xs" />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <div className="h-10 w-[88px] shrink-0 rounded-xl bg-stone-900" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-28 shrink-0 rounded-xl border border-stone-200 bg-white"
                        />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <AdminBookingServiceCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

function AdminBookingSelectPillSkeleton() {
    return (
        <div className="mt-4 flex h-[34px] w-full items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-stone-50 px-3">
            <div className="h-3 w-3 rounded bg-stone-200" />
            <div className="h-3 w-14 rounded bg-stone-200" />
        </div>
    );
}

function AdminBookingAnyStaffCardSkeleton() {
    return (
        <div className="flex flex-col items-center justify-between rounded-2xl border-2 border-stone-200/80 bg-white p-5 text-center">
            <div className="flex flex-col items-center">
                <div className="mb-3 h-14 w-14 rounded-full bg-stone-200" />
                <div className="h-5 w-36 max-w-full rounded bg-stone-200" />
            </div>
            <AdminBookingSelectPillSkeleton />
        </div>
    );
}

function AdminBookingStaffMemberCardSkeleton() {
    return (
        <div className="flex flex-col items-center justify-between rounded-2xl border-2 border-stone-200/80 bg-white p-5 text-center">
            <div className="flex flex-col items-center">
                <div className="mb-3 h-14 w-14 rounded-full bg-stone-200 shadow-sm" />
                <div className="h-5 w-28 rounded bg-stone-200" />
                <div className="mt-2 h-3.5 w-20 rounded bg-stone-100" />
            </div>
            <AdminBookingSelectPillSkeleton />
        </div>
    );
}

export function AdminBookingStaffStepSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-4 w-80 max-w-full rounded bg-stone-100" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <AdminBookingAnyStaffCardSkeleton />
                {Array.from({ length: 5 }).map((_, i) => (
                    <AdminBookingStaffMemberCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function AdminBookingDateStepSkeleton() {
    return (
        <div className="mx-auto w-full max-w-md animate-pulse space-y-5 lg:max-w-lg">
            <div className="flex gap-2 overflow-hidden pb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 w-24 shrink-0 rounded-xl bg-stone-100" />
                ))}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center justify-between">
                    <div className="h-8 w-8 rounded-full border border-stone-200 bg-stone-50" />
                    <div className="h-6 w-36 rounded bg-stone-200" />
                    <div className="h-8 w-8 rounded-full border border-stone-200 bg-stone-50" />
                </div>
                <div className="mb-2 grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((day) => (
                        <div key={day} className="flex justify-center">
                            <div className="h-3 w-8 rounded bg-stone-100" />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="flex aspect-square items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-stone-100" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto h-4 w-56 rounded bg-stone-100" />
        </div>
    );
}

function AdminBookingPeriodSkeleton({ slotCount = 6 }: { slotCount?: number }) {
    return (
        <div className="space-y-2.5">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-stone-200" />
                <div className="h-4 w-24 rounded bg-stone-200" />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {Array.from({ length: slotCount }).map((_, i) => (
                    <div key={i} className="h-10 rounded-xl border border-stone-200 bg-white" />
                ))}
            </div>
        </div>
    );
}

export function AdminBookingTimeStepSkeleton() {
    return (
        <div className="w-full animate-pulse space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div className="h-4 w-56 rounded bg-stone-100" />
                <div className="h-3 w-20 rounded bg-stone-100" />
            </div>
            <div className="space-y-5">
                <AdminBookingPeriodSkeleton slotCount={4} />
                <AdminBookingPeriodSkeleton slotCount={6} />
                <AdminBookingPeriodSkeleton slotCount={3} />
            </div>
        </div>
    );
}
