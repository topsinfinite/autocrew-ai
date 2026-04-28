# Sales Deck Builder Implementation Plan — Part 2

> **Continuation of `2026-04-28-sales-deck-builder.md` (Phases 0–4).** Phases 5–11 below.

---

## Phase 5: State + personalization (TDD)

### Task 5.1: Canonical JSON serializer (TDD)

**Files:**
- Create: `lib/deck/canonical-json.ts`
- Create: `__tests__/deck/canonical-json.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// __tests__/deck/canonical-json.test.ts
import { describe, it, expect } from "vitest";
import { canonicalJson } from "@/lib/deck/canonical-json";

describe("canonicalJson", () => {
  it("sorts object keys deterministically", () => {
    expect(canonicalJson({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
  });
  it("recurses into nested objects", () => {
    expect(canonicalJson({ b: { d: 1, c: 2 }, a: 3 })).toBe('{"a":3,"b":{"c":2,"d":1}}');
  });
  it("preserves array order", () => {
    expect(canonicalJson([3, 1, 2])).toBe("[3,1,2]");
  });
  it("handles null and primitives", () => {
    expect(canonicalJson(null)).toBe("null");
    expect(canonicalJson("x")).toBe('"x"');
    expect(canonicalJson(42)).toBe("42");
  });
  it("two equivalent objects produce identical output regardless of key order", () => {
    const a = { x: { b: 2, a: 1 }, y: [1, 2] };
    const b = { y: [1, 2], x: { a: 1, b: 2 } };
    expect(canonicalJson(a)).toBe(canonicalJson(b));
  });
});
```

- [ ] **Step 2: Run — verify FAIL**

Run: `npx vitest run __tests__/deck/canonical-json.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// lib/deck/canonical-json.ts
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalJson((value as any)[k])).join(",") + "}";
}
```

- [ ] **Step 4: Run — verify PASS**

Run: `npx vitest run __tests__/deck/canonical-json.test.ts`
Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/deck/canonical-json.ts __tests__/deck/canonical-json.test.ts
git commit -m "feat(deck): add canonicalJson serializer (deterministic key order)"
```

### Task 5.2: Draft id hash (TDD)

**Files:**
- Create: `lib/deck/hash.ts`
- Create: `__tests__/deck/hash.test.ts`

- [ ] **Step 1: Write tests**

```ts
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
```

- [ ] **Step 2: Run — verify FAIL**

Run: `npx vitest run __tests__/deck/hash.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// lib/deck/hash.ts
import { canonicalJson } from "./canonical-json";

export async function draftIdFor(value: unknown): Promise<string> {
  const text = canonicalJson(value);
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex.slice(0, 12);
}
```

- [ ] **Step 4: Run — verify PASS**

Run: `npx vitest run __tests__/deck/hash.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/deck/hash.ts __tests__/deck/hash.test.ts
git commit -m "feat(deck): add draftIdFor (sha1, 12-char, deterministic)"
```

### Task 5.3: Personalization — `substitute()` (TDD)

**Files:**
- Create: `lib/deck/personalization.ts`
- Create: `__tests__/deck/personalization.test.ts`

- [ ] **Step 1: Write tests**

```ts
import { describe, it, expect } from "vitest";
import { substitute, formatDate, formatDateShort, type SubstitutionContext } from "@/lib/deck/personalization";

const ctx: SubstitutionContext = {
  prospect: { name: "Acme Corp", industry: "Healthcare", contactName: "Dr. Sarah Chen", dealValue: "$50,000" },
  salesRep: { name: "Jordan", email: "jordan@autocrew-ai.com" },
  date: new Date("2026-04-28T12:00:00Z"),
};

describe("substitute", () => {
  it("replaces whitelisted vars", () => {
    expect(substitute("Hello {{prospect.name}}", ctx)).toBe("Hello Acme Corp");
    expect(substitute("Industry: {{prospect.industry}}", ctx)).toBe("Industry: Healthcare");
    expect(substitute("Contact: {{prospect.contactName}}", ctx)).toBe("Contact: Dr. Sarah Chen");
    expect(substitute("Value: {{prospect.dealValue}}", ctx)).toBe("Value: $50,000");
    expect(substitute("From {{salesRep.name}} <{{salesRep.email}}>", ctx)).toBe("From Jordan <jordan@autocrew-ai.com>");
  });
  it("substitutes date helpers", () => {
    expect(substitute("Sent {{date}}", ctx)).toBe("Sent April 2026");
    expect(substitute("Sent {{date.short}}", ctx)).toBe("Sent 04/2026");
  });
  it("renders missing optional vars as empty string", () => {
    const empty: SubstitutionContext = { prospect: {}, salesRep: {}, date: ctx.date };
    expect(substitute("Hi {{prospect.contactName}}!", empty)).toBe("Hi !");
  });
  it("renders non-whitelisted vars as empty string", () => {
    expect(substitute("Hack: {{prospect.dealValue.somethingNested}}", ctx)).toBe("Hack: ");
    expect(substitute("Bad: {{__proto__}}", ctx)).toBe("Bad: ");
  });
  it("leaves text without vars untouched", () => {
    expect(substitute("Plain text.", ctx)).toBe("Plain text.");
  });
});

describe("date helpers", () => {
  it("formatDate uses 'Month YYYY'", () => {
    expect(formatDate(new Date("2026-04-28"))).toBe("April 2026");
  });
  it("formatDateShort uses 'MM/YYYY'", () => {
    expect(formatDateShort(new Date("2026-04-28"))).toBe("04/2026");
  });
});
```

- [ ] **Step 2: Run — verify FAIL**

- [ ] **Step 3: Implement**

```ts
// lib/deck/personalization.ts
export type SubstitutionContext = {
  prospect: {
    name?: string; industry?: string; contactName?: string; dealValue?: string;
  };
  salesRep: { name?: string; email?: string };
  date: Date;
};

