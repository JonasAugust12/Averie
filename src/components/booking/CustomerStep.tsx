'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingCustomerSchema, type BookingCustomerInput } from '@validations/booking.schema';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';

const fieldBase =
    'w-full border-0 border-b border-stone-300 bg-transparent px-0 py-3 font-sans text-base text-primary outline-none transition-all placeholder:text-stone-400 focus:border-primary';

export function CustomerStep() {
    const t = useBookingTranslations();
    const { customer, setCustomer, setStep } = useBookingStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BookingCustomerInput>({
        resolver: zodResolver(bookingCustomerSchema),
        defaultValues: customer ?? {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            note: '',
        },
    });

    useEffect(() => {
        if (customer) {
            reset({
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                phone: customer.phone || '',
                email: customer.email || '',
                note: customer.note || '',
            });
        }
    }, [customer, reset]);

    function onSubmit(data: BookingCustomerInput) {
        setCustomer(data);
        setStep(6);
    }

    return (
        <div className="mx-auto w-full max-w-xl">
            <p className="mb-8 font-sans text-[16px] text-stone-700 font-medium leading-relaxed">
                Almost done — just a few details so we can confirm your appointment.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                    <Field
                        label={t('customer.firstName')}
                        error={errors.firstName?.message}
                        required
                    >
                        <input
                            className={fieldBase}
                            autoComplete="given-name"
                            placeholder="First name"
                            {...register('firstName')}
                        />
                    </Field>
                    <Field label={t('customer.lastName')} error={errors.lastName?.message}>
                        <input
                            className={fieldBase}
                            autoComplete="family-name"
                            placeholder="Last name"
                            {...register('lastName')}
                        />
                    </Field>
                </div>
                <Field label={t('customer.phone')} error={errors.phone?.message} required>
                    <input
                        className={fieldBase}
                        type="tel"
                        autoComplete="tel"
                        placeholder="(555) 000-0000"
                        {...register('phone')}
                    />
                </Field>
                <Field label={t('customer.email')} error={errors.email?.message}>
                    <input
                        className={fieldBase}
                        type="email"
                        autoComplete="email"
                        placeholder="hello@example.com"
                        {...register('email')}
                    />
                </Field>
                <Field label={t('customer.note')}>
                    <textarea
                        {...register('note')}
                        rows={3}
                        placeholder="Preferred polish color, sensitivities, anything we should know…"
                        className={cn(fieldBase, 'resize-y leading-relaxed')}
                    />
                </Field>

                <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:pt-4 sm:shadow-none sm:backdrop-blur-none">
                    <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 sm:justify-start">
                        <Button
                            type="button"
                            variant="outlined"
                            className="rounded-full tracking-widest uppercase px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm active:scale-95 transition-all duration-200"
                            onClick={() => setStep(4)}
                        >
                            ← {t('back')}
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-full tracking-widest uppercase px-8 sm:px-10 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all duration-200"
                        >
                            {t('cta.toReview')} →
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function Field({
    label,
    error,
    required,
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                className={cn(
                    'mb-2 block font-sans text-sm tracking-[0.12em] uppercase',
                    required ? 'font-bold text-stone-900' : 'font-semibold text-stone-500',
                )}
            >
                {label}{' '}
                {required && (
                    <span className="text-danger ml-0.5" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
            {children}
            {error ? (
                <p className="mt-1.5 font-sans text-sm font-bold text-danger">{error}</p>
            ) : null}
        </div>
    );
}
