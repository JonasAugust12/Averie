import { extractPhoneDigits } from '@utils/phone.util';

/** Vietnam mobile national number: 9 digits starting with 3, 5, 7, 8, or 9. */
function isVietnamMobileNational(digits: string): boolean {
    return digits.length === 9 && /^[35789]/.test(digits);
}

/**
 * Normalize booking phone input to Vietnam E.164 (+84XXXXXXXXX) when valid.
 * Accepts 0xxxxxxxxx, 84xxxxxxxxx, +84xxxxxxxxx, or 9-digit national form.
 */
export function toVietnamE164(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    const digits = extractPhoneDigits(trimmed);
    if (!digits) return null;

    let national: string | null = null;

    if (digits.startsWith('84')) {
        const rest = digits.slice(2);
        if (rest.length === 9 && isVietnamMobileNational(rest)) {
            national = rest;
        } else if (rest.length === 10 && rest.startsWith('0')) {
            const candidate = rest.slice(1);
            if (isVietnamMobileNational(candidate)) {
                national = candidate;
            }
        }
    } else if (digits.startsWith('0') && digits.length === 10) {
        const candidate = digits.slice(1);
        if (isVietnamMobileNational(candidate)) {
            national = candidate;
        }
    } else if (isVietnamMobileNational(digits)) {
        national = digits;
    }

    if (!national) return null;
    return `+84${national}`;
}
