'use client';

import { Calendar as CalendarIcon, User } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import type { SalonService, SalonStaff } from '@typings/salon.type';

interface BookingReviewStepProps {
    selectedServices: SalonService[];
    selectedStaff: SalonStaff | null | undefined;
    selectedDate: string;
    selectedTime: string;
    totalPrice: number;
    totalDuration: number;
    customerForm: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        note: string;
    };
}

export function BookingReviewStep({
    selectedServices,
    selectedStaff,
    selectedDate,
    selectedTime,
    totalPrice,
    totalDuration,
    customerForm,
}: BookingReviewStepProps) {
    const tAdmin = useAdminTranslations();

    return (
        <div className="mx-auto w-full max-w-2xl space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden divide-y divide-stone-100">
                {/* Services Summary */}
                <div className="p-5">
                    <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                        {tAdmin('booking.review.servicesTitle')} ({selectedServices.length})
                    </h4>
                    <ul className="space-y-2.5">
                        {selectedServices.map((svc) => (
                            <li key={svc.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-sans text-sm font-bold text-stone-900">
                                        {svc.name}
                                    </p>
                                    <p className="font-sans text-xs text-stone-500">
                                        {svc.durationMin} min
                                    </p>
                                </div>
                                <span className="font-display text-base font-black text-stone-900">
                                    {formatUsd(svc.price)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-2 gap-4 p-5">
                    <div>
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                            {tAdmin('booking.review.specialist')}
                        </span>
                        <p className="font-sans text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-stone-500" />
                            {selectedStaff
                                ? selectedStaff.name
                                : tAdmin('booking.review.anySpecialist')}
                        </p>
                    </div>
                    <div>
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                            {tAdmin('booking.review.dateTime')}
                        </span>
                        <p className="font-sans text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <CalendarIcon className="h-3.5 w-3.5 text-stone-500" />
                            {formatDisplayDate(selectedDate)} {tAdmin('booking.review.at')}{' '}
                            {selectedTime}
                        </p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="p-5">
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
                        {tAdmin('booking.review.customer')}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p className="font-sans text-sm font-bold text-stone-900">
                                {customerForm.firstName} {customerForm.lastName}
                            </p>
                            <p className="font-sans text-xs text-stone-500">
                                {customerForm.phone}{' '}
                                {customerForm.email && `· ${customerForm.email}`}
                            </p>
                        </div>
                    </div>
                    {customerForm.note && (
                        <p className="mt-2 text-xs font-medium text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                            &ldquo;{customerForm.note}&rdquo;
                        </p>
                    )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-5 bg-stone-900 text-white">
                    <div>
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-stone-300">
                            {tAdmin('booking.review.totalDue')}
                        </span>
                        <p className="font-sans text-xs text-stone-400">
                            {tAdmin('booking.review.estimated').replace(
                                '{min}',
                                String(totalDuration),
                            )}
                        </p>
                    </div>
                    <span className="font-display text-2xl font-black text-amber-300">
                        {formatUsd(totalPrice)}
                    </span>
                </div>
            </div>
        </div>
    );
}
