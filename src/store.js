/**
 * store.js — KV operations for endpoints and event log
 *
 * KV schema:
 *   endpoints:{env}              → JSON array of Endpoint objects
 *   events:{env}:index           → JSON array of EventSummary (newest first, max 100)
 *   event:{env}:{id}             → Full EventRecord (TTL 7 days)
 *   session:{token}              → "1" (TTL 24h)
 *
 * env is always "live" or "test"
 */

const MAX_EVENTS = 100;
const EVENT_TTL  = 60 * 60 * 24 * 7; // 7 days
const SESSION_TTL = 60 * 60 * 24;     // 24 hours

/* ── Types (JSDoc) ─────────────────────────────────── */

/**
 * @typedef {object} Endpoint
 * @property {string}  id
 * @property {string}  url
 * @property {string}  label
 * @property {boolean} enabled
 * @property {number}  createdAt  — Unix ms
 */

/**
 * @typedef {object} DeliveryResult
 * @property {string}  endpointId
 * @property {string}  url
 * @property {string}  label
 * @property {boolean} success
 * @property {number}  statusCode
 * @property {number}  latencyMs
 * @property {string}  [error]
 */

/**
 * @typedef {object} EventRecord
 * @property {string}           id
 * @property {string}           env           — "live" | "test"
 * @property {number}           receivedAt    — Unix ms
 * @property {string}           eventType     — e.g. "charge.success"
 * @property {string}           reference
 * @property {number}           amount
 * @property {string}           currency
 * @property {string}           rawPayload    — trimmed to 4 KB max
 * @property {DeliveryResult[]} deliveries
 */

/* ── Endpoints ─────────────────────────────────────── */

export async function getEndpoints(kv, env) {
  const raw = await kv.get(`endpoints:${env}`);
  return raw ? JSON.parse(raw) : [];
}

export async function saveEndpoints(kv, env, endpoints) {
  await kv.put(`endpoints:${env}`, JSON.stringify(endpoints));
}

export async function addEndpoint(kv, env, { id, url, label }) {
  const list = await getEndpoints(kv, env);
  list.push({ id, url, label, enabled: true, createdAt: Date.now() });
  await saveEndpoints(kv, env, list);
}

export async function removeEndpoint(kv, env, id) {
  const list = await getEndpoints(kv, env);
  await saveEndpoints(kv, env, list.filter(e => e.id !== id));
}

export async function toggleEndpoint(kv, env, id, enabled) {
  const list = await getEndpoints(kv, env);
  const ep = list.find(e => e.id === id);
  if (ep) ep.enabled = enabled;
  await saveEndpoints(kv, env, list);
}

/* ── Events ────────────────────────────────────────── */

export async function saveEvent(kv, env, record) {
  // Store full record
  await kv.put(
    `event:${env}:${record.id}`,
    JSON.stringify(record),
    { expirationTtl: EVENT_TTL },
  );

  // Update rolling index (summary only)
  const raw = await kv.get(`events:${env}:index`);
  const index = raw ? JSON.parse(raw) : [];

  const summary = {
    id:          record.id,
    receivedAt:  record.receivedAt,
    eventType:   record.eventType,
    reference:   record.reference,
    amount:      record.amount,
    currency:    record.currency,
    total:       record.deliveries.length,
    succeeded:   record.deliveries.filter(d => d.success).length,
  };

  index.unshift(summary);
  if (index.length > MAX_EVENTS) index.length = MAX_EVENTS;

  await kv.put(`events:${env}:index`, JSON.stringify(index), { expirationTtl: EVENT_TTL });
}

export async function getEventsIndex(kv, env) {
  const raw = await kv.get(`events:${env}:index`);
  return raw ? JSON.parse(raw) : [];
}

export async function getEvent(kv, env, id) {
  const raw = await kv.get(`event:${env}:${id}`);
  return raw ? JSON.parse(raw) : null;
}

/* ── Sessions ──────────────────────────────────────── */

export async function createSession(kv, token) {
  await kv.put(`session:${token}`, '1', { expirationTtl: SESSION_TTL });
}

export async function validateSession(kv, token) {
  if (!token) return false;
  const val = await kv.get(`session:${token}`);
  return val === '1';
}

export async function deleteSession(kv, token) {
  if (token) await kv.delete(`session:${token}`);
}
