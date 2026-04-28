import { describe, it, expect } from "vitest";
import { newDraftFromTemplate } from "@/lib/deck/draft-factory";

describe("newDraftFromTemplate", () => {
  it("produces a draft with id, default theme, all slides included, unique uids", async () => {
    const draft = await newDraftFromTemplate({
      templateId: "blank",
      prospect: { name: "Acme" },
      salesRep: { name: "Jordan" },
      now: new Date("2026-04-28T00:00:00Z"),
    });
    expect(draft.id).toMatch(/^[a-f0-9]{12}$/);
    expect(draft.template).toBe("blank");
    expect(draft.theme.accent).toBeDefined();
    expect(draft.slides.length).toBeGreaterThan(0);
    expect(draft.slides.every((s) => s.included)).toBe(true);
    const uids = new Set(draft.slides.map((s) => s.uid));
    expect(uids.size).toBe(draft.slides.length);
  });
  it("uses template defaults when accent/displayStyle not overridden", async () => {
    const draft = await newDraftFromTemplate({ templateId: "widget-pitch", prospect: {}, salesRep: {}, now: new Date() });
    expect(draft.theme.accent).toBe("orange");
    expect(draft.theme.displayStyle).toBe("bold-sans");
  });
});
