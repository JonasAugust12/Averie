'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Clock, Mail, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { useSendBookingEmail } from '@services/booking.service';
import { cn } from '@utils/cn.util';
import {
    getBookingEmailSubject,
    getDefaultBookingEmailIntro,
} from '@utils/booking-email-intro.util';
import { toastSuccess } from '@utils/toast.util';
import type { BookingListItemDto } from '@typings/booking.type';
import type { EmailColorTheme, EmailDesignVariant } from '@email/themes';
import {
    sendBookingEmailSchema,
    type SendBookingEmailInput,
} from '@validations/booking-email.schema';
import { EmailDesignPicker } from './EmailDesignPicker';

type SendBookingEmailModalProps = {
    booking: BookingListItemDto;
    isOpen: boolean;
    onClose: () => void;
};

const QUICK_CHIPS = [
    {
        id: 'arrive',
        label: '⏱ Đến sớm 5p',
        text: ' Please arrive 5 minutes prior to your scheduled time.',
    },
    {
        id: 'parking',
        label: '🚗 Chỗ đỗ xe',
        text: ' Free client parking is available directly behind our salon.',
    },
    {
        id: 'photos',
        label: '💅 Mẫu nail art',
        text: ' Feel free to bring photo references of any nail art design you love!',
    },
    {
        id: 'policy',
        label: '🌸 Đổi/Hủy lịch',
        text: ' Kindly notify us 24 hours in advance if you need to adjust your booking.',
    },
];

