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
    adminFormModalLocks: number;
}

interface UIActions {
    setLoading: (isLoading: boolean, message?: string) => void;
    showLoading: (message?: string) => void;
    hideLoading: () => void;
    showConfirm: (config: ConfirmPopupConfig) => void;
    hideConfirm: () => void;
    setConfirmLoading: (loading: boolean) => void;
    lockAdminFormModal: () => void;
    unlockAdminFormModal: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
    isLoading: false,
    loadingMessage: undefined,
    confirmPopup: null,
    isConfirmLoading: false,
    adminFormModalLocks: 0,

    setLoading: (isLoading, message) =>
        set({
            isLoading,
            loadingMessage: message,
        }),

    showLoading: (message) =>
        set({
            isLoading: true,
            loadingMessage: message,
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

    lockAdminFormModal: () =>
        set((state) => ({ adminFormModalLocks: state.adminFormModalLocks + 1 })),

    unlockAdminFormModal: () =>
        set((state) => ({ adminFormModalLocks: Math.max(0, state.adminFormModalLocks - 1) })),
}));
