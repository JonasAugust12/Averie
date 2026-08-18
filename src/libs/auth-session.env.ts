/** Default Auth.js session lifetime: 30 days (matches Auth.js default). */
export const DEFAULT_AUTH_SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * Reads `AUTH_SESSION_MAX_AGE_SECONDS` from env.
 * Falls back to {@link DEFAULT_AUTH_SESSION_MAX_AGE_SECONDS} when unset or invalid.
 */
export function readAuthSessionMaxAgeSeconds(): number {
    const raw = process.env.AUTH_SESSION_MAX_AGE_SECONDS?.trim();
    if (!raw) {
        return DEFAULT_AUTH_SESSION_MAX_AGE_SECONDS;
    }

    const value = Number.parseInt(raw, 10);
    if (!Number.isFinite(value) || value <= 0) {
        return DEFAULT_AUTH_SESSION_MAX_AGE_SECONDS;
    }

    return value;
}
