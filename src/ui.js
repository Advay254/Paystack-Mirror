/**
 * ui.js — Paystack Mirror Dashboard
 * Mobile-first, enterprise-grade UI. SVG icons only, no emojis.
 */

export function dashboardHTML() {
return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Paystack Mirror</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#09090b;
  --surface:#111114;
  --card:#18181c;
  --card-hover:#1e1e24;
  --border:#27272d;
  --border-subtle:#1f1f24;
  --text:#f4f4f5;
  --text-2:#a1a1aa;
  --text-3:#52525b;
  --accent:#6366f1;
  --accent-hover:#818cf8;
  --accent-dim:rgba(99,102,241,.12);
  --green:#22c55e;
  --green-dim:rgba(34,197,94,.1);
  --red:#ef4444;
  --red-dim:rgba(239,68,68,.1);
  --yellow:#f59e0b;
  --yellow-dim:rgba(245,158,11,.1);
  --radius:8px;
  --radius-lg:12px;
  --radius-xl:16px;
  --shadow:0 1px 3px rgba(0,0,0,.4),0 1px 2px rgba(0,0,0,.3);
  --shadow-lg:0 10px 40px rgba(0,0,0,.5);
  --font:-apple-system,'DM Sans',sans-serif;
  --mono:'DM Mono',monospace;
}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;font-size:14px;line-height:1.5}
button{font-family:var(--font);cursor:pointer;border:none;background:none;outline:none}
input{font-family:var(--font)}
a{color:inherit;text-decoration:none}
svg{display:block;flex-shrink:0}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

/* ── Utilities ── */
.hidden{display:none!important}
.flex{display:flex}.flex-col{flex-direction:column}
.items-center{align-items:center}.items-start{align-items:flex-start}
.justify-between{justify-content:space-between}.justify-center{justify-content:center}
.gap-1{gap:4px}.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}.gap-6{gap:24px}
.w-full{width:100%}.min-w-0{min-width:0}.flex-1{flex:1}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.text-sm{font-size:13px}.text-xs{font-size:11px}.text-lg{font-size:17px}.text-xl{font-size:20px}
.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}
.text-2{color:var(--text-2)}.text-3{color:var(--text-3)}
.text-accent{color:var(--accent)}.text-green{color:var(--green)}
.text-red{color:var(--red)}.text-yellow{color:var(--yellow)}
.mono{font-family:var(--mono);font-size:12px}
.uppercase{text-transform:uppercase}.tracking-wide{letter-spacing:.06em}

/* ── Layout ── */
.page-container{max-width:900px;margin:0 auto;padding:16px}
@media(min-width:768px){.page-container{padding:32px 24px}}

/* ── Cards ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg)}
.card-header{padding:16px 20px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between}
.card-body{padding:20px}
@media(min-width:768px){.card-header{padding:18px 24px}.card-body{padding:24px}}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:var(--radius);font-size:13px;font-weight:500;transition:all .15s ease;white-space:nowrap;line-height:1}
.btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:var(--accent-hover)}
.btn-ghost{background:transparent;color:var(--text-2);border:1px solid var(--border)}.btn-ghost:hover{border-color:var(--accent);color:var(--text)}
.btn-danger{background:var(--red-dim);color:var(--red);border:1px solid rgba(239,68,68,.2)}.btn-danger:hover{background:rgba(239,68,68,.18)}
.btn-sm{padding:5px 10px;font-size:12px;gap:4px}
.btn-icon{padding:7px;border-radius:var(--radius)}.btn-icon:hover{background:var(--card-hover)}
.btn:disabled{opacity:.4;cursor:not-allowed;pointer-events:none}

/* ── Inputs ── */
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-size:12px;font-weight:500;color:var(--text-2);letter-spacing:.02em}
.input{width:100%;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:14px;font-family:var(--font);transition:border-color .15s}
.input:focus{outline:none;border-color:var(--accent)}
.input::placeholder{color:var(--text-3)}
.input-wrap{position:relative}
.input-wrap .input{padding-right:40px}
.input-wrap .toggle-pw{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-3);padding:4px;transition:color .15s}
.input-wrap .toggle-pw:hover{color:var(--text-2)}

