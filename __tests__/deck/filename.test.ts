import { describe, it, expect } from "vitest";
import { deckFilename } from "@/lib/deck/filename";

describe("deckFilename", () => {
  it("produces lowercase kebab-case with template + prospect + date", () => {
    expect(deckFilename({ template: "widget-pitch", prospectName: "Acme Corp", date: new Date("2026-04-28") }))
      .toBe("autocrew-widget-pitch-acme-corp-2026-04-28");
  });
  it("falls back when prospect is missing", () => {
    expect(deckFilename({ template: "widget-pitch", date: new Date("2026-04-28") }))
      .toBe("autocrew-widget-pitch-2026-04-28");
  });
  it("strips unsafe filename chars", () => {
    expect(deckFilename({ template: "widget-pitch", prospectName: "A/B Test: Q1?", date: new Date("2026-04-28") }))
      .toBe("autocrew-widget-pitch-a-b-test-q1-2026-04-28");
  });
});
