/**
 * Client-side AES-256-GCM decryption for response obfuscation.
 *
 * Usage scope: Browser only — uses Web Crypto API (no Node.js `crypto`).
 * Controlled by: NEXT_PUBLIC_ENABLE_OBFUSCATION env var.
 *
 * The key is obfuscated (split across multiple variables) to slow down
 * casual reverse-engineering, not to provide real security.
 */

/**
 * Derives the AES-GCM CryptoKey from the obfuscated secret fragments.
 * Intentional: split + shuffle to obscure from casual bundle readers.
 */
async function deriveKey(): Promise<CryptoKey> {
    // Key fragments — split to deter simple bundle search
    // NOTE: a determined reverse-engineer can still find this; the goal is DevTools obfuscation only.
    const f = ['AVR_k9Xm2', 'P8qL_v5N', '1wZ7R_tE', '4uY0sC_3', 'jF6hG9dB2mA5'];
    const secret = [f[0], f[1], f[2], f[3], f[4]].join('');

    const encoded = new TextEncoder().encode(secret);
    const hash = await crypto.subtle.digest('SHA-256', encoded);

    return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['decrypt']);
}

/**
 * Decrypts a dot-delimited AES-256-GCM payload produced by `encryptData()` on the server.
 * @param payload - Format: `iv_base64.authTag_base64.ciphertext_base64`
 * @returns The original JSON-parsed value
 */
export async function decryptData<T = unknown>(payload: string): Promise<T> {
    const parts = payload.split('.');
    if (parts.length !== 3) {
        throw new Error('[decryption.client] Invalid payload format — expected iv.authTag.cipher');
    }

    const [ivB64, authTagB64, encryptedB64] = parts;

    const fromBase64 = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    const iv = fromBase64(ivB64);
    const authTag = fromBase64(authTagB64);
    const encrypted = fromBase64(encryptedB64);

    // Web Crypto expects: ciphertext || authTag (concatenated)
    const combined = new Uint8Array(encrypted.length + authTag.length);
    combined.set(encrypted);
    combined.set(authTag, encrypted.length);

    const key = await deriveKey();

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined);

    return JSON.parse(new TextDecoder().decode(decrypted)) as T;
}