/* ── Badges ── */
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;letter-spacing:.02em}
.badge-green{background:var(--green-dim);color:var(--green);border:1px solid rgba(34,197,94,.2)}
.badge-yellow{background:var(--yellow-dim);color:var(--yellow);border:1px solid rgba(245,158,11,.2)}
.badge-gray{background:rgba(82,82,91,.15);color:var(--text-3);border:1px solid var(--border)}
.badge-accent{background:var(--accent-dim);color:var(--accent);border:1px solid rgba(99,102,241,.2)}
.badge-red{background:var(--red-dim);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.dot-green{background:var(--green)}.dot-gray{background:var(--text-3)}
.dot-green.pulse{animation:pulse-glow 2s infinite}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{box-shadow:0 0 0 4px rgba(34,197,94,0)}}

/* ── Skeleton ── */
.skeleton{background:linear-gradient(90deg,var(--card) 25%,var(--card-hover) 50%,var(--card) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:4px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.sk-line{height:12px;margin-bottom:8px}.sk-line.short{width:40%}.sk-line.med{width:65%}.sk-line.full{width:100%}

/* ── Toast ── */
#toast-container{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);font-size:13px;box-shadow:var(--shadow-lg);pointer-events:all;animation:toast-in .2s ease;min-width:240px;max-width:320px}
.toast.success{border-color:rgba(34,197,94,.3)}.toast.error{border-color:rgba(239,68,68,.3)}
@keyframes toast-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes toast-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(8px)}}

/* ── Modal ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:100;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(2px)}
@media(min-width:640px){.overlay{align-items:center}}
.modal{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-xl) var(--radius-xl) 0 0;width:100%;max-width:480px;padding:24px;animation:modal-in .2s ease;max-height:90vh;overflow-y:auto}
@media(min-width:640px){.modal{border-radius:var(--radius-xl)}}
@keyframes modal-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.modal-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px;display:block}
@media(min-width:640px){.modal-handle{display:none}}
.modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.modal-title{font-size:16px;font-weight:600;color:var(--text)}
.modal-close{color:var(--text-3);padding:4px;border-radius:var(--radius);transition:color .15s}.modal-close:hover{color:var(--text)}

/* ── Login ── */
#login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--bg)}
.login-card{width:100%;max-width:380px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:32px;box-shadow:var(--shadow-lg)}
.login-logo{width:44px;height:44px;background:var(--accent-dim);border:1px solid rgba(99,102,241,.25);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;color:var(--accent);margin-bottom:20px}
.login-title{font-size:22px;font-weight:700;color:var(--text);letter-spacing:-.3px;margin-bottom:4px}
.login-subtitle{font-size:13px;color:var(--text-2);margin-bottom:28px}
.login-fields{display:flex;flex-direction:column;gap:16px;margin-bottom:20px}
.login-error{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;background:var(--red-dim);border:1px solid rgba(239,68,68,.2);border-radius:var(--radius);font-size:12px;color:var(--red)}
.attempt-bar{margin-top:12px;padding:8px 0 0}
.attempt-dots{display:flex;gap:4px;margin-top:6px}
.attempt-dot{width:8px;height:8px;border-radius:50%;background:var(--border);transition:background .2s}
.attempt-dot.used{background:var(--red)}
.lockout-timer{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--yellow-dim);border:1px solid rgba(245,158,11,.2);border-radius:var(--radius);font-size:12px;color:var(--yellow);margin-top:12px}
.login-footer{margin-top:24px;padding-top:20px;border-top:1px solid var(--border-subtle);display:flex;align-items:center;gap:8px;color:var(--text-3);font-size:11px}

