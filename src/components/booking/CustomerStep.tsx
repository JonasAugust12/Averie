'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingCustomerSchema, type BookingCustomerInput } from '@validations/booking.schema';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';

const fieldClass =
    'w-full border-0 border-b border-border bg-transparent px-0 py-3 font-sans text-sm text-primary outline-none transition-colors placeholder:text-muted/60 focus:border-primary';

export function CustomerStep() {
    const t = useBookingTranslations();
    const { customer, setCustomer, setStep } = useBookingStore();

    const {
        register,
        handleSubmit,
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

    function onSubmit(data: BookingCustomerInput) {
        setCustomer(data);
        setStep(6);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <Field label={t('customer.firstName')} error={errors.firstName?.message}>
                    <input
                        className={fieldClass}
                        autoComplete="given-name"
                        {...register('firstName')}
                    />
                </Field>
                <Field label={t('customer.lastName')} error={errors.lastName?.message}>
                    <input
                        className={fieldClass}
                        autoComplete="family-name"
                        {...register('lastName')}
                    />
                </Field>
            </div>
            <Field label={t('customer.phone')} error={errors.phone?.message}>
                <input
                    className={fieldClass}
                    type="tel"
                    autoComplete="tel"
                    {...register('phone')}
                />
            </Field>
            <Field label={t('customer.email')} error={errors.email?.message}>
                <input
                    className={fieldClass}
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                />
            </Field>
            <Field label={t('customer.note')}>
                <textarea {...register('note')} rows={3} className={cn(fieldClass, 'resize-y')} />
            </Field>

            <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-border/50 bg-background/95 py-4 backdrop-blur-sm">
                <Button
                    type="button"
                    variant="outlined"
                    className="tracking-widest uppercase"
                    onClick={() => setStep(4)}
                >
                    {t('back')}
                </Button>
                <Button type="submit" className="rounded-full tracking-widest uppercase">
                    {t('cta.toReview')}
                </Button>
            </div>
        </form>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block font-sans text-xs tracking-widest text-muted uppercase">
                {label}
            </label>
            {children}
            {error ? <p className="mt-1 font-sans text-xs text-danger">{error}</p> : null}
        </div>
    );
}
