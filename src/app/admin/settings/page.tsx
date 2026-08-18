import type { Metadata } from 'next';
import { AdminAccountSettings } from '@components/admin/settings/AdminAccountSettings';

export const metadata: Metadata = {
    title: 'Account settings',
};

export default function AdminAccountSettingsPage() {
    return <AdminAccountSettings />;
}
