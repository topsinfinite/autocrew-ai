// lib/deck/state.ts
import type { AccentToken, DisplayStyle } from "./tokens";
import type { SlideContent } from "./slide-content-types";
import type { DeckTemplateId } from "./templates";

export type DeckDraft = {
  id: string;
  schemaVersion: 1;
  template: DeckTemplateId;
  createdAt: string;
  theme: { accent: AccentToken; displayStyle: DisplayStyle };
  prospect: { name?: string; industry?: string; contactName?: string; dealValue?: string; logoDataUrl?: string };
  salesRep: { name?: string; email?: string };
  slides: Array<{
    uid: string;
    template: SlideContent["template"];
    included: boolean;
    content: SlideContent["content"];
  }>;
};

const KEY_LIST = "deck:list";
const keyDraft = (id: string) => `deck:${id}`;
const KEY_REP = "deck:sales-rep-profile";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonWithEvict(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e instanceof DOMException && (e.name === "QuotaExceededError" || e.code === 22)) {
      // Evict oldest then retry once.
      const ids = listDraftIds();
      const oldest = ids[ids.length - 1];
      if (oldest) {
        deleteDraft(oldest);
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return;
        } catch {}
      }
    }
    throw e;
  }
}

export function listDraftIds(): string[] {
  return readJson<string[]>(KEY_LIST, []);
}

export function saveDraft(draft: DeckDraft): void {
  writeJsonWithEvict(keyDraft(draft.id), draft);
  const list = listDraftIds().filter((x) => x !== draft.id);
  list.unshift(draft.id);
  localStorage.setItem(KEY_LIST, JSON.stringify(list));
}

export function loadDraft(id: string): DeckDraft | null {
  return readJson<DeckDraft | null>(keyDraft(id), null);
}

export function deleteDraft(id: string): void {
  localStorage.removeItem(keyDraft(id));
  const list = listDraftIds().filter((x) => x !== id);
  localStorage.setItem(KEY_LIST, JSON.stringify(list));
}

export type SalesRepProfile = { name?: string; email?: string };

export function loadSalesRepProfile(): SalesRepProfile {
  return readJson<SalesRepProfile>(KEY_REP, {});
}

export function saveSalesRepProfile(p: SalesRepProfile): void {
  localStorage.setItem(KEY_REP, JSON.stringify(p));
}
