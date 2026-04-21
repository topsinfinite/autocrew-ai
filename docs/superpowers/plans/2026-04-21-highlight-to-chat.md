# Highlight-to-Chat (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a marketing-site prototype of the Contextual AI highlight-to-chat interaction, mounted under `app/(public)/layout.tsx`, with a stubbed widget adapter so dogfood is unblocked before the widget team exposes `window.AutoCrew.prefillWithContext`.

**Architecture:** Strict module boundaries — pure `lib/contextual-ai/` modules (flags, context, adapter, events) are React-free and unit-tested; `components/contextual-ai/` owns the React surface (provider + popover + hook). The adapter is resolved at click-time so the external `widget.js` (loaded `afterInteractive`) can arrive late. Popover is portaled to `document.body` with `z-50` (below `PhoneCallFab` z-80 and `CookieBanner` z-90).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, TypeScript strict, vitest + jsdom (added in Task 0), lucide-react icons (already in repo).

**Spec:** `docs/superpowers/specs/2026-04-21-highlight-to-chat-design.md`

---

## File structure

**Created**
```
lib/contextual-ai/
├── adapter.ts              # ContextualAIAdapter, resolveAdapter, stubAdapter
├── context.ts              # buildContext, inferSectionLabel
├── events.ts               # track() + ContextualAIEvent types
├── flags.ts                # isEnabled(), hasAnalyticsConsent()
├── types.ts                # EnrichedContext, shared types
├── index.ts                # re-exports
└── __tests__/
    ├── flags.test.ts
    ├── context.test.ts
    └── adapter.test.ts

components/contextual-ai/
├── contextual-ai-provider.tsx    # 'use client'; mount point, owns state
├── selection-popover.tsx         # 'use client'; portaled, positioned popover
├── stub-debug-card.tsx           # 'use client'; dev-only payload viewer
├── use-text-selection.ts         # 'use client'; selection hook
└── index.ts

vitest.config.ts                   # jsdom env for __tests__
```

**Modified**

| File | Change |
|---|---|
| `package.json` | Add `vitest`, `jsdom`, `@vitest/ui` devDeps; add `test` script |
| `app/(public)/layout.tsx` | Wrap children with `<ContextualAIProvider>` |
| `components/layout/phone-call-fab.tsx` | Add `data-contextual-ai="off"` to root wrapper |
| `components/consent/cookie-banner.tsx` | Add `data-contextual-ai="off"` to banner root |
| `components/consent/cookie-preferences-dialog.tsx` | Add `data-contextual-ai="off"` to `DialogContent` |
| `.env.example` | Document `NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED`, `NEXT_PUBLIC_CONTEXTUAL_AI_STUB` |
| `CLAUDE.md` | Add "Contextual AI" section documenting the flags and dogfood flow |

---

## Task 0: Add vitest + jsdom

The repo has no test runner. The spec requires jsdom unit tests for pure modules.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install vitest + jsdom**

Run:
```bash
npm install --save-dev vitest@^2.1.0 jsdom@^25.0.0
```

Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add `test` script to package.json**

Modify `package.json` scripts section to add a test script right after `validate`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "typecheck": "tsc --noEmit",
  "format": "npx prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
  "format:check": "npx prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
  "validate": "npm run typecheck && npm run lint && npm run format:check",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create `vitest.config.ts` at repo root:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

- [ ] **Step 4: Verify vitest is installed and runs**

Run: `npm test -- --run --reporter=verbose`
Expected: exits 0 with "No test files found" or similar — confirms vitest discovers nothing yet but is wired.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore(test): add vitest + jsdom for contextual-ai unit tests"
```

---

## Task 1: `lib/contextual-ai/types.ts` — shared types

**Files:**
- Create: `lib/contextual-ai/types.ts`

- [ ] **Step 1: Create the types module**

Create `lib/contextual-ai/types.ts`:

```ts
export interface EnrichedContext {
  /** Exact highlighted text, capped at 1000 chars by the hook. */
  selection: string;
  /** Nearest block-level ancestor's text, whitespace-collapsed, <= 500 chars. */
  surrounding?: string;
  /** Label for the section containing the selection, <= 80 chars. */
  sectionLabel?: string;
  /** location.pathname — no search, no hash. */
  url: string;
}

export interface ContextualAIAdapter {
  prefillWithContext(ctx: EnrichedContext): Promise<void> | void;
}

export type ContextualAIEvent =
  | {
      name: "contextual_ai_selection";
      chars: number;
      sectionLabel?: string;
      path: string;
    }
  | {
      name: "contextual_ai_open";
      chars: number;
      sectionLabel?: string;
      path: string;
      hasSurrounding: boolean;
    }
  | {
      name: "contextual_ai_dismissed";
      reason: "click_away" | "escape" | "scroll" | "resize" | "route_change";
    }
  | { name: "contextual_ai_adapter_missing"; path: string };
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/contextual-ai/types.ts
git commit -m "feat(contextual-ai): add shared type definitions"
```

---

## Task 2: `lib/contextual-ai/flags.ts` — feature flag resolution

**Files:**
- Create: `lib/contextual-ai/flags.ts`
- Create: `lib/contextual-ai/__tests__/flags.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/contextual-ai/__tests__/flags.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { isEnabled, hasAnalyticsConsent } from "../flags";

