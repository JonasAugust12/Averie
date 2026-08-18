/** Strip formatting characters and keep digits only. */
export function extractPhoneDigits(phone: string): string {
    return phone.replace(/\D/g, '');
}

/** US numbers: also match without a leading country code 1. */
export function phoneDigitVariants(digits: string): string[] {
    const normalized = extractPhoneDigits(digits);
    if (!normalized) return [];

    const variants = new Set<string>([normalized]);

    if (normalized.length === 11 && normalized.startsWith('1')) {
        variants.add(normalized.slice(1));
    }
    if (normalized.length === 10) {
        variants.add(`1${normalized}`);
    }

    return [...variants];
}

/** Compare stored vs searched phone, ignoring separators and optional US country code. */
export function phoneDigitsMatch(stored: string, search: string): boolean {
    const storedDigits = extractPhoneDigits(stored);
    const searchVariants = phoneDigitVariants(search);

    if (!storedDigits || searchVariants.length === 0) return false;

    return searchVariants.some((variant) => {
        if (storedDigits === variant) return true;
        if (storedDigits.length >= 10 && variant.length >= 10) {
            return storedDigits.slice(-10) === variant.slice(-10);
        }
        return false;
    });
}

/** Regex that matches the same digit sequence with optional separators between digits. */
export function buildFlexiblePhoneRegex(digits: string): RegExp {
    const tail = digits.slice(-Math.min(Math.max(digits.length, 7), 10));
    const pattern = tail
        .split('')
        .map((digit) => `${digit}\\D*`)
        .join('');
    return new RegExp(pattern, 'i');
}

/** Normalize user input before booking lookup (reference stays as-is; phones lose formatting). */
export function normalizeBookingLookupQuery(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;

    if (/^AV-/i.test(trimmed)) {
        return trimmed.toUpperCase();
    }

    const digits = extractPhoneDigits(trimmed);
    if (digits.length >= 7) {
        return digits;
    }

    return trimmed;
}
