'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, ShieldCheck, Sparkles, User } from 'lucide-react';
import { bookingCustomerSchema, type BookingCustomerInput } from '@validations/booking.schema';
import { useBookingTranslations } from '@i18n/use-app-translations';
import { useBookingStore } from '@stores/booking.store';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';

export function CustomerStep() {
    const t = useBookingTranslations();
    const { customer, setCustomer, setStep } = useBookingStore();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
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

    const noteValue = watch('note') || '';

    const quickTags = useMemo(
        () => [
            { key: 'firstVisit', label: t('customer.quickTags.firstVisit') },
            { key: 'gelRemoval', label: t('customer.quickTags.gelRemoval') },
            { key: 'nailArt', label: t('customer.quickTags.nailArt') },
            { key: 'sensitive', label: t('customer.quickTags.sensitive') },
            { key: 'quiet', label: t('customer.quickTags.quiet') },
        ],
        [t],
    );

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

    const handleToggleTag = (tagLabel: string) => {
        const currentNote = noteValue.trim();
        if (currentNote.includes(tagLabel)) {
            // Remove tag
            const updated = currentNote
                .split('\n')
                .filter((line) => line.trim() !== tagLabel)
                .join('\n')
                .trim();
            setValue('note', updated, { shouldValidate: true, shouldDirty: true });
        } else {
            // Append tag
            const updated = currentNote ? `${currentNote}\n${tagLabel}` : tagLabel;
            setValue('note', updated, { shouldValidate: true, shouldDirty: true });
        }
    };

    const isTagActive = (tagLabel: string) => {
        return noteValue.includes(tagLabel);
    };

    function onSubmit(data: BookingCustomerInput) {
        setCustomer(data);
        setStep(6);
    }

    return (
        <div className="mx-auto w-full max-w-2xl space-y-6 sm:space-y-8 animate-fade-in">
            {/* Header & Subtitle */}
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-stone-100/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-600 backdrop-blur-xs">
                    <User className="h-3.5 w-3.5 text-stone-500" />
                    <span>{t('steps.customer')}</span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                    {t('customer.title')}
                </h2>
                <p className="font-sans text-sm font-medium leading-relaxed text-stone-600 sm:text-base">
                    {t('customer.subtitle')}
                </p>
            </div>

            {/* Privacy & Concierge Reassurance Banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-stone-200/70 bg-linear-to-r from-stone-50/90 via-white/80 to-amber-50/30 p-3.5 sm:p-4 shadow-2xs backdrop-blur-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                    <p className="font-sans text-xs sm:text-[13px] font-semibold text-stone-800">
                        {t('customer.privacyBadge')}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                {/* Names */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* First Name */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                            <User className="h-3.5 w-3.5 text-stone-500" />
                            <span>{t('customer.firstName')}</span>
                            <span className="text-rose-600 font-bold">*</span>
                        </label>
                        <div
                            className={cn(
                                'relative flex items-center rounded-xl border bg-stone-50/60 px-3.5 py-3 shadow-2xs transition-all duration-200 focus-within:bg-white',
                                errors.firstName
                                    ? 'border-rose-400 ring-2 ring-rose-500/10'
                                    : 'border-stone-300 hover:border-stone-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
                            )}
                        >
                            <input
                                className="w-full bg-transparent font-sans text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 outline-none"
                                placeholder={t('customer.firstNamePlaceholder')}
                                autoComplete="given-name"
                                {...register('firstName')}
                            />
                        </div>
                        {errors.firstName?.message && (
                            <p className="font-sans text-xs font-semibold text-rose-600 pl-1">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    {/* Last Name (Required) */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                            <User className="h-3.5 w-3.5 text-stone-500" />
                            <span>{t('customer.lastName')}</span>
                            <span className="text-rose-600 font-bold">*</span>
                        </label>
                        <div
                            className={cn(
                                'relative flex items-center rounded-xl border bg-stone-50/60 px-3.5 py-3 shadow-2xs transition-all duration-200 focus-within:bg-white',
                                errors.lastName
                                    ? 'border-rose-400 ring-2 ring-rose-500/10'
                                    : 'border-stone-300 hover:border-stone-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
                            )}
                        >
                            <input
                                className="w-full bg-transparent font-sans text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 outline-none"
                                placeholder={t('customer.lastNamePlaceholder')}
                                autoComplete="family-name"
                                {...register('lastName')}
                            />
                        </div>
                        {errors.lastName?.message && (
                            <p className="font-sans text-xs font-semibold text-rose-600 pl-1">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Phone & Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                            <Phone className="h-3.5 w-3.5 text-stone-500" />
                            <span>{t('customer.phone')}</span>
                            <span className="text-rose-600 font-bold">*</span>
                        </label>
                        <div
                            className={cn(
                                'relative flex items-center rounded-xl border bg-stone-50/60 px-3.5 py-3 shadow-2xs transition-all duration-200 focus-within:bg-white',
                                errors.phone
                                    ? 'border-rose-400 ring-2 ring-rose-500/10'
                                    : 'border-stone-300 hover:border-stone-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
                            )}
                        >
                            <input
                                className="w-full bg-transparent font-sans text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 outline-none"
                                type="tel"
                                autoComplete="tel"
                                placeholder={t('customer.phonePlaceholder')}
                                {...register('phone')}
                            />
                        </div>
                        {errors.phone?.message && (
                            <p className="font-sans text-xs font-semibold text-rose-600 pl-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                            <Mail className="h-3.5 w-3.5 text-stone-500" />
                            <span>{t('customer.email')}</span>
                        </label>
                        <div
                            className={cn(
                                'relative flex items-center rounded-xl border bg-stone-50/60 px-3.5 py-3 shadow-2xs transition-all duration-200 focus-within:bg-white',
                                errors.email
                                    ? 'border-rose-400 ring-2 ring-rose-500/10'
                                    : 'border-stone-300 hover:border-stone-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
                            )}
                        >
                            <input
                                className="w-full bg-transparent font-sans text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 outline-none"
                                type="email"
                                autoComplete="email"
                                placeholder={t('customer.emailPlaceholder')}
                                {...register('email')}
                            />
                        </div>
                        {errors.email?.message && (
                            <p className="font-sans text-xs font-semibold text-rose-600 pl-1">
                                {errors.email.message}
                            </p>
                        )}
                        <p className="font-sans text-xs leading-relaxed text-stone-500 pl-1">
                            {t('customer.emailHelper')}
                        </p>
                    </div>
                </div>

                {/* Note & Quick Preferences */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        <span>{t('customer.note')}</span>
                    </label>
                    <div className="rounded-2xl border border-stone-300 bg-stone-50/60 p-4 shadow-2xs transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 hover:border-stone-400">
                        <textarea
                            {...register('note')}
                            rows={3}
                            placeholder={t('customer.notePlaceholder')}
                            className="w-full resize-y bg-transparent font-sans text-sm sm:text-[15px] font-medium text-stone-900 placeholder:text-stone-400 outline-none leading-relaxed"
                        />

                        {/* Interactive Quick Preference Tags */}
                        <div className="mt-3 pt-3 border-t border-stone-200/70">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('customer.quickTagsTitle')}
                                </p>
                                <span className="text-[10px] font-medium text-stone-400">
                                    {noteValue.length}/500
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {quickTags.map((tag) => {
                                    const active = isTagActive(tag.label);
                                    return (
                                        <button
                                            key={tag.key}
                                            type="button"
                                            onClick={() => handleToggleTag(tag.label)}
                                            className={cn(
                                                'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer border active:scale-95',
                                                active
                                                    ? 'bg-primary text-neutral border-primary shadow-xs ring-2 ring-primary/10'
                                                    : 'bg-white text-stone-700 border-stone-200 shadow-2xs hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900',
                                            )}
                                        >
                                            {tag.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="fixed sm:static bottom-0 left-0 right-0 z-40 border-t border-stone-300/80 bg-white/95 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:pt-4 sm:shadow-none sm:backdrop-blur-none">
                    <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 sm:justify-start">
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
