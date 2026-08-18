function SelectPillSkeleton() {
    return (
        <div className="mt-4 flex h-9 w-full items-center justify-center rounded-full border border-stone-400 bg-stone-50 sm:h-10">
            <div className="h-3 w-16 rounded bg-stone-200" />
        </div>
    );
}

function AnyTechnicianCardSkeleton() {
    return (
        <div className="flex h-full flex-col items-center justify-between rounded-2xl border-2 border-stone-300 bg-white/70 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-stone-200 sm:h-20 sm:w-20" />
                <div className="mt-3 h-5 w-32 rounded bg-stone-200 sm:mt-4 sm:h-6" />
                <div className="mt-2 space-y-1.5">
                    <div className="mx-auto h-3.5 w-28 rounded bg-stone-100" />
                    <div className="mx-auto h-3.5 w-24 rounded bg-stone-100" />
                </div>
            </div>
            <SelectPillSkeleton />
        </div>
    );
}

function StaffCardSkeleton() {
    return (
        <div className="flex h-full flex-col items-center justify-between rounded-2xl border-2 border-stone-300 bg-white/70 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-secondary-100 sm:h-20 sm:w-20" />
                <div className="mt-3 h-5 w-24 rounded bg-stone-200 sm:mt-4 sm:h-6 sm:w-28" />
                <div className="mt-2 h-3.5 w-20 rounded bg-stone-100" />
            </div>
            <SelectPillSkeleton />
        </div>
    );
}

export function EmployeeStepSkeleton({ staffCount = 4 }: { staffCount?: number }) {
    return (
        <div className="w-full animate-pulse space-y-6 sm:space-y-10">
            <div className="max-w-md space-y-2">
                <div className="h-4 w-full rounded bg-stone-100 sm:h-4" />
                <div className="h-4 w-[94%] rounded bg-stone-100 sm:h-4" />
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
                <li>
                    <AnyTechnicianCardSkeleton />
                </li>
                {Array.from({ length: staffCount }).map((_, i) => (
                    <li key={i}>
                        <StaffCardSkeleton />
                    </li>
                ))}
            </ul>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:static sm:border-t sm:border-stone-200/60 sm:bg-transparent sm:p-0 sm:pt-4 sm:shadow-none sm:backdrop-blur-none">
                <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
                    <div className="flex h-10 items-center gap-2 rounded-full border border-stone-300 bg-background px-3.5 sm:h-11 sm:gap-3 sm:px-4">
                        <div className="h-5 w-5 rounded-full bg-stone-100" />
                        <div className="hidden h-3.5 w-28 rounded bg-stone-100 sm:block" />
                    </div>
                    <div className="h-10 w-36 rounded-full bg-stone-200 sm:h-11 sm:w-40" />
                </div>
            </div>
        </div>
    );
}
