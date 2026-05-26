/**
 * auth.js — Dashboard authentication with brute-force protection
 *
 * Security model:
 *  - Username + password (both required, set via env vars)
 *  - Rate limiting: 5 failed attempts → 15-minute lockout per IP
 *  - Constant-time credential comparison (prevents timing oracle)
 *  - HttpOnly, Secure, SameSite=Strict session cookie
 *  - 24-hour session TTL in KV
 *
 * Required env vars:
 *   DASHBOARD_USERNAME   — login username
 *   DASHBOARD_PASSWORD   — login password
 */

import { randomId } from './crypto.js';
import { createSession, validateSession, deleteSession } from './store.js';

const COOKIE_NAME     = 'mirror_session';
const MAX_ATTEMPTS    = 5;
const LOCKOUT_SEC     = 15 * 60;        // 15 minutes
const RATE_KEY_TTL    = 60 * 60;        // 1 hour window before counter resets

/* ── Session helpers ───────────────────────────────── */

export function getSessionToken(request) {
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.split(';').map(c => c.trim())
    .find(c => c.startsWith(`${COOKIE_NAME}=`));
  return match ? match.slice(COOKIE_NAME.length + 1) : null;
}

export async function isAuthenticated(request, kv) {
  const token = getSessionToken(request);
  return validateSession(kv, token);
}

/* ── Rate limiting ─────────────────────────────────── */

function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

async function getRateLimit(kv, ip) {
  const raw = await kv.get(`ratelimit:${ip}`);
  if (!raw) return { attempts: 0, lockedUntil: null };
  try { return JSON.parse(raw); }
  catch { return { attempts: 0, lockedUntil: null }; }
}

async function recordFailedAttempt(kv, ip) {
  const data = await getRateLimit(kv, ip);
  data.attempts = (data.attempts || 0) + 1;
  if (data.attempts >= MAX_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCKOUT_SEC * 1000;
  }
  await kv.put(`ratelimit:${ip}`, JSON.stringify(data), { expirationTtl: RATE_KEY_TTL });
  return data;
}

async function clearRateLimit(kv, ip) {
  await kv.delete(`ratelimit:${ip}`);
}

/* ── Constant-time string comparison ───────────────── */

function safeCompare(a, b) {
  const sa = String(a ?? '');
  const sb = String(b ?? '');
  const maxLen = Math.max(sa.length, sb.length);
  let diff = sa.length ^ sb.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (sa.charCodeAt(i) || 0) ^ (sb.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/* ── Login handler ─────────────────────────────────── */

export async function handleLogin(request, env) {
  const ip = getClientIp(request);

  // Check lockout before reading body
  const rateData = await getRateLimit(env.KV, ip);
  if (rateData.lockedUntil && rateData.lockedUntil > Date.now()) {
    const retryAfter = Math.ceil((rateData.lockedUntil - Date.now()) / 1000);
    return json({
      ok: false,
      error: 'Too many failed attempts. Try again later.',
      lockedUntil: rateData.lockedUntil,
      retryAfter,
    }, 429);
  }

  // Parse body
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid request body' }, 400); }

  // Env vars must be configured
  if (!env.DASHBOARD_USERNAME || !env.DASHBOARD_PASSWORD) {
    return json({ ok: false, error: 'Dashboard credentials not configured on server' }, 500);
  }

  const usernameOk = safeCompare(body.username, env.DASHBOARD_USERNAME);
  const passwordOk = safeCompare(body.password, env.DASHBOARD_PASSWORD);

  if (!usernameOk || !passwordOk) {
    const updated = await recordFailedAttempt(env.KV, ip);
    const remaining = Math.max(0, MAX_ATTEMPTS - updated.attempts);

    return json({
      ok: false,
      error: 'Invalid username or password',
      attemptsRemaining: remaining,
      ...(updated.lockedUntil ? { lockedUntil: updated.lockedUntil } : {}),
    }, 401);
  }

  // Success — clear rate limit and issue session
  await clearRateLimit(env.KV, ip);
  const token = randomId() + randomId(); // 32-char random token
  await createSession(env.KV, token);

  const isHttps = (env.WORKER_BASE_URL || '').startsWith('https');
  const cookie = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=86400',
    ...(isHttps ? ['Secure'] : []),
  ].join('; ');

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
  });
}

/* ── Logout handler ────────────────────────────────── */

export async function handleLogout(request, env) {
  const token = getSessionToken(request);
  await deleteSession(env.KV, token);
  const cookie = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
