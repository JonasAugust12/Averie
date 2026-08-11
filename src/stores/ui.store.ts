import { create } from 'zustand';

interface UIState {
    isLoading: boolean;
    loadingMessage?: string;
}

interface UIActions {
    setLoading: (isLoading: boolean, message?: string) => void;
    showLoading: (message?: string) => void;
    hideLoading: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
    isLoading: false,
    loadingMessage: undefined,

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
}));
