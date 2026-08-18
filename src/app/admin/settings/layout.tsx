import type { ReactNode } from 'react';
import { AdminSettingsNav } from '@components/admin/settings/AdminSettingsNav';

export default function AdminSettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-3xl">
            <AdminSettingsNav />
            {children}
        </div>
    );
}