/* ── App header ── */
#app-header{position:sticky;top:0;z-index:50;background:rgba(9,9,11,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border-subtle);padding:0 16px;height:56px;display:flex;align-items:center;justify-content:space-between}
@media(min-width:768px){#app-header{padding:0 24px}}
.header-logo{display:flex;align-items:center;gap:10px}
.header-logo-icon{width:30px;height:30px;background:var(--accent-dim);border:1px solid rgba(99,102,241,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--accent)}
.header-logo-text{font-size:15px;font-weight:600;letter-spacing:-.2px}
.header-logo-badge{font-size:10px;color:var(--text-3);border:1px solid var(--border);border-radius:4px;padding:1px 5px;font-family:var(--mono)}
.env-tabs{display:flex;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:3px;gap:2px}
.env-tab{padding:5px 14px;border-radius:6px;font-size:12px;font-weight:500;color:var(--text-2);transition:all .15s;display:flex;align-items:center;gap:5px;cursor:pointer}
.env-tab.active{background:var(--card);color:var(--text);box-shadow:0 1px 3px rgba(0,0,0,.3)}
.header-actions{display:flex;align-items:center;gap:8px}
.user-btn{display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:var(--radius);color:var(--text-2);font-size:12px;font-weight:500;border:1px solid var(--border);transition:all .15s}
.user-btn:hover{border-color:var(--border);background:var(--card-hover);color:var(--text)}

/* ── Webhook URL card ── */
.webhook-card{padding:16px 20px}
@media(min-width:768px){.webhook-card{padding:18px 24px}}
.webhook-label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);margin-bottom:12px}
.webhook-row{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--surface);border:1px solid var(--border-subtle);border-radius:var(--radius);margin-bottom:6px}
.webhook-row:last-child{margin-bottom:0}
.webhook-env-tag{font-size:10px;font-weight:600;letter-spacing:.05em;padding:2px 7px;border-radius:4px;flex-shrink:0}
.webhook-env-tag.live{background:var(--green-dim);color:var(--green)}
.webhook-env-tag.test{background:var(--yellow-dim);color:var(--yellow)}
.webhook-url{font-family:var(--mono);font-size:11px;color:var(--text-2);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.copy-btn{padding:4px 8px;border-radius:6px;border:1px solid var(--border);color:var(--text-3);font-size:11px;font-weight:500;transition:all .15s;display:flex;align-items:center;gap:4px;flex-shrink:0}
.copy-btn:hover{border-color:var(--accent);color:var(--accent)}
.copy-btn.copied{border-color:var(--green);color:var(--green)}

/* ── Endpoints ── */
.endpoint-row{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--border-subtle)}
.endpoint-row:last-child{border-bottom:none}
.endpoint-info{flex:1;min-width:0}
.endpoint-name{font-size:13px;font-weight:500;color:var(--text);display:flex;align-items:center;gap:8px;margin-bottom:3px}
.endpoint-url{font-family:var(--mono);font-size:11px;color:var(--text-3);truncate:true;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.endpoint-meta{font-size:11px;color:var(--text-3);margin-top:2px}
.endpoint-actions{display:flex;gap:6px;flex-shrink:0}

/* ── Events table ── */
.events-table{width:100%;border-collapse:collapse}
.events-table th{text-align:left;font-size:11px;font-weight:600;color:var(--text-3);letter-spacing:.06em;text-transform:uppercase;padding:0 12px 10px 12px;border-bottom:1px solid var(--border)}
.events-table th:first-child{padding-left:0}
.events-table th:last-child{padding-right:0}
.events-table td{padding:12px;border-bottom:1px solid var(--border-subtle);vertical-align:middle}
.events-table td:first-child{padding-left:0}
.events-table td:last-child{padding-right:0}
.events-table tr:last-child td{border-bottom:none}
.events-table tbody tr{cursor:pointer;transition:background .1s}
.events-table tbody tr:hover td{background:var(--card-hover)}
.events-table tbody tr:hover td:first-child{border-radius:var(--radius) 0 0 var(--radius)}
.events-table tbody tr:hover td:last-child{border-radius:0 var(--radius) var(--radius) 0}
@media(max-width:640px){
  .col-amount,.col-ref{display:none}
}

/* ── Delivery list ── */
.delivery-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle)}
.delivery-item:last-child{border-bottom:none}
.delivery-status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.delivery-info{flex:1;min-width:0}
.delivery-label{font-size:13px;font-weight:500;color:var(--text);display:flex;align-items:center;gap:8px}
.delivery-url{font-family:var(--mono);font-size:11px;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}
.delivery-error{font-size:11px;color:var(--red);margin-top:3px}

/* ── Empty state ── */
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center}
.empty-icon{width:40px;height:40px;color:var(--text-3);margin-bottom:12px;opacity:.5}
.empty-title{font-size:14px;font-weight:500;color:var(--text-2);margin-bottom:4px}
.empty-desc{font-size:12px;color:var(--text-3)}

/* ── Raw payload block ── */
.raw-block{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px;font-family:var(--mono);font-size:11px;color:var(--text-2);overflow-x:auto;white-space:pre-wrap;word-break:break-all;max-height:180px;overflow-y:auto;line-height:1.6}

