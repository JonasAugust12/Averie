'use client';

import { X } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useChangeOwnPassword } from '@services/auth.service';
import { ChangePasswordForm } from '@components/shared/ChangePasswordForm';
import { usePreventScroll } from '@hooks/usePreventScroll';

interface StaffChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export function StaffChangePasswordModal({ open, onClose }: StaffChangePasswordModalProps) {
    const t = useAdminTranslations();
    const changePassword = useChangeOwnPassword({
        successMessage: t('staffPortal.changePasswordSuccess'),
    });
    usePreventScroll(open);

    if (!open) return null;

    async function handleSubmit(values: Parameters<typeof changePassword.mutateAsync>[0]) {
        await changePassword.mutateAsync(values);
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-3 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between border-b border-stone-100 px-5 py-4">
                    <div>
                        <h2 className="font-display text-lg font-bold text-stone-900">
                            {t('staffPortal.changePasswordTitle')}
                        </h2>
                        <p className="mt-0.5 font-sans text-xs text-stone-500">
                            {t('staffPortal.changePasswordSubtitle')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-100 hover:bg-stone-50"
                        aria-label={t('staffPortal.closeAria')}
                    >
                        <X className="h-4 w-4 text-stone-500" />
                    </button>
                </div>
                <div className="p-5">
                    <ChangePasswordForm
                        labels={{
                            currentPassword: t('settingsAccount.currentPassword'),
                            newPassword: t('settingsAccount.newPassword'),
                            confirmPassword: t('settingsAccount.confirmPassword'),
                            submit: t('staffPortal.changePasswordSubmit'),
                            submitting: t('settingsAccount.submitting'),
                        }}
                        onSubmit={handleSubmit}
                        isSubmitting={changePassword.isPending}
                    />
                </div>
            </div>
        </div>
    );
}
