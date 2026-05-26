/**
 * crypto.js — HMAC-SHA512 webhook signature verification
 * Uses SubtleCrypto (no deps, native to CF Workers runtime).
 */

/**
 * Verify a Paystack webhook signature.
 * Paystack signs the raw body with HMAC-SHA512 using your secret key.
 * The hex digest is in the `x-paystack-signature` header.
 *
 * @param {string} rawBody
 * @param {string} signature
 * @param {string} secretKey
 * @returns {Promise<boolean>}
 */
export async function verifySignature(rawBody, signature, secretKey) {
  if (!rawBody || !signature || !secretKey) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secretKey),
    { name: 'HMAC', hash: { name: 'SHA-512' } },
    false, ['sign'],
  );

  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody));
  const computed = [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // Constant-time compare
  if (computed.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

/** Generate a short random ID for events/sessions */
export function randomId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}
