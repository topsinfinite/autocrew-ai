import { describe, it, expect } from "vitest";
import { draftIdFor } from "@/lib/deck/hash";

describe("draftIdFor", () => {
  it("returns a 12-char string", async () => {
    const id = await draftIdFor({ template: "blank", createdAt: "2026-04-28T00:00:00.000Z", x: 1 });
    expect(id).toMatch(/^[a-f0-9]{12}$/);
  });
  it("is stable for identical input regardless of key order", async () => {
    const a = { template: "blank", createdAt: "2026-04-28T00:00:00.000Z", x: { b: 2, a: 1 } };
    const b = { x: { a: 1, b: 2 }, createdAt: "2026-04-28T00:00:00.000Z", template: "blank" };
    expect(await draftIdFor(a)).toBe(await draftIdFor(b));
  });
  it("differs for different input", async () => {
    const a = await draftIdFor({ template: "blank", createdAt: "2026-04-28T00:00:00.000Z" });
    const b = await draftIdFor({ template: "blank", createdAt: "2026-04-28T00:00:01.000Z" });
    expect(a).not.toBe(b);
  });
});
