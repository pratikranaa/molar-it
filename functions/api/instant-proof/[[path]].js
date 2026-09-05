/**
 * Instant Proof BFF for molar.it — Cloudflare Pages Function.
 * Ported from Vercel api/instant-proof.js (same HMAC cookie contract).
 *
 * Env:
 *   MOLAR_CONTROL_PLANE_URL / CONTROL_PLANE_URL  (default https://api.molar.it/plumbing-api)
 *   INSTANT_PROOF_PROXY_SECRET                   (≥32 chars; required in production)
 */

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RESOURCES = new Set(["live", "stream", "frame", "evidence", "claim", "share"]);
const SHARED_RESOURCES = new Set(["frame", "evidence"]);
const COOKIE = "molar_instant_proof_client";

const ALLOWED_ORIGINS = new Set([
  "https://molar.it",
  "https://www.molar.it",
  "https://molar-it.pages.dev",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:3000",
]);

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function requireSecret(secret) {
  if (!secret || secret.length < 32) {
    throw new Error("Instant Proof proxy secret must be at least 32 characters");
  }
  return secret;
}

async function hmacHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(requireSecret(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToHex(sig);
}

function equalHex(left, right) {
  if (!/^[0-9a-f]{64}$/i.test(left) || !/^[0-9a-f]{64}$/i.test(right)) return false;
  const a = hexToBytes(left);
  const b = hexToBytes(right);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function cookieValue(cookieHeader) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE) return value.join("=");
  }
  return null;
}

function clientIp(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function proxyClientIdentity(request, secret) {
  const current = cookieValue(request.headers.get("Cookie"));
  let id;
  if (current) {
    const [maybeId, signature] = current.split(".");
    if (maybeId && signature && equalHex(signature, await hmacHex(secret, `cookie:${maybeId}`))) {
      id = maybeId;
    }
  }
  if (!id) id = crypto.randomUUID();
  const cookie = `${id}.${await hmacHex(secret, `cookie:${id}`)}`;
  const browserKey = await hmacHex(secret, `browser:${id}`);
  const networkKey = await hmacHex(secret, `network:${clientIp(request)}`);
  const timestamp = Math.floor(Date.now() / 1000);
  const unsigned = `v1.${timestamp}.${browserKey}.${networkKey}`;
  return {
    assertion: `${unsigned}.${await hmacHex(secret, unsigned)}`,
    cookieValue: cookie,
  };
}

function controlPlaneBase(env) {
  const base =
    env.MOLAR_CONTROL_PLANE_URL || env.CONTROL_PLANE_URL || "https://api.molar.it/plumbing-api";
  const parsed = new URL(base);
  if (parsed.protocol !== "https:") {
    throw new Error("Molar control plane must use HTTPS in production");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error("Molar control plane URL must not include credentials, query, or hash");
  }
  return parsed.toString().replace(/\/$/, "");
}

function safePath(segments) {
  if (segments.length === 0) return "";
  if (segments[0] === "shared") {
    if (segments.length > 2 || (segments.length === 2 && !SHARED_RESOURCES.has(segments[1]))) {
      return null;
    }
    return segments.join("/");
  }
  if (segments.length > 2 || !UUID.test(segments[0] || "")) return null;
  if (segments.length === 2 && !RESOURCES.has(segments[1])) return null;
  return segments.map(encodeURIComponent).join("/");
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  return headers;
}

async function handle(context) {
  const { request, env, params } = context;
  const cors = corsHeaders(request);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  try {
    const secret = env.INSTANT_PROOF_PROXY_SECRET || "";
    const identity = await proxyClientIdentity(request, secret);
    const rawPath = params.path;
    const segments = Array.isArray(rawPath)
      ? rawPath.filter(Boolean)
      : rawPath
        ? String(rawPath).split("/").filter(Boolean)
        : [];
    const validated = safePath(segments);
    if (validated === null) {
      return new Response(JSON.stringify({ error: "proof_not_found" }), {
        status: 404,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const base = controlPlaneBase(env);
    const source = new URL(request.url);
    const target = new URL(`${base}/api/v1/instant-proof${validated ? `/${validated}` : ""}`);
    if (segments[1] === "frame") {
      const step = source.searchParams.get("step") || "";
      if (!/^\d{1,4}$/.test(step) || Number(step) > 1000) {
        return new Response(JSON.stringify({ error: "invalid_proof_frame" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      target.searchParams.set("step", step);
    }

    const headers = {
      Accept: request.headers.get("Accept") || "application/json",
      "X-Forwarded-For": clientIp(request),
      "X-Molar-Instant-Proof-Client": identity.assertion,
    };
    const authorization = request.headers.get("Authorization");
    if (authorization) headers.Authorization = authorization;
    if (segments[1] === "claim") {
      const cookie = request.headers.get("Cookie");
      if (cookie) headers.Cookie = cookie;
    }

    let body;
    if (request.method === "POST") {
      headers["Content-Type"] = "application/json";
      body = await request.text();
      if (body.length > 4096) {
        return new Response(
          JSON.stringify({
            error: "request_too_large",
            message: "Request body is too large.",
            hint: "Send a smaller JSON body.",
          }),
          { status: 413, headers: { ...cors, "Content-Type": "application/json" } },
        );
      }
    }

    const upstream = await fetch(target.toString(), {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    const out = new Headers(cors);
    out.set(
      "Set-Cookie",
      `${COOKIE}=${identity.cookieValue}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax; Secure`,
    );
    out.set("Cache-Control", "no-store, private");
    out.set("Referrer-Policy", "no-referrer");
    out.set("X-Content-Type-Options", "nosniff");
    const contentType = upstream.headers.get("content-type");
    if (contentType) out.set("Content-Type", contentType);
    const retryAfter = upstream.headers.get("retry-after");
    if (retryAfter) out.set("Retry-After", retryAfter);
    if (contentType && contentType.startsWith("text/event-stream")) {
      out.set("X-Accel-Buffering", "no");
    }

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: out,
    });
  } catch (err) {
    const status = err && err.status === 413 ? 413 : 503;
    return new Response(
      JSON.stringify({
        error: status === 413 ? "request_too_large" : "instant_proof_unavailable",
        message:
          status === 413
            ? "Request body is too large."
            : "Instant Proof is temporarily unavailable.",
        hint:
          status === 413
            ? "Send a smaller JSON body."
            : "Try again in a moment.",
      }),
      {
        status,
        headers: {
          ...corsHeaders(request),
          "Content-Type": "application/json",
          "Cache-Control": "no-store, private",
        },
      },
    );
  }
}

export async function onRequest(context) {
  return handle(context);
}