describe("isEnabled", () => {
  const originalEnv = process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED;

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/");
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = originalEnv;
  });

  it("returns true when env flag is unset (default on)", () => {
    delete process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED;
    expect(isEnabled()).toBe(true);
  });

  it("returns true when env flag is 'true'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "true";
    expect(isEnabled()).toBe(true);
  });

  it("returns false when env flag is 'false'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "false";
    expect(isEnabled()).toBe(false);
  });

  it("URL ?contextual-ai=off overrides env=true", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "true";
    window.history.replaceState({}, "", "/?contextual-ai=off");
    expect(isEnabled()).toBe(false);
  });

  it("URL ?contextual-ai=on overrides env=false", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "false";
    window.history.replaceState({}, "", "/?contextual-ai=on");
    expect(isEnabled()).toBe(true);
  });

  it("localStorage 'contextual-ai:disabled' overrides env=true", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "true";
    localStorage.setItem("contextual-ai:disabled", "1");
    expect(isEnabled()).toBe(false);
  });

  it("URL override beats localStorage", () => {
    localStorage.setItem("contextual-ai:disabled", "1");
    window.history.replaceState({}, "", "/?contextual-ai=on");
    expect(isEnabled()).toBe(true);
  });
});

describe("hasAnalyticsConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns false when no consent stored", () => {
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns false when consent JSON is malformed", () => {
    localStorage.setItem("cookie-consent", "not json");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns false when analytics is denied", () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, analytics: false, preferences: false, marketing: false }),
    );
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns true when analytics is granted", () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, analytics: true, preferences: false, marketing: false }),
    );
    expect(hasAnalyticsConsent()).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to see it fail**

Run: `npm test -- --run lib/contextual-ai/__tests__/flags.test.ts`
Expected: FAIL — cannot find module `../flags`.

- [ ] **Step 3: Implement `flags.ts`**

Create `lib/contextual-ai/flags.ts`:

```ts
const URL_PARAM = "contextual-ai";
const LOCAL_STORAGE_KEY = "contextual-ai:disabled";
const CONSENT_STORAGE_KEY = "cookie-consent";

export function isEnabled(): boolean {
  if (typeof window === "undefined") return false;

  // URL override has highest priority.
  const params = new URLSearchParams(window.location.search);
  const override = params.get(URL_PARAM);
  if (override === "on") return true;
  if (override === "off") return false;

  // localStorage per-visitor opt-out.
  try {
    if (window.localStorage.getItem(LOCAL_STORAGE_KEY) === "1") return false;
  } catch {
    // localStorage can throw in private browsing on some browsers.
  }

  // Build-time env flag. Default on when unset.
  const envFlag = process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED;
  if (envFlag === "false") return false;
  return true;
}

export function isStubEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB === "true";
}

interface StoredConsent {
  essential?: boolean;
  analytics?: boolean;
  preferences?: boolean;
  marketing?: boolean;
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const parsed: StoredConsent = JSON.parse(raw);
    return parsed.analytics === true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run the tests, confirm pass**

Run: `npm test -- --run lib/contextual-ai/__tests__/flags.test.ts`
Expected: all 11 tests pass.

- [ ] **Step 5: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/contextual-ai/flags.ts lib/contextual-ai/__tests__/flags.test.ts
git commit -m "feat(contextual-ai): add feature flag + consent helpers"
```

---

## Task 3: `lib/contextual-ai/context.ts` — DOM walk + section inference

