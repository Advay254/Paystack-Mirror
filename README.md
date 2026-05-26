<div align="center">

<img src="https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" width="80" />

# Paystack Mirror

**One Paystack webhook URL. Unlimited downstream services.**

A Cloudflare Worker that receives Paystack events and broadcasts them to every registered endpoint simultaneously — raw, unmodified, with the original signature forwarded so each service can verify independently.

[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare_Workers-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-6366f1?style=flat)](LICENSE)
![Runtime](https://img.shields.io/badge/Runtime-Edge-22c55e?style=flat)

</div>

---

## The problem it solves

Paystack gives you **one webhook URL** per environment. If you have multiple services on the same Paystack account, only one gets the events.

```
❌ Without Mirror          ✅ With Mirror
                           
Paystack ──► Service A     Paystack ──► Mirror ──► Service A
         ✗  Service B                          ──► Service B
         ✗  Service C                          ──► Service C
```

---

## How it works

<img src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" width="100%" />

```
Paystack (Live)  POST ──► /hook/live ──┐
                                       │  Verify HMAC-SHA512
Paystack (Test)  POST ──► /hook/test ──┤
                                       │
                           fan-out in parallel (Promise.allSettled)
                                       │
              ┌────────────────────────┼─────────────────────┐
              ▼                        ▼                      ▼
       Service A /webhook      Service B /webhook     Service C /webhook
       self-verify sig         self-verify sig        self-verify sig
       handle or ignore        handle or ignore       handle or ignore
```

Each downstream service receives the **original raw body** and the **original `x-paystack-signature`** header — as if Paystack called it directly. No routing logic, no parsing. Pure mirror.

---

## Dashboard

<img src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" width="100%" />

A built-in secure dashboard at `/` lets you:

- Register and manage downstream endpoints per environment
- View the last 100 events with per-endpoint delivery status
- Inspect raw payloads and latency per delivery
- Replay any past event to all currently active endpoints

**Login** requires username + password (both set as env secrets). Brute-force protection locks the account for 15 minutes after 5 failed attempts.

---

## Quick start

```bash
git clone https://github.com/Advay254/paystack-mirror
cd paystack-mirror
npm install

# 1. Create KV namespace
npm run kv:create
# → Copy the output id into wrangler.toml [[kv_namespaces]] → id

# 2. Set secrets
wrangler secret put PAYSTACK_LIVE_SECRET
wrangler secret put PAYSTACK_TEST_SECRET
wrangler secret put DASHBOARD_USERNAME
wrangler secret put DASHBOARD_PASSWORD

# 3. Deploy
npm run deploy
```

Then register these URLs in [Paystack Dashboard](https://dashboard.paystack.com) → Settings → API Keys & Webhooks:

| Environment | Webhook URL |
|---|---|
| Live | `https://paystack-mirror.your-subdomain.workers.dev/hook/live` |
| Test | `https://paystack-mirror.your-subdomain.workers.dev/hook/test` |

---

## Environment variables

| Variable | Type | Description |
|---|---|---|
| `PAYSTACK_LIVE_SECRET` | Secret | `sk_live_*` — verifies live webhook HMAC signatures |
| `PAYSTACK_TEST_SECRET` | Secret | `sk_test_*` — verifies test webhook HMAC signatures |
| `DASHBOARD_USERNAME` | Secret | Login username for the dashboard |
| `DASHBOARD_PASSWORD` | Secret | Login password for the dashboard |
| `WORKER_BASE_URL` | Plain var | Deployed worker URL — enables `Secure` cookie flag |

Set secrets via `wrangler secret put <NAME>` or CF Dashboard → Worker → Settings → Variables & Secrets.

---

## Downstream integration

Each service receives:

```http
POST /your-webhook
Content-Type: application/json
x-paystack-signature: <original HMAC-SHA512 from Paystack>
x-mirror-env: live
x-mirror-event-id: <unique id per broadcast>

{ ...original Paystack event payload... }
```

Verify the signature with your own Paystack secret key, check if the reference belongs to your service, and process or ignore:

```js
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['x-paystack-signature'];
  const env = req.headers['x-mirror-env']; // 'live' | 'test'

  const secret = env === 'live' ? process.env.PAYSTACK_LIVE_SK : process.env.PAYSTACK_TEST_SK;
  const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');
  if (hash !== sig) return res.sendStatus(401);

  const event = JSON.parse(req.body);
  if (event.event !== 'charge.success') return res.sendStatus(200);

  // Only handle if the reference belongs to this service
  const order = await myDb.findOrder(event.data.reference);
  if (!order) return res.sendStatus(200); // not ours — ignore

  // Process payment...
  res.sendStatus(200);
});
```

---

## Security

| Concern | Mitigation |
|---|---|
| Forged Paystack events | HMAC-SHA512 verified via SubtleCrypto before any fan-out |
| Live/test confusion | Separate paths `/hook/live` and `/hook/test` with separate keys |
| Dashboard brute force | 5 attempts → 15-minute IP lockout stored in KV |
| Timing oracle on credentials | Constant-time XOR comparison on username and password |
| Session hijacking | HttpOnly, Secure, SameSite=Strict cookie, 24h TTL |
| Duplicate webhook delivery | Each broadcast gets a unique `x-mirror-event-id` for downstream idempotency |
| Downstream timeouts | 10-second per-endpoint timeout — one slow service never blocks others |

---

## File structure

```
src/
├── index.js     Worker router
├── mirror.js    Webhook receiver + parallel fan-out broadcaster  
├── api.js       REST handlers (endpoint/event CRUD)
├── auth.js      Username + password auth, brute-force protection
├── store.js     KV operations (endpoints, event log, sessions, rate limits)
├── crypto.js    HMAC-SHA512 verification + random ID
└── ui.js        Dashboard SPA (served inline, no external hosting)
```

---

<div align="center">
  <sub>Built for the ADVAY stack · Cloudflare Workers · Zero external dependencies</sub>
</div>
