/**
 * POST /api/waitlist
 * Body: { email, company?, role?, source?, website? }  — website is honeypot
 *
 * Configure one of:
 *   WAITLIST_WEBHOOK_URL   → Google Apps Script → Sheet (free; see scripts/google-sheets-waitlist.gs)
 *   LOOPS_API_KEY          → Loops.so (optional, paid tier eventually)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_ORIGINS = new Set([
  'https://molar.it',
  'https://www.molar.it',
  'https://cartographer.molar.it',
  'https://clones.molar.it',
  'https://guard.molar.it',
  'https://trace.molar.it',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
]);

function allowedOrigin(req) {
  const origin = req.headers.origin;
  return origin && ALLOWED_ORIGINS.has(origin) ? origin : null;
}

function setCors(req, res) {
  const origin = allowedOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function json(req, res, status, body) {
  setCors(req, res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function forwardLoops({ email, company, role, source }) {
  const key = process.env.LOOPS_API_KEY;
  if (!key) return { ok: false, reason: 'no_loops' };

  const payload = {
    email,
    userGroup: process.env.LOOPS_USER_GROUP || 'waitlist',
    source: source || 'molar.it',
    subscribed: true,
  };
  if (company) payload.company = company;
  if (role) payload.role = role;

  const r = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (r.ok || r.status === 409) return { ok: true, provider: 'loops' };
  const text = await r.text();
  return { ok: false, reason: 'loops_error', detail: text.slice(0, 200) };
}

async function forwardWebhook(body) {
  const url = process.env.WAITLIST_WEBHOOK_URL;
  if (!url) return { ok: false, reason: 'no_webhook' };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const text = await r.text();
    return { ok: false, reason: 'webhook_error', detail: text.slice(0, 200) };
  }
  return { ok: true, provider: 'webhook' };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(req, res);
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    return json(req, res, 405, { error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return json(req, res, 400, { error: 'Invalid JSON' });
    }
  }
  if (!body || typeof body !== 'object') {
    return json(req, res, 400, { error: 'Invalid body' });
  }

  if (body.website) {
    return json(req, res, 200, { ok: true });
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return json(req, res, 400, { error: 'Enter a valid work email.' });
  }

  const record = {
    email,
    company: String(body.company || '').trim().slice(0, 120) || undefined,
    role: String(body.role || '').trim().slice(0, 60) || undefined,
    source: String(body.source || 'molar.it').trim().slice(0, 80),
    createdAt: new Date().toISOString(),
  };

  let result = await forwardWebhook(record);
  if (!result.ok) result = await forwardLoops(record);

  if (!result.ok) {
    const configured = process.env.WAITLIST_WEBHOOK_URL || process.env.LOOPS_API_KEY;
    if (!configured) {
      return json(req, res, 503, {
        error: 'Waitlist storage is not configured yet. Email pratik@molar.it and we will add you manually.',
      });
    }
    return json(req, res, 502, { error: 'Could not save signup. Try again or email pratik@molar.it.' });
  }

  return json(req, res, 200, { ok: true });
};
