/**
 * Instant Proof BFF for molar.it
 *
 * Proxies `/api/instant-proof` (+ subpaths) to the control plane while signing
 * a browser/network identity cookie — same contract as the V3 preview host.
 *
 * Env:
 *   MOLAR_CONTROL_PLANE_URL / CONTROL_PLANE_URL  (default https://api.molar.it)
 *   INSTANT_PROOF_PROXY_SECRET                   (≥32 chars; required in production)
 *
 * Technique adapted from v3/src/lib/instant-proof-proxy.ts (Molar).
 */
const crypto = require("crypto");

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RESOURCES = new Set(["live", "stream", "frame", "evidence", "claim", "share"]);
const SHARED_RESOURCES = new Set(["frame", "evidence"]);
const COOKIE = "molar_instant_proof_client";

const ALLOWED_ORIGINS = new Set([
  "https://molar.it",
  "https://www.molar.it",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:3000",
]);

function requireSecret(secret) {
  if (!secret || secret.length < 32) {
    throw new Error("Instant Proof proxy secret must be at least 32 characters");
  }
  return secret;
}

function hmac(secret, value) {
  return crypto.createHmac("sha256", requireSecret(secret)).update(value).digest("hex");
}

function equalHex(left, right) {
  if (!/^[0-9a-f]{64}$/i.test(left) || !/^[0-9a-f]{64}$/i.test(right)) return false;
  return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

function cookieValue(cookieHeader) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE) return value.join("=");
  }
  return null;
}

function clientIp(req) {
  const forwarded =
    req.headers["x-vercel-forwarded-for"] ||
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    "";
  return String(forwarded).split(",")[0].trim() || "unknown";
}

function proxyClientIdentity(req, secret) {
  const current = cookieValue(req.headers.cookie);
  let id;
  if (current) {
    const [maybeId, signature] = current.split(".");
    if (maybeId && signature && equalHex(signature, hmac(secret, `cookie:${maybeId}`))) {
      id = maybeId;
    }
  }
  if (!id) id = crypto.randomUUID();
  const cookie = `${id}.${hmac(secret, `cookie:${id}`)}`;
  const browserKey = hmac(secret, `browser:${id}`);
  const networkKey = hmac(secret, `network:${clientIp(req)}`);
  const timestamp = Math.floor(Date.now() / 1000);
  const unsigned = `v1.${timestamp}.${browserKey}.${networkKey}`;
  return {
    assertion: `${unsigned}.${hmac(secret, unsigned)}`,
    cookieValue: cookie,
  };
}

function controlPlaneBase() {
  const base =
    process.env.MOLAR_CONTROL_PLANE_URL ||
    process.env.CONTROL_PLANE_URL ||
    "https://api.molar.it";
  const parsed = new URL(base);
  if (process.env.VERCEL_ENV === "production" && parsed.protocol !== "https:") {
    throw new Error("Molar control plane must use HTTPS in production");
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

function pathFromReq(req) {
  const url = new URL(req.url, "https://molar.it");
  // Prefer rewritten `__path` (vercel.json) so one function covers subpaths.
  const rewritten = url.searchParams.get("__path");
  if (rewritten != null && rewritten !== "") {
    return rewritten.split("/").filter(Boolean);
  }
  const raw = url.pathname.replace(/^\/api\/instant-proof\/?/, "");
  return raw ? raw.split("/").filter(Boolean) : [];
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept",
  );
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 4096) {
        reject(Object.assign(new Error("request_too_large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const secret = process.env.INSTANT_PROOF_PROXY_SECRET || "";
    const identity = proxyClientIdentity(req, secret);
    const segments = pathFromReq(req);
    const validated = safePath(segments);
    if (validated === null) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "proof_not_found" }));
      return;
    }

    const base = controlPlaneBase();
    const source = new URL(req.url, "https://molar.it");
    const target = new URL(
      `/api/v1/instant-proof${validated ? `/${validated}` : ""}`,
      `${base}/`,
    );
    if (segments[1] === "frame") {
      const step = source.searchParams.get("step") || "";
      if (!/^\d{1,4}$/.test(step) || Number(step) > 1000) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "invalid_proof_frame" }));
        return;
      }
      target.searchParams.set("step", step);
    }

    const headers = {
      Accept: req.headers.accept || "application/json",
      "X-Forwarded-For": clientIp(req),
      "X-Molar-Instant-Proof-Client": identity.assertion,
    };
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    if (segments[1] === "claim" && req.headers.cookie) {
      headers.Cookie = req.headers.cookie;
    }

    let body;
    if (req.method === "POST") {
      headers["Content-Type"] = "application/json";
      body = await readBody(req);
    }

    const upstream = await fetch(target.toString(), {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const secure = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      `${COOKIE}=${identity.cookieValue}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`,
    );
    res.setHeader("Cache-Control", "no-store, private");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const contentType = upstream.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    const retryAfter = upstream.headers.get("retry-after");
    if (retryAfter) res.setHeader("Retry-After", retryAfter);
    if (contentType && contentType.startsWith("text/event-stream")) {
      res.setHeader("X-Accel-Buffering", "no");
      res.setHeader("Connection", "keep-alive");
    }

    res.statusCode = upstream.status;
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.end(buf);
  } catch (err) {
    const status = err && err.status === 413 ? 413 : 503;
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store, private");
    res.end(
      JSON.stringify({
        error: status === 413 ? "request_too_large" : "instant_proof_unavailable",
        message:
          status === 413
            ? "Request body is too large."
            : "Instant Proof is temporarily unavailable.",
        hint:
          status === 413
            ? "Send a smaller JSON body."
            : "Configure INSTANT_PROOF_PROXY_SECRET and MOLAR_CONTROL_PLANE_URL on the Vercel project, then retry.",
      }),
    );
  }
};
