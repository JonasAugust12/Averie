import { create } from 'zustand';

export interface ConfirmPopupConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    isAlert?: boolean;
    onConfirm: () => void | Promise<void>;
    onClose?: () => void;
}

interface UIState {
    isLoading: boolean;
    loadingMessage?: string;
    confirmPopup: ConfirmPopupConfig | null;
    isConfirmLoading: boolean;
}

interface UIActions {
    setLoading: (isLoading: boolean, message?: string) => void;
    showLoading: (message?: string) => void;
    hideLoading: () => void;
    showConfirm: (config: ConfirmPopupConfig) => void;
    hideConfirm: () => void;
    setConfirmLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
    isLoading: false,
    loadingMessage: undefined,
    confirmPopup: null,
    isConfirmLoading: false,

    setLoading: (isLoading, message) =>
        set({
            isLoading,
            loadingMessage: message,
        }),

    showLoading: (message) =>
        set({
            isLoading: true,
            loadingMessage: message || 'Đang xử lý...',
        }),

    hideLoading: () =>
        set({
            isLoading: false,
            loadingMessage: undefined,
        }),

    showConfirm: (confirmPopup) =>
        set({
            confirmPopup,
            isConfirmLoading: false,
        }),

    hideConfirm: () =>
        set({
            confirmPopup: null,
            isConfirmLoading: false,
        }),

    setConfirmLoading: (isConfirmLoading) =>
        set({
            isConfirmLoading,
        }),
}));