/* ── Divider ── */
.divider{border:none;border-top:1px solid var(--border-subtle);margin:0}
</style>
</head>
<body>

<!-- ─── Toast container ─────────────────────────── -->
<div id="toast-container"></div>

<!-- ─── Login screen ────────────────────────────── -->
<div id="login-screen" class="hidden">
  <div class="login-card">
    <div class="login-logo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
    <h1 class="login-title">Paystack Mirror</h1>
    <p class="login-subtitle">Sign in to manage your webhook endpoints</p>

    <div class="login-fields">
      <div class="field">
        <label for="login-username">Username</label>
        <input class="input" type="text" id="login-username" autocomplete="username"
               placeholder="Enter username" onkeydown="if(event.key==='Enter')focusPw()">
      </div>
      <div class="field">
        <label for="login-password">Password</label>
        <div class="input-wrap">
          <input class="input" type="password" id="login-password" autocomplete="current-password"
                 placeholder="Enter password" onkeydown="if(event.key==='Enter')doLogin()">
          <button class="toggle-pw" onclick="togglePw()" title="Toggle visibility">
            <svg id="pw-eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div id="login-error" class="login-error hidden">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span id="login-error-text"></span>
    </div>

    <div id="attempt-bar" class="attempt-bar hidden">
      <div class="text-xs text-2" id="attempt-label"></div>
      <div class="attempt-dots" id="attempt-dots"></div>
    </div>

    <div id="lockout-box" class="lockout-timer hidden">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      <span>Account locked. Try again in <strong id="lockout-count"></strong></span>
    </div>

    <button class="btn btn-primary w-full" id="login-btn"
            style="margin-top:16px;justify-content:center;padding:11px"
            onclick="doLogin()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
      </svg>
      Sign in
    </button>

    <div class="login-footer">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      Secured with Cloudflare Workers KV
    </div>
  </div>
</div>

<!-- ─── App ─────────────────────────────────────── -->
<div id="app" class="hidden">

  <!-- Header -->
  <header id="app-header">
    <div class="header-logo">
      <div class="header-logo-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
      </div>
      <span class="header-logo-text">Paystack Mirror</span>
      <span class="header-logo-badge" id="env-badge">LIVE</span>
    </div>

    <div class="env-tabs">
      <button class="env-tab active" id="tab-live" onclick="switchEnv('live')">
        <svg width="7" height="7" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="var(--green)"/></svg>
        Live
      </button>
      <button class="env-tab" id="tab-test" onclick="switchEnv('test')">
        <svg width="7" height="7" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="var(--yellow)"/></svg>
        Test
      </button>
    </div>

    <div class="header-actions">
      <button class="user-btn" onclick="doLogout()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span class="hidden" id="header-username" style="display:none"></span>
        Logout
      </button>
    </div>
  </header>

  <!-- Content -->
  <div class="page-container" style="display:flex;flex-direction:column;gap:16px;margin-top:16px">

    <!-- Webhook URLs -->
    <div class="card">
      <div class="webhook-card">
        <div class="webhook-label">Register in Paystack Dashboard &rarr; API Keys &amp; Webhooks</div>
        <div class="webhook-row">
          <span class="webhook-env-tag live">LIVE</span>
          <span class="webhook-url" id="live-url-text"></span>
          <button class="copy-btn" id="copy-live" onclick="copyUrl('live')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </button>
        </div>
        <div class="webhook-row">
          <span class="webhook-env-tag test">TEST</span>
          <span class="webhook-url" id="test-url-text"></span>
          <button class="copy-btn" id="copy-test" onclick="copyUrl('test')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </button>
        </div>
      </div>
    </div>

    <!-- Endpoints -->
    <div class="card">
      <div class="card-header">
        <div>
          <div style="font-size:15px;font-weight:600">Connected Endpoints</div>
          <div class="text-xs text-3" style="margin-top:2px">All active endpoints receive every event simultaneously</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openAddModal()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Endpoint
        </button>
      </div>
      <div class="card-body" style="padding-top:8px;padding-bottom:8px">
        <div id="endpoints-list"></div>
      </div>
    </div>

    <!-- Events -->
    <div class="card" style="margin-bottom:24px">
      <div class="card-header">
        <div>
          <div style="font-size:15px;font-weight:600">Event Log</div>
          <div class="text-xs text-3" style="margin-top:2px">Last 100 events per environment</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="loadEvents()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>
      <div class="card-body" style="padding-top:12px">
        <div id="events-list"></div>
      </div>
    </div>

  </div>
