/**
 * index.js — Paystack Webhook Mirror
 *
 * A single Cloudflare Worker that:
 *  1. Receives Paystack webhooks (live + test on separate paths)
 *  2. Verifies each event's HMAC-SHA512 signature
 *  3. Broadcasts the raw event to ALL registered endpoints in parallel
 *  4. Logs delivery results per event
 *  5. Serves a secure dashboard for managing endpoints and viewing logs
 *
 * ── ROUTES ──────────────────────────────────────────────
 *  POST /hook/live          ← Register this as your Live webhook in Paystack
 *  POST /hook/test          ← Register this as your Test webhook in Paystack
 *
 *  GET  /                   ← Dashboard (requires auth cookie)
 *  GET  /api/me             ← Auth check (returns 200 or 401)
 *  POST /api/login          ← { password }
 *  POST /api/logout
 *
 *  GET    /api/endpoints?env=live|test
 *  POST   /api/endpoints?env=live|test        { url, label }
 *  PATCH  /api/endpoints/:id?env=live|test    { enabled }
 *  DELETE /api/endpoints/:id?env=live|test
 *
 *  GET  /api/events?env=live|test
 *  GET  /api/events/:id?env=live|test
 *  POST /api/events/:id/replay?env=live|test
 *
 * ── REQUIRED ENV VARS (set via `wrangler secret put`) ───
 *  PAYSTACK_LIVE_SECRET    sk_live_*  — verifies live webhook signatures
 *  PAYSTACK_TEST_SECRET    sk_test_*  — verifies test webhook signatures
 *  DASHBOARD_PASSWORD      any string — dashboard login password
 *
 * ── OPTIONAL ENV VARS ────────────────────────────────────
 *  WORKER_BASE_URL         — used to render https:// Secure cookie flag
 *
 * ── KV BINDING ────────────────────────────────────────────
 *  KV  →  bound KV namespace (create with: wrangler kv namespace create MIRROR_KV)
 */

import { handleWebhook }           from './mirror.js';
import { isAuthenticated, handleLogin, handleLogout } from './auth.js';
import {
  apiGetEndpoints, apiAddEndpoint, apiToggleEndpoint, apiDeleteEndpoint,
  apiGetEvents, apiGetEvent, apiReplayEvent,
} from './api.js';
import { dashboardHTML } from './ui.js';

export default {
  async fetch(request, env, ctx) {
    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    try {
      /* ── Paystack incoming webhooks ── */
      if (path === '/hook/live' && method === 'POST')
        return handleWebhook(request, env, ctx, 'live');

      if (path === '/hook/test' && method === 'POST')
        return handleWebhook(request, env, ctx, 'test');

      /* ── Public auth endpoints ── */
      if (path === '/api/login'  && method === 'POST') return handleLogin(request, env);
      if (path === '/api/logout' && method === 'POST') return handleLogout(request, env);

      /* ── Auth check (dashboard SPA uses this on boot) ── */
      if (path === '/api/me') {
        const ok = await isAuthenticated(request, env.KV);
        return new Response(JSON.stringify({ ok }), {
          status: ok ? 200 : 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      /* ── Dashboard (requires auth) ── */
      if (path === '/' && method === 'GET') {
        return new Response(dashboardHTML(), {
          headers: { 'Content-Type': 'text/html; charset=UTF-8' },
        });
      }

      /* ── Protected API routes ── */
      const authed = await isAuthenticated(request, env.KV);
      if (!authed) {
        return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Endpoints
      if (path === '/api/endpoints') {
        if (method === 'GET')  return apiGetEndpoints(request, env, url);
        if (method === 'POST') return apiAddEndpoint(request, env, url);
      }

      // /api/endpoints/:id
      const epMatch = path.match(/^\/api\/endpoints\/([a-f0-9]+)$/);
      if (epMatch) {
        const id = epMatch[1];
        if (method === 'PATCH')  return apiToggleEndpoint(request, env, url, id);
        if (method === 'DELETE') return apiDeleteEndpoint(request, env, url, id);
      }

      // Events index
      if (path === '/api/events' && method === 'GET')
        return apiGetEvents(request, env, url);

      // /api/events/:id
      const evMatch = path.match(/^\/api\/events\/([a-f0-9]+)$/);
      if (evMatch) {
        const id = evMatch[1];
        if (method === 'GET') return apiGetEvent(request, env, url, id);
      }

      // /api/events/:id/replay
      const replayMatch = path.match(/^\/api\/events\/([a-f0-9]+)\/replay$/);
      if (replayMatch && method === 'POST')
        return apiReplayEvent(request, env, url, replayMatch[1], ctx);

      return new Response('Not Found', { status: 404 });

    } catch (err) {
      console.error('[mirror] Unhandled error on', path, ':', err?.message ?? err);
      return new Response(JSON.stringify({ ok: false, error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
