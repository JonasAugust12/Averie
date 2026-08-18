import type { Metadata } from 'next';
import { AdminAccountSettings } from '@components/admin/settings';

export const metadata: Metadata = {
    title: 'Account settings',
};

export default function AdminAccountSettingsPage() {
    return <AdminAccountSettings />;
}