**Files:**
- Create: `lib/contextual-ai/context.ts`
- Create: `lib/contextual-ai/__tests__/context.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/contextual-ai/__tests__/context.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { buildContext, inferSectionLabel } from "../context";

function selectTextIn(el: HTMLElement, text: string): Range {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const content = node.textContent ?? "";
    const idx = content.indexOf(text);
    if (idx >= 0) {
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + text.length);
      return range;
    }
  }
  throw new Error(`Text "${text}" not found in element`);
}

describe("buildContext", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.history.replaceState({}, "", "/pricing?utm=abc#plans");
  });

  it("captures surrounding paragraph text for a <p> ancestor", () => {
    document.body.innerHTML = `
      <section>
        <h2>Pricing</h2>
        <p>Professional is $99 per month with HIPAA compliance.</p>
      </section>
    `;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "HIPAA compliance");
    const ctx = buildContext(range, "HIPAA compliance");
    expect(ctx.selection).toBe("HIPAA compliance");
    expect(ctx.surrounding).toBe("Professional is $99 per month with HIPAA compliance.");
    expect(ctx.sectionLabel).toBe("Pricing");
    expect(ctx.url).toBe("/pricing"); // search and hash stripped
  });

  it("caps surrounding text at 500 chars", () => {
    const longText = "a".repeat(700);
    document.body.innerHTML = `<section><h1>H</h1><p>${longText}</p></section>`;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "a".repeat(20));
    const ctx = buildContext(range, "a".repeat(20));
    expect(ctx.surrounding?.length).toBe(500);
  });

  it("collapses whitespace in surrounding text", () => {
    document.body.innerHTML = `<section><h1>H</h1><p>foo   bar\n\tbaz qux</p></section>`;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "bar");
    const ctx = buildContext(range, "bar");
    expect(ctx.surrounding).toBe("foo bar baz qux");
  });

  it("handles selection with no block ancestor by leaving surrounding undefined", () => {
    document.body.innerHTML = `<div><span>raw text with enough chars here</span></div>`;
    const span = document.querySelector("span")!;
    const range = selectTextIn(span, "raw text");
    const ctx = buildContext(range, "raw text");
    expect(ctx.surrounding).toBeUndefined();
    expect(ctx.sectionLabel).toBeUndefined();
  });

  it("respects [data-section] as a boundary and label source", () => {
    document.body.innerHTML = `
      <div data-section="Hero">
        <h1>Marketing headline</h1>
        <p>A compelling claim about conversion.</p>
      </div>
    `;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "compelling claim");
    const ctx = buildContext(range, "compelling claim");
    expect(ctx.sectionLabel).toBe("Hero");
  });

  it("falls back to heading text when no [data-section]", () => {
    document.body.innerHTML = `
      <section>
        <h2>Our features</h2>
        <p>Self-serve onboarding reduces support tickets.</p>
      </section>
    `;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "Self-serve");
    const ctx = buildContext(range, "Self-serve");
    expect(ctx.sectionLabel).toBe("Our features");
  });

  it("url strips search and hash", () => {
    window.history.replaceState({}, "", "/about?ref=linkedin#team");
    document.body.innerHTML = `<section><h1>H</h1><p>hello world text here</p></section>`;
    const range = selectTextIn(document.querySelector("p")!, "hello world");
    const ctx = buildContext(range, "hello world");
    expect(ctx.url).toBe("/about");
  });
});

describe("inferSectionLabel", () => {
  it("returns undefined for null boundary", () => {
    expect(inferSectionLabel(null)).toBeUndefined();
  });

  it("prefers explicit data-section over heading", () => {
    const el = document.createElement("section");
    el.setAttribute("data-section", "Explicit");
    el.innerHTML = `<h1>Heading</h1>`;
    expect(inferSectionLabel(el)).toBe("Explicit");
  });

  it("falls back to first h1/h2/h3 text", () => {
    const el = document.createElement("section");
    el.innerHTML = `<h3>Third heading wins</h3>`;
    expect(inferSectionLabel(el)).toBe("Third heading wins");
  });

  it("truncates heading text at 80 chars", () => {
    const el = document.createElement("section");
    el.innerHTML = `<h1>${"x".repeat(120)}</h1>`;
    expect(inferSectionLabel(el)?.length).toBe(80);
  });

  it("falls back to aria-label, then id", () => {
    const withAria = document.createElement("section");
    withAria.setAttribute("aria-label", "Pricing region");
    expect(inferSectionLabel(withAria)).toBe("Pricing region");

    const withId = document.createElement("section");
    withId.id = "faq";
    expect(inferSectionLabel(withId)).toBe("faq");
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npm test -- --run lib/contextual-ai/__tests__/context.test.ts`
Expected: FAIL — cannot find module `../context`.

- [ ] **Step 3: Implement `context.ts`**

Create `lib/contextual-ai/context.ts`:

```ts
import type { EnrichedContext } from "./types";

const BLOCK_TAGS = new Set([
  "P",
  "LI",
  "BLOCKQUOTE",
  "FIGCAPTION",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
]);
const BOUNDARY_TAGS = new Set(["SECTION", "ARTICLE", "MAIN", "FOOTER"]);

export const SURROUNDING_CAP = 500;
export const SECTION_LABEL_CAP = 80;

export function buildContext(range: Range, selection: string): EnrichedContext {
  const start = range.commonAncestorContainer;
  let node: HTMLElement | null =
    start.nodeType === Node.TEXT_NODE
      ? (start.parentElement as HTMLElement | null)
      : (start as HTMLElement);

  let nearestBlock: HTMLElement | null = null;
  let boundary: HTMLElement | null = null;

  while (node && node !== document.body) {
    if (
      !nearestBlock &&
      (BLOCK_TAGS.has(node.tagName) || node.hasAttribute("data-block"))
    ) {
      nearestBlock = node;
    }
    if (BOUNDARY_TAGS.has(node.tagName) || node.hasAttribute("data-section")) {
      boundary = node;
      break;
    }
    node = node.parentElement;
  }

  const raw = nearestBlock?.textContent ?? "";
  const surrounding = raw.replace(/\s+/g, " ").trim().slice(0, SURROUNDING_CAP);

  return {
    selection,
    surrounding: surrounding ? surrounding : undefined,
    sectionLabel: inferSectionLabel(boundary),
    url: window.location.pathname,
  };
}

export function inferSectionLabel(
  boundary: HTMLElement | null,
): string | undefined {
  if (!boundary) return undefined;

  const explicit = boundary.getAttribute("data-section");
  if (explicit) return explicit;

  const heading = boundary.querySelector("h1, h2, h3");
  if (heading?.textContent) {
    return heading.textContent
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, SECTION_LABEL_CAP);
  }

  return boundary.getAttribute("aria-label") ?? boundary.id ?? undefined;
}
```

