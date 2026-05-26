/**
 * mirror.js — Webhook receiver + parallel fan-out broadcaster
 *
 * Design: receives one Paystack event → broadcasts to ALL enabled endpoints
 * simultaneously. Each downstream service decides for itself if the event
 * is relevant. No routing logic here — pure mirror.
 *
 * The original x-paystack-signature header is forwarded untouched so
 * each downstream service can verify authenticity with their own copy
 * of the Paystack secret key.
 */

import { verifySignature, randomId } from './crypto.js';
import { getEndpoints, saveEvent }   from './store.js';

const FAN_OUT_TIMEOUT_MS = 10_000; // 10s per downstream

/**
 * Handle an incoming Paystack webhook for a given environment.
 *
 * @param {Request}          request
 * @param {object}           env       — CF Worker env bindings
 * @param {ExecutionContext}  ctx
 * @param {'live'|'test'}    paystackEnv
 */
export async function handleWebhook(request, env, ctx, paystackEnv) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const rawBody  = await request.text();
  const sigHeader = request.headers.get('x-paystack-signature') || '';

  // ── Verify with the correct secret key for this environment ──
  const secretKey = paystackEnv === 'live'
    ? env.PAYSTACK_LIVE_SECRET
    : env.PAYSTACK_TEST_SECRET;

  const valid = await verifySignature(rawBody, sigHeader, secretKey);
  if (!valid) {
    console.warn(`[mirror] Invalid signature on ${paystackEnv} webhook`);
    return new Response('Unauthorized', { status: 401 });
  }

  // ── Parse event ──
  let event;
  try { event = JSON.parse(rawBody); }
  catch { return new Response('Bad Request', { status: 400 }); }

  // ── Acknowledge Paystack immediately ──
  // Fan-out runs asynchronously — Paystack doesn't wait for it.
  const eventId = randomId();

  ctx.waitUntil(
    fanOut(env, paystackEnv, event, rawBody, sigHeader, eventId)
      .catch(err => console.error('[mirror] Fan-out error:', err?.message))
  );

  return new Response('OK', { status: 200 });
}

/**
 * Fan out one event to all enabled endpoints in parallel.
 * Records delivery results to KV regardless of individual failures.
 */
async function fanOut(env, paystackEnv, event, rawBody, originalSig, eventId) {
  const endpoints = await getEndpoints(env.KV, paystackEnv);
  const active    = endpoints.filter(ep => ep.enabled);

  // Fire all deliveries in parallel
  const deliveries = await Promise.allSettled(
    active.map(ep => deliverTo(ep, rawBody, originalSig, paystackEnv, eventId))
  );

  // Map results
  const results = active.map((ep, i) => {
    const outcome = deliveries[i];
    if (outcome.status === 'fulfilled') return outcome.value;
    return {
      endpointId: ep.id,
      url:        ep.url,
      label:      ep.label,
      success:    false,
      statusCode: 0,
      latencyMs:  0,
      error:      outcome.reason?.message || 'Unknown error',
    };
  });

  // ── Build and persist event record ──
  const data = event?.data ?? {};
  await saveEvent(env.KV, paystackEnv, {
    id:         eventId,
    env:        paystackEnv,
    receivedAt: Date.now(),
    eventType:  event?.event  || 'unknown',
    reference:  data.reference || '',
    amount:     data.amount    || 0,
    currency:   data.currency  || '',
    rawPayload: rawBody.slice(0, 4096), // cap at 4 KB
    deliveries: results,
  });

  const ok  = results.filter(r => r.success).length;
  const tot = results.length;
  console.log(`[mirror] ${paystackEnv} | ${event?.event} | ${eventId} | ${ok}/${tot} delivered`);
}

/**
 * Deliver one event to one downstream endpoint.
 * Forwards the original Paystack signature so the receiver can verify.
 *
 * @returns {Promise<DeliveryResult>}
 */
async function deliverTo(ep, rawBody, originalSig, paystackEnv, eventId) {
  const t0 = Date.now();

  try {
    const res = await fetch(ep.url, {
      method:  'POST',
      headers: {
        'Content-Type':            'application/json',
        'x-paystack-signature':    originalSig,   // downstream verifies this
        'x-mirror-env':            paystackEnv,
        'x-mirror-event-id':       eventId,       // idempotency key for downstream
        'User-Agent':              'Paystack-Mirror/1.0',
      },
      body:   rawBody,
      signal: AbortSignal.timeout(FAN_OUT_TIMEOUT_MS),
    });

    return {
      endpointId: ep.id,
      url:        ep.url,
      label:      ep.label,
      success:    res.ok,
      statusCode: res.status,
      latencyMs:  Date.now() - t0,
    };
  } catch (err) {
    return {
      endpointId: ep.id,
      url:        ep.url,
      label:      ep.label,
      success:    false,
      statusCode: 0,
      latencyMs:  Date.now() - t0,
      error:      err.name === 'TimeoutError' ? 'Timed out after 10s' : err.message,
    };
  }
}

/**
 * Replay a stored event to all currently-enabled endpoints.
 * Uses the same stored rawPayload and original signature.
 */
export async function replayEvent(env, paystackEnv, record, ctx) {
  ctx.waitUntil(
    fanOut(
      env,
      paystackEnv,
      JSON.parse(record.rawPayload),
      record.rawPayload,
      '', // no original sig available for replay — downstream should handle missing sig
      randomId(),
    ).catch(err => console.error('[mirror] Replay error:', err?.message))
  );
}