const ALLOWED = new Set([
  "prospect.name", "prospect.industry", "prospect.contactName", "prospect.dealValue",
  "salesRep.name", "salesRep.email",
  "date", "date.short",
]);

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
export function formatDateShort(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${mm}/${d.getFullYear()}`;
}

function lookup(ctx: SubstitutionContext, path: string): string {
  if (!ALLOWED.has(path)) return "";
  switch (path) {
    case "prospect.name":         return ctx.prospect.name ?? "";
    case "prospect.industry":     return ctx.prospect.industry ?? "";
    case "prospect.contactName":  return ctx.prospect.contactName ?? "";
    case "prospect.dealValue":    return ctx.prospect.dealValue ?? "";
    case "salesRep.name":         return ctx.salesRep.name ?? "";
    case "salesRep.email":        return ctx.salesRep.email ?? "";
    case "date":                  return formatDate(ctx.date);
    case "date.short":            return formatDateShort(ctx.date);
    default:                      return "";
  }
}

export function substitute(text: string, ctx: SubstitutionContext): string {
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => lookup(ctx, path));
}
```

- [ ] **Step 4: Run — verify PASS** (8 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/deck/personalization.ts __tests__/deck/personalization.test.ts
git commit -m "feat(deck): add substitute() with whitelisted variables + date helpers"
```

### Task 5.4: Filename helper (TDD)

**Files:**
- Create: `lib/deck/filename.ts`
- Create: `__tests__/deck/filename.test.ts`

- [ ] **Step 1: Tests**

```ts
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
```

- [ ] **Step 2: Implement**

```ts
// lib/deck/filename.ts
function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
export function deckFilename(opts: { template: string; prospectName?: string; date: Date }): string {
  const d = opts.date;
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const prospect = opts.prospectName ? slugify(opts.prospectName) : "";
  return ["autocrew", slugify(opts.template), prospect, dateStr].filter(Boolean).join("-");
}
```

- [ ] **Step 3: Run — verify PASS, then commit**

```bash
git add lib/deck/filename.ts __tests__/deck/filename.test.ts
git commit -m "feat(deck): add deckFilename helper (slug + date)"
```

### Task 5.5: `DeckDraft` schema + state I/O (TDD)

**Files:**
- Create: `lib/deck/state.ts`
- Create: `__tests__/deck/state.test.ts`

- [ ] **Step 1: Tests**

```ts
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
```

- [ ] **Step 2: Implement**

```ts
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
        try { localStorage.setItem(key, JSON.stringify(value)); return; } catch {}
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
```

- [ ] **Step 3: Run — verify PASS** (7 tests).

- [ ] **Step 4: Commit**

```bash
git add lib/deck/state.ts __tests__/deck/state.test.ts
git commit -m "feat(deck): add DeckDraft schema + localStorage I/O (with quota eviction)"
```

### Task 5.6: Helpers — slide uid + initial draft from template

**Files:**
- Create: `lib/deck/draft-factory.ts`
- Create: `__tests__/deck/draft-factory.test.ts`

- [ ] **Step 1: Tests**

```ts
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
```

- [ ] **Step 2: Implement**

```ts
// lib/deck/draft-factory.ts
import { DECK_TEMPLATES, type DeckTemplateId } from "./templates";
import type { DeckDraft } from "./state";
import type { AccentToken, DisplayStyle } from "./tokens";
import { draftIdFor } from "./hash";

let uidCounter = 0;
function nextUid(): string {
  uidCounter += 1;
  return `s${Date.now().toString(36)}${uidCounter.toString(36)}`;
}

export async function newDraftFromTemplate(args: {
  templateId: DeckTemplateId;
  prospect: DeckDraft["prospect"];
  salesRep: DeckDraft["salesRep"];
  now: Date;
  themeOverride?: { accent?: AccentToken; displayStyle?: DisplayStyle };
}): Promise<DeckDraft> {
  const template = DECK_TEMPLATES[args.templateId];
  const draftCore: Omit<DeckDraft, "id"> = {
    schemaVersion: 1,
    template: args.templateId,
    createdAt: args.now.toISOString(),
    theme: {
      accent: args.themeOverride?.accent ?? template.defaultAccent,
      displayStyle: args.themeOverride?.displayStyle ?? template.defaultDisplayStyle,
    },
    prospect: { ...args.prospect },
    salesRep: { ...args.salesRep },
    slides: template.slides.map((s) => ({
      uid: nextUid(),
      template: s.template,
      included: true,
      content: s.content,
    })),
  };
  const id = await draftIdFor(draftCore);
  return { id, ...draftCore };
}
```

- [ ] **Step 3: Run — verify PASS, commit**

```bash
git add lib/deck/draft-factory.ts __tests__/deck/draft-factory.test.ts
git commit -m "feat(deck): add newDraftFromTemplate factory"
```

---

## Phase 6: Wizard form — `/decks/new/[deckTemplate]`

### Task 6.1: Logo downscale helper

**Files:**
- Create: `lib/deck/image.ts`

- [ ] **Step 1: Implement**

```ts
// lib/deck/image.ts
const MAX_BYTES = 200 * 1024;
const MAX_DIM = 512;

export async function fileToCappedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(file);
  });
  const sizeBytes = Math.ceil((dataUrl.length - dataUrl.indexOf(",") - 1) * 3 / 4);
  if (sizeBytes <= MAX_BYTES) return dataUrl;

  // Downscale via canvas
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("invalid image"));
    i.src = dataUrl;
  });
  const ratio = Math.min(MAX_DIM / img.width, MAX_DIM / img.height, 1);
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  let q = 0.92;
  let out = canvas.toDataURL("image/png");
  while (out.length * 0.75 > MAX_BYTES && q > 0.4) {
    q -= 0.1;
    out = canvas.toDataURL("image/jpeg", q);
  }
  return out;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/deck/image.ts
git commit -m "feat(deck): add fileToCappedDataUrl (downscale to <200KB)"
```

### Task 6.2: Wizard form component

**Files:**
- Create: `components/deck/builder/WizardForm.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ACCENT_LIST, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";
import { DECK_TEMPLATES, type DeckTemplateId } from "@/lib/deck/templates";
import { newDraftFromTemplate } from "@/lib/deck/draft-factory";
import { saveDraft, loadSalesRepProfile, saveSalesRepProfile } from "@/lib/deck/state";
import { fileToCappedDataUrl } from "@/lib/deck/image";

type Props = { templateId: DeckTemplateId };

export function WizardForm({ templateId }: Props) {
  const tpl = DECK_TEMPLATES[templateId];
  const router = useRouter();

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactName, setContactName] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [logo, setLogo] = useState<string | undefined>();
  const [accent, setAccent] = useState<AccentToken>(tpl.defaultAccent);
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>(tpl.defaultDisplayStyle);
  const [salesRepName, setSalesRepName] = useState("");
  const [salesRepEmail, setSalesRepEmail] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const p = loadSalesRepProfile();
    if (p.name) setSalesRepName(p.name);
    if (p.email) setSalesRepEmail(p.email);
  }, []);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await fileToCappedDataUrl(f);
      setLogo(url);
    } catch (e) {
      setErr("Could not load that image. Try a different file.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Prospect name is required."); return; }
    setBusy(true); setErr(null);
    try {
      saveSalesRepProfile({ name: salesRepName || undefined, email: salesRepEmail || undefined });
      const draft = await newDraftFromTemplate({
        templateId,
        prospect: {
          name: name.trim() || undefined,
          industry: industry.trim() || undefined,
          contactName: contactName.trim() || undefined,
          dealValue: dealValue.trim() || undefined,
          logoDataUrl: logo,
        },
        salesRep: { name: salesRepName || undefined, email: salesRepEmail || undefined },
        now: new Date(),
        themeOverride: { accent, displayStyle },
      });
      saveDraft(draft);
      router.push(`/decks/preview/${draft.id}`);
    } catch (e) {
      setErr("Could not generate deck. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 720 }}>
      <Field label="Prospect name *" value={name} onChange={setName} required autoFocus />
      <Field label="Prospect industry" value={industry} onChange={setIndustry} />
      <FileField label="Prospect logo (optional, ≤200KB)" preview={logo} onChange={handleLogoChange} />

      <SwatchPicker label="Accent color" value={accent} onChange={setAccent} />
      <DisplayStylePicker value={displayStyle} onChange={setDisplayStyle} />

      <button type="button" onClick={() => setShowMore((v) => !v)} style={discloseBtn}>
        {showMore ? "− Hide personalization" : "+ More personalization (optional)"}
      </button>
      {showMore && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingLeft: 16, borderLeft: "1px solid var(--deck-border)" }}>
          <Field label="Contact name" value={contactName} onChange={setContactName} />
          <Field label="Deal value (free text, e.g. $50,000)" value={dealValue} onChange={setDealValue} />
          <Field label="Your name" value={salesRepName} onChange={setSalesRepName} />
          <Field label="Your email" value={salesRepEmail} onChange={setSalesRepEmail} />
        </div>
      )}

      {err ? <div style={{ color: "var(--deck-accent-red)", fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>{err}</div> : null}

      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" disabled={busy} style={primaryBtn}>{busy ? "Generating…" : "Generate deck →"}</button>
        <a href="/decks" style={ghostBtn}>Cancel</a>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", marginBottom: 8 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16, outline: "none" };
const primaryBtn: React.CSSProperties = { padding: "14px 24px", background: "var(--deck-accent)", color: "#000", border: "none", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "14px 24px", background: "transparent", color: "var(--deck-text-muted)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center" };
const discloseBtn: React.CSSProperties = { background: "transparent", border: "none", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", padding: 0, alignSelf: "flex-start" };

function Field({ label, value, onChange, required, autoFocus }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; autoFocus?: boolean }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} required={required} autoFocus={autoFocus} />
    </div>
  );
}