- [ ] **Step 4: Run the tests, confirm pass**

Run: `npm test -- --run lib/contextual-ai/__tests__/context.test.ts`
Expected: all tests pass.

- [ ] **Step 5: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/contextual-ai/context.ts lib/contextual-ai/__tests__/context.test.ts
git commit -m "feat(contextual-ai): add context enrichment (DOM walk + section label)"
```

---

## Task 4: `lib/contextual-ai/adapter.ts` — adapter resolution + stub

**Files:**
- Create: `lib/contextual-ai/adapter.ts`
- Create: `lib/contextual-ai/__tests__/adapter.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/contextual-ai/__tests__/adapter.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { resolveAdapter, stubAdapter } from "../adapter";

declare global {
  // eslint-disable-next-line no-var
  var AutoCrew: unknown;
}

describe("resolveAdapter", () => {
  const originalStub = process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB;

  beforeEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = originalStub;
  });

  afterEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
  });

  it("returns an adapter routing to window.AutoCrew.prefillWithContext when present", async () => {
    const spy = vi.fn();
    (window as unknown as { AutoCrew: unknown }).AutoCrew = {
      prefillWithContext: spy,
    };

    const adapter = resolveAdapter();
    expect(adapter).not.toBeNull();

    await adapter!.prefillWithContext({
      selection: "hi",
      url: "/",
    });
    expect(spy).toHaveBeenCalledWith({ selection: "hi", url: "/" });
  });

  it("returns stubAdapter when real API missing and stub flag is 'true'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = "true";
    const adapter = resolveAdapter();
    expect(adapter).toBe(stubAdapter);
  });

  it("returns null when API missing and stub flag not 'true'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = "false";
    expect(resolveAdapter()).toBeNull();

    delete process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB;
    expect(resolveAdapter()).toBeNull();
  });

  it("returns null when AutoCrew exists but prefillWithContext is not a function", () => {
    (window as unknown as { AutoCrew: unknown }).AutoCrew = {
      prefillWithContext: "nope",
    };
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = undefined;
    expect(resolveAdapter()).toBeNull();
  });
});

