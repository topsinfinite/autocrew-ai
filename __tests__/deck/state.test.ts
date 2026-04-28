// __tests__/deck/state.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  type DeckDraft,
  saveDraft, loadDraft, deleteDraft, listDraftIds,
  loadSalesRepProfile, saveSalesRepProfile,
} from "@/lib/deck/state";

function makeDraft(over: Partial<DeckDraft> = {}): DeckDraft {
  return {
    id: "abc123abc123",
    schemaVersion: 1,
    template: "blank",
    createdAt: "2026-04-28T00:00:00.000Z",
    theme: { accent: "green", displayStyle: "serif-italic" },
    prospect: {},
    salesRep: {},
    slides: [],
    ...over,
  };
}

beforeEach(() => localStorage.clear());

describe("draft I/O", () => {
  it("saves and loads a draft", () => {
    const d = makeDraft({ id: "xyz" });
    saveDraft(d);
    expect(loadDraft("xyz")).toEqual(d);
  });
  it("returns null for missing draft", () => {
    expect(loadDraft("nope")).toBeNull();
  });
  it("listDraftIds reflects saved order (newest first)", () => {
    saveDraft(makeDraft({ id: "first" }));
    saveDraft(makeDraft({ id: "second" }));
    expect(listDraftIds()).toEqual(["second", "first"]);
  });
  it("deleteDraft removes from list and storage", () => {
    saveDraft(makeDraft({ id: "x" }));
    deleteDraft("x");
    expect(loadDraft("x")).toBeNull();
    expect(listDraftIds()).toEqual([]);
  });
  it("does not duplicate id in list when saving same id twice", () => {
    saveDraft(makeDraft({ id: "x" }));
    saveDraft(makeDraft({ id: "x", prospect: { name: "Acme" } }));
    expect(listDraftIds()).toEqual(["x"]);
    expect(loadDraft("x")?.prospect.name).toBe("Acme");
  });
});

describe("sales-rep profile", () => {
  it("saves and loads", () => {
    saveSalesRepProfile({ name: "Jordan", email: "jordan@autocrew-ai.com" });
    expect(loadSalesRepProfile()).toEqual({ name: "Jordan", email: "jordan@autocrew-ai.com" });
  });
  it("returns empty object when missing", () => {
    expect(loadSalesRepProfile()).toEqual({});
  });
});
