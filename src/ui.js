/**
 * ui.js — Dashboard SPA (served at GET /)
 * Stack: Tailwind Play CDN + Vanilla JS + DM Sans / DM Mono
 */

export function dashboardHTML() {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Paystack Mirror</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<script>
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans', 'sans-serif'], mono: ['DM Mono', 'monospace'] },
      colors: {
        surface: { DEFAULT: '#0d0d0f', card: '#141418', border: '#26262c', hover: '#1e1e24' },
        accent:  { DEFAULT: '#6366f1', hover: '#818cf8', dim: '#6366f120' },
      },
    },
  },
};
</script>
<style>
  * { -webkit-font-smoothing: antialiased; }
  body { background: #0d0d0f; color: #e2e2e8; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #36363e; border-radius: 4px; }
  .mono { font-family: 'DM Mono', monospace; }
  .badge-green  { background:#16a34a22; color:#4ade80; border:1px solid #4ade8033; }
  .badge-red    { background:#dc262622; color:#f87171; border:1px solid #f8717133; }
  .badge-yellow { background:#ca8a0422; color:#fbbf24; border:1px solid #fbbf2433; }
  .badge-gray   { background:#6b728022; color:#9ca3af; border:1px solid #9ca3af33; }
  .badge-indigo { background:#6366f122; color:#a5b4fc; border:1px solid #a5b4fc33; }
  input, select { background:#1a1a20 !important; border:1px solid #26262c !important;
                  color:#e2e2e8 !important; border-radius:8px; padding:8px 12px;
                  outline:none; font-family:'DM Sans',sans-serif; font-size:14px; }
  input:focus, select:focus { border-color:#6366f1 !important; box-shadow:0 0 0 2px #6366f120; }
  .btn-primary { background:#6366f1; color:#fff; border-radius:8px; padding:8px 16px;
                  font-size:14px; font-weight:500; cursor:pointer; border:none;
                  transition:background .15s; }
  .btn-primary:hover { background:#818cf8; }
  .btn-ghost { background:transparent; color:#9ca3af; border:1px solid #26262c;
               border-radius:8px; padding:6px 12px; font-size:13px; cursor:pointer;
               transition:all .15s; }
  .btn-ghost:hover { border-color:#6366f1; color:#a5b4fc; }
  .btn-danger { background:#dc262615; color:#f87171; border:1px solid #dc262630;
                border-radius:8px; padding:6px 12px; font-size:13px; cursor:pointer;
                transition:all .15s; }
  .btn-danger:hover { background:#dc262625; }
  .card { background:#141418; border:1px solid #26262c; border-radius:12px; }
  .tab { padding:8px 20px; border-radius:8px; font-size:14px; font-weight:500;
         cursor:pointer; transition:all .15s; color:#6b7280; }
  .tab.active { background:#6366f122; color:#a5b4fc; }
  .tab:hover:not(.active) { color:#e2e2e8; }
  #overlay { position:fixed; inset:0; background:#00000090; z-index:50;
             display:flex; align-items:center; justify-content:center; }
  #overlay.hidden { display:none; }
  .spinner { width:20px; height:20px; border:2px solid #26262c;
             border-top-color:#6366f1; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
</style>
</head>
<body class="min-h-screen">

<!-- ── Login Screen ───────────────────────────────── -->
<div id="login-screen" class="hidden min-h-screen flex items-center justify-center p-4">
  <div class="card p-8 w-full max-w-sm">
    <div class="flex items-center gap-3 mb-8">
      <div class="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-lg">🪞</div>
      <div>
        <h1 class="text-white font-semibold text-lg leading-none">Paystack Mirror</h1>
        <p class="text-xs text-gray-500 mt-0.5">Webhook broadcaster</p>
      </div>
    </div>
    <div class="space-y-3">
      <input id="pw-input" type="password" placeholder="Dashboard password"
             class="w-full" onkeydown="if(event.key==='Enter')doLogin()">
      <button class="btn-primary w-full" onclick="doLogin()">Sign in</button>
      <p id="login-err" class="text-red-400 text-xs text-center hidden"></p>
    </div>
  </div>
</div>

<!-- ── Main Dashboard ────────────────────────────── -->
<div id="app" class="hidden max-w-4xl mx-auto px-4 py-6 space-y-6">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-xl">🪞</span>
      <h1 class="text-white font-semibold text-lg">Paystack Mirror</h1>
    </div>
    <div class="flex items-center gap-2">
      <div class="flex gap-1 p-1 bg-surface-card rounded-lg border border-surface-border">
        <button class="tab active" id="tab-live" onclick="switchEnv('live')">🟢 Live</button>
        <button class="tab"        id="tab-test" onclick="switchEnv('test')">🧪 Test</button>
      </div>
      <button class="btn-ghost" onclick="doLogout()">Logout</button>
    </div>
  </div>

  <!-- Webhook URLs info card -->
  <div class="card p-4">
    <p class="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Register these in Paystack Dashboard → API Keys & Webhooks</p>
    <div class="space-y-2">
      <div class="flex items-center gap-3">
        <span class="badge-green px-2 py-0.5 rounded text-xs font-medium">Live</span>
        <code class="mono text-sm text-indigo-300" id="live-url">loading...</code>
        <button class="btn-ghost text-xs py-1 px-2" onclick="copyUrl('live')">Copy</button>
      </div>
      <div class="flex items-center gap-3">
        <span class="badge-yellow px-2 py-0.5 rounded text-xs font-medium">Test</span>
        <code class="mono text-sm text-indigo-300" id="test-url">loading...</code>
        <button class="btn-ghost text-xs py-1 px-2" onclick="copyUrl('test')">Copy</button>
      </div>
    </div>
  </div>

  <!-- Endpoints section -->
  <div class="card p-5">
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-white">Connected Endpoints</h2>
      <button class="btn-primary text-sm" onclick="openAddModal()">+ Add Endpoint</button>
    </div>
    <div id="endpoints-list">
      <div class="flex justify-center py-8"><div class="spinner"></div></div>
    </div>
  </div>

  <!-- Events section -->
  <div class="card p-5">
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-white">Recent Events</h2>
      <button class="btn-ghost text-sm" onclick="loadEvents()">↻ Refresh</button>
    </div>
    <div id="events-list">
      <div class="flex justify-center py-8"><div class="spinner"></div></div>
    </div>
  </div>
</div>

<!-- ── Add Endpoint Modal ─────────────────────────── -->
<div id="overlay" class="hidden" onclick="if(event.target===this)closeAddModal()">
  <div class="card p-6 w-full max-w-md mx-4" onclick="event.stopPropagation()">
    <h3 class="text-white font-semibold mb-4">Add Endpoint</h3>
    <div class="space-y-3">
      <div>
        <label class="text-xs text-gray-400 mb-1 block">Label</label>
        <input id="ep-label" type="text" placeholder="e.g. NexusAPI Bridge" class="w-full">
      </div>
      <div>
        <label class="text-xs text-gray-400 mb-1 block">Webhook URL</label>
        <input id="ep-url" type="url" placeholder="https://your-service.workers.dev/webhook" class="w-full">
      </div>
      <p class="text-xs text-gray-500">
        This URL will receive ALL <span id="modal-env" class="text-indigo-400 font-medium">live</span> events.
        Each service should verify the <code class="mono">x-paystack-signature</code> independently.
      </p>
      <p id="ep-err" class="text-red-400 text-xs hidden"></p>
      <div class="flex gap-2 pt-1">
        <button class="btn-primary flex-1" onclick="doAddEndpoint()">Add</button>
        <button class="btn-ghost" onclick="closeAddModal()">Cancel</button>
      </div>
    </div>
  </div>
</div>

<!-- ── Event Detail Modal ─────────────────────────── -->
<div id="event-overlay" class="hidden" onclick="if(event.target===this)closeEventModal()">
  <div class="card p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white font-semibold">Event Detail</h3>
      <button class="btn-ghost text-xs" onclick="closeEventModal()">✕</button>
    </div>
    <div id="event-detail-content"></div>
  </div>
</div>

<script>
/* ── State ─────────────────────────────── */
let currentEnv = 'live';
const BASE = window.location.origin;

/* ── Boot ──────────────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  // Set webhook URLs
  document.getElementById('live-url').textContent = BASE + '/hook/live';
  document.getElementById('test-url').textContent = BASE + '/hook/test';

  // Check auth
  const res = await fetch('/api/me');
  if (res.ok) showApp();
  else showLogin();
});

function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}
function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  loadAll();
}
function loadAll() { loadEndpoints(); loadEvents(); }

/* ── Auth ──────────────────────────────── */
async function doLogin() {
  const pw  = document.getElementById('pw-input').value;
  const err = document.getElementById('login-err');
  err.classList.add('hidden');
  const r = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:pw}) });
  if (r.ok) { showApp(); document.getElementById('pw-input').value = ''; }
  else { err.textContent = 'Wrong password'; err.classList.remove('hidden'); }
}
async function doLogout() {
  await fetch('/api/logout', { method:'POST' });
  showLogin();
}

/* ── Env tabs ──────────────────────────── */
function switchEnv(env) {
  currentEnv = env;
  document.getElementById('tab-live').className = 'tab' + (env==='live' ? ' active' : '');
  document.getElementById('tab-test').className = 'tab' + (env==='test' ? ' active' : '');
  document.getElementById('modal-env').textContent = env;
  loadAll();
}

/* ── Copy URL ──────────────────────────── */
function copyUrl(env) {
  navigator.clipboard.writeText(BASE + '/hook/' + env);
}

/* ── Endpoints ─────────────────────────── */
async function loadEndpoints() {
  document.getElementById('endpoints-list').innerHTML =
    '<div class="flex justify-center py-8"><div class="spinner"></div></div>';
  const r = await fetch('/api/endpoints?env=' + currentEnv);
  const { data } = await r.json();
  renderEndpoints(data || []);
}

function renderEndpoints(list) {
  const el = document.getElementById('endpoints-list');
  if (!list.length) {
    el.innerHTML = '<p class="text-gray-500 text-sm text-center py-8">No endpoints yet. Add one to start mirroring.</p>';
    return;
  }
  el.innerHTML = list.map(ep => \`
    <div class="flex items-start gap-3 py-3 border-b border-surface-border last:border-0">
      <div class="mt-0.5">
        \${ep.enabled
          ? '<span class="w-2 h-2 rounded-full bg-green-500 block mt-1"></span>'
          : '<span class="w-2 h-2 rounded-full bg-gray-600 block mt-1"></span>'}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5">
          <span class="text-white text-sm font-medium">\${esc(ep.label)}</span>
          \${ep.enabled
            ? '<span class="badge-green text-xs px-1.5 py-0.5 rounded">active</span>'
            : '<span class="badge-gray text-xs px-1.5 py-0.5 rounded">disabled</span>'}
        </div>
        <p class="mono text-xs text-gray-400 truncate">\${esc(ep.url)}</p>
        <p class="text-xs text-gray-600 mt-0.5">\${timeAgo(ep.createdAt)}</p>
      </div>
      <div class="flex gap-1.5 shrink-0">
        <button class="btn-ghost text-xs py-1 px-2"
          onclick="toggleEp('\${ep.id}', \${!ep.enabled})">\${ep.enabled ? 'Disable' : 'Enable'}</button>
        <button class="btn-danger text-xs py-1 px-2"
          onclick="deleteEp('\${ep.id}')">✕</button>
      </div>
    </div>
  \`).join('');
}

function openAddModal()  {
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('ep-label').focus();
}
function closeAddModal() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('ep-label').value = '';
  document.getElementById('ep-url').value = '';
  document.getElementById('ep-err').classList.add('hidden');
}

async function doAddEndpoint() {
  const url   = document.getElementById('ep-url').value.trim();
  const label = document.getElementById('ep-label').value.trim();
  const err   = document.getElementById('ep-err');
  err.classList.add('hidden');

  const r = await fetch('/api/endpoints?env=' + currentEnv, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, label }),
  });
  const data = await r.json();
  if (data.ok) { closeAddModal(); loadEndpoints(); }
  else { err.textContent = data.error || 'Failed'; err.classList.remove('hidden'); }
}

async function toggleEp(id, enabled) {
  await fetch('/api/endpoints/' + id + '?env=' + currentEnv, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  loadEndpoints();
}

async function deleteEp(id) {
  if (!confirm('Remove this endpoint?')) return;
  await fetch('/api/endpoints/' + id + '?env=' + currentEnv, { method: 'DELETE' });
  loadEndpoints();
}

/* ── Events ────────────────────────────── */
async function loadEvents() {
  document.getElementById('events-list').innerHTML =
    '<div class="flex justify-center py-8"><div class="spinner"></div></div>';
  const r = await fetch('/api/events?env=' + currentEnv);
  const { data } = await r.json();
  renderEvents(data || []);
}

function renderEvents(list) {
  const el = document.getElementById('events-list');
  if (!list.length) {
    el.innerHTML = '<p class="text-gray-500 text-sm text-center py-8">No events received yet.</p>';
    return;
  }
  el.innerHTML = \`
    <table class="w-full text-sm">
      <thead>
        <tr class="text-left text-xs text-gray-500 border-b border-surface-border">
          <th class="pb-2 font-medium">Time</th>
          <th class="pb-2 font-medium">Event</th>
          <th class="pb-2 font-medium">Reference</th>
          <th class="pb-2 font-medium">Amount</th>
          <th class="pb-2 font-medium">Delivered</th>
          <th class="pb-2"></th>
        </tr>
      </thead>
      <tbody>
        \${list.map(ev => \`
          <tr class="border-b border-surface-border last:border-0 hover:bg-surface-hover
                     cursor-pointer transition-colors"
              onclick="openEventModal('\${ev.id}')">
            <td class="py-2.5 text-gray-400 text-xs">\${timeAgo(ev.receivedAt)}</td>
            <td class="py-2.5">
              <span class="badge-indigo px-2 py-0.5 rounded mono text-xs">\${esc(ev.eventType)}</span>
            </td>
            <td class="py-2.5 mono text-xs text-gray-300">\${esc(ev.reference || '—')}</td>
            <td class="py-2.5 text-xs text-gray-300">
              \${ev.amount ? fmtAmount(ev.amount, ev.currency) : '—'}
            </td>
            <td class="py-2.5">
              \${deliveryBadge(ev.succeeded, ev.total)}
            </td>
            <td class="py-2.5">
              <button class="btn-ghost text-xs py-0.5 px-2"
                onclick="event.stopPropagation(); replayEv('\${ev.id}')">↺ Replay</button>
            </td>
          </tr>
        \`).join('')}
      </tbody>
    </table>
  \`;
}

function deliveryBadge(ok, total) {
  if (total === 0) return '<span class="badge-gray px-2 py-0.5 rounded text-xs">no targets</span>';
  if (ok === total) return \`<span class="badge-green px-2 py-0.5 rounded text-xs">\${ok}/\${total} ✓</span>\`;
  if (ok === 0)     return \`<span class="badge-red px-2 py-0.5 rounded text-xs">0/\${total} ✗</span>\`;
  return \`<span class="badge-yellow px-2 py-0.5 rounded text-xs">\${ok}/\${total} ⚠</span>\`;
}

async function openEventModal(id) {
  document.getElementById('event-overlay').classList.remove('hidden');
  document.getElementById('event-detail-content').innerHTML =
    '<div class="flex justify-center py-6"><div class="spinner"></div></div>';

  const r = await fetch('/api/events/' + id + '?env=' + currentEnv);
  const { data, error } = await r.json();
  if (!data) {
    document.getElementById('event-detail-content').innerHTML =
      '<p class="text-red-400 text-sm">' + esc(error || 'Not found') + '</p>';
    return;
  }

  document.getElementById('event-detail-content').innerHTML = \`
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-xs text-gray-500 mb-1">Event</p>
          <span class="badge-indigo px-2 py-0.5 rounded mono text-xs">\${esc(data.eventType)}</span>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">Environment</p>
          \${data.env === 'live'
            ? '<span class="badge-green px-2 py-0.5 rounded text-xs">live</span>'
            : '<span class="badge-yellow px-2 py-0.5 rounded text-xs">test</span>'}
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">Reference</p>
          <p class="mono text-xs text-gray-300">\${esc(data.reference || '—')}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">Amount</p>
          <p class="text-sm text-white">\${data.amount ? fmtAmount(data.amount, data.currency) : '—'}</p>
        </div>
        <div class="col-span-2">
          <p class="text-xs text-gray-500 mb-1">Received</p>
          <p class="text-xs text-gray-400">\${new Date(data.receivedAt).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <p class="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Delivery Results</p>
        \${data.deliveries.length === 0
          ? '<p class="text-gray-500 text-sm">No endpoints were active at the time.</p>'
          : data.deliveries.map(d => \`
              <div class="flex items-start gap-3 py-2 border-b border-surface-border last:border-0">
                <div class="mt-0.5">
                  \${d.success
                    ? '<span class="w-2 h-2 rounded-full bg-green-500 block mt-1"></span>'
                    : '<span class="w-2 h-2 rounded-full bg-red-500 block mt-1"></span>'}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-sm text-white">\${esc(d.label)}</span>
                    \${d.statusCode
                      ? '<span class="mono text-xs text-gray-500">HTTP ' + d.statusCode + '</span>'
                      : ''}
                    <span class="mono text-xs text-gray-600">\${d.latencyMs}ms</span>
                  </div>
                  <p class="mono text-xs text-gray-500 truncate">\${esc(d.url)}</p>
                  \${d.error ? '<p class="text-red-400 text-xs mt-0.5">' + esc(d.error) + '</p>' : ''}
                </div>
              </div>
            \`).join('')}
      </div>

      <div>
        <p class="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Raw Payload</p>
        <pre class="bg-surface rounded-lg p-3 text-xs mono text-gray-400
                    overflow-x-auto max-h-40 border border-surface-border whitespace-pre-wrap">\${esc(fmtJson(data.rawPayload))}</pre>
      </div>

      <button class="btn-primary w-full text-sm"
        onclick="closeEventModal(); replayEv('\${data.id}')">↺ Replay to all active endpoints</button>
    </div>
  \`;
}
function closeEventModal() { document.getElementById('event-overlay').classList.add('hidden'); }

async function replayEv(id) {
  const r = await fetch('/api/events/' + id + '/replay?env=' + currentEnv, { method:'POST' });
  const data = await r.json();
  if (data.ok) { setTimeout(loadEvents, 1000); }
}

/* ── Helpers ───────────────────────────── */
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
                         .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function timeAgo(ms) {
  if (!ms) return '—';
  const diff = Date.now() - ms;
  if (diff < 60000)  return Math.floor(diff/1000) + 's ago';
  if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
  return Math.floor(diff/86400000) + 'd ago';
}
function fmtAmount(amount, currency) {
  const major = (amount / 100).toFixed(2);
  return currency ? currency + ' ' + major : major;
}
function fmtJson(str) {
  try { return JSON.stringify(JSON.parse(str), null, 2); }
  catch { return str; }
}
</script>
</body>
</html>`;
}