describe("stubAdapter", () => {
  it("dispatches a CustomEvent with the payload", () => {
    const listener = vi.fn();
    document.addEventListener("contextual_ai_stub", listener as EventListener);
    stubAdapter.prefillWithContext({ selection: "hello", url: "/test" });
    expect(listener).toHaveBeenCalledTimes(1);
    const ev = listener.mock.calls[0][0] as CustomEvent;
    expect(ev.detail).toEqual({ selection: "hello", url: "/test" });
    document.removeEventListener("contextual_ai_stub", listener as EventListener);
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npm test -- --run lib/contextual-ai/__tests__/adapter.test.ts`
Expected: FAIL — cannot find module `../adapter`.

- [ ] **Step 3: Implement `adapter.ts`**

Create `lib/contextual-ai/adapter.ts`:

```ts
import type { ContextualAIAdapter, EnrichedContext } from "./types";

interface AutoCrewGlobal {
  prefillWithContext?: (ctx: EnrichedContext) => void | Promise<void>;
}

export const stubAdapter: ContextualAIAdapter = {
  prefillWithContext(ctx: EnrichedContext) {
    document.dispatchEvent(
      new CustomEvent("contextual_ai_stub", { detail: ctx }),
    );
    // eslint-disable-next-line no-console
    console.info("[contextual-ai:stub]", ctx);
  },
};

export function resolveAdapter(): ContextualAIAdapter | null {
  if (typeof window === "undefined") return null;

  const api = (window as unknown as { AutoCrew?: AutoCrewGlobal }).AutoCrew;
  if (api && typeof api.prefillWithContext === "function") {
    return {
      prefillWithContext: (ctx) => api.prefillWithContext!(ctx),
    };
  }

  if (process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB === "true") {
    return stubAdapter;
  }

  return null;
}
```

- [ ] **Step 4: Run the tests, confirm pass**

Run: `npm test -- --run lib/contextual-ai/__tests__/adapter.test.ts`
Expected: all tests pass.

- [ ] **Step 5: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/contextual-ai/adapter.ts lib/contextual-ai/__tests__/adapter.test.ts
git commit -m "feat(contextual-ai): add adapter resolution + stub adapter"
```

---

## Task 5: `lib/contextual-ai/events.ts` — analytics emission

**Files:**
- Create: `lib/contextual-ai/events.ts`

This module is thin glue around `gtag` + `dispatchEvent`. We rely on the consent test from Task 2 and cover `track` via integration in the provider. No dedicated unit test.

- [ ] **Step 1: Implement `events.ts`**

Create `lib/contextual-ai/events.ts`:

```ts
import type { ContextualAIEvent } from "./types";
import { hasAnalyticsConsent } from "./flags";

interface GtagGlobal {
  (command: "event", eventName: string, params: Record<string, unknown>): void;
}

export function track(event: ContextualAIEvent): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  document.dispatchEvent(
    new CustomEvent("contextual_ai", { detail: event }),
  );

  const gtag = (window as unknown as { gtag?: GtagGlobal }).gtag;
  if (typeof gtag === "function" && hasAnalyticsConsent()) {
    const { name, ...params } = event;
    gtag("event", name, params);
  }
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/contextual-ai/events.ts
git commit -m "feat(contextual-ai): add analytics tracking (gtag + CustomEvent)"
```

---

## Task 6: `lib/contextual-ai/index.ts` — barrel re-exports

**Files:**
- Create: `lib/contextual-ai/index.ts`

- [ ] **Step 1: Implement `index.ts`**

Create `lib/contextual-ai/index.ts`:

```ts
export { buildContext, inferSectionLabel, SURROUNDING_CAP } from "./context";
export { resolveAdapter, stubAdapter } from "./adapter";
export { isEnabled, isStubEnabled, hasAnalyticsConsent } from "./flags";
export { track } from "./events";
export type {
  ContextualAIAdapter,
  ContextualAIEvent,
  EnrichedContext,
} from "./types";
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/contextual-ai/index.ts
git commit -m "feat(contextual-ai): export barrel for lib modules"
```

---

## Task 7: `components/contextual-ai/use-text-selection.ts` — selection hook

**Files:**
- Create: `components/contextual-ai/use-text-selection.ts`

The hook reads `window.getSelection()`, filters exclusions, debounces, and returns `{ selection, rect, range } | null`. Unit-testing a hook that depends on mouse events is brittle; we verify behavior via manual QA in Task 13 and integration via the provider.

- [ ] **Step 1: Implement `use-text-selection.ts`**

Create `components/contextual-ai/use-text-selection.ts`:

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export const MIN_CHARS = 15;
export const MAX_SELECTION_CHARS = 1000;
export const DEBOUNCE_MS = 250;

const EXCLUDED_SELECTORS = [
  "input",
  "textarea",
  '[contenteditable=""]',
  '[contenteditable="true"]',
  "button",
  "a",
  "nav",
  "code",
  "pre",
  '[role="button"]',
  '[data-contextual-ai="off"]',
];

export interface ActiveSelection {
  text: string;
  rect: DOMRect;
  range: Range;
}

function isTouchPrimary(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

function isExcluded(node: Node | null): boolean {
  let el: HTMLElement | null =
    node && node.nodeType === Node.TEXT_NODE
      ? (node.parentElement as HTMLElement | null)
      : (node as HTMLElement | null);
  while (el && el !== document.body) {
    for (const sel of EXCLUDED_SELECTORS) {
      if (el.matches(sel)) return true;
    }
    el = el.parentElement;
  }
  return false;
}

export function useTextSelection(enabled: boolean): ActiveSelection | null {
  const [active, setActive] = useState<ActiveSelection | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (isTouchPrimary()) return;

    const handle = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
          setActive(null);
          return;
        }

        const raw = sel.toString();
        const trimmed = raw.trim();
        if (trimmed.length < MIN_CHARS) {
          setActive(null);
          return;
        }

        const range = sel.getRangeAt(0);
        if (isExcluded(range.commonAncestorContainer)) {
          setActive(null);
          return;
        }

        const text =
          raw.length > MAX_SELECTION_CHARS
            ? raw.slice(0, MAX_SELECTION_CHARS)
            : raw;
        const rect = range.getBoundingClientRect();
        setActive({ text, rect, range });
      }, DEBOUNCE_MS);
    };

    const clearOnScroll = () => setActive(null);

    document.addEventListener("mouseup", handle);
    document.addEventListener("selectionchange", handle);
    document.addEventListener("keyup", handle);
    window.addEventListener("scroll", clearOnScroll, { passive: true });
    window.addEventListener("resize", clearOnScroll);

    return () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
      }
      document.removeEventListener("mouseup", handle);
      document.removeEventListener("selectionchange", handle);
      document.removeEventListener("keyup", handle);
      window.removeEventListener("scroll", clearOnScroll);
      window.removeEventListener("resize", clearOnScroll);
    };
  }, [enabled]);

  return active;
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/contextual-ai/use-text-selection.ts
git commit -m "feat(contextual-ai): add text-selection hook with exclusion + debounce"
```

---

## Task 8: `components/contextual-ai/selection-popover.tsx` — popover UI

**Files:**
- Create: `components/contextual-ai/selection-popover.tsx`

- [ ] **Step 1: Implement the popover**

Create `components/contextual-ai/selection-popover.tsx`:

```tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionPopoverProps {
  rect: DOMRect;
  onClick: () => void;
  onDismiss: () => void;
}

const POPOVER_HEIGHT_PX = 36;
const GAP_PX = 8;
const EDGE_PADDING_PX = 8;
const FLIP_THRESHOLD_PX = 48;

