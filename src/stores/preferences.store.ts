import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@utils/encrypted-storage.client';

interface PreferencesState {
    language: 'en' | 'vi';
    theme: 'light' | 'dark';
}

interface PreferencesActions {
    setLanguage: (language: 'en' | 'vi') => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

type PreferencesStore = PreferencesState & PreferencesActions;

export const usePreferencesStore = create<PreferencesStore>()(
    persist(
        (set) => ({
            language: 'en',
            theme: 'light',

            setLanguage: (language) => set({ language }),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'averie-preferences',
            storage: createJSONStorage(() => encryptedStorage),
        },
    ),
);