</div>

<!-- ─── Add Endpoint Modal ───────────────────────── -->
<div id="add-modal" class="overlay hidden" onclick="if(event.target===this)closeAddModal()">
  <div class="modal">
    <span class="modal-handle"></span>
    <div class="modal-header">
      <span class="modal-title">Add Endpoint</span>
      <button class="modal-close btn-icon" onclick="closeAddModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="field">
        <label for="ep-label">Label</label>
        <input class="input" type="text" id="ep-label" placeholder="e.g. NexusAPI Bridge">
      </div>
      <div class="field">
        <label for="ep-url">Webhook URL</label>
        <input class="input" type="url" id="ep-url" placeholder="https://your-service.workers.dev/webhook"
               onkeydown="if(event.key==='Enter')doAddEndpoint()">
      </div>
      <div style="padding:10px 12px;background:var(--surface);border-radius:var(--radius);font-size:12px;color:var(--text-3);line-height:1.6">
        This URL will receive all <strong id="modal-env-label" style="color:var(--text-2)">live</strong> Paystack events.
        The original <code style="font-family:var(--mono);font-size:11px;color:var(--accent)">x-paystack-signature</code> header is forwarded — verify it independently.
      </div>
      <div id="add-error" class="login-error hidden">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span id="add-error-text"></span>
      </div>
      <div style="display:flex;gap:8px;padding-top:4px">
        <button class="btn btn-primary flex-1" style="justify-content:center" onclick="doAddEndpoint()">Add Endpoint</button>
        <button class="btn btn-ghost" onclick="closeAddModal()">Cancel</button>
      </div>
    </div>
  </div>
</div>

<!-- ─── Event Detail Modal ───────────────────────── -->
<div id="event-modal" class="overlay hidden" onclick="if(event.target===this)closeEventModal()">
  <div class="modal" style="max-width:520px">
    <span class="modal-handle"></span>
    <div class="modal-header">
      <span class="modal-title">Event Detail</span>
      <button class="modal-close btn-icon" onclick="closeEventModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div id="event-detail"></div>
  </div>
</div>

<script>
/* ──────────────────────────────────────────────────
   STATE
────────────────────────────────────────────────── */
let currentEnv = 'live';
let lockoutInterval = null;
const BASE = window.location.origin;

/* ──────────────────────────────────────────────────
   BOOT
────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('live-url-text').textContent = BASE + '/hook/live';
  document.getElementById('test-url-text').textContent = BASE + '/hook/test';
  const res = await fetch('/api/me');
  res.ok ? showApp() : showLogin();
});

function showLogin() {
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  setTimeout(() => document.getElementById('login-username').focus(), 100);
}
function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  loadAll();
}
function loadAll() { loadEndpoints(); loadEvents(); }

/* ──────────────────────────────────────────────────
   AUTH
────────────────────────────────────────────────── */
function togglePw() {
  const inp = document.getElementById('login-password');
  const icon = document.getElementById('pw-eye-icon');
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  icon.innerHTML = show
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}
function focusPw() { document.getElementById('login-password').focus(); }

function setLockoutTimer(until) {
  clearInterval(lockoutInterval);
  const box = document.getElementById('lockout-box');
  const count = document.getElementById('lockout-count');
  const btn = document.getElementById('login-btn');
  box.classList.remove('hidden');
  btn.disabled = true;

  function tick() {
    const rem = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    const m = Math.floor(rem / 60), s = rem % 60;
    count.textContent = m > 0 ? m + 'm ' + s + 's' : s + 's';
    if (rem <= 0) {
      clearInterval(lockoutInterval);
      box.classList.add('hidden');
      btn.disabled = false;
      document.getElementById('attempt-bar').classList.add('hidden');
    }
  }
  tick();
  lockoutInterval = setInterval(tick, 1000);
}

