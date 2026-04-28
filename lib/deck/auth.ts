// lib/deck/auth.ts
// Uses Web Crypto so the same code runs in middleware (Edge) and route handlers (Node).

const enc = new TextEncoder();

async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  // Note: relies on Vercel's Edge runtime Buffer polyfill. If switching runtimes, swap to
  // a Web-standard base64url helper.
  return Buffer.from(sig).toString("base64url");
}

/** Returns the cookie value. Format: "<payload>.<sig>" */
export async function signAuthToken(payload: string, secret: string): Promise<string> {
  const sig = await hmacSha256(payload, secret);
  return `${payload}.${sig}`;
}

const DEFAULT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/** Verifies the cookie value. Returns true iff payload was signed with the same secret AND not expired. */
export async function verifyAuthToken(token: string, secret: string, maxAgeMs: number = DEFAULT_MAX_AGE_MS): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === token.length - 1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = await hmacSha256(payload, secret);
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return false;
  // Payload format: "v1:<timestamp-ms>" — reject tokens older than maxAgeMs.
  const m = /^v1:(\d+)$/.exec(payload);
  if (!m) return false;
  const issuedAt = Number(m[1]);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > maxAgeMs) return false;
  return true;
}
