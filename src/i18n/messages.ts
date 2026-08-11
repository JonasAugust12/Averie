import viCommon from '@messages/vi/common.json';
import viErrors from '@messages/vi/errors.json';
import viSuccess from '@messages/vi/success.json';
import viPages from '@messages/vi/pages.json';
import viSalon from '@messages/vi/salon.json';
import viBooking from '@messages/vi/booking.json';
import viAccount from '@messages/vi/account.json';
import viAdmin from '@messages/vi/admin.json';
import enCommon from '@messages/en/common.json';
import enErrors from '@messages/en/errors.json';
import enSuccess from '@messages/en/success.json';
import enPages from '@messages/en/pages.json';
import enSalon from '@messages/en/salon.json';
import enBooking from '@messages/en/booking.json';
import enAccount from '@messages/en/account.json';
import enAdmin from '@messages/en/admin.json';

export const messages = {
    vi: {
        common: viCommon,
        errors: viErrors,
        success: viSuccess,
        pages: viPages,
        salon: viSalon,
        booking: viBooking,
        account: viAccount,
        admin: viAdmin,
    },
    en: {
        common: enCommon,
        errors: enErrors,
        success: enSuccess,
        pages: enPages,
        salon: enSalon,
        booking: enBooking,
        account: enAccount,
        admin: enAdmin,
    },
} as const;
