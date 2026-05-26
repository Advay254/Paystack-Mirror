/**
 * auth.js — Dashboard session management
 *
 * Cookie: mirror_session=<token>; HttpOnly; Secure; SameSite=Strict
 * Sessions live in KV with a 24-hour TTL.
 * Password is set via DASHBOARD_PASSWORD env var.
 */

import { randomId }                        from './crypto.js';
import { createSession, validateSession, deleteSession } from './store.js';

const COOKIE_NAME = 'mirror_session';

/**
 * Extract the session token from the Cookie header.
 * @param {Request} request
 * @returns {string|null}
 */
export function getSessionToken(request) {
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.split(';').map(c => c.trim()).find(c => c.startsWith(`${COOKIE_NAME}=`));
  return match ? match.slice(COOKIE_NAME.length + 1) : null;
}

/**
 * Check if the current request has a valid session.
 * @param {Request} request
 * @param {KVNamespace} kv
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated(request, kv) {
  const token = getSessionToken(request);
  return validateSession(kv, token);
}

/**
 * Handle POST /api/login
 * Body: { password: string }
 */
export async function handleLogin(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }

  if (!env.DASHBOARD_PASSWORD) {
    return json({ ok: false, error: 'DASHBOARD_PASSWORD not configured' }, 500);
  }

  // Constant-time password comparison
  const provided = String(body.password || '');
  const expected = String(env.DASHBOARD_PASSWORD);

  let diff = provided.length ^ expected.length;
  const len = Math.max(provided.length, expected.length);
  for (let i = 0; i < len; i++) {
    diff |= (provided.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
  }

  if (diff !== 0) {
    return json({ ok: false, error: 'Invalid password' }, 401);
  }

  const token = randomId() + randomId(); // 32-char random token
  await createSession(env.KV, token);

  const cookie = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=86400',
    ...(env.WORKER_BASE_URL?.startsWith('https') ? ['Secure'] : []),
  ].join('; ');

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookie,
    },
  });
}

/**
 * Handle POST /api/logout
 */
export async function handleLogout(request, env) {
  const token = getSessionToken(request);
  await deleteSession(env.KV, token);

  const cookie = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookie,
    },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
