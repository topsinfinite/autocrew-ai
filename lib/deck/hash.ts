// lib/deck/hash.ts
import { canonicalJson } from "./canonical-json";

export async function draftIdFor(value: unknown): Promise<string> {
  const text = canonicalJson(value);
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.slice(0, 12);
}
