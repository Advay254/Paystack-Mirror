/**
 * api.js — REST API handlers (all require auth)
 *
 * GET    /api/endpoints?env=live|test
 * POST   /api/endpoints?env=live|test        { url, label }
 * PATCH  /api/endpoints/:id?env=live|test    { enabled }
 * DELETE /api/endpoints/:id?env=live|test
 *
 * GET    /api/events?env=live|test
 * GET    /api/events/:id?env=live|test
 * POST   /api/events/:id/replay?env=live|test
 */

import { randomId }       from './crypto.js';
import { replayEvent }    from './mirror.js';
import {
  getEndpoints, addEndpoint, removeEndpoint, toggleEndpoint,
  getEventsIndex, getEvent,
} from './store.js';

/* ── Endpoints ─────────────────────────────────────── */

export async function apiGetEndpoints(request, env, url) {
  const paystackEnv = env_(url);
  const list = await getEndpoints(env.KV, paystackEnv);
  return json({ ok: true, env: paystackEnv, data: list });
}

export async function apiAddEndpoint(request, env, url) {
  const paystackEnv = env_(url);
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }

  const { url: epUrl, label } = body;

  if (!epUrl || !isValidUrl(epUrl)) {
    return json({ ok: false, error: 'A valid HTTPS URL is required' }, 400);
  }
  if (!label || String(label).trim().length === 0) {
    return json({ ok: false, error: 'label is required' }, 400);
  }

  // Prevent duplicate URLs in the same env
  const existing = await getEndpoints(env.KV, paystackEnv);
  if (existing.some(e => e.url === epUrl)) {
    return json({ ok: false, error: 'This URL is already registered for this environment' }, 409);
  }

  const id = randomId();
  await addEndpoint(env.KV, paystackEnv, { id, url: epUrl, label: String(label).trim() });
  return json({ ok: true, data: { id } }, 201);
}

export async function apiToggleEndpoint(request, env, url, id) {
  const paystackEnv = env_(url);
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }

  if (typeof body.enabled !== 'boolean') {
    return json({ ok: false, error: 'enabled (boolean) is required' }, 400);
  }

  await toggleEndpoint(env.KV, paystackEnv, id, body.enabled);
  return json({ ok: true });
}

export async function apiDeleteEndpoint(request, env, url, id) {
  const paystackEnv = env_(url);
  await removeEndpoint(env.KV, paystackEnv, id);
  return json({ ok: true });
}

/* ── Events ────────────────────────────────────────── */

export async function apiGetEvents(request, env, url) {
  const paystackEnv = env_(url);
  const index = await getEventsIndex(env.KV, paystackEnv);
  return json({ ok: true, env: paystackEnv, data: index });
}

export async function apiGetEvent(request, env, url, id) {
  const paystackEnv = env_(url);
  const record = await getEvent(env.KV, paystackEnv, id);
  if (!record) return json({ ok: false, error: 'Event not found' }, 404);
  return json({ ok: true, data: record });
}

export async function apiReplayEvent(request, env, url, id, ctx) {
  const paystackEnv = env_(url);
  const record = await getEvent(env.KV, paystackEnv, id);
  if (!record) return json({ ok: false, error: 'Event not found' }, 404);
  if (!record.rawPayload) return json({ ok: false, error: 'Raw payload not available for replay' }, 400);

  await replayEvent(env, paystackEnv, record, ctx);
  return json({ ok: true, message: 'Replay dispatched' });
}

/* ── Helpers ───────────────────────────────────────── */

function env_(url) {
  const e = url.searchParams.get('env');
  return e === 'test' ? 'test' : 'live';
}

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