function showAttempts(remaining) {
  const bar = document.getElementById('attempt-bar');
  const label = document.getElementById('attempt-label');
  const dots = document.getElementById('attempt-dots');
  const MAX = 5;
  const used = MAX - remaining;
  bar.classList.remove('hidden');
  label.textContent = remaining + ' attempt' + (remaining !== 1 ? 's' : '') + ' remaining';
  dots.innerHTML = Array.from({length: MAX}, (_, i) =>
    '<div class="attempt-dot' + (i < used ? ' used' : '') + '"></div>'
  ).join('');
}

async function doLogin() {
  const btn = document.getElementById('login-btn');
  const errBox = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text');
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    errText.textContent = 'Please enter your username and password.';
    errBox.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Signing in...';
  errBox.classList.add('hidden');

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });
  const data = await res.json();

  btn.disabled = false;
  btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="21" y1="12" x2="3" y2="12"/></svg> Sign in';

  if (data.ok) {
    showApp();
    return;
  }

  errText.textContent = data.error || 'Sign in failed.';
  errBox.classList.remove('hidden');

  if (data.lockedUntil) { setLockoutTimer(data.lockedUntil); return; }
  if (typeof data.attemptsRemaining === 'number') showAttempts(data.attemptsRemaining);
}

async function doLogout() {
  await fetch('/api/logout', {method: 'POST'});
  showLogin();
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

/* ──────────────────────────────────────────────────
   ENV TABS
────────────────────────────────────────────────── */
function switchEnv(env) {
  currentEnv = env;
  document.getElementById('tab-live').className = 'env-tab' + (env === 'live' ? ' active' : '');
  document.getElementById('tab-test').className = 'env-tab' + (env === 'test' ? ' active' : '');
  document.getElementById('env-badge').textContent = env.toUpperCase();
  document.getElementById('env-badge').style.color = env === 'live' ? 'var(--green)' : 'var(--yellow)';
  document.getElementById('env-badge').style.borderColor = env === 'live' ? 'rgba(34,197,94,.3)' : 'rgba(245,158,11,.3)';
  document.getElementById('modal-env-label').textContent = env;
  loadAll();
}

/* ──────────────────────────────────────────────────
   COPY
────────────────────────────────────────────────── */
function copyUrl(env) {
  const url = BASE + '/hook/' + env;
  navigator.clipboard.writeText(url);
  const btn = document.getElementById('copy-' + env);
  const orig = btn.innerHTML;
  btn.classList.add('copied');
  btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied';
  setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
}

function copyText(text, label) {
  navigator.clipboard.writeText(text);
  toast(label + ' copied', 'success');
}

/* ──────────────────────────────────────────────────
   TOAST
────────────────────────────────────────────────── */
function toast(msg, type='success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  const iconOk = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  const iconErr = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  t.className = 'toast ' + type;
  t.innerHTML = (type === 'success' ? iconOk : iconErr) + '<span>' + esc(msg) + '</span>';
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'toast-out .2s ease forwards'; setTimeout(() => t.remove(), 200); }, 3000);
}

/* ──────────────────────────────────────────────────
   ENDPOINTS
────────────────────────────────────────────────── */
async function loadEndpoints() {
  const el = document.getElementById('endpoints-list');
  el.innerHTML = renderSkeleton();
  const res = await fetch('/api/endpoints?env=' + currentEnv);
  const {data} = await res.json();
  renderEndpoints(data || []);
}

function renderSkeleton() {
  return '<div style="padding:8px 0"><div class="skeleton sk-line med" style="margin-bottom:16px"></div><div class="skeleton sk-line full"></div></div>';
}

