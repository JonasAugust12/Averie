/**
 * Optional field-level errors from Zod (Server Actions).
 * Envelope still uses { status, message, data }.
 */
export type ActionFieldErrors = Record<string, string[]>;
