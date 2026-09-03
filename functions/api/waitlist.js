/**
 * POST /api/waitlist — Cloudflare Pages Function (ported from Vercel api/waitlist.js).
 *
 * Env (Pages → Settings → Environment variables, or `wrangler pages secret put`):
 *   WAITLIST_WEBHOOK_URL  Google Apps Script (or any HTTPS endpoint)
 *   LOOPS_API_KEY         optional Loops.so
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_ORIGINS = new Set([
  "https://molar.it",
  "https://www.molar.it",
  "https://molar-it.pages.dev",
  "https://cartographer.molar.it",
  "https://clones.molar.it",
  "https://guard.molar.it",
  "https://trace.molar.it",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:3000",
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  return headers;
}

function json(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

async function forwardLoops(env, { email, company, role, source }) {
  const key = env.LOOPS_API_KEY;
  if (!key) return { ok: false, reason: "no_loops" };

  const payload = {
    email,
    userGroup: env.LOOPS_USER_GROUP || "waitlist",
    source: source || "molar.it",
    subscribed: true,
  };
  if (company) payload.company = company;
  if (role) payload.role = role;

  const r = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (r.ok || r.status === 409) return { ok: true, provider: "loops" };
  const text = await r.text();
  return { ok: false, reason: "loops_error", detail: text.slice(0, 200) };
}

async function forwardWebhook(env, body) {
  const url = env.WAITLIST_WEBHOOK_URL;
  if (!url) return { ok: false, reason: "no_webhook" };

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const text = await r.text();
    return { ok: false, reason: "webhook_error", detail: text.slice(0, 200) };
  }
  return { ok: true, provider: "webhook" };
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }
  if (request.method !== "POST") {
    return json(request, 405, { error: "Method not allowed" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(request, 400, { error: "Invalid JSON" });
  }
  if (!body || typeof body !== "object") {
    return json(request, 400, { error: "Invalid body" });
  }

  if (body.website) {
    return json(request, 200, { ok: true });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return json(request, 400, { error: "Enter a valid work email." });
  }

  const record = {
    email,
    company: String(body.company || "").trim().slice(0, 120) || undefined,
    role: String(body.role || "").trim().slice(0, 60) || undefined,
    source: String(body.source || "molar.it").trim().slice(0, 80),
    createdAt: new Date().toISOString(),
  };

  let result = await forwardWebhook(env, record);
  if (!result.ok) result = await forwardLoops(env, record);

  if (!result.ok) {
    const configured = env.WAITLIST_WEBHOOK_URL || env.LOOPS_API_KEY;
    if (!configured) {
      return json(request, 503, {
        error:
          "Waitlist storage is not configured yet. Email pratik@molar.it and we will add you manually.",
      });
    }
    return json(request, 502, {
      error: "Could not save signup. Try again or email pratik@molar.it.",
    });
  }

  return json(request, 200, { ok: true });
}
