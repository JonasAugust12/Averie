'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { useUIStore } from '@stores/ui.store';
import { cn } from '@utils/cn.util';
import { AdminComposeEmailModal } from './AdminComposeEmailModal';

export function AdminEmailFloatButton() {
    const t = useAdminTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const isFormModalOpen = useUIStore((s) => s.adminFormModalLocks > 0);

    if (isFormModalOpen) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={t('composeEmail.floatButtonLabel')}
                title={t('composeEmail.floatButtonLabel')}
                className={cn(
                    'fixed z-40 flex items-center justify-center rounded-full border-2 border-white/90 bg-gradient-to-br from-[#F5EFEA] to-[#E8DDD4] shadow-[0_8px_28px_rgba(43,38,35,0.18)] transition-all cursor-pointer',
                    'hover:scale-105 hover:shadow-[0_12px_32px_rgba(43,38,35,0.22)] active:scale-95',
                    'bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))]',
                    'h-14 w-14 sm:h-16 sm:w-16',
                )}
            >
                <span className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-full bg-white/70 ring-1 ring-stone-200/80">
                    <Image
                        src="/icons/mascot_email.png"
                        alt=""
                        fill
                        sizes="44px"
                        className="object-contain p-0.5"
                        priority={false}
                    />
                </span>
            </button>

            <AdminComposeEmailModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