export function SendBookingEmailModal({ booking, isOpen, onClose }: SendBookingEmailModalProps) {
    const t = useAdminTranslations();
    const sendEmail = useSendBookingEmail();
    usePreventScroll(isOpen);

    const designLabels = useMemo(
        () => ({
            classic: t('bookings.sendEmail.designClassic'),
            elegant: t('bookings.sendEmail.designElegant'),
            modern: t('bookings.sendEmail.designModern'),
        }),
        [t],
    );

    const themeLabels = useMemo(
        () => ({
            averie: t('bookings.sendEmail.themeAverie'),
            rose: t('bookings.sendEmail.themeRose'),
            sage: t('bookings.sendEmail.themeSage'),
            midnight: t('bookings.sendEmail.themeMidnight'),
        }),
        [t],
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<SendBookingEmailInput>({
        resolver: zodResolver(sendBookingEmailSchema),
        defaultValues: {
            bookingId: booking.id,
            to: booking.customer.email ?? '',
            template: 'confirmation',
            emailDesign: 'classic',
            emailTheme: 'averie',
            customMessage: getDefaultBookingEmailIntro('confirmation', booking.customer.firstName),
        },
    });

    const template = useWatch({ control, name: 'template' }) ?? 'confirmation';
    const customMessage = useWatch({ control, name: 'customMessage' }) ?? '';
    const emailDesign = (useWatch({ control, name: 'emailDesign' }) ??
        'classic') as EmailDesignVariant;
    const emailTheme = (useWatch({ control, name: 'emailTheme' }) ?? 'averie') as EmailColorTheme;

    useEffect(() => {
        if (!isOpen) return;
        reset({
            bookingId: booking.id,
            to: booking.customer.email ?? '',
            template: 'confirmation',
            emailDesign: 'classic',
            emailTheme: 'averie',
            customMessage: getDefaultBookingEmailIntro('confirmation', booking.customer.firstName),
        });
    }, [booking.customer.email, booking.customer.firstName, booking.id, isOpen, reset]);

    useEffect(() => {
        if (!isOpen) return;
        setValue(
            'customMessage',
            getDefaultBookingEmailIntro(template, booking.customer.firstName),
        );
    }, [template, booking.customer.firstName, isOpen, setValue]);

    if (!isOpen) return null;

    const serviceNames = booking.services.map((service) => service.name).join(', ');
    const previewSubject = getBookingEmailSubject(template, booking.reference);

    const handleResetMessage = () => {
        setValue(
            'customMessage',
            getDefaultBookingEmailIntro(template, booking.customer.firstName),
        );
    };

    const handleToggleChip = (chipText: string) => {
        if (customMessage.includes(chipText.trim())) {
            // Remove chip text
            const updated = customMessage.replace(chipText.trim(), '').replace(/\s+/g, ' ').trim();
            setValue('customMessage', updated);
        } else {
            // Append chip text
            const updated = `${customMessage.trim()}${chipText}`;
            setValue('customMessage', updated);
        }
    };

    const onSubmit = handleSubmit((values) => {
        sendEmail.mutate(values, {
            onSuccess: () => {
                toastSuccess(t('bookings.sendEmail.success'));
                onClose();
            },
        });
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
            <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-stone-900/45 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="send-booking-email-title"
                className="relative z-10 flex max-h-[92vh] sm:max-h-[min(92vh,780px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#FDFCFB] shadow-2xl transition-all"
            >
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-stone-200/80 bg-[#F5EFEA] px-4 py-3.5 sm:px-5 sm:py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-stone-50 shadow-2xs">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div>
                            <h2
                                id="send-booking-email-title"
                                className="font-display text-base font-semibold text-stone-900 sm:text-lg"
                            >
                                {t('bookings.sendEmail.title')}
                            </h2>
                            <p className="font-sans text-[11px] text-stone-500 hidden sm:block">
                                Gửi thông báo trực tiếp qua email tới khách hàng
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-800 cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
                        <input type="hidden" {...register('bookingId')} />
                        <input type="hidden" {...register('emailDesign')} />
                        <input type="hidden" {...register('emailTheme')} />
                        <input type="hidden" {...register('template')} />

                        {/* Booking Context Summary Banner */}
                        <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-3.5 text-sm text-stone-700 shadow-3xs">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-500">
                                    #{booking.reference}
                                </span>
                                <span className="rounded-full bg-stone-200/70 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-stone-700">
                                    {booking.customer.firstName} {booking.customer.lastName}
                                </span>
                            </div>
                            <p className="mt-1.5 font-semibold text-stone-900">
                                {booking.date} · {booking.time}
                            </p>
                            {serviceNames ? (
                                <p className="mt-1 text-xs text-stone-600 truncate">
                                    {serviceNames}
                                </p>
                            ) : null}
                        </div>

                        {/* Recipient Email Input */}
                        <div className="space-y-1.5">
                            <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                {t('bookings.sendEmail.recipient')}
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                className={cn(
                                    'w-full rounded-xl border bg-white px-3.5 py-2.5 font-sans text-sm font-semibold text-stone-900 outline-none transition-all shadow-3xs',
                                    errors.to
                                        ? 'border-rose-400 ring-2 ring-rose-500/10'
                                        : 'border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-200',
                                )}
                                {...register('to')}
                            />
                            {errors.to?.message ? (
                                <p className="font-sans text-xs font-semibold text-rose-600">
                                    {errors.to.message}
                                </p>
                            ) : null}
                        </div>

                        {/* Visual Template Selector Cards (Confirmation vs Reminder) */}
                        <div className="space-y-2">
                            <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                {t('bookings.sendEmail.template')}
                            </label>
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setValue('template', 'confirmation')}
                                    className={cn(
                                        'flex items-center gap-2.5 rounded-xl border-2 p-3 text-left transition-all cursor-pointer shadow-3xs',
                                        template === 'confirmation'
                                            ? 'border-stone-900 ring-2 ring-stone-300 bg-white'
                                            : 'border-stone-200 bg-stone-50/60 hover:border-stone-400 hover:bg-white',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
                                            template === 'confirmation'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-stone-200/70 text-stone-500',
                                        )}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-sans text-xs font-bold text-stone-900 truncate">
                                            {t('bookings.sendEmail.templateConfirmation')}
                                        </p>
                                        <p className="font-sans text-[10px] text-stone-500 truncate">
                                            Xác nhận lịch mới
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setValue('template', 'reminder')}
                                    className={cn(
                                        'flex items-center gap-2.5 rounded-xl border-2 p-3 text-left transition-all cursor-pointer shadow-3xs',
                                        template === 'reminder'
                                            ? 'border-stone-900 ring-2 ring-stone-300 bg-white'
                                            : 'border-stone-200 bg-stone-50/60 hover:border-stone-400 hover:bg-white',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
                                            template === 'reminder'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-stone-200/70 text-stone-500',
                                        )}
                                    >
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-sans text-xs font-bold text-stone-900 truncate">
                                            {t('bookings.sendEmail.templateReminder')}
                                        </p>
                                        <p className="font-sans text-[10px] text-stone-500 truncate">
                                            Nhắc nhở sắp tới
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Email Design & Palette Picker */}
                        <EmailDesignPicker
                            design={emailDesign}
                            theme={emailTheme}
                            onDesignChange={(value) => setValue('emailDesign', value)}
                            onThemeChange={(value) => setValue('emailTheme', value)}
                            designLabel={t('bookings.sendEmail.designLabel')}
                            themeLabel={t('bookings.sendEmail.themeLabel')}
                            livePreviewLabel={t('bookings.sendEmail.livePreview')}
                            designLabels={designLabels}
                            themeLabels={themeLabels}
                        />

                        {/* Real-time Text Preview Card */}
                        <div className="space-y-2 rounded-xl border border-stone-200/90 bg-white p-3.5 shadow-3xs">
                            <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                {t('bookings.sendEmail.previewTitle')}
                            </p>
                            <div className="space-y-1">
                                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('bookings.sendEmail.previewSubject')}
                                </p>
                                <p className="font-sans text-xs font-semibold text-stone-900 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200/70">
                                    {previewSubject}
                                </p>
                            </div>
                            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/70 p-3">
                                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('bookings.sendEmail.previewHeading')}
                                </p>
                                <p className="mt-1 font-display text-sm font-semibold text-stone-900">
                                    {template === 'reminder'
                                        ? t('bookings.sendEmail.previewHeadingReminder')
                                        : t('bookings.sendEmail.previewHeadingConfirmation')}
                                </p>
                                <p className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-stone-700">
                                    {customMessage}
                                </p>
                                <p className="mt-3 border-t border-stone-200/80 pt-2 font-sans text-[11px] text-stone-500">
                                    {t('bookings.sendEmail.previewIncludes')}
                                </p>
                            </div>
                        </div>

                        {/* Custom Message Field + Quick Action Note Chips */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                    {t('bookings.sendEmail.customMessage')}
                                </label>
                                <button
                                    type="button"
                                    onClick={handleResetMessage}
                                    className="inline-flex items-center gap-1.5 font-sans text-[11px] font-bold text-stone-600 transition-colors hover:text-stone-900 cursor-pointer"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    {t('bookings.sendEmail.resetTemplate')}
                                </button>
                            </div>

                            {/* 1-Tap Quick Note Chips for Low-tech Salon Owner */}
                            <div className="space-y-1">
                                <p className="flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
                                    <Sparkles className="h-3 w-3 text-amber-600" />
                                    Gợi ý nhanh 1-chạm (thêm ghi chú vào email):
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {QUICK_CHIPS.map((chip) => {
                                        const isAdded = customMessage.includes(chip.text.trim());
                                        return (
                                            <button
                                                key={chip.id}
                                                type="button"
                                                onClick={() => handleToggleChip(chip.text)}
                                                className={cn(
                                                    'rounded-lg border px-2.5 py-1 font-sans text-xs font-medium transition-all cursor-pointer shadow-3xs',
                                                    isAdded
                                                        ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                                                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50',
                                                )}
                                            >
                                                {chip.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <textarea
                                rows={4}
                                className={cn(
                                    'w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 font-sans text-sm text-stone-900 outline-none transition-all shadow-3xs',
                                    errors.customMessage
                                        ? 'border-rose-400 ring-2 ring-rose-500/10'
                                        : 'border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-200',
                                )}
                                {...register('customMessage')}
                            />
                            {errors.customMessage?.message ? (
                                <p className="font-sans text-xs font-semibold text-rose-600">
                                    {errors.customMessage.message}
                                </p>
                            ) : (
                                <p className="font-sans text-[11px] text-stone-500">
                                    {t('bookings.sendEmail.customMessageHint')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Modal Action Footer */}
                    <div className="flex shrink-0 flex-col-reverse sm:flex-row items-center justify-end gap-2.5 border-t border-stone-200/80 bg-[#FDFCFB] p-3.5 sm:p-5">
                        <Button
                            type="button"
                            variant="outlined"
                            size="sm"
                            onClick={onClose}
                            className="w-full sm:w-auto"
                        >
                            {t('bookings.actions.cancelNo')}
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={sendEmail.isPending}
                            className="w-full sm:w-auto min-w-30"
                        >
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                            {sendEmail.isPending ? 'Đang gửi...' : t('bookings.sendEmail.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