export function SelectionPopover({
  rect,
  onClick,
  onDismiss,
}: SelectionPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const popoverWidth = el.offsetWidth;
    const viewportWidth = window.innerWidth;

    // Vertical: above by default; flip below if too close to top.
    const top =
      rect.top < FLIP_THRESHOLD_PX
        ? rect.bottom + GAP_PX
        : rect.top - POPOVER_HEIGHT_PX - GAP_PX;

    // Horizontal: center over selection, clamp to viewport.
    const centeredLeft = rect.left + rect.width / 2 - popoverWidth / 2;
    const left = Math.max(
      EDGE_PADDING_PX,
      Math.min(centeredLeft, viewportWidth - popoverWidth - EDGE_PADDING_PX),
    );

    setPosition({ top, left });
  }, [rect]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.getSelection()?.removeAllRanges();
        onDismiss();
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onDismiss]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label="Ask Sarah about selected text"
      data-contextual-ai="off"
      className={cn(
        "fixed z-50 flex items-center gap-1.5 rounded-full border border-border",
        "bg-card/95 backdrop-blur px-3 py-1.5 shadow-lg",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-150",
      )}
      style={{ top: position.top, left: position.left }}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full",
        )}
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
        <span>Ask Sarah</span>
        <ArrowRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </button>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/contextual-ai/selection-popover.tsx
git commit -m "feat(contextual-ai): add portal-based selection popover"
```

---

## Task 9: `components/contextual-ai/stub-debug-card.tsx` — dev payload viewer

**Files:**
- Create: `components/contextual-ai/stub-debug-card.tsx`

- [ ] **Step 1: Implement the debug card**

Create `components/contextual-ai/stub-debug-card.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnrichedContext } from "@/lib/contextual-ai";

interface StubDebugCardProps {
  payload: EnrichedContext;
  onClose: () => void;
}

export function StubDebugCard({ payload, onClose }: StubDebugCardProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard unavailable; silent fail in dev tool.
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      data-contextual-ai="off"
      className={cn(
        "fixed bottom-4 right-4 z-[85] w-[360px] max-w-[calc(100vw-2rem)]",
        "rounded-xl border border-primary/40 bg-card/95 backdrop-blur-xl p-4 shadow-xl",
        "motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:fade-in motion-safe:duration-200",
      )}
      role="dialog"
      aria-label="Contextual AI stub debug card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-space-mono uppercase tracking-wider text-primary">
            Contextual AI — stub mode
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This is what the widget would receive.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copy}
            aria-label="Copy payload"
            className="rounded p-1 hover:bg-muted"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 hover:bg-muted"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <dl className="mt-3 space-y-2 text-xs">
        <Field label="Selection" value={payload.selection} />
        {payload.sectionLabel && (
          <Field label="Section" value={payload.sectionLabel} />
        )}
        <Field label="URL" value={payload.url} />
        {payload.surrounding && (
          <Field label="Surrounding" value={payload.surrounding} collapsed />
        )}
      </dl>
    </div>,
    document.body,
  );
}

