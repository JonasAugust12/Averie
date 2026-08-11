import viCommon from '@messages/vi/common.json';
import viErrors from '@messages/vi/errors.json';
import viSuccess from '@messages/vi/success.json';
import viPages from '@messages/vi/pages.json';
import enCommon from '@messages/en/common.json';
import enErrors from '@messages/en/errors.json';
import enSuccess from '@messages/en/success.json';
import enPages from '@messages/en/pages.json';

export const messages = {
    vi: {
        common: viCommon,
        errors: viErrors,
        success: viSuccess,
        pages: viPages,
    },
    en: {
        common: enCommon,
        errors: enErrors,
        success: enSuccess,
        pages: enPages,
    },
} as const;