function FileField({ label, preview, onChange }: { label: string; preview?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {preview ? <img src={preview} alt="" style={{ height: 48, background: "#fff", padding: 4, borderRadius: 2 }} /> : null}
        <input type="file" accept="image/*" onChange={onChange} style={{ color: "var(--deck-text-muted)", fontFamily: "var(--deck-body-family)" }} />
      </div>
    </div>
  );
}

function SwatchPicker({ label, value, onChange }: { label: string; value: AccentToken; onChange: (v: AccentToken) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: 12 }}>
        {ACCENT_LIST.map((a) => (
          <button
            key={a}
            type="button"
            aria-label={a}
            onClick={() => onChange(a)}
            style={{
              width: 40, height: 40, borderRadius: 2,
              background: `var(--deck-accent-${a})`,
              border: value === a ? "2px solid #fff" : "1px solid var(--deck-border)",
              cursor: "pointer", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DisplayStylePicker({ value, onChange }: { value: DisplayStyle; onChange: (v: DisplayStyle) => void }) {
  return (
    <div>
      <label style={labelStyle}>Display style</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StyleCard chosen={value === "serif-italic"} onClick={() => onChange("serif-italic")} previewFamily="var(--font-instrument-serif), serif" italic label="Serif italic" />
        <StyleCard chosen={value === "bold-sans"} onClick={() => onChange("bold-sans")} previewFamily="var(--font-geist-sans), sans-serif" italic={false} label="Bold sans" />
      </div>
    </div>
  );
}
function StyleCard({ chosen, onClick, previewFamily, italic, label }: { chosen: boolean; onClick: () => void; previewFamily: string; italic: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "var(--deck-surface)",
        border: chosen ? "2px solid var(--deck-accent)" : "1px solid var(--deck-border)",
        borderRadius: 2, padding: 24, cursor: "pointer", textAlign: "left",
      }}
    >
      <div style={{ fontFamily: previewFamily, fontStyle: italic ? "italic" : "normal", fontSize: 64, lineHeight: 1, color: "var(--deck-text-primary)", fontWeight: italic ? 400 : 700 }}>Aa</div>
      <div style={{ marginTop: 16, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)" }}>{label}</div>
    </button>
  );
}
```

- [ ] **Step 2: Page wrapper**

Create `app/(deck)/new/[deckTemplate]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { DECK_TEMPLATES, type DeckTemplateId } from "@/lib/deck/templates";
import { WizardForm } from "@/components/deck/builder/WizardForm";

export default async function NewDeckPage({ params }: { params: Promise<{ deckTemplate: string }> }) {
  const { deckTemplate } = await params;
  const tpl = DECK_TEMPLATES[deckTemplate as DeckTemplateId];
  if (!tpl) notFound();
  return (
    <main style={{ padding: 80, maxWidth: 960, marginInline: "auto" }}>
      <a href="/decks" style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", textDecoration: "none" }}>← Decks</a>
      <h1 style={{ fontFamily: "var(--deck-display-family)", fontStyle: "var(--deck-display-style)", fontWeight: "var(--deck-display-weight)" as unknown as number, fontSize: 64, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "16px 0 8px" }}>
        New {tpl.name}.
      </h1>
      <p style={{ color: "var(--deck-text-muted)", fontSize: 16, marginBottom: 48 }}>{tpl.description}</p>
      <WizardForm templateId={tpl.id} />
    </main>
  );
}
```

- [ ] **Step 3: Manual smoke test**

`npm run dev` → log in → visit `http://localhost:3000/decks/new/blank` → fill name "Acme" → Generate → URL should change to `/decks/preview/<id>` (preview not built yet — expect a 404).

- [ ] **Step 4: Commit**

```bash
git add components/deck/builder/WizardForm.tsx app/\(deck\)/new/
git commit -m "feat(deck): add wizard form (/decks/new/[deckTemplate])"
```

---

## Phase 7: Editor — `/decks/preview/[id]`

### Task 7.1: Editor shell + URL plumbing

**Files:**
- Create: `app/(deck)/preview/[id]/page.tsx`
- Create: `components/deck/builder/EditorShell.tsx`

- [ ] **Step 1: Page wrapper (Server Component, just renders the client shell)**

`app/(deck)/preview/[id]/page.tsx`:

```tsx
import { EditorShell } from "@/components/deck/builder/EditorShell";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditorShell draftId={id} />;
}
```

- [ ] **Step 2: `EditorShell.tsx` — loads draft, mounts top bar + rail + stage + hidden iframe**

```tsx
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadDraft, saveDraft, type DeckDraft } from "@/lib/deck/state";
import { DeckThemeProvider } from "@/components/deck/builder/DeckThemeContext";
import { SlideRail } from "./SlideRail";
import { SlideStage } from "./SlideStage";
import { DownloadButtons } from "./DownloadButtons";
import { HiddenRenderIframe } from "./HiddenRenderIframe";

export function EditorShell({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<DeckDraft | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setDraft(loadDraft(draftId)); }, [draftId]);

  // Cross-tab edit collision banner
  const [otherTab, setOtherTab] = useState(false);
  useEffect(() => {
    const ch = new BroadcastChannel(`deck:${draftId}`);
    const me = Math.random().toString(36).slice(2);
    ch.postMessage({ type: "ping", from: me });
    ch.onmessage = (e) => { if (e.data?.type === "ping" && e.data.from !== me) setOtherTab(true); };
    return () => ch.close();
  }, [draftId]);

  const update = useCallback((mut: (d: DeckDraft) => DeckDraft) => {
    setDraft((cur) => {
      if (!cur) return cur;
      const next = mut(cur);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveDraft(next), 500);
      return next;
    });
  }, []);

  if (draft === null) {
    // loading
    return <main style={{ padding: 80, color: "var(--deck-text-muted)" }}>Loading…</main>;
  }
  if (!draft) {
    return (
      <main style={{ padding: 80 }}>
        <h1 style={{ color: "var(--deck-text-primary)", fontFamily: "var(--deck-display-family)", fontStyle: "italic", fontSize: 48 }}>Draft not found in this browser.</h1>
        <p style={{ color: "var(--deck-text-muted)", marginTop: 16 }}>Drafts are stored locally — try a different machine? Or start a new one.</p>
        <a href="/decks" style={{ display: "inline-block", marginTop: 24, padding: "14px 24px", background: "var(--deck-accent)", color: "#000", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>Start a new deck →</a>
      </main>
    );
  }

  return (
    <DeckThemeProvider accent={draft.theme.accent} displayStyle={draft.theme.displayStyle}>
      <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", height: "100vh" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid var(--deck-border)" }}>
          <a href="/decks" style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", textDecoration: "none" }}>← Decks</a>
          <span style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)" }}>
            {draft.id} · {draft.template}
          </span>
          <DownloadButtons draft={draft} />
        </header>
        {otherTab && (
          <div style={{ background: "color-mix(in srgb, var(--deck-accent-yellow) 20%, transparent)", padding: "8px 24px", color: "var(--deck-text-primary)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            ⚠ This deck is open in another tab. Edits may overlap.
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", height: "100%", overflow: "hidden" }}>
          <SlideRail draft={draft} activeIdx={activeIdx} onActivate={setActiveIdx} onUpdate={update} />
          <SlideStage draft={draft} activeIdx={activeIdx} onUpdate={update} />
        </div>
        <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderTop: "1px solid var(--deck-border)", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.12em" }}>
          <button onClick={() => setActiveIdx((i) => Math.max(0, i - 1))} style={navBtn}>← prev</button>
          <span>{String(activeIdx + 1).padStart(2, "0")} / {String(draft.slides.length).padStart(2, "0")}</span>
          <button onClick={() => setActiveIdx((i) => Math.min(draft.slides.length - 1, i + 1))} style={navBtn}>next →</button>
        </footer>
      </div>
      <HiddenRenderIframe draftId={draft.id} />
    </DeckThemeProvider>
  );
}

const navBtn: React.CSSProperties = { background: "transparent", border: "none", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
```

- [ ] **Step 3: Stub `SlideRail`, `SlideStage`, `DownloadButtons`, `HiddenRenderIframe` so EditorShell compiles**

Create each file in `components/deck/builder/` with a placeholder:

```tsx
// components/deck/builder/SlideRail.tsx
"use client";
import type { DeckDraft } from "@/lib/deck/state";
export function SlideRail({ draft, activeIdx, onActivate }: { draft: DeckDraft; activeIdx: number; onActivate: (i: number) => void; onUpdate: (m: (d: DeckDraft) => DeckDraft) => void }) {
  return <aside style={{ borderRight: "1px solid var(--deck-border)", overflowY: "auto" }}>{draft.slides.map((s, i) => <button key={s.uid} onClick={() => onActivate(i)} style={{ display: "block", padding: 12, background: i === activeIdx ? "var(--deck-surface)" : "transparent", border: "none", color: "var(--deck-text-primary)", textAlign: "left", width: "100%", cursor: "pointer", fontFamily: "var(--deck-mono-family)", fontSize: 11 }}>{String(i + 1).padStart(2, "0")} {s.template}</button>)}</aside>;
}
// components/deck/builder/SlideStage.tsx
"use client";
import type { DeckDraft } from "@/lib/deck/state";
import { renderSlide } from "@/lib/deck/slide-templates";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/deck/tokens";
export function SlideStage({ draft, activeIdx }: { draft: DeckDraft; activeIdx: number; onUpdate: (m: (d: DeckDraft) => DeckDraft) => void }) {
  const slide = draft.slides[activeIdx];
  if (!slide) return null;
  // Fit-to-viewport scale
  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflow: "hidden", background: "#050505" }}>
      <div style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: "scale(min(calc((100vw - 280px - 48px) / 1920), calc((100vh - 130px) / 1080)))", transformOrigin: "center" }}>
        {renderSlide({ template: slide.template, content: slide.content } as any, { positionLabel: `${String(activeIdx + 1).padStart(2, "0")} / ${String(draft.slides.length).padStart(2, "0")}` })}
      </div>
    </main>
  );
}
// components/deck/builder/DownloadButtons.tsx
"use client";
import type { DeckDraft } from "@/lib/deck/state";
export function DownloadButtons(_: { draft: DeckDraft }) {
  return <div style={{ display: "flex", gap: 8 }}>
    <button disabled style={{ padding: "8px 16px", background: "var(--deck-accent)", color: "#000", border: "none", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>PDF</button>
    <button disabled style={{ padding: "8px 16px", background: "var(--deck-surface)", color: "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>PPTX</button>
  </div>;
}
// components/deck/builder/HiddenRenderIframe.tsx
"use client";
export function HiddenRenderIframe({ draftId }: { draftId: string }) {
  return <iframe id="deck-render-iframe" src={`/decks/render/${draftId}`} style={{ position: "fixed", left: -99999, top: -99999, width: 1920, height: 100000, opacity: 0, pointerEvents: "none" }} title="render" aria-hidden />;
}
```

- [ ] **Step 4: Manual smoke test**

`npm run dev` → log in → wizard for blank → preview should show first slide scaled, slide rail with two entries, top bar with disabled PDF/PPTX buttons, bottom nav.

- [ ] **Step 5: Commit**

```bash
git add app/\(deck\)/preview/ components/deck/builder/
git commit -m "feat(deck): add editor shell + stub rail/stage/downloads/iframe"
```

### Task 7.2: Drag-reorder + include-toggle in `SlideRail`

**Files:**
- Modify: `components/deck/builder/SlideRail.tsx`

- [ ] **Step 1: Replace with full implementation**

```tsx
"use client";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DeckDraft } from "@/lib/deck/state";
import { SLIDE_TEMPLATE_IDS, type SlideTemplateId } from "@/lib/deck/slide-content-types";
import { useState } from "react";

type Props = {
  draft: DeckDraft;
  activeIdx: number;
  onActivate: (i: number) => void;
  onUpdate: (m: (d: DeckDraft) => DeckDraft) => void;
};

export function SlideRail({ draft, activeIdx, onActivate, onUpdate }: Props) {
  const [adding, setAdding] = useState(false);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onUpdate((d) => {
      const oldIdx = d.slides.findIndex((s) => s.uid === active.id);
      const newIdx = d.slides.findIndex((s) => s.uid === over.id);
      if (oldIdx < 0 || newIdx < 0) return d;
      const next = [...d.slides];
      const [moved] = next.splice(oldIdx, 1);
      next.splice(newIdx, 0, moved);
      onActivate(newIdx);
      return { ...d, slides: next };
    });
  }

  function toggleIncluded(uid: string) {
    onUpdate((d) => ({ ...d, slides: d.slides.map((s) => s.uid === uid ? { ...s, included: !s.included } : s) }));
  }

  function addSlide(t: SlideTemplateId) {
    onUpdate((d) => {
      const uid = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
      const newSlide = { uid, template: t, included: true, content: defaultContentFor(t) };
      const next = { ...d, slides: [...d.slides.slice(0, activeIdx + 1), newSlide as any, ...d.slides.slice(activeIdx + 1)] };
      onActivate(activeIdx + 1);
      return next;
    });
    setAdding(false);
  }

  return (
    <aside style={{ borderRight: "1px solid var(--deck-border)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--deck-border)" }}>
        <span style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)" }}>Slides</span>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={draft.slides.map((s) => s.uid)} strategy={verticalListSortingStrategy}>
          {draft.slides.map((s, i) => (
            <SortableRow key={s.uid} uid={s.uid} active={i === activeIdx} included={s.included} onActivate={() => onActivate(i)} onToggle={() => toggleIncluded(s.uid)}
              label={`${String(i + 1).padStart(2, "0")}  ${s.template}`} />
          ))}
        </SortableContext>
      </DndContext>
      <div style={{ borderTop: "1px solid var(--deck-border)", padding: 12 }}>
        <button onClick={() => setAdding((v) => !v)} style={addBtn}>+ Add slide</button>
        {adding && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {SLIDE_TEMPLATE_IDS.map((t) => (
              <button key={t} onClick={() => addSlide(t)} style={addItemBtn}>{t}</button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function SortableRow({ uid, label, active, included, onActivate, onToggle }: { uid: string; label: string; active: boolean; included: boolean; onActivate: () => void; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: uid });
  return (
    <div ref={setNodeRef} {...attributes} style={{ transform: CSS.Transform.toString(transform), transition, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: active ? "var(--deck-surface)" : "transparent", borderBottom: "1px solid var(--deck-border)" }}>
      <button {...listeners} aria-label="drag" style={{ background: "transparent", border: "none", color: "var(--deck-text-muted)", cursor: "grab", padding: 4 }}>⠿</button>
      <button onClick={onToggle} aria-label="toggle included" style={{ background: "transparent", border: "none", color: included ? "var(--deck-accent)" : "var(--deck-text-muted)", cursor: "pointer", padding: 4 }}>{included ? "▣" : "▢"}</button>
      <button onClick={onActivate} style={{ flex: 1, textAlign: "left", background: "transparent", border: "none", color: included ? "var(--deck-text-primary)" : "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.08em", cursor: "pointer", padding: 4 }}>{label}</button>
    </div>
  );
}

const addBtn: React.CSSProperties = { width: "100%", padding: "10px", background: "var(--deck-surface)", color: "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
const addItemBtn: React.CSSProperties = { padding: "6px 10px", background: "transparent", color: "var(--deck-text-muted)", border: "none", textAlign: "left", fontFamily: "var(--deck-mono-family)", fontSize: 11, cursor: "pointer" };

// Default content per template — one entry per SlideTemplateId. Keep terse; sales fills it in inline.
function defaultContentFor(t: SlideTemplateId): any {
  switch (t) {
    case "Cover":             return { headlineParts: [{ text: "New cover " }, { text: "headline.", accent: true }], sub: "Sub copy.", footerLeft: "autocrew-ai.com" };
    case "Problem":           return { number: "01", label: "PROBLEM", headlineParts: [{ text: "The " }, { text: "problem", accent: true }, { text: "." }], body: "Body copy." };
    case "Solution":          return { number: "02", label: "SOLUTION", headlineParts: [{ text: "The " }, { text: "solution", accent: true }, { text: "." }], body: "Body copy.", bullets: ["ONE", "TWO", "THREE"] };
    case "FiveCardGrid":      return { number: "03", label: "OVERVIEW", headline: "Five things.", sub: "One sentence.", cards: [1,2,3,4,5].map((n) => ({ number: `0${n}`, title: `Card ${n}`, body: "Body." })) };
    case "DetailWithCode":    return { number: "01", label: "DETAIL", headline: "Detail title.", body: "Body.", bestFor: ["Use case A", "Use case B"], code: { filename: "example", code: "// code" } };
    case "SixCardGrid":       return { number: "04", label: "CATEGORIES", headline: "Six places.", cards: [1,2,3,4,5,6].map((n) => ({ cornerLabel: `LABEL ${n}`, title: `Card ${n}`, body: "Body." })) };
    case "NumberedPoints":    return { number: "05", label: "POINTS", headline: "Numbered points.", points: [1,2,3,4,5,6].map((n) => ({ number: `0${n}`, title: `Point ${n}`, body: "Body." })) };
    case "HeadlineWithScreenshot": return { number: "06", label: "DETAIL", headlineParts: [{ text: "Detail." }], body: "Body.", bullets: [], screenshot: { kind: "kv", title: "preview", rows: [{ label: "ONE", value: "Value" }] } };
    case "HeadlineWithCode":  return { number: "07", label: "INSTALL", headlineLines: [{ text: "Three " }, { text: "lines.", accent: true }], code: { filename: "example", code: "// code" } };
    case "ComparisonTable":   return { number: "08", label: "VS", headlineParts: [{ text: "We compare " }, { text: "favorably.", accent: true }], columns: ["CAPABILITY", "OTHER", "AUTOCREW"], rows: [["Time", "Slow", "Fast"]] };
    case "ClosingCTA":        return { headlineParts: [{ text: "Ready to " }, { text: "ship?", accent: true }], sub: "Talk to us.", primaryCta: { label: "Book a demo" } };
    case "BigStat":           return { label: "STAT", stat: "94%", statLabel: "AVERAGE METRIC", context: "Context." };
    case "Quote":             return { label: "TESTIMONIAL", quote: "Game changer.", attribution: { name: "Person", title: "Title", org: "Org" } };
  }
}
```

- [ ] **Step 2: Manual verify** — drag a slide, toggle include, add a slide. Commit.

```bash
git add components/deck/builder/SlideRail.tsx
git commit -m "feat(deck): rail with drag-reorder, include-toggle, + Add slide"
```

### Task 7.3: Inline contenteditable for text fields + per-template inspector

**Files:**
- Modify: `components/deck/builder/SlideStage.tsx`
- Create: `components/deck/builder/SlideInspector.tsx`

- [ ] **Step 1: Add a click-to-edit overlay strategy**

Wrap the rendered slide in a layer that listens to `click` events on `[data-editable]` descendants. The slide templates need to mark fields as editable. **Decision:** for v1, keep editing primarily via the inspector (right panel) for predictability. Inline contenteditable can be added per-template later — it's a UX bonus, not a blocker. Update Section 4 of the spec accordingly via a parking-lot note.

Implement the inspector pattern:

```tsx
// components/deck/builder/SlideInspector.tsx
"use client";
import type { DeckDraft } from "@/lib/deck/state";
import { ACCENT_LIST, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";

type Props = {
  draft: DeckDraft;
  activeIdx: number;
  onUpdate: (m: (d: DeckDraft) => DeckDraft) => void;
  onClose: () => void;
};

export function SlideInspector({ draft, activeIdx, onUpdate, onClose }: Props) {
  const slide = draft.slides[activeIdx];
  if (!slide) return null;

  const updateContent = (patch: Record<string, unknown>) =>
    onUpdate((d) => ({ ...d, slides: d.slides.map((s, i) => i === activeIdx ? { ...s, content: { ...(s.content as object), ...patch } as any } : s) }));

  return (
    <aside style={{ width: 360, padding: 24, borderLeft: "1px solid var(--deck-border)", overflowY: "auto", background: "#050505" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <span style={lbl}>Slide {String(activeIdx + 1).padStart(2, "0")} · {slide.template}</span>
        <button onClick={onClose} style={ghostX}>×</button>
      </div>

      {/* Generic JSON editor as universal fallback. Per-template fields can be added later. */}
      <label style={lbl}>Content (JSON)</label>
      <textarea
        defaultValue={JSON.stringify(slide.content, null, 2)}
        onBlur={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            updateContent(parsed);
          } catch {/* ignore — keep prior value */}
        }}
        rows={20}
        style={{ width: "100%", padding: 12, background: "var(--deck-surface)", border: "1px solid var(--deck-border)", color: "var(--deck-text-primary)", fontFamily: "var(--deck-mono-family)", fontSize: 12, borderRadius: 2, marginBottom: 32, resize: "vertical" }}
      />

      <h3 style={lbl}>Theme</h3>
      <div style={{ display: "flex", gap: 8, marginTop: 8, marginBottom: 16 }}>
        {ACCENT_LIST.map((a) => (
          <button key={a} onClick={() => onUpdate((d) => ({ ...d, theme: { ...d.theme, accent: a as AccentToken } }))}
            style={{ width: 28, height: 28, borderRadius: 2, background: `var(--deck-accent-${a})`, border: draft.theme.accent === a ? "2px solid #fff" : "1px solid var(--deck-border)", padding: 0, cursor: "pointer" }} aria-label={a} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {(["serif-italic", "bold-sans"] as DisplayStyle[]).map((d) => (
          <button key={d} onClick={() => onUpdate((dr) => ({ ...dr, theme: { ...dr.theme, displayStyle: d } }))}
            style={{ flex: 1, padding: "8px 12px", background: draft.theme.displayStyle === d ? "var(--deck-accent)" : "var(--deck-surface)", color: draft.theme.displayStyle === d ? "#000" : "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>{d}</button>
        ))}
      </div>
    </aside>
  );
}

const lbl: React.CSSProperties = { display: "block", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", marginBottom: 8 };
const ghostX: React.CSSProperties = { background: "transparent", border: "none", color: "var(--deck-text-muted)", fontSize: 24, cursor: "pointer" };
```

- [ ] **Step 2: Update `SlideStage.tsx` to toggle inspector when slide is clicked**

```tsx
"use client";
import { useState } from "react";
import type { DeckDraft } from "@/lib/deck/state";
import { renderSlide } from "@/lib/deck/slide-templates";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/deck/tokens";
import { SlideInspector } from "./SlideInspector";

type Props = { draft: DeckDraft; activeIdx: number; onUpdate: (m: (d: DeckDraft) => DeckDraft) => void };

export function SlideStage({ draft, activeIdx, onUpdate }: Props) {
  const slide = draft.slides[activeIdx];
  const [inspectorOpen, setInspectorOpen] = useState(false);
  if (!slide) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: inspectorOpen ? "1fr 360px" : "1fr", height: "100%" }}>
      <main onClick={() => setInspectorOpen(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflow: "hidden", background: "#050505", cursor: "pointer" }}>
        <div style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: "scale(min(calc((100vw - 280px - 360px - 48px) / 1920), calc((100vh - 130px) / 1080)))", transformOrigin: "center" }}>
          {renderSlide({ template: slide.template, content: slide.content } as any, { positionLabel: `${String(activeIdx + 1).padStart(2, "0")} / ${String(draft.slides.length).padStart(2, "0")}` })}
        </div>
      </main>
      {inspectorOpen ? <SlideInspector draft={draft} activeIdx={activeIdx} onUpdate={onUpdate} onClose={() => setInspectorOpen(false)} /> : null}
    </div>
  );
}
```

- [ ] **Step 3: Add a parking-lot note about deferring inline contenteditable** to `2026-04-28-deck-builder-v2-and-beyond.md`. (Append a new section: "Inline contenteditable per slide template — currently editing happens via JSON inspector. Trigger to revisit: sales reports JSON editing is friction; ~1 day per slide template for proper inline editing surfaces.")

- [ ] **Step 4: Manual verify, commit**

Click a slide → inspector opens with editable JSON. Edit JSON, blur → slide updates.

```bash
git add components/deck/builder/SlideInspector.tsx components/deck/builder/SlideStage.tsx docs/superpowers/parking-lot/
git commit -m "feat(deck): add slide inspector (JSON edit + theme), defer inline contenteditable to parking lot"
```

---

## Phase 8: Render route (`/decks/render/[id]`)

### Task 8.1: Render route — chromeless slide stack

**Files:**
- Create: `app/(deck)/render/[id]/page.tsx`
- Create: `components/deck/builder/RenderStack.tsx`

- [ ] **Step 1: Page**

```tsx
// app/(deck)/render/[id]/page.tsx
import { RenderStack } from "@/components/deck/builder/RenderStack";

export const metadata = { robots: { index: false, follow: false } };

export default async function RenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RenderStack draftId={id} />;
}
```

- [ ] **Step 2: Client renderer**

```tsx
// components/deck/builder/RenderStack.tsx
"use client";
import { useEffect, useState } from "react";
import { loadDraft, type DeckDraft } from "@/lib/deck/state";
import { DeckThemeProvider } from "@/components/deck/builder/DeckThemeContext";
import { renderSlide } from "@/lib/deck/slide-templates";

export function RenderStack({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<DeckDraft | null>(null);
  useEffect(() => { setDraft(loadDraft(draftId)); }, [draftId]);
  useEffect(() => { if (draft) document.title = `${draft.template}-${draft.prospect.name ?? "draft"}-${draft.id}`; }, [draft]);
  if (!draft) return null;
  const included = draft.slides.filter((s) => s.included);
  return (
    <DeckThemeProvider accent={draft.theme.accent} displayStyle={draft.theme.displayStyle}>
      <div data-deck-render-root style={{ background: "#0A0A0A" }}>
        {included.map((s, i) => (
          <div key={s.uid} data-deck-slide-wrap>
            {renderSlide({ template: s.template, content: s.content } as any, { positionLabel: `${String(i + 1).padStart(2, "0")} / ${String(included.length).padStart(2, "0")}` })}
          </div>
        ))}
      </div>
    </DeckThemeProvider>
  );
}
```

- [ ] **Step 3: Manual verify**

Visit `/decks/render/<id>` directly (after creating a draft) — see all included slides stacked vertically, full 1920×1080 each. Print preview (Cmd+P) shows correct page size.

- [ ] **Step 4: Commit**

```bash
git add app/\(deck\)/render/ components/deck/builder/RenderStack.tsx
git commit -m "feat(deck): add /decks/render/[id] chromeless stack (PDF/PPTX source)"
```

---

## Phase 9: Exports

### Task 9.1: Wait helpers

**Files:**
- Create: `lib/deck/exporters/wait.ts`

```ts
// lib/deck/exporters/wait.ts
export async function waitForFonts(win: Window): Promise<void> {
  // @ts-expect-error fonts is on Document
  if (win.document.fonts?.ready) await win.document.fonts.ready;
}
export async function waitForImages(doc: Document): Promise<void> {
  const imgs = Array.from(doc.images);
  await Promise.all(imgs.map((img) => img.complete ? Promise.resolve() : new Promise<void>((res) => { img.addEventListener("load", () => res(), { once: true }); img.addEventListener("error", () => res(), { once: true }); })));
}
```

Commit: `feat(deck): add waitForFonts/waitForImages helpers`

### Task 9.2: PDF exporter (window.print)

**Files:**
- Create: `lib/deck/exporters/pdf.ts`

```ts
// lib/deck/exporters/pdf.ts
import { waitForFonts, waitForImages } from "./wait";
import { deckFilename } from "../filename";
import type { DeckDraft } from "../state";

export async function exportPdf(draft: DeckDraft): Promise<void> {
  const iframe = document.getElementById("deck-render-iframe") as HTMLIFrameElement | null;
  if (!iframe?.contentWindow || !iframe.contentDocument) throw new Error("Render iframe not mounted");
  const win = iframe.contentWindow;
  await waitForFonts(win);
  await waitForImages(iframe.contentDocument);
  iframe.contentDocument.title = deckFilename({ template: draft.template, prospectName: draft.prospect.name, date: new Date(draft.createdAt) });
  win.focus();
  win.print();
}
```

Commit: `feat(deck): add PDF exporter (window.print)`

### Task 9.3: PPTX exporter (PptxGenJS + html2canvas)

**Files:**
- Create: `lib/deck/exporters/pptx.ts`

```ts
// lib/deck/exporters/pptx.ts
import PptxGenJS from "pptxgenjs";
import html2canvas from "html2canvas";
import { waitForFonts, waitForImages } from "./wait";
import { deckFilename } from "../filename";
import type { DeckDraft } from "../state";

export async function exportPptx(draft: DeckDraft, onProgress?: (cur: number, total: number) => void): Promise<void> {
  const iframe = document.getElementById("deck-render-iframe") as HTMLIFrameElement | null;
  if (!iframe?.contentWindow || !iframe.contentDocument) throw new Error("Render iframe not mounted");
  await waitForFonts(iframe.contentWindow);
  await waitForImages(iframe.contentDocument);

  const slideEls = Array.from(iframe.contentDocument.querySelectorAll<HTMLElement>("[data-deck-slide]"));
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "AC_16x9", width: 13.333, height: 7.5 });
  pptx.layout = "AC_16x9";

  for (let i = 0; i < slideEls.length; i++) {
    onProgress?.(i, slideEls.length);
    const canvas = await html2canvas(slideEls[i], { scale: 2, backgroundColor: "#0A0A0A", useCORS: true, logging: false, windowWidth: 1920, windowHeight: 1080 });
    const dataUrl = canvas.toDataURL("image/png");
    pptx.addSlide().addImage({ data: dataUrl, x: 0, y: 0, w: 13.333, h: 7.5 });
  }
  onProgress?.(slideEls.length, slideEls.length);
  await pptx.writeFile({ fileName: `${deckFilename({ template: draft.template, prospectName: draft.prospect.name, date: new Date(draft.createdAt) })}.pptx` });
}
```

Commit: `feat(deck): add PPTX exporter (PptxGenJS + html2canvas)`

### Task 9.4: Wire `DownloadButtons`

**Files:**
- Modify: `components/deck/builder/DownloadButtons.tsx`

```tsx
"use client";
import { useState } from "react";
import type { DeckDraft } from "@/lib/deck/state";
import { exportPdf } from "@/lib/deck/exporters/pdf";
import { exportPptx } from "@/lib/deck/exporters/pptx";

export function DownloadButtons({ draft }: { draft: DeckDraft }) {
  const [busy, setBusy] = useState<"pdf" | "pptx" | null>(null);
  const [progress, setProgress] = useState(0);

  async function pdf() {
    setBusy("pdf");
    try { await exportPdf(draft); } finally { setBusy(null); }
  }
  async function pptx() {
    setBusy("pptx"); setProgress(0);
    try { await exportPptx(draft, (cur, total) => setProgress(Math.round((cur / total) * 100))); }
    finally { setBusy(null); setProgress(0); }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={pdf} disabled={busy !== null} style={primary}>{busy === "pdf" ? "Opening…" : "PDF"}</button>
      <button onClick={pptx} disabled={busy !== null} style={ghost}>{busy === "pptx" ? `PPTX ${progress}%` : "PPTX"}</button>
    </div>
  );
}

const primary: React.CSSProperties = { padding: "8px 16px", background: "var(--deck-accent)", color: "#000", border: "none", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
const ghost: React.CSSProperties = { padding: "8px 16px", background: "var(--deck-surface)", color: "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
```

- [ ] **Step 2: Manual verify** — generate a deck, click PDF (print dialog opens with correct page size + filename), click PPTX (downloads .pptx with image-based slides).

Commit: `feat(deck): wire PDF/PPTX download buttons`

---

## Phase 10: Gallery + thumbnails

### Task 10.1: Replace placeholder `/decks` with template gallery

**Files:**
- Modify: `app/(deck)/page.tsx`

```tsx
import Link from "next/link";
import { DECK_TEMPLATE_LIST } from "@/lib/deck/templates";

export default function DecksGalleryPage() {
  return (
    <main style={{ padding: 80, maxWidth: 1280, marginInline: "auto" }}>
      <h1 style={{ fontFamily: "var(--deck-display-family)", fontStyle: "var(--deck-display-style)", fontWeight: "var(--deck-display-weight)" as unknown as number, fontSize: 96, lineHeight: 1, letterSpacing: "-0.025em", margin: "0 0 16px" }}>
        Decks.
      </h1>
      <p style={{ color: "var(--deck-text-muted)", fontSize: 18, marginBottom: 64, maxWidth: 720 }}>
        Pick a template, fill in a prospect, download as PDF or PPTX.{" "}
        <span style={{ display: "inline-block", marginLeft: 8, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Drafts live in this browser only — download to keep them.
        </span>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
        {DECK_TEMPLATE_LIST.map((t) => (
          <Link key={t.id} href={`/decks/new/${t.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <article style={{ background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, overflow: "hidden", aspectRatio: "16/12", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, background: "#000", backgroundImage: `url(${t.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 20, color: "var(--deck-text-primary)" }}>{t.name}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--deck-text-muted)" }}>{t.description}</p>
                </div>
                <span style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-accent)" }}>{t.slides.length} ›</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Add placeholder thumbnails** at `public/decks/thumbs/` — for v1, generate by manually screenshotting the first slide of each rendered deck. (Or use solid-color placeholders for now and replace later.)

```bash
mkdir -p /Users/jeberulz/Documents/AI-projects/autocrew-marketing/public/decks/thumbs
# create simple placeholder PNGs OR commit empty .gitkeep then update later
```

- [ ] **Step 3: Commit**

```bash
git add app/\(deck\)/page.tsx public/decks/
git commit -m "feat(deck): add /decks gallery (4 deck-template cards)"
```

---

## Phase 11: Polish + verification

### Task 11.1: Reset button + confirm modal

**Files:** Modify `components/deck/builder/EditorShell.tsx` to add a Reset button next to Download buttons. Calls `newDraftFromTemplate` with current prospect/theme, replaces slides, saves.

Commit: `feat(deck): add Reset (reload template defaults, preserve prospect+theme)`

### Task 11.2: Top-level error boundary on `/decks/preview/[id]`

**Files:** Create `app/(deck)/preview/[id]/error.tsx`:

```tsx
"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: 80 }}>
      <h1 style={{ fontFamily: "var(--deck-display-family)", fontStyle: "italic", fontSize: 48, color: "#fff" }}>Something went wrong.</h1>
      <button onClick={reset} style={{ marginTop: 24, padding: "12px 24px", background: "var(--deck-accent)", color: "#000", border: "none", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>Try again</button>
    </main>
  );
}
```

Commit: `feat(deck): add error boundary on editor route`

### Task 11.3: ESLint convention check

**Files:** Modify `eslint.config.mjs` to add a `no-restricted-imports` rule for `components/deck/**`:

```js
// inside the existing config — add an override rule for components/deck/**:
{
  files: ["components/deck/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": ["error", { patterns: ["**/components/landing/**", "**/components/layout/**"] }],
  },
},
```

- [ ] Verify: `npm run lint` passes; importing landing into deck fails as expected.

Commit: `chore(deck): enforce isolation via eslint no-restricted-imports`

### Task 11.4: Final manual end-to-end QA

- [ ] **Step 1: full-flow smoke test**
  1. Log out (clear `decks_auth` cookie in DevTools).
  2. Visit `/decks` → redirect to `/decks/__login`.
  3. Wrong password → "Access denied".
  4. Right password → land on gallery.
  5. Click "Widget Pitch" → wizard.
  6. Fill: name "Acme Corp", industry "SaaS", accent green, display serif-italic, logo upload.
  7. Generate → editor opens with 15 slides.
  8. Click slide 4 → inspector opens with JSON.
  9. Edit text in JSON, blur → slide updates.
  10. Reorder slides via drag.
  11. Toggle slide 6 to ▢ excluded.
  12. Click PDF → print dialog opens, save as PDF, verify all included slides present at 1920×1080 vector.
  13. Click PPTX → progress 0%→100%, download, open in PowerPoint or Keynote, verify pixel-identical to PDF.
  14. Refresh editor URL → draft restored.
  15. Open editor URL in new tab → "open in another tab" banner appears.
  16. Open editor URL on different machine → "Draft not found" page.

- [ ] **Step 2: Run all checks**

```bash
npm run typecheck
npm run lint
npx vitest run
npm run build
```

All must PASS.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore(deck): final QA pass + lint clean"
```

---

## Phase 12: Pre-merge

### Task 12.1: Update CLAUDE.md with deck builder section

**Files:** Modify `CLAUDE.md` (project) — add a `## Sales Deck Builder` section noting:
- Lives at `/decks`, gated by `DECKS_PASSWORD`
- Code in `app/(deck)/`, `components/deck/`, `lib/deck/`
- Marketing site is untouched
- See spec: `docs/superpowers/specs/2026-04-28-sales-deck-builder-design.md`
- See plan: `docs/superpowers/plans/2026-04-28-sales-deck-builder.md` + `-part2.md`

Commit: `docs: add sales deck builder section to CLAUDE.md`

### Task 12.2: Open PR

Run:

```bash
git push -u origin feat/sales-deck-builder
gh pr create --title "Sales deck builder (v1)" --body "$(cat <<'EOF'
## Summary
- Adds password-gated deck builder at /decks for the AutoCrew sales team
- 13 slide templates + 4 deck templates (Widget Pitch, Healthcare, Restaurant, Blank)
- Browser-local Workflow A: ephemeral drafts in localStorage, no DB
- Client-side exports: PDF via window.print(), PPTX via PptxGenJS + html2canvas
- Marketing site is untouched (isolated route group, scoped CSS, ESLint enforced)

## Spec
docs/superpowers/specs/2026-04-28-sales-deck-builder-design.md

## Plan
docs/superpowers/plans/2026-04-28-sales-deck-builder.md (+ -part2.md)

## Test plan
- [ ] Set DECKS_PASSWORD + DECKS_AUTH_SECRET in Vercel env
- [ ] Log in at /decks/__login
- [ ] Build a Widget Pitch deck for "Acme Corp"
- [ ] Download as PDF; verify vector text + 1920×1080 pages
- [ ] Download as PPTX; open in PowerPoint, verify pixel-identical
EOF
)"
```

Commit not needed (PR creation is the artifact).

---

## Spec coverage check (self-review)

Walked through `2026-04-28-sales-deck-builder-design.md`:

| Spec section | Covered by |
|---|---|
| 1. Goal & constraints | Phase 0–11 (entire plan) |
| 2. Architecture (route group, isolation, fonts) | Tasks 1.1, 1.2, 11.3 |
| 2. Access gate (middleware + auth route + login) | Tasks 1.3, 1.4 |
| 3. Slide kit (13 templates, design tokens, primitives, deck templates) | Tasks 2.1–2.8, 3.1–3.10, 4.1–4.3 |
| 4. Wizard form | Tasks 6.1, 6.2 |
| 4. Editor (rail, stage, inspector, hybrid editing) | Tasks 7.1, 7.2, 7.3 (note: inline contenteditable parked; JSON inspector ships) |
| 4. Render route (chromeless) | Task 8.1 |
| 5. Exports (PDF, PPTX) | Tasks 9.1–9.4 |
| 6. Personalization (variables) | Task 5.3 |
| 6. State (DeckDraft, localStorage, edge cases) | Tasks 5.1, 5.2, 5.4, 5.5, 5.6 |
| 7. Out of scope | Already in parking-lot docs (referenced) |
| 8. Known risks | X-Frame-Options addressed (1.2); html2canvas constraints respected in primitives |
| 9. Phasing | 11 phases here track the spec's 11 phases |
| 10. Approval | n/a — implementation artifact |

**Gap noted and resolved inline:** the spec claimed inline contenteditable on text fields. The plan implements **JSON inspector** as the v1 editing surface and adds inline contenteditable to the parking-lot doc with a clear trigger. This is a deliberate scope reduction; it's documented in Task 7.3 Step 3.

**Type consistency check:** `DeckDraft`, `SlideContent`, `AccentToken`, `DisplayStyle`, `DeckTemplateId`, `SlideTemplateId` are defined once and imported everywhere. `slide.content` is typed via the discriminated union; the slide registry's `renderSlide` helper does a controlled `as any` cast at the boundary.

**Placeholder scan:** no "TBD", "TODO", "implement later", "fill in details", "similar to Task N", or "add appropriate error handling" remain.

---

## Execution Handoff

**Plan complete and saved to:**
- `docs/superpowers/plans/2026-04-28-sales-deck-builder.md` (Phases 0–4)
- `docs/superpowers/plans/2026-04-28-sales-deck-builder-part2.md` (Phases 5–12)

**Two execution options:**

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.

2. **Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