function renderEndpoints(list) {
  const el = document.getElementById('endpoints-list');
  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><svg class="empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div class="empty-title">No endpoints connected</div><div class="empty-desc">Add an endpoint to start receiving Paystack events</div></div>';
    return;
  }
  el.innerHTML = list.map(ep => {
    const isActive = ep.enabled;
    return '<div class="endpoint-row">' +
      '<div class="dot ' + (isActive ? 'dot-green pulse' : 'dot-gray') + '"></div>' +
      '<div class="endpoint-info">' +
        '<div class="endpoint-name">' +
          esc(ep.label) +
          '<span class="badge ' + (isActive ? 'badge-green' : 'badge-gray') + '">' + (isActive ? 'Active' : 'Disabled') + '</span>' +
        '</div>' +
        '<div class="endpoint-url">' + esc(ep.url) + '</div>' +
        '<div class="endpoint-meta">' + timeAgo(ep.createdAt) + '</div>' +
      '</div>' +
      '<div class="endpoint-actions">' +
        '<button class="btn btn-ghost btn-sm" onclick="toggleEp(\'' + ep.id + '\',' + !ep.enabled + ')">' + (ep.enabled ? 'Disable' : 'Enable') + '</button>' +
        '<button class="btn btn-icon" onclick="deleteEp(\'' + ep.id + '\')" title="Remove endpoint" style="color:var(--text-3)">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openAddModal() {
  document.getElementById('add-modal').classList.remove('hidden');
  document.getElementById('add-error').classList.add('hidden');
  setTimeout(() => document.getElementById('ep-label').focus(), 100);
}
function closeAddModal() {
  document.getElementById('add-modal').classList.add('hidden');
  document.getElementById('ep-label').value = '';
  document.getElementById('ep-url').value = '';
}

async function doAddEndpoint() {
  const url = document.getElementById('ep-url').value.trim();
  const label = document.getElementById('ep-label').value.trim();
  const errBox = document.getElementById('add-error');
  const errText = document.getElementById('add-error-text');
  errBox.classList.add('hidden');

  const res = await fetch('/api/endpoints?env=' + currentEnv, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url, label})
  });
  const data = await res.json();
  if (data.ok) {
    closeAddModal();
    loadEndpoints();
    toast('Endpoint added', 'success');
  } else {
    errText.textContent = data.error || 'Failed to add endpoint';
    errBox.classList.remove('hidden');
  }
}

async function toggleEp(id, enabled) {
  await fetch('/api/endpoints/' + id + '?env=' + currentEnv, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({enabled})
  });
  loadEndpoints();
  toast(enabled ? 'Endpoint enabled' : 'Endpoint disabled', 'success');
}

async function deleteEp(id) {
  if (!confirm('Remove this endpoint? It will stop receiving events immediately.')) return;
  await fetch('/api/endpoints/' + id + '?env=' + currentEnv, {method: 'DELETE'});
  loadEndpoints();
  toast('Endpoint removed', 'success');
}

/* ──────────────────────────────────────────────────
   EVENTS
────────────────────────────────────────────────── */
async function loadEvents() {
  const el = document.getElementById('events-list');
  el.innerHTML = renderSkeleton() + renderSkeleton();
  const res = await fetch('/api/events?env=' + currentEnv);
  const {data} = await res.json();
  renderEvents(data || []);
}

