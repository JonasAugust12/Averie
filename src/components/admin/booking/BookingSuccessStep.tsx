'use client';

import { CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@components/common';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatDisplayDate, formatUsd } from '@utils/format.util';
import type { SalonService } from '@typings/salon.type';

interface BookingSuccessStepProps {
    createdReference: string | null;
    selectedDate: string;
    selectedTime: string;
    selectedServices: SalonService[];
    totalPrice: number;
    customerForm: {
        firstName: string;
        lastName: string;
    };
    onClose?: () => void;
    onNewBooking?: () => void;
}

export function BookingSuccessStep({
    createdReference,
    selectedDate,
    selectedTime,
    selectedServices,
    totalPrice,
    customerForm,
    onClose,
    onNewBooking,
}: BookingSuccessStepProps) {
    const tAdmin = useAdminTranslations();

    return (
        <div className="text-center py-6 sm:py-8 space-y-6 max-w-md mx-auto animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
                <h3 className="font-display text-2xl font-black text-stone-900">
                    {tAdmin('booking.success.title')}
                </h3>
                <p className="font-sans text-xs text-stone-500 font-semibold uppercase tracking-widest mt-1">
                    {tAdmin('booking.success.ref')}{' '}
                    <span className="text-stone-900 font-bold">{createdReference}</span>
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 text-left space-y-3 shadow-sm">
                <div className="flex justify-between text-sm">
                    <span className="text-stone-500 font-medium">
                        {tAdmin('booking.success.customer')}
                    </span>
                    <span className="text-stone-900 font-bold">
                        {customerForm.firstName} {customerForm.lastName}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-stone-500 font-medium">
                        {tAdmin('booking.success.when')}
                    </span>
                    <span className="text-stone-900 font-bold">
                        {formatDisplayDate(selectedDate)} @ {selectedTime}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-stone-500 font-medium">
                        {tAdmin('booking.success.services')}
                    </span>
                    <span className="text-stone-900 font-bold">
                        {selectedServices.map((s) => s.name).join(', ')}
                    </span>
                </div>
                <div className="flex justify-between text-sm border-t border-stone-100 pt-3">
                    <span className="text-stone-500 font-medium">
                        {tAdmin('booking.success.total')}
                    </span>
                    <span className="text-stone-900 font-black">{formatUsd(totalPrice)}</span>
                </div>
            </div>

            {onClose && onNewBooking && (
                <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        className="border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl uppercase tracking-wider text-xs"
                    >
                        {tAdmin('booking.success.close')}
                    </Button>
                    <Button
                        onClick={onNewBooking}
                        className="bg-stone-900 text-white rounded-xl uppercase tracking-wider text-xs flex items-center gap-1.5"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        {tAdmin('booking.success.newBooking')}
                    </Button>
                </div>
            )}
        </div>
    );
}
