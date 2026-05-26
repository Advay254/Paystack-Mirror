# Paystack Mirror

A **Cloudflare Worker** that solves Paystack's single-webhook-URL limitation.

Point Paystack at this worker. Register as many downstream services as you want.
Every verified event gets **broadcast to all of them simultaneously** — raw, unmodified.
Each service decides for itself whether the event belongs to it.

---

## Architecture

```
Paystack (Live)  ──POST──▶  /hook/live  ──┐
                                           │  verify HMAC-SHA512
Paystack (Test)  ──POST──▶  /hook/test  ──┤
                                           │
                                    fan-out (parallel)
                                           │
                         ┌─────────────────┼─────────────────┐
                         ▼                 ▼                 ▼
                  NexusAPI Bridge    AdvayPass          SkyluxMovies
                  /webhook           /api/webhook       /paystack/hook
                         │                 │                 │
                   self-verify        self-verify       self-verify
                   x-paystack-        x-paystack-       x-paystack-
                   signature          signature         signature
```

The original `x-paystack-signature` header is forwarded untouched on every
delivery, so each downstream service can independently verify authenticity
using its own copy of the Paystack secret key.

Two additional headers are injected:
- `x-mirror-env: live | test` — which Paystack environment the event came from
- `x-mirror-event-id: <id>` — unique ID for idempotency in the downstream service

---

## Quick start

### 1. Install and create KV

```bash
git clone https://github.com/Advay254/paystack-mirror
cd paystack-mirror
npm install
npm run kv:create
# → Copy the output id into wrangler.toml [[kv_namespaces]] → id
```

### 2. Set secrets

```bash
wrangler secret put PAYSTACK_LIVE_SECRET   # sk_live_*
wrangler secret put PAYSTACK_TEST_SECRET   # sk_test_*
wrangler secret put DASHBOARD_PASSWORD     # your dashboard password
```

### 3. Deploy

```bash
npm run deploy
# → https://paystack-mirror.your-subdomain.workers.dev
```

### 4. Register in Paystack

Go to [Paystack Dashboard](https://dashboard.paystack.com) → **Settings → API Keys & Webhooks**:

| Environment | Webhook URL |
|-------------|-------------|
| **Live**    | `https://paystack-mirror.your-subdomain.workers.dev/hook/live` |
| **Test**    | `https://paystack-mirror.your-subdomain.workers.dev/hook/test` |

### 5. Open the dashboard

Visit `https://paystack-mirror.your-subdomain.workers.dev` and log in with your `DASHBOARD_PASSWORD`.

Add each of your downstream services under the correct environment tab.

---

## Environment variables

| Variable               | How to set             | Description |
|------------------------|------------------------|-------------|
| `PAYSTACK_LIVE_SECRET` | `wrangler secret put`  | `sk_live_*` — verifies live webhook signatures |
| `PAYSTACK_TEST_SECRET` | `wrangler secret put`  | `sk_test_*` — verifies test webhook signatures |
| `DASHBOARD_PASSWORD`   | `wrangler secret put`  | Login password for the dashboard |
| `WORKER_BASE_URL`      | CF dashboard → Vars    | Your deployed worker URL (enables `Secure` cookie) |

---

## Dashboard

The built-in dashboard lives at `/` and requires the `DASHBOARD_PASSWORD` to access.

**Features:**
- Switch between Live and Test environments with a tab
- Add / disable / remove downstream endpoints
- View the last 100 events per environment with delivery status per endpoint
- Expand any event to see the raw payload and per-endpoint latency/HTTP status
- Replay any past event to all currently-active endpoints with one click

---

## How downstream services integrate

Each downstream service receives a standard POST with:

```
Content-Type: application/json
x-paystack-signature: <original HMAC-SHA512 from Paystack>
x-mirror-env: live
x-mirror-event-id: <unique id>
Body: <original Paystack JSON payload, byte-for-byte>
```

The service verifies the signature with its own Paystack secret key — same as
it would if Paystack called it directly. If the reference/metadata doesn't
match this service's records, it returns 200 and ignores the event.

**Example downstream handler (Node.js/Express):**

```js
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['x-paystack-signature'];
  const env = req.headers['x-mirror-env'];       // 'live' | 'test'
  const mid = req.headers['x-mirror-event-id'];  // for idempotency

  // Use your own Paystack secret key here
  const secret = env === 'live' ? process.env.PAYSTACK_LIVE_SK : process.env.PAYSTACK_TEST_SK;
  const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');

  if (hash !== sig) return res.sendStatus(401);

  const event = JSON.parse(req.body);

  // Only handle events that belong to this service
  if (event.event !== 'charge.success') return res.sendStatus(200);
  if (!myOrders.has(event.data.reference)) return res.sendStatus(200);

  // Process it...
  res.sendStatus(200);
});
```

**For the epay-paystack-bridge worker** — its `/webhook` endpoint already does
full HMAC-SHA512 verification, so it just works as a registered endpoint here.
Register it as:
- Label: `NexusAPI Bridge`
- URL: `https://epay-bridge.your-subdomain.workers.dev/webhook`

---

## Security

| Concern | How it's handled |
|---------|-----------------|
| Forged Paystack events | HMAC-SHA512 verified before any fan-out |
| Live/test key separation | `/hook/live` uses `PAYSTACK_LIVE_SECRET`, `/hook/test` uses `PAYSTACK_TEST_SECRET` |
| Dashboard access | HttpOnly session cookie, constant-time password compare, 24h session TTL |
| Dashboard session fixation | New random 32-char token on every login |
| XSS in dashboard | All user-supplied strings HTML-escaped before rendering |
| Downstream timeouts | 10-second per-endpoint timeout, `Promise.allSettled` — one slow service never blocks others |
| Secrets in logs | Only event type, reference, and delivery status are logged — never key values |

---

## Logs

```bash
npm run tail
```

Each broadcast logs:
```
[mirror] live | charge.success | a3f9b2c1d4e5 | 3/3 delivered
[mirror] test | charge.success | 88ef12ab3cd4 | 1/2 delivered
```

---

## File structure

```
paystack-mirror/
├── src/
│   ├── index.js    Worker router + all path dispatch
│   ├── mirror.js   Webhook receiver, HMAC verify, parallel fan-out
│   ├── api.js      REST handlers for endpoint/event management
│   ├── auth.js     Session login/logout/validation
│   ├── store.js    KV operations (endpoints, event log, sessions)
│   ├── crypto.js   HMAC-SHA512 verify + random ID generator
│   └── ui.js       Full dashboard SPA (inline HTML served by worker)
├── wrangler.toml
├── package.json
├── .dev.vars.example
├── .gitignore
└── README.md
```