function Field({
  label,
  value,
  collapsed = false,
}: {
  label: string;
  value: string;
  collapsed?: boolean;
}) {
  return (
    <div>
      <dt className="font-space-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-0.5 font-geist text-foreground",
          collapsed && "line-clamp-3",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/contextual-ai/stub-debug-card.tsx
git commit -m "feat(contextual-ai): add stub debug card for dogfood mode"
```

---

## Task 10: `components/contextual-ai/contextual-ai-provider.tsx` — mount + orchestration

**Files:**
- Create: `components/contextual-ai/contextual-ai-provider.tsx`
- Create: `components/contextual-ai/index.ts`

- [ ] **Step 1: Implement the provider**

Create `components/contextual-ai/contextual-ai-provider.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  buildContext,
  isEnabled,
  isStubEnabled,
  resolveAdapter,
  track,
  type EnrichedContext,
} from "@/lib/contextual-ai";
import { useTextSelection } from "./use-text-selection";

const SelectionPopover = dynamic(
  () => import("./selection-popover").then((m) => m.SelectionPopover),
  { ssr: false },
);

const StubDebugCard = dynamic(
  () => import("./stub-debug-card").then((m) => m.StubDebugCard),
  { ssr: false },
);

export function ContextualAIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [stubPayload, setStubPayload] = useState<EnrichedContext | null>(null);
  const lastTrackedTextRef = useRef<string | null>(null);

  useEffect(() => {
    setHydrated(true);
    setEnabled(isEnabled());
  }, []);

  // Reset on route change.
  useEffect(() => {
    setStubPayload(null);
    lastTrackedTextRef.current = null;
  }, [pathname]);

  const active = useTextSelection(hydrated && enabled);

  // Fire selection analytics once per stable selection.
  useEffect(() => {
    if (!active) return;
    if (lastTrackedTextRef.current === active.text) return;
    lastTrackedTextRef.current = active.text;
    track({
      name: "contextual_ai_selection",
      chars: active.text.length,
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }, [active]);

  const handleOpen = useCallback(() => {
    if (!active) return;
    const ctx = buildContext(active.range, active.text);
    track({
      name: "contextual_ai_open",
      chars: ctx.selection.length,
      sectionLabel: ctx.sectionLabel,
      path: ctx.url,
      hasSurrounding: Boolean(ctx.surrounding),
    });

    const adapter = resolveAdapter();
    if (!adapter) {
      track({ name: "contextual_ai_adapter_missing", path: ctx.url });
      return;
    }

    void adapter.prefillWithContext(ctx);
    if (isStubEnabled()) {
      setStubPayload(ctx);
    }
    window.getSelection()?.removeAllRanges();
  }, [active]);

  const handleDismiss = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    track({ name: "contextual_ai_dismissed", reason: "click_away" });
  }, []);

  return (
    <>
      {children}
      {hydrated && enabled && active && (
        <SelectionPopover
          rect={active.rect}
          onClick={handleOpen}
          onDismiss={handleDismiss}
        />
      )}
      {hydrated && stubPayload && (
        <StubDebugCard
          payload={stubPayload}
          onClose={() => setStubPayload(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Create barrel export**

Create `components/contextual-ai/index.ts`:

```ts
export { ContextualAIProvider } from "./contextual-ai-provider";
```

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Run full test suite**

Run: `npm test -- --run`
Expected: all tests still pass (no regressions from earlier tasks).

- [ ] **Step 5: Commit**

```bash
git add components/contextual-ai/contextual-ai-provider.tsx components/contextual-ai/index.ts
git commit -m "feat(contextual-ai): add provider wiring hook, popover, stub card"
```

---

## Task 11: Mount provider in `app/(public)/layout.tsx`

**Files:**
- Modify: `app/(public)/layout.tsx`

- [ ] **Step 1: Update the layout**

Replace the contents of `app/(public)/layout.tsx` with:

```tsx
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";
import { PhoneCallFab } from "@/components/layout/phone-call-fab";
import { BackgroundEffects } from "@/components/landing/background-effects";
import { ContextualAIProvider } from "@/components/contextual-ai";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundEffects showGrid={false} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNav />
        <ContextualAIProvider>
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </ContextualAIProvider>
        <PublicFooter />
        <PhoneCallFab />
      </div>
    </div>
  );
}
```

Note: only `<main>` is inside the provider. Nav and footer are excluded so selecting text in the nav links (which `<a>` already excludes) or footer doesn't trigger the popover.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: build succeeds with no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/\(public\)/layout.tsx
git commit -m "feat(contextual-ai): mount provider in public layout"
```

---

## Task 12: Add `data-contextual-ai="off"` escape hatches

**Files:**
- Modify: `components/layout/phone-call-fab.tsx`
- Modify: `components/consent/cookie-banner.tsx`
- Modify: `components/consent/cookie-preferences-dialog.tsx`

- [ ] **Step 1: Opt out PhoneCallFab**

Modify `components/layout/phone-call-fab.tsx`. Find the outer `<div>` (around line 19) and add `data-contextual-ai="off"` to it:

```tsx
<div
  data-contextual-ai="off"
  className={cn(
    "lg:hidden fixed z-[80] max-w-[calc(100vw-2rem)] transition-[bottom,left] duration-300 ease-out",
    useStackOffset
      ? "left-4 sm:left-6"
      : "bottom-5 left-4 sm:bottom-6 sm:left-6",
  )}
  style={useStackOffset ? { bottom: fabStackBottomPx } : undefined}
>
```

- [ ] **Step 2: Opt out CookieBanner**

Modify `components/consent/cookie-banner.tsx`. Find the `<div ref={bannerRef} role="dialog" ...>` (around line 58) and add `data-contextual-ai="off"`:

```tsx
<div
  ref={bannerRef}
  role="dialog"
  aria-label="Cookie consent"
  data-contextual-ai="off"
  className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 z-[90] sm:max-w-sm rounded-xl bg-card/80 backdrop-blur-xl border border-border/50 p-4 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-4 fade-in duration-500"
>
```

- [ ] **Step 3: Opt out CookiePreferencesDialog**

Modify `components/consent/cookie-preferences-dialog.tsx`. Locate the `<DialogContent>` element and add `data-contextual-ai="off"`:

```tsx
<DialogContent data-contextual-ai="off" className="...">
```

(Preserve any existing className; only add the new attribute.)

- [ ] **Step 4: Run typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/layout/phone-call-fab.tsx components/consent/cookie-banner.tsx components/consent/cookie-preferences-dialog.tsx
git commit -m "feat(contextual-ai): opt chrome UI out of highlight-to-chat"
```

---

## Task 13: Update `.env.example` + `CLAUDE.md`

**Files:**
- Modify: `.env.example`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update `.env.example`**

Append to `.env.example`:

```bash

# Contextual AI (Highlight-to-Chat) — Phase 1 prototype
# Default on in all environments. Set to "false" to disable globally.
NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED=true

# When "true" AND window.AutoCrew.prefillWithContext is not present, clicking
# "Ask Sarah" shows a debug card with the payload the widget would receive.
# Leave unset in production; set to "true" locally for dogfood.
NEXT_PUBLIC_CONTEXTUAL_AI_STUB=
```

- [ ] **Step 2: Document in `CLAUDE.md`**

Append to `CLAUDE.md`, after the existing "Development Notes" section:

```markdown

## Contextual AI (Highlight-to-Chat)

Phase 1 prototype that turns any highlighted text on a marketing page into a pre-loaded chat prompt. Mounted under `app/(public)/layout.tsx`; every current and future `(public)/*` page inherits it automatically.

**Toggle**
- Global: `NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED=false` in env.
- Per-session: append `?contextual-ai=off` (or `=on`) to any URL.
- Per-visitor: `localStorage.setItem('contextual-ai:disabled', '1')` in the browser console.

**Dogfood locally**
1. Set `NEXT_PUBLIC_CONTEXTUAL_AI_STUB=true` in `.env.local`.
2. `npm run dev`.
3. Highlight text (≥15 chars) anywhere on a `(public)/*` page.
4. Click "Ask Sarah →". A debug card appears bottom-right showing the exact `EnrichedContext` payload.

**How it wires to the real widget**
The external `widget.js` from `app.autocrew-ai.com` is loaded in `app/layout.tsx`. When the widget team ships `window.AutoCrew.prefillWithContext(ctx: EnrichedContext)`, the adapter auto-resolves to the real API at click time — no changes needed in this repo. The type signature is exported from `lib/contextual-ai`.

**Opt an element out**
Stamp `data-contextual-ai="off"` on any element; selections inside it are ignored.
```

- [ ] **Step 3: Commit**

```bash
git add .env.example CLAUDE.md
git commit -m "docs(contextual-ai): document env flags + dogfood flow"
```

---

## Task 14: Manual QA

This verifies behavior that unit tests can't reach (real selection events, position math, adapter flow).

- [ ] **Step 1: Run the full test suite one more time**

Run: `npm test -- --run && npm run validate`
Expected: all tests pass, typecheck clean, lint clean, format clean.

- [ ] **Step 2: Start dev server with stub flag**

Run:
```bash
echo 'NEXT_PUBLIC_CONTEXTUAL_AI_STUB=true' >> .env.local
npm run dev
```

Expected: server starts on http://localhost:3000.

- [ ] **Step 3: Walk through the QA matrix**

On http://localhost:3000 (homepage):

| Test | Expected |
|---|---|
| Highlight <15 chars of body copy | No popover |
| Highlight ≥15 chars of body copy | Popover appears above selection within 250 ms |
| Highlight text near top of viewport | Popover flips below selection |
| Highlight text near right edge | Popover clamps to viewport (no overflow) |
| Click "Ask Sarah →" | Debug card appears bottom-right with selection, url, sectionLabel inferred from heading |
| Press Esc with popover open | Popover hides, browser selection cleared |
| Scroll page with popover open | Popover hides |
| Select text inside a CTA button | No popover |
| Select text inside the nav | No popover |
| Select text inside the cookie banner | No popover |
| Open DevTools, run `localStorage.setItem('contextual-ai:disabled','1')`, reload | Popover never appears |
| Visit `/?contextual-ai=off` | Popover never appears |
| Visit `/?contextual-ai=on` after disabling in localStorage | Popover appears |
| Visit `/contact`, `/about`, `/industry/coaching` | Popover works on each |
| Visit `/docs` | Popover does NOT appear (docs not under `(public)`) |
| Visit `/login` | Popover does NOT appear |

- [ ] **Step 4: Verify analytics events in DevTools**

With the dev server running and the debug card visible after a click, in the browser console:

```js
document.addEventListener('contextual_ai', (e) => console.log('[ctx-ai]', e.detail));
```

Highlight text, click Ask Sarah. Expected console output:
- `contextual_ai_selection` event
- `contextual_ai_open` event with `hasSurrounding: true`

- [ ] **Step 5: Remove the stub flag from `.env.local` before committing anything**

Check `.env.local` is gitignored (`git check-ignore .env.local`). If it is, skip. Otherwise remove the line added in Step 2.

- [ ] **Step 6: Final check**

Run: `npm run validate && npm test -- --run && npm run build`
Expected: all green.

No commit in this task — it's verification only.

---

## Self-review

**Spec coverage**

| Spec section | Covered by |
|---|---|
| §3 Architecture — module layout | Tasks 1–10 create exactly the files listed |
| §4 Selection lifecycle — hook constants, exclusions, touch no-op | Task 7 |
| §4 Popover positioning, clamping, Escape, click-away | Task 8 |
| §5 Context enrichment DOM walk, section inference | Tasks 1, 3 |
| §6 Adapter contract + runtime resolution | Tasks 1, 4 |
| §7 Analytics events + consent gating | Tasks 2, 5, 10 |
| §8 Feature flags (env + URL + localStorage) | Task 2 |
| §9 File inventory | All tasks |
| §10 Unit tests | Tasks 2, 3, 4 |
| §10 Manual QA matrix | Task 14 |
| §11 Risks — SSR, bundle, z-index, stub-gate | Task 10 (dynamic import, `'use client'`), Task 8 (z-50), Task 4 (stub env gate) |
| §12 Rollout — env default on, stub off | Task 13 |

**Placeholder scan:** no TBD / TODO / "handle edge cases" — every step has concrete code or exact commands.

**Type consistency:** `EnrichedContext` defined once in `types.ts`, re-exported via `index.ts`, imported by `context.ts`, `adapter.ts`, `events.ts` (indirectly via types), `contextual-ai-provider.tsx`, `stub-debug-card.tsx`. Same shape everywhere.

**Consent wiring:** `hasAnalyticsConsent()` reads from `localStorage['cookie-consent']` which is the exact key `ConsentProvider` writes (`components/providers/consent-provider.tsx:37`) — verified against the existing code.

**Z-index layering:** popover `z-50` < `PhoneCallFab` `z-[80]` < `CookieBanner` `z-[90]` < stub card `z-[85]`. Stub card intentionally above FAB so it's visible during dogfood but still below the cookie banner.
