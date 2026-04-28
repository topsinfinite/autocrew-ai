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
  return Buffer.from(sig).toString("base64url");
}

/** Returns the cookie value. Format: "<payload>.<sig>" */
export async function signAuthToken(payload: string, secret: string): Promise<string> {
  const sig = await hmacSha256(payload, secret);
  return `${payload}.${sig}`;
}

/** Verifies the cookie value. Returns true iff payload was signed with the same secret. */
export async function verifyAuthToken(token: string, secret: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === token.length - 1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = await hmacSha256(payload, secret);
  // Constant-time-ish: compare equal-length strings; bail early on mismatch is acceptable here
  // because the secret never differs per-request.
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
