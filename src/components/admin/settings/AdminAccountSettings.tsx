'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useChangeOwnPassword } from '@services/auth.service';
import { useAllStaff, useResetStaffPassword } from '@services/staff.service';
import { ChangePasswordForm } from '@components/shared/ChangePasswordForm';
import { Button } from '@components/common';
import { Input } from '@components/ui';
import { formatUserName } from '@utils/staff.util';
import {
    adminResetStaffPasswordFormSchema,
    type AdminResetStaffPasswordFormInput,
} from '@validations/staff.schema';

export function AdminAccountSettings() {
    const t = useAdminTranslations();
    const changePassword = useChangeOwnPassword();
    const resetStaffPassword = useResetStaffPassword();
    const { data: staffList } = useAllStaff();

    const [showStaffPassword, setShowStaffPassword] = useState(false);
    const [showStaffConfirm, setShowStaffConfirm] = useState(false);

    const staffForm = useForm<AdminResetStaffPasswordFormInput>({
        resolver: zodResolver(adminResetStaffPasswordFormSchema),
        defaultValues: { staffId: '', password: '', confirmPassword: '' },
    });

    async function handleChangeOwn(values: Parameters<typeof changePassword.mutateAsync>[0]) {
        await changePassword.mutateAsync(values);
    }

    async function handleResetStaff(values: AdminResetStaffPasswordFormInput) {
        await resetStaffPassword.mutateAsync({
            id: values.staffId,
            password: values.password,
        });
        staffForm.reset({ staffId: values.staffId, password: '', confirmPassword: '' });
    }

    const staffErrors = staffForm.formState.errors;

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
                <div className="border-b border-stone-100 bg-linear-to-r from-stone-50 to-secondary-50/40 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                        </span>
                        <div>
                            <h2 className="font-display text-xl font-semibold text-stone-900">
                                {t('settingsAccount.changeOwnTitle')}
                            </h2>
                            <p className="mt-0.5 font-sans text-sm text-stone-500">
                                {t('settingsAccount.changeOwnSubtitle')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <ChangePasswordForm
                        labels={{
                            currentPassword: t('settingsAccount.currentPassword'),
                            newPassword: t('settingsAccount.newPassword'),
                            confirmPassword: t('settingsAccount.confirmPassword'),
                            submit: t('settingsAccount.changeOwnSubmit'),
                            submitting: t('settingsAccount.submitting'),
                        }}
                        onSubmit={handleChangeOwn}
                        isSubmitting={changePassword.isPending}
                    />
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
                <div className="border-b border-stone-100 bg-linear-to-r from-stone-50 to-tertiary/30 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-neutral shadow-sm">
                            <Users className="h-5 w-5" />
                        </span>
                        <div>
                            <h2 className="font-display text-xl font-semibold text-stone-900">
                                {t('settingsAccount.resetStaffTitle')}
                            </h2>
                            <p className="mt-0.5 font-sans text-sm text-stone-500">
                                {t('settingsAccount.resetStaffSubtitle')}
                            </p>
                        </div>
                    </div>
                </div>
                <form onSubmit={staffForm.handleSubmit(handleResetStaff)} className="space-y-4 p-6">
                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('settingsAccount.selectStaff')}
                        </label>
                        <select
                            {...staffForm.register('staffId')}
                            className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-3 font-sans text-sm font-medium text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
                        >
                            <option value="">{t('settingsAccount.selectStaffPlaceholder')}</option>
                            {(staffList ?? []).map((member) => (
                                <option key={member.id} value={member.id}>
                                    {formatUserName(member)} · {member.email}
                                </option>
                            ))}
                        </select>
                        {staffErrors.staffId ? (
                            <p className="font-sans text-xs font-medium text-rose-600">
                                {staffErrors.staffId.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('settingsAccount.newPassword')}
                        </label>
                        <div className="relative">
                            <Input
                                type={showStaffPassword ? 'text' : 'password'}
                                className="pr-11 border-stone-200 bg-stone-50/80 focus:bg-white"
                                {...staffForm.register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowStaffPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            >
                                {showStaffPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {staffErrors.password ? (
                            <p className="font-sans text-xs font-medium text-rose-600">
                                {staffErrors.password.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                            {t('settingsAccount.confirmPassword')}
                        </label>
                        <div className="relative">
                            <Input
                                type={showStaffConfirm ? 'text' : 'password'}
                                className="pr-11 border-stone-200 bg-stone-50/80 focus:bg-white"
                                {...staffForm.register('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowStaffConfirm((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            >
                                {showStaffConfirm ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {staffErrors.confirmPassword ? (
                            <p className="font-sans text-xs font-medium text-rose-600">
                                {staffErrors.confirmPassword.message}
                            </p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={resetStaffPassword.isPending}
                        className="rounded-full px-6 py-2.5 font-sans text-sm font-bold tracking-wide shadow-sm"
                    >
                        {resetStaffPassword.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t('settingsAccount.submitting')}
                            </>
                        ) : (
                            <>
                                <KeyRound className="h-4 w-4" />
                                {t('settingsAccount.resetStaffSubmit')}
                            </>
                        )}
                    </Button>
                </form>
            </section>
        </div>
    );
}
