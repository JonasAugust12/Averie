'use client';

import { useEffect } from 'react';
import { useUIStore } from '@stores/ui.store';
import { usePreventScroll } from '@hooks/usePreventScroll';

/** Prevents a second admin modal (New Booking) and background scroll while mounted. */
export function useAdminFormModalLock() {
    const lock = useUIStore((s) => s.lockAdminFormModal);
    const unlock = useUIStore((s) => s.unlockAdminFormModal);
    usePreventScroll(true);

    useEffect(() => {
        lock();
        return () => unlock();
    }, [lock, unlock]);
}
