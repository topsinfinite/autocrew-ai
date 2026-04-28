import { describe, it, expect } from "vitest";
import { signAuthToken, verifyAuthToken } from "@/lib/deck/auth";

describe("deck auth tokens", () => {
  const secret = "0123456789abcdef0123456789abcdef";

  it("signs a token that verifies with the same secret", async () => {
    const token = await signAuthToken("v1:1700000000000", secret);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
    const ok = await verifyAuthToken(token, secret);
    expect(ok).toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signAuthToken("v1:1700000000000", secret);
    const ok = await verifyAuthToken(token, "different-secret-also-32-chars-x");
    expect(ok).toBe(false);
  });

  it("rejects garbage input", async () => {
    expect(await verifyAuthToken("not-a-token", secret)).toBe(false);
    expect(await verifyAuthToken("", secret)).toBe(false);
  });
});
