export function BookingConfirmationSkeleton() {
    return (
        <div className="w-full flex flex-col items-center animate-pulse">
            {/* Hero Header Skeleton */}
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8 w-full max-w-md">
                <div className="mb-3 sm:mb-4 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-stone-200" />
                <div className="h-6 w-44 rounded-full bg-stone-200 mb-3" />
                <div className="h-8 w-64 sm:w-80 rounded-xl bg-stone-200 mb-2" />
                <div className="h-4 w-56 sm:w-72 rounded-md bg-stone-100" />
            </div>

            {/* 2-Column Bento Grid Skeleton */}
            <div className="grid w-full gap-6 md:grid-cols-2 md:items-start lg:gap-8">
                {/* Left Column: Boarding Pass Ticket Card Skeleton */}
                <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 shadow-sm">
                    {/* Reference Bar */}
                    <div className="border-b border-stone-200/80 bg-stone-50/80 p-4 sm:p-5 flex items-center justify-between gap-3">
                        <div className="space-y-1.5">
                            <div className="h-3 w-20 rounded bg-stone-200" />
                            <div className="h-6 w-32 rounded bg-stone-300" />
                        </div>
                        <div className="h-8 w-24 rounded-full bg-stone-200" />
                    </div>

                    {/* Services Details */}
                    <div className="p-5 sm:p-6 border-b border-stone-100 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="h-3 w-20 rounded bg-stone-200" />
                            <div className="h-4 w-16 rounded-full bg-stone-100" />
                        </div>
                        <div className="rounded-2xl border border-stone-200/70 bg-stone-50/50 p-2 space-y-2">
                            <div className="h-12 w-full rounded-xl bg-stone-200/80" />
                            <div className="h-12 w-full rounded-xl bg-stone-200/60" />
                        </div>
                    </div>

                    {/* Bento Grid: Technician & Schedule */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 border-b border-stone-100 bg-white p-4 sm:p-5 gap-4">
                        {/* Technician */}
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded bg-stone-200" />
                            <div className="flex items-center gap-3">
                                <div className="size-10 sm:size-11 rounded-xl bg-stone-200 shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-4 w-28 rounded bg-stone-300" />
                                    <div className="h-3 w-20 rounded bg-stone-100" />
                                </div>
                            </div>
                        </div>
                        {/* Schedule */}
                        <div className="space-y-2 pt-3 sm:pt-0 sm:pl-4">
                            <div className="h-3 w-24 rounded bg-stone-200" />
                            <div className="flex items-center gap-3">
                                <div className="size-10 sm:size-11 rounded-xl bg-stone-200 shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-4 w-32 rounded bg-stone-300" />
                                    <div className="h-3 w-20 rounded bg-stone-100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/30 space-y-2">
                        <div className="h-3 w-24 rounded bg-stone-200" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="h-9 rounded-xl bg-stone-200/70" />
                            <div className="h-9 rounded-xl bg-stone-200/70" />
                        </div>
                    </div>

                    {/* Price & Summary Total */}
                    <div className="border-t border-stone-200 bg-stone-100/50 p-4 sm:p-6 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="h-3 w-16 rounded bg-stone-200" />
                            <div className="h-3.5 w-32 rounded bg-stone-100" />
                        </div>
                        <div className="h-7 w-20 rounded-lg bg-stone-300" />
                    </div>

                    {/* Actions */}
                    <div className="hidden border-t border-stone-200 bg-white p-5 sm:p-6 md:flex md:flex-col md:gap-2.5">
                        <div className="h-11 w-full rounded-full bg-stone-300" />
                        <div className="h-10 w-full rounded-full bg-stone-200" />
                    </div>
                </div>

                {/* Right Column: Salon Concierge & Location Skeleton */}
                <div className="flex w-full flex-col gap-5">
                    <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 shadow-sm">
                        {/* Address Header */}
                        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-start gap-3.5">
                            <div className="size-10 rounded-2xl bg-stone-200 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-4 w-28 rounded bg-stone-300" />
                                <div className="h-3.5 w-44 rounded bg-stone-200" />
                                <div className="h-3 w-32 rounded bg-stone-100" />
                            </div>
                        </div>
                        {/* Map iframe placeholder */}
                        <div className="relative aspect-16/10 w-full bg-stone-200" />
                        {/* Contact & Hours Quick Bar */}
                        <div className="p-5 sm:p-6 space-y-3 bg-stone-50/50">
                            <div className="flex items-center justify-between">
                                <div className="h-3.5 w-24 rounded bg-stone-200" />
                                <div className="h-3.5 w-28 rounded bg-stone-300" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="h-3.5 w-20 rounded bg-stone-200" />
                                <div className="h-3.5 w-36 rounded bg-stone-200" />
                            </div>
                        </div>
                    </div>
                    {/* Arrival Policy card */}
                    <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-5 shadow-xs flex items-start gap-3.5">
                        <div className="size-5 rounded-full bg-stone-200 shrink-0 mt-0.5" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-40 rounded bg-stone-300" />
                            <div className="h-3 w-full rounded bg-stone-100" />
                            <div className="h-3 w-3/4 rounded bg-stone-100" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
