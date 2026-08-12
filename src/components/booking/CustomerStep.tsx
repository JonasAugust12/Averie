'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingCustomerSchema, type BookingCustomerInput } from '@validations/booking.schema';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';

const fieldBase =
    'w-full border-0 border-b border-border/60 bg-transparent px-0 py-3 font-sans text-sm text-primary outline-none transition-all placeholder:text-muted/50 focus:border-primary';

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
        <div className="mx-auto w-full max-w-xl">
            <p className="mb-8 font-sans text-sm text-muted leading-relaxed">
                Almost done — just a few details so we can confirm your appointment.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                    <Field label={t('customer.firstName')} error={errors.firstName?.message}>
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
                <Field label={t('customer.phone')} error={errors.phone?.message}>
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

                <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-3 border-t border-border/20 bg-background/95 px-4 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                    <Button
                        type="button"
                        variant="outlined"
                        className="rounded-full tracking-widest uppercase px-8"
                        onClick={() => setStep(4)}
                    >
                        {t('back')}
                    </Button>
                    <Button type="submit" className="rounded-full tracking-widest uppercase px-10">
                        {t('cta.toReview')}
                    </Button>
                </div>
            </form>
        </div>
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
            <label className="mb-1 block font-sans text-xs tracking-[0.18em] text-muted uppercase">
                {label}
            </label>
            {children}
            {error ? <p className="mt-1.5 font-sans text-xs text-danger">{error}</p> : null}
        </div>
    );
}