function renderEvents(list) {
  const el = document.getElementById('events-list');
  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><svg class="empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><div class="empty-title">No events received yet</div><div class="empty-desc">Events appear here after Paystack delivers webhooks</div></div>';
    return;
  }
  el.innerHTML = '<table class="events-table"><thead><tr>' +
    '<th>Time</th><th>Event</th><th class="col-ref">Reference</th>' +
    '<th class="col-amount">Amount</th><th>Delivered</th><th></th>' +
    '</tr></thead><tbody>' +
    list.map(ev => {
      const ok = ev.succeeded || 0, tot = ev.total || 0;
      const badge = tot === 0 ? 'badge-gray' : ok === tot ? 'badge-green' : ok === 0 ? 'badge-red' : 'badge-yellow';
      const label = tot === 0 ? 'No targets' : ok + '/' + tot;
      return '<tr onclick="openEventModal(\'' + ev.id + '\')">' +
        '<td><span class="text-xs text-2">' + timeAgo(ev.receivedAt) + '</span></td>' +
        '<td><span class="badge badge-accent mono" style="font-size:10px">' + esc(ev.eventType) + '</span></td>' +
        '<td class="col-ref"><span class="mono text-xs text-2">' + esc(ev.reference || '—') + '</span></td>' +
        '<td class="col-amount"><span class="text-xs">' + (ev.amount ? fmtAmount(ev.amount, ev.currency) : '—') + '</span></td>' +
        '<td><span class="badge ' + badge + '">' + label + '</span></td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();replayEv(\'' + ev.id + '\')" title="Replay event">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>' +
          'Replay</button></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';
}

async function openEventModal(id) {
  document.getElementById('event-modal').classList.remove('hidden');
  document.getElementById('event-detail').innerHTML = '<div style="padding:20px 0">' + renderSkeleton() + renderSkeleton() + '</div>';
  const res = await fetch('/api/events/' + id + '?env=' + currentEnv);
  const {data, error} = await res.json();
  if (!data) { document.getElementById('event-detail').innerHTML = '<p class="text-sm text-red" style="padding:8px 0">' + esc(error||'Not found') + '</p>'; return; }
  const ok = data.deliveries.filter(d => d.success).length;
  document.getElementById('event-detail').innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">' +
      infoCell('Event Type', '<span class="badge badge-accent mono" style="font-size:10px">' + esc(data.eventType) + '</span>') +
      infoCell('Environment', '<span class="badge ' + (data.env === 'live' ? 'badge-green' : 'badge-yellow') + '">' + data.env + '</span>') +
      infoCell('Reference', '<span class="mono text-xs">' + esc(data.reference || '—') + '</span>') +
      infoCell('Amount', '<span class="font-medium">' + (data.amount ? fmtAmount(data.amount, data.currency) : '—') + '</span>') +
      '<div style="grid-column:span 2">' + infoCell('Received', '<span class="text-xs text-2">' + new Date(data.receivedAt).toLocaleString() + '</span>') + '</div>' +
    '</div>' +
    '<hr class="divider" style="margin-bottom:16px">' +
    '<div class="text-xs font-semibold text-3 uppercase tracking-wide" style="margin-bottom:10px;letter-spacing:.08em">Delivery Results — ' + ok + '/' + data.deliveries.length + ' succeeded</div>' +
    (data.deliveries.length === 0
      ? '<p class="text-sm text-2" style="padding:8px 0">No active endpoints at time of delivery.</p>'
      : data.deliveries.map(d => '<div class="delivery-item">' +
          '<div class="delivery-status-dot" style="background:' + (d.success ? 'var(--green)' : 'var(--red)') + '"></div>' +
          '<div class="delivery-info">' +
            '<div class="delivery-label">' + esc(d.label) +
              (d.statusCode ? '<span class="mono text-xs text-3">HTTP ' + d.statusCode + '</span>' : '') +
              '<span class="text-xs text-3">' + d.latencyMs + 'ms</span>' +
            '</div>' +
            '<div class="delivery-url">' + esc(d.url) + '</div>' +
            (d.error ? '<div class="delivery-error">' + esc(d.error) + '</div>' : '') +
          '</div>' +
        '</div>').join('')
    ) +
    '<hr class="divider" style="margin:16px 0">' +
    '<div class="flex items-center justify-between" style="margin-bottom:10px">' +
      '<div class="text-xs font-semibold text-3 uppercase tracking-wide" style="letter-spacing:.08em">Raw Payload</div>' +
      '<button class="btn btn-ghost btn-sm" onclick="copyText(' + "'" + esc(data.rawPayload) + "'" + ',\'Payload\')">Copy</button>' +
    '</div>' +
    '<div class="raw-block">' + esc(fmtJson(data.rawPayload)) + '</div>' +
    '<button class="btn btn-primary w-full" style="margin-top:16px;justify-content:center" onclick="closeEventModal();replayEv(\'' + data.id + '\')">' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>' +
      'Replay to all active endpoints' +
    '</button>';
}

function infoCell(label, val) {
  return '<div><div class="text-xs text-3" style="margin-bottom:4px">' + label + '</div><div>' + val + '</div></div>';
}

function closeEventModal() { document.getElementById('event-modal').classList.add('hidden'); }

async function replayEv(id) {
  const res = await fetch('/api/events/' + id + '/replay?env=' + currentEnv, {method: 'POST'});
  const data = await res.json();
  toast(data.ok ? 'Replay dispatched' : (data.error || 'Replay failed'), data.ok ? 'success' : 'error');
  if (data.ok) setTimeout(loadEvents, 1200);
}

/* ──────────────────────────────────────────────────
   UTILS
────────────────────────────────────────────────── */
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function timeAgo(ms) {
  if (!ms) return '—';
  const d = Date.now() - ms;
  if (d < 60000) return Math.floor(d/1000) + 's ago';
  if (d < 3600000) return Math.floor(d/60000) + 'm ago';
  if (d < 86400000) return Math.floor(d/3600000) + 'h ago';
  return Math.floor(d/86400000) + 'd ago';
}
function fmtAmount(a, c) { return (c || '') + ' ' + (a/100).toFixed(2); }
function fmtJson(s) { try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; } }
</script>
</body>
</html>`;
}
