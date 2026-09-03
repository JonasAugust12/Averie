'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, X } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { useSendBookingEmail } from '@services/booking.service';
import { cn } from '@utils/cn.util';
import { toastSuccess } from '@utils/toast.util';
import type { BookingListItemDto } from '@typings/booking.type';
import {
    sendBookingEmailSchema,
    type SendBookingEmailInput,
} from '@validations/booking-email.schema';

type SendBookingEmailModalProps = {
    booking: BookingListItemDto;
    isOpen: boolean;
    onClose: () => void;
};

export function SendBookingEmailModal({ booking, isOpen, onClose }: SendBookingEmailModalProps) {
    const t = useAdminTranslations();
    const sendEmail = useSendBookingEmail();
    usePreventScroll(isOpen);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SendBookingEmailInput>({
        resolver: zodResolver(sendBookingEmailSchema),
        defaultValues: {
            bookingId: booking.id,
            to: booking.customer.email ?? '',
            template: 'confirmation',
        },
    });

    useEffect(() => {
        if (!isOpen) return;
        reset({
            bookingId: booking.id,
            to: booking.customer.email ?? '',
            template: 'confirmation',
        });
    }, [booking.customer.email, booking.id, isOpen, reset]);

    if (!isOpen) return null;

    const serviceNames = booking.services.map((service) => service.name).join(', ');

    const onSubmit = handleSubmit((values) => {
        sendEmail.mutate(values, {
            onSuccess: () => {
                toastSuccess(t('bookings.sendEmail.success'));
                onClose();
            },
        });
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="send-booking-email-title"
                className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-[#FDFCFB] shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-stone-200 bg-[#F5EFEA] px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-stone-700" />
                        <h2
                            id="send-booking-email-title"
                            className="font-display text-lg font-semibold text-stone-900"
                        >
                            {t('bookings.sendEmail.title')}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-stone-200/60 hover:text-stone-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 p-5">
                    <input type="hidden" {...register('bookingId')} />

                    <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 text-sm text-stone-700">
                        <p className="font-mono text-xs font-bold uppercase tracking-wide text-stone-500">
                            {booking.reference}
                        </p>
                        <p className="mt-1 font-semibold text-stone-900">
                            {booking.date} · {booking.time}
                        </p>
                        {serviceNames ? (
                            <p className="mt-1 text-stone-600">{serviceNames}</p>
                        ) : null}
                    </div>

                    <div className="space-y-1.5">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                            {t('bookings.sendEmail.recipient')}
                        </label>
                        <input
                            type="email"
                            autoComplete="email"
                            className={cn(
                                'w-full rounded-xl border bg-white px-3.5 py-3 font-sans text-sm font-semibold text-stone-900 outline-none transition-all',
                                errors.to
                                    ? 'border-rose-400 ring-2 ring-rose-500/10'
                                    : 'border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/10',
                            )}
                            {...register('to')}
                        />
                        {errors.to?.message ? (
                            <p className="font-sans text-xs font-semibold text-rose-600">
                                {errors.to.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-1.5">
                        <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                            {t('bookings.sendEmail.template')}
                        </label>
                        <select
                            className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 font-sans text-sm font-semibold text-stone-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            {...register('template')}
                        >
                            <option value="confirmation">
                                {t('bookings.sendEmail.templateConfirmation')}
                            </option>
                            <option value="reminder">
                                {t('bookings.sendEmail.templateReminder')}
                            </option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outlined" size="sm" onClick={onClose}>
                            {t('bookings.actions.cancelNo')}
                        </Button>
                        <Button type="submit" size="sm" disabled={sendEmail.isPending}>
                            {t('bookings.sendEmail.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
