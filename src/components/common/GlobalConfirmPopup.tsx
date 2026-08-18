'use client';

import { X, AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@utils/cn.util';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { useUIStore } from '@stores/ui.store';
import { useCommonTranslations } from '@i18n/use-app-translations';

export default function GlobalConfirmPopup() {
    const { confirmPopup, isConfirmLoading, hideConfirm } = useUIStore();
    const t = useCommonTranslations();

    usePreventScroll(!!confirmPopup);

    if (!confirmPopup) return null;

    const {
        title,
        message,
        confirmText = t('actions.confirm'),
        cancelText = t('actions.cancel'),
        type = 'warning',
        isAlert = false,
        onConfirm,
        onClose,
    } = confirmPopup;

    const handleClose = () => {
        onClose?.();
        hideConfirm();
    };

    const handleConfirm = async () => {
        if (isAlert) {
            handleClose();
        } else {
            await onConfirm();
        }
    };

    const config = {
        danger: {
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            iconBg: 'bg-red-50/80',
            buttonBg: 'bg-[#a35c5c] text-white hover:bg-[#8f4b4b] border border-red-200/50',
            border: 'border-red-100',
            glow: 'from-red-500/10 to-transparent',
        },
        warning: {
            icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
            iconBg: 'bg-amber-50/80',
            buttonBg: 'bg-[#b68953] text-white hover:bg-[#9e7343] border border-amber-200/50',
            border: 'border-amber-100',
            glow: 'from-amber-500/10 to-transparent',
        },
        info: {
            icon: <Info className="w-6 h-6 text-stone-700" />,
            iconBg: 'bg-stone-100/90',
            buttonBg: 'bg-stone-800 text-stone-100 hover:bg-stone-900 border border-stone-700/50',
            border: 'border-stone-200/60',
            glow: 'from-stone-500/5 to-transparent',
        },
    };

    const current = config[type];

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity duration-300"
                onClick={isConfirmLoading ? undefined : handleClose}
            />

            {/* Modal Box */}
            <div
                className={cn(
                    'relative bg-white w-full max-w-105 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border flex flex-col overflow-hidden transition-all duration-300',
                    current.border,
                )}
            >
                {/* Visual Glow Header overlay */}
                <div
                    className={cn(
                        'absolute top-0 left-0 right-0 h-32 bg-linear-to-b opacity-45 pointer-events-none',
                        current.glow,
                    )}
                />

                {/* Top header row with Icon and X button */}
                <div className="relative flex items-start justify-between p-6 pb-2">
                    <div
                        className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-white/50 backdrop-blur-sm transition-transform duration-500 hover:scale-105',
                            current.iconBg,
                        )}
                    >
                        {current.icon}
                    </div>
                    {!isConfirmLoading && (
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 rounded-full transition-all text-stone-400 hover:text-stone-600 active:scale-90"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Dialog Body */}
                <div className="relative px-6 py-4">
                    <h3 className="text-xl font-display text-stone-900 tracking-wide mb-2 leading-snug">
                        {title}
                    </h3>
                    <p className="text-[14.5px] font-sans text-stone-500 leading-relaxed font-semibold">
                        {message}
                    </p>
                </div>

                {/* Dialog Actions Footer */}
                <div className="px-6 py-5 mt-2 flex gap-3 bg-stone-50/50 border-t border-stone-100/50">
                    {!isAlert && (
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isConfirmLoading}
                            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-full border border-stone-200/80 bg-white font-sans text-sm font-bold text-stone-700 shadow-xs hover:bg-stone-50 hover:border-stone-300 transition-all hover:scale-103 active:scale-97 cursor-pointer disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4 shrink-0" />
                            <span>{cancelText}</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isConfirmLoading}
                        className={cn(
                            'flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-full font-sans text-sm font-bold shadow-sm transition-all hover:scale-103 active:scale-97 cursor-pointer disabled:opacity-50',
                            current.buttonBg,
                            isAlert && 'w-full',
                        )}
                    >
                        {isConfirmLoading ? (
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
