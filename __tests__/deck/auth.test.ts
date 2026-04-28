import { describe, it, expect } from "vitest";
import { signAuthToken, verifyAuthToken } from "@/lib/deck/auth";

describe("deck auth tokens", () => {
  const secret = "0123456789abcdef0123456789abcdef0123456789abcdef";

  it("signs a token that verifies with the same secret", async () => {
    const token = await signAuthToken(`v1:${Date.now()}`, secret);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
    const ok = await verifyAuthToken(token, secret);
    expect(ok).toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signAuthToken(`v1:${Date.now()}`, secret);
    const ok = await verifyAuthToken(token, "different-secret-also-32-chars-aa");
    expect(ok).toBe(false);
  });

  it("rejects garbage input", async () => {
    expect(await verifyAuthToken("not-a-token", secret)).toBe(false);
    expect(await verifyAuthToken("", secret)).toBe(false);
  });

  it("rejects a tampered payload paired with a valid-format signature for a different payload", async () => {
    const goodToken = await signAuthToken(`v1:${Date.now()}`, secret);
    const goodSig = goodToken.slice(goodToken.lastIndexOf(".") + 1);
    const tampered = `v1:9999999999999.${goodSig}`;
    expect(await verifyAuthToken(tampered, secret)).toBe(false);
  });

  it("rejects a token with payload older than maxAgeMs", async () => {
    const ancient = Date.now() - 1000 * 60 * 60 * 24 * 365; // 1 year ago
    const token = await signAuthToken(`v1:${ancient}`, secret);
    const ok = await verifyAuthToken(token, secret); // default 30-day TTL
    expect(ok).toBe(false);
  });

  it("accepts a fresh token within maxAgeMs", async () => {
    const token = await signAuthToken(`v1:${Date.now()}`, secret);
    expect(await verifyAuthToken(token, secret, 60_000)).toBe(true);
  });
});
