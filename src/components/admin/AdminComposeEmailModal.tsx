'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Send, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { EmailDesignPicker } from '@components/admin/bookings/EmailDesignPicker';
import { usePreventScroll } from '@hooks/usePreventScroll';
import {
    getAdminEmailFromAction,
    sendAdminComposeEmailAction,
} from '@actions/admin-compose-email.action';
import { unwrapApiResponse } from '@libs/action.util';
import { useAppMutation } from '@hooks/useAppMutation';
import { DEFAULT_EMAIL_FROM } from '@email/constants';
import type { EmailColorTheme, EmailDesignVariant } from '@email/themes';
import { cn } from '@utils/cn.util';
import { toastSuccess } from '@utils/toast.util';
import {
    sendAdminComposeEmailSchema,
    type SendAdminComposeEmailInput,
} from '@validations/admin-compose-email.schema';

type AdminComposeEmailModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function AdminComposeEmailModal({ isOpen, onClose }: AdminComposeEmailModalProps) {
    const t = useAdminTranslations();
    usePreventScroll(isOpen);

    const fromQuery = useQuery({
        queryKey: ['admin', 'email-from'],
        queryFn: async () => unwrapApiResponse(await getAdminEmailFromAction()),
        enabled: isOpen,
        staleTime: 60_000,
    });

    const sendEmail = useAppMutation({
        mutationFn: async (input: SendAdminComposeEmailInput) =>
            unwrapApiResponse(await sendAdminComposeEmailAction(input)),
        showGlobalLoading: true,
        loadingMessage: t('composeEmail.sending'),
    });

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
    } = useForm<SendAdminComposeEmailInput>({
        resolver: zodResolver(sendAdminComposeEmailSchema),
        defaultValues: {
            to: '',
            subject: '',
            heading: '',
            body: '',
            emailDesign: 'classic',
            emailTheme: 'averie',
        },
    });

    const subject = useWatch({ control, name: 'subject' }) ?? '';
    const heading = useWatch({ control, name: 'heading' }) ?? '';
    const body = useWatch({ control, name: 'body' }) ?? '';
    const emailDesign = (useWatch({ control, name: 'emailDesign' }) ??
        'classic') as EmailDesignVariant;
    const emailTheme = (useWatch({ control, name: 'emailTheme' }) ?? 'averie') as EmailColorTheme;

    useEffect(() => {
        if (!isOpen) return;
        reset({
            to: '',
            subject: '',
            heading: '',
            body: '',
            emailDesign: 'classic',
            emailTheme: 'averie',
        });
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const fromAddress = fromQuery.data?.from ?? DEFAULT_EMAIL_FROM;
    const previewHeading =
        heading.trim() || subject.trim() || t('composeEmail.previewHeadingFallback');

    const onSubmit = handleSubmit((values) => {
        sendEmail.mutate(
            {
                ...values,
                heading: values.heading?.trim() || values.subject.trim(),
            },
            {
                onSuccess: () => {
                    toastSuccess(t('composeEmail.success'));
                    onClose();
                },
            },
        );
    });

    return (
        <div className="fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:p-4">
            <button
                type="button"
                aria-label={t('close')}
                className="absolute inset-0 bg-stone-900/45 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-compose-email-title"
                className="relative z-10 flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-stone-200/90 bg-[#FDFCFB] shadow-2xl sm:max-h-[min(92dvh,780px)] sm:rounded-2xl"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-stone-200/80 bg-[#F5EFEA] px-4 py-3.5 sm:px-5 sm:py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-stone-50 shadow-2xs">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div>
                            <h2
                                id="admin-compose-email-title"
                                className="font-display text-base font-semibold text-stone-900 sm:text-lg"
                            >
                                {t('composeEmail.title')}
                            </h2>
                            <p className="font-sans text-[11px] text-stone-500 hidden sm:block">
                                {t('composeEmail.subtitle')}
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

                <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
                        <input type="hidden" {...register('emailDesign')} />
                        <input type="hidden" {...register('emailTheme')} />

                        <div className="space-y-1.5">
                            <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                {t('composeEmail.from')}
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={fromAddress}
                                className="w-full cursor-default rounded-xl border border-stone-200 bg-stone-100/80 px-3.5 py-2.5 font-sans text-sm font-semibold text-stone-600 shadow-3xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                {t('composeEmail.to')}
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                placeholder={t('composeEmail.toPlaceholder')}
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

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                    {t('composeEmail.subject')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('composeEmail.subjectPlaceholder')}
                                    className={cn(
                                        'w-full rounded-xl border bg-white px-3.5 py-2.5 font-sans text-sm text-stone-900 outline-none transition-all shadow-3xs',
                                        errors.subject
                                            ? 'border-rose-400 ring-2 ring-rose-500/10'
                                            : 'border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-200',
                                    )}
                                    {...register('subject')}
                                />
                                {errors.subject?.message ? (
                                    <p className="font-sans text-xs font-semibold text-rose-600">
                                        {errors.subject.message}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                    {t('composeEmail.heading')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('composeEmail.headingPlaceholder')}
                                    className={cn(
                                        'w-full rounded-xl border bg-white px-3.5 py-2.5 font-sans text-sm text-stone-900 outline-none transition-all shadow-3xs',
                                        errors.heading
                                            ? 'border-rose-400 ring-2 ring-rose-500/10'
                                            : 'border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-200',
                                    )}
                                    {...register('heading')}
                                />
                                {errors.heading?.message ? (
                                    <p className="font-sans text-xs font-semibold text-rose-600">
                                        {errors.heading.message}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                {t('composeEmail.body')}
                            </label>
                            <textarea
                                rows={5}
                                placeholder={t('composeEmail.bodyPlaceholder')}
                                className={cn(
                                    'w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 font-sans text-sm text-stone-900 outline-none transition-all shadow-3xs',
                                    errors.body
                                        ? 'border-rose-400 ring-2 ring-rose-500/10'
                                        : 'border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-200',
                                )}
                                {...register('body')}
                            />
                            {errors.body?.message ? (
                                <p className="font-sans text-xs font-semibold text-rose-600">
                                    {errors.body.message}
                                </p>
                            ) : null}
                        </div>

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

                        <div className="space-y-2 rounded-xl border border-stone-200/90 bg-white p-3.5 shadow-3xs">
                            <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                                {t('composeEmail.previewTitle')}
                            </p>
                            <div className="space-y-1">
                                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('bookings.sendEmail.previewSubject')}
                                </p>
                                <p className="rounded-lg border border-stone-200/70 bg-stone-50 px-2.5 py-1.5 font-sans text-xs font-semibold text-stone-900">
                                    {subject.trim() || t('composeEmail.previewSubjectFallback')}
                                </p>
                            </div>
                            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/70 p-3">
                                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('bookings.sendEmail.previewHeading')}
                                </p>
                                <p className="mt-1 font-display text-sm font-semibold text-stone-900">
                                    {previewHeading}
                                </p>
                                <p className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-stone-700">
                                    {body.trim() || t('composeEmail.previewBodyFallback')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col-reverse gap-2.5 border-t border-stone-200/80 bg-[#FDFCFB] p-3.5 sm:flex-row sm:items-center sm:justify-end sm:p-5">
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
                            className="w-full min-w-30 sm:w-auto"
                        >
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                            {sendEmail.isPending
                                ? t('composeEmail.sending')
                                : t('composeEmail.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
