import type { ReactNode } from 'react';
import { AdminSettingsNav } from '@components/admin/settings';

export default function AdminSettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <AdminSettingsNav />
            {children}
        </div>
    );
}
