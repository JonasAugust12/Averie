'use client';

import { useTranslations } from 'next-intl';
import type { AppNamespace } from '@i18n/config';

export function useAppTranslations(namespace: AppNamespace) {
    return useTranslations(namespace);
}

export function useCommonTranslations() {
    return useAppTranslations('common');
}

export function useErrorTranslations() {
    return useAppTranslations('errors');
}

export function useSuccessTranslations() {
    return useAppTranslations('success');
}

export function usePageTranslations() {
    return useAppTranslations('pages');
}

export function useSalonTranslations() {
    return useAppTranslations('salon');
}

export function useBookingTranslations() {
    return useAppTranslations('booking');
}

export function useAccountTranslations() {
    return useAppTranslations('account');
}

export function useAdminTranslations() {
    return useAppTranslations('admin');
}
