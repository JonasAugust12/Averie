'use client';

import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordInput } from '@validations/auth.schema';
import { Button } from '@components/common';
import { Input } from '@components/ui';
import { cn } from '@utils/cn.util';

interface ChangePasswordFormProps {
    labels: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
        submit: string;
        submitting: string;
    };
    onSubmit: (values: ChangePasswordInput) => Promise<void>;
    isSubmitting?: boolean;
    className?: string;
}

export function ChangePasswordForm({
    labels,
    onSubmit,
    isSubmitting = false,
    className,
}: ChangePasswordFormProps) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    async function handleFormSubmit(values: ChangePasswordInput) {
        await onSubmit(values);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('space-y-4', className)}>
            <PasswordField
                label={labels.currentPassword}
                error={errors.currentPassword?.message}
                visible={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
                {...register('currentPassword')}
            />
            <PasswordField
                label={labels.newPassword}
                error={errors.newPassword?.message}
                visible={showNew}
                onToggle={() => setShowNew((v) => !v)}
                {...register('newPassword')}
            />
            <PasswordField
                label={labels.confirmPassword}
                error={errors.confirmPassword?.message}
                visible={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                {...register('confirmPassword')}
            />

            <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-6 py-2.5 font-sans text-sm font-bold tracking-wide shadow-sm"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {labels.submitting}
                    </>
                ) : (
                    <>
                        <KeyRound className="h-4 w-4" />
                        {labels.submit}
                    </>
                )}
            </Button>
        </form>
    );
}

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    visible: boolean;
    onToggle: () => void;
}

function PasswordField({
    label,
    error,
    visible,
    onToggle,
    className,
    ...props
}: PasswordFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                {label}
            </label>
            <div className="relative">
                <Input
                    type={visible ? 'text' : 'password'}
                    className={cn(
                        'pr-11 border-stone-200 bg-stone-50/80 focus:bg-white',
                        className,
                    )}
                    {...props}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    aria-label={visible ? 'Hide password' : 'Show password'}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error ? <p className="font-sans text-xs font-medium text-rose-600">{error}</p> : null}
        </div>
    );
}
