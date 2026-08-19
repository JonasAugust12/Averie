'use client';

import { X } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useChangeOwnPassword } from '@services/auth.service';
import { ChangePasswordForm } from '@components/shared';
import { usePreventScroll } from '@hooks/usePreventScroll';

interface StaffChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export function StaffChangePasswordModal({ open, onClose }: StaffChangePasswordModalProps) {
    const t = useAdminTranslations();
    const changePassword = useChangeOwnPassword({
        successMessage: t('staffPortal.changePasswordSuccess') || 'Password changed successfully',
    });
    usePreventScroll(open);

    if (!open) return null;

    async function handleSubmit(values: Parameters<typeof changePassword.mutateAsync>[0]) {
        await changePassword.mutateAsync(values);
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-white/95 shadow-2xl backdrop-blur-xs animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5">
                    <div>
                        <h2 className="font-display text-lg font-bold text-stone-900 sm:text-xl">
                            {t('staffPortal.changePasswordTitle') || 'Change Password'}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
                            {t('staffPortal.changePasswordSubtitle') ||
                                'Update your personal account credentials'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-100 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
                        aria-label={t('staffPortal.closeAria') || 'Close'}
                    >
                        <X className="h-4 w-4 text-stone-500" />
                    </button>
                </div>
                <div className="p-6">
                    <ChangePasswordForm
                        labels={{
                            currentPassword:
                                t('settingsAccount.currentPassword') || 'Current Password',
                            newPassword: t('settingsAccount.newPassword') || 'New Password',
                            confirmPassword:
                                t('settingsAccount.confirmPassword') || 'Confirm New Password',
                            submit: t('staffPortal.changePasswordSubmit') || 'Update Password',
                            submitting: t('settingsAccount.submitting') || 'Updating...',
                        }}
                        onSubmit={handleSubmit}
                        isSubmitting={changePassword.isPending}
                    />
                </div>
            </div>
        </div>
    );
}
