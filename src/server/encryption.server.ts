/**
 * Server-side AES-256-GCM encryption for response obfuscation.
 *
 * Usage scope: Route Handlers only (Node.js runtime).
 * Controlled by: ENABLE_OBFUSCATION env var.
 *
 * Output format: "<iv_base64>.<authTag_base64>.<encrypted_base64>"
 */
import crypto from 'node:crypto';

export const OBFUSCATION_ENABLED = process.env.ENABLE_OBFUSCATION === '1';

/**
 * Derives a 32-byte AES key from OBFUSCATION_SECRET via SHA-256.
 * Lazy-evaluated so the module can be imported safely even when the var is missing.
 */
function getKey(): Buffer {
    const secret = process.env.OBFUSCATION_SECRET;
    if (!secret) {
        throw new Error(
            '[encryption.server] OBFUSCATION_SECRET is not set. ' +
                'Add it to .env.local or Vercel env vars.',
        );
    }
    return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts arbitrary data with AES-256-GCM.
 * @returns Dot-delimited base64 string: `iv.authTag.ciphertext`
 */
export function encryptData(data: unknown): string {
    const key = getKey();
    const iv = crypto.randomBytes(12); // 96-bit IV — GCM spec

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const plaintext = JSON.stringify(data);

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag(); // 16-byte auth tag

    return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join(
        '.',
    );
}
