interface BookingDetailSkeletonProps {
    /** `ticket` matches admin booking detail; `list` is a compact rows placeholder. */
    variant?: 'list' | 'ticket';
    centered?: boolean;
}

export function BookingDetailSkeleton({
    variant = 'list',
    centered = false,
}: BookingDetailSkeletonProps) {
    const alignClass = centered ? 'items-center' : '';

    if (variant === 'ticket') {
        return (
            <div className={`animate-pulse w-full space-y-6 ${alignClass}`}>
                <div className={`h-5 w-44 rounded bg-stone-100 ${centered ? 'mx-auto' : ''}`} />

                <div
                    className={`flex w-full flex-col gap-4 ${centered ? 'items-center text-center' : 'sm:flex-row sm:items-start sm:justify-between'}`}
                >
                    <div className="space-y-2 text-center">
                        <div className="mx-auto h-6 w-24 rounded-full bg-stone-200" />
                        <div className="mx-auto h-8 w-52 rounded bg-stone-200" />
                        <div className="mx-auto h-4 w-36 rounded bg-stone-100" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-stone-200/90 bg-[#FCFAF6] shadow-md ring-1 ring-stone-200/60">
                    <div className="flex flex-col md:flex-row">
                        <div className="h-14 w-full shrink-0 bg-stone-300 md:h-auto md:w-20" />

                        <div className="flex flex-1 flex-col md:grid md:grid-cols-12">
                            <div className="space-y-4 border-b border-stone-200/70 p-5 md:col-span-8 md:border-b-0">
                                <div className="flex items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-stone-300" />
                                        <div className="space-y-1.5">
                                            <div className="h-3 w-20 rounded bg-stone-200" />
                                            <div className="h-2.5 w-28 rounded bg-stone-100" />
                                        </div>
                                    </div>
                                    <div className="h-3 w-32 rounded bg-stone-100" />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <div className="h-2 w-16 rounded bg-stone-100" />
                                                <div
                                                    className={`h-4 rounded bg-stone-200 ${i === 2 ? 'w-full' : 'w-40'}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-2 w-16 rounded bg-stone-100" />
                                        <div className="min-h-16 rounded-lg border border-stone-200/70 bg-stone-100/80 p-3">
                                            <div className="mx-auto h-3 w-3/4 rounded bg-stone-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block md:col-span-1">
                                <div className="mx-auto h-full w-px bg-stone-200/80" />
                            </div>

                            <div className="space-y-4 border-t border-stone-200/70 p-5 text-center md:col-span-3 md:border-t-0">
                                <div className="space-y-2">
                                    <div className="mx-auto h-3 w-24 rounded bg-stone-200" />
                                    <div className="mx-auto h-3 w-32 rounded bg-stone-100" />
                                </div>
                                <div className="mx-auto max-w-45 rounded-lg border border-stone-200/70 bg-stone-100/80 p-3">
                                    <div className="mx-auto h-2 w-16 rounded bg-stone-200" />
                                    <div className="mx-auto mt-2 h-3 w-full rounded bg-stone-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="mx-auto h-2 w-14 rounded bg-stone-100" />
                                    <div className="mx-auto h-6 w-20 rounded bg-stone-200" />
                                </div>
                                <div className="mx-auto h-10 w-45 rounded bg-stone-200/80" />
                                <div className="mx-auto h-3 w-24 rounded bg-stone-100" />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`flex w-full ${centered ? 'justify-center' : 'justify-center sm:justify-end'}`}
                >
                    <div className="h-9 w-32 rounded-lg bg-stone-200" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl animate-pulse space-y-6">
            <div className="h-7 w-28 rounded-full bg-stone-100" />
            <div className="h-7 w-36 rounded bg-stone-200" />

            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-neutral">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex justify-between gap-4 px-4 py-3">
                        <div className="h-4 w-24 rounded bg-stone-100" />
                        <div
                            className={`h-4 rounded bg-stone-200 ${i % 2 === 0 ? 'w-32' : 'w-40'}`}
                        />
                    </div>
                ))}
            </div>

            <div className="h-4 w-36 rounded bg-stone-100" />
        </div>
    );
}
