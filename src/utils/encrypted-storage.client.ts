import type { StateStorage } from 'zustand/middleware';
import { decryptClientString, encryptClientString } from './decryption.client';

function isStorageEncryptionEnabled(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION === 'true';
}

/**
 * Custom Zustand StateStorage implementation that encrypts persisted state
 * using Web Crypto API (AES-256-GCM) when NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION=true.
 */
export const encryptedStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        if (typeof window === 'undefined') return null;

        const rawValue = localStorage.getItem(name);
        if (!rawValue) return null;

        if (!isStorageEncryptionEnabled()) {
            return rawValue;
        }

        try {
            return await decryptClientString(rawValue);
        } catch {
            // Fallback for unencrypted legacy state or corrupted payloads
            if (rawValue.trim().startsWith('{') || rawValue.trim().startsWith('[')) {
                return rawValue;
            }
            return null;
        }
    },

    setItem: async (name: string, value: string): Promise<void> => {
        if (typeof window === 'undefined') return;

        if (!isStorageEncryptionEnabled()) {
            localStorage.setItem(name, value);
            return;
        }

        try {
            const encrypted = await encryptClientString(value);
            localStorage.setItem(name, encrypted);
        } catch {
            // Graceful fallback to unencrypted set if Web Crypto fails
            localStorage.setItem(name, value);
        }
    },

    removeItem: (name: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(name);
    },
};
