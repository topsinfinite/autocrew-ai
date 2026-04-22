# Contextual AI Adapter Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `lib/contextual-ai/adapter.ts` to call the shipped `window.AutoCrew.ask()` widget API, add a pre-init queue stub in `app/layout.tsx`, and remove the unused stub/dogfood mode — so the highlight-to-chat feature works in production against the real widget.

**Architecture:** The adapter layer stays as the seam between the composer and the widget. Instead of handing the widget a structured `EnrichedContext`, the adapter composes a single Format-B string (`On {sectionLabel}:\n> "{selection}"\n\n{prompt}`) and calls `AutoCrew.ask(message, { autoSend: true, mode: "chat" })`. A tiny `beforeInteractive` queue stub in the root layout guarantees calls made before `widget.js` loads are buffered and replayed. The `NEXT_PUBLIC_CONTEXTUAL_AI_STUB` flag and its debug card are deleted (no longer useful now that every real call hits the live widget).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Vitest + jsdom.

**Spec:** [docs/superpowers/specs/2026-04-22-contextual-ai-adapter-rewrite-design.md](../specs/2026-04-22-contextual-ai-adapter-rewrite-design.md)

---

## File Map

- **Modify:** `lib/contextual-ai/types.ts` — rename method on `ContextualAIAdapter`
- **Rewrite:** `lib/contextual-ai/adapter.ts` — new compose + resolver targeting `AutoCrew.ask`
- **Modify:** `lib/contextual-ai/flags.ts` — delete `isStubEnabled`
- **Modify:** `lib/contextual-ai/index.ts` — drop `stubAdapter` + `isStubEnabled` exports
- **Rewrite:** `lib/contextual-ai/__tests__/adapter.test.ts` — cover compose + new resolver
- **Modify:** `lib/contextual-ai/__tests__/flags.test.ts` — no stub-flag tests to drop (none exist); no change
- **Modify:** `components/contextual-ai/contextual-ai-provider.tsx` — call `adapter.send(ctx)`, drop stub card
- **Delete:** `components/contextual-ai/stub-debug-card.tsx`
- **Modify:** `app/layout.tsx` — insert queue stub Script before widget config
- **Delete:** `docs/highlight-to-chat-widget-api-handover.md`
- **Modify:** `CLAUDE.md` — rewrite `## Contextual AI (Highlight-to-Chat)` section

---

## Task 1: Update adapter contract on the type

**Files:**
- Modify: `lib/contextual-ai/types.ts:14-16`

- [ ] **Step 1: Update `ContextualAIAdapter` to expose `send(ctx)` instead of `prefillWithContext(ctx)`**

Replace the `ContextualAIAdapter` interface in `lib/contextual-ai/types.ts` (currently lines 14–16) with:

```ts
export interface ContextualAIAdapter {
  /** Hand the enriched context to the widget. Composes + submits via AutoCrew.ask. */
  send(ctx: EnrichedContext): void | Promise<void>;
}
```

Leave `EnrichedContext` (lines 1–12) and `ContextualAIEvent` (lines 18–53) unchanged.

- [ ] **Step 2: Run typecheck — it will fail in known places**

Run: `npm run typecheck`
Expected: FAIL. Errors in `lib/contextual-ai/adapter.ts` and `components/contextual-ai/contextual-ai-provider.tsx` referencing `prefillWithContext`. These are addressed in later tasks.

- [ ] **Step 3: Do not commit yet — part of the same logical unit as Task 2**

Proceed to Task 2.

---

## Task 2: Write failing tests for the new adapter

**Files:**
- Rewrite: `lib/contextual-ai/__tests__/adapter.test.ts`

- [ ] **Step 1: Replace the file contents with the new test suite**

Overwrite `lib/contextual-ai/__tests__/adapter.test.ts` with:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { resolveAdapter } from "../adapter";

type AskFn = (
  message: string,
  options?: { mode?: "chat" | "voice"; autoSend?: boolean; focus?: boolean },
) => void;

function installAutoCrew(ask: AskFn | unknown) {
  (window as unknown as { AutoCrew: { ask: unknown } }).AutoCrew = {
    ask,
  };
}

describe("resolveAdapter", () => {
  beforeEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
  });

  afterEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
  });

  it("returns null when window.AutoCrew is undefined", () => {
    expect(resolveAdapter()).toBeNull();
  });

  it("returns null when window.AutoCrew.ask is not a function", () => {
    installAutoCrew("not a function");
    expect(resolveAdapter()).toBeNull();
  });

  it("returns a working adapter when AutoCrew.ask is a function", () => {
    installAutoCrew(vi.fn());
    const adapter = resolveAdapter();
    expect(adapter).not.toBeNull();
    expect(typeof adapter!.send).toBe("function");
  });

  describe("send() message composition", () => {
    let ask: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      ask = vi.fn();
      installAutoCrew(ask);
    });

    it("composes Format B with section label when present", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "HIPAA-aware patient engagement",
        sectionLabel: "Healthcare features",
        url: "/industry/healthcare",
        userPrompt: "Does this handle Spanish-speaking patients?",
      });

      expect(ask).toHaveBeenCalledWith(
        'On Healthcare features:\n> "HIPAA-aware patient engagement"\n\nDoes this handle Spanish-speaking patients?',
        { autoSend: true, mode: "chat" },
      );
    });

    it("omits section prefix when sectionLabel is absent", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "automated lead qualification",
        url: "/features",
        userPrompt: "How fast is it?",
      });

      expect(ask).toHaveBeenCalledWith(
        '> "automated lead qualification"\n\nHow fast is it?',
        { autoSend: true, mode: "chat" },
      );
    });

    it("uses 'Can you explain this?' when userPrompt is missing", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "agentic crew",
        sectionLabel: "Overview",
        url: "/",
      });

      expect(ask).toHaveBeenCalledWith(
        'On Overview:\n> "agentic crew"\n\nCan you explain this?',
        { autoSend: true, mode: "chat" },
      );
    });

    it("uses fallback prompt when userPrompt is whitespace-only", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "voice agent",
        url: "/",
        userPrompt: "   \n  ",
      });

      expect(ask).toHaveBeenCalledWith(
        '> "voice agent"\n\nCan you explain this?',
        { autoSend: true, mode: "chat" },
      );
    });
  });
});
```

- [ ] **Step 2: Run the tests — they must fail**

Run: `npm test -- adapter.test`
Expected: FAIL. The current `adapter.ts` still imports/exports `stubAdapter` and has a `prefillWithContext`-shaped adapter; the tests cannot even compile against its API yet.

---

## Task 3: Rewrite `lib/contextual-ai/adapter.ts`

**Files:**
- Rewrite: `lib/contextual-ai/adapter.ts`

- [ ] **Step 1: Overwrite the adapter file with the new implementation**

Replace the entire contents of `lib/contextual-ai/adapter.ts` with:

```ts
import type { ContextualAIAdapter, EnrichedContext } from "./types";

interface AutoCrewAskOptions {
  mode?: "chat" | "voice";
  autoSend?: boolean;
  focus?: boolean;
}

interface AutoCrewAPI {
  ask?: (message: string, options?: AutoCrewAskOptions) => void;
}

function composeMessage(ctx: EnrichedContext): string {
  const prompt = ctx.userPrompt?.trim() || "Can you explain this?";
  const prefix = ctx.sectionLabel ? `On ${ctx.sectionLabel}:\n` : "";
  return `${prefix}> "${ctx.selection}"\n\n${prompt}`;
}

export function resolveAdapter(): ContextualAIAdapter | null {
  if (typeof window === "undefined") return null;
  const api = (window as unknown as { AutoCrew?: AutoCrewAPI }).AutoCrew;
  const ask = api?.ask;
  if (typeof ask !== "function") return null;
  return {
    send: (ctx) => ask(composeMessage(ctx), { autoSend: true, mode: "chat" }),
  };
}
```

Key points:
- No more `stubAdapter` export.
- No more `NEXT_PUBLIC_CONTEXTUAL_AI_STUB` branch.
- Returns `null` only when `AutoCrew.ask` is truly unavailable (stub script would normally guarantee `ask` exists as a queueing shim in production).

- [ ] **Step 2: Run the adapter tests — they must pass**

Run: `npm test -- adapter.test`
Expected: PASS for all 7 tests in the describe blocks.

- [ ] **Step 3: Run typecheck — `flags.ts` + `index.ts` + provider still fail**

Run: `npm run typecheck`
Expected: FAIL with errors like "Module has no exported member 'stubAdapter'", "Property 'prefillWithContext' does not exist", "Module has no exported member 'isStubEnabled'". These are addressed in Tasks 4–6.

---

## Task 4: Remove `isStubEnabled` from `flags.ts`

**Files:**
- Modify: `lib/contextual-ai/flags.ts:27-29`

- [ ] **Step 1: Delete the `isStubEnabled` function**

In `lib/contextual-ai/flags.ts`, delete lines 27–29 (the `isStubEnabled` function):

```ts
export function isStubEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB === "true";
}
```

Leave `isEnabled()` (lines 5–25), the consent constants, and `hasAnalyticsConsent()` (lines 31–48) unchanged.

- [ ] **Step 2: Run flags tests — must still pass**

Run: `npm test -- flags.test`
Expected: PASS. `flags.test.ts` does not test `isStubEnabled`, so nothing to update.

---

## Task 5: Drop removed exports from the barrel

**Files:**
- Modify: `lib/contextual-ai/index.ts:2-3`

- [ ] **Step 1: Update the barrel exports**

Replace the contents of `lib/contextual-ai/index.ts` with:

```ts
export { buildContext, inferSectionLabel, SURROUNDING_CAP } from "./context";
export { resolveAdapter } from "./adapter";
export { isEnabled, hasAnalyticsConsent } from "./flags";
export { track } from "./events";
export type {
  ContextualAIAdapter,
  ContextualAIEvent,
  EnrichedContext,
} from "./types";
```

Changes: removed `stubAdapter` from `./adapter` and `isStubEnabled` from `./flags`.

- [ ] **Step 2: Run typecheck — provider still fails, everything else should be clean**

Run: `npm run typecheck`
Expected: FAIL only in `components/contextual-ai/contextual-ai-provider.tsx` referencing `isStubEnabled`, `StubDebugCard`, and `adapter.prefillWithContext`. Addressed next.

---

## Task 6: Rewire the provider to use `adapter.send()` and drop the stub card

**Files:**
- Modify: `components/contextual-ai/contextual-ai-provider.tsx`

- [ ] **Step 1: Overwrite the provider file**

Replace the entire contents of `components/contextual-ai/contextual-ai-provider.tsx` with:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  buildContext,
  isEnabled,
  resolveAdapter,
  track,
  type EnrichedContext,
} from "@/lib/contextual-ai";
import { useTextSelection } from "./use-text-selection";
import type { ComposerDismissReason } from "./selection-composer";

const SelectionPopover = dynamic(
  () => import("./selection-popover").then((m) => m.SelectionPopover),
  { ssr: false },
);

const SelectionComposer = dynamic(
  () => import("./selection-composer").then((m) => m.SelectionComposer),
  { ssr: false },
);

interface ComposerState {
  ctx: EnrichedContext;
  rect: DOMRect;
}

export function ContextualAIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const lastTrackedTextRef = useRef<string | null>(null);

  useEffect(() => {
    setHydrated(true);
    setEnabled(isEnabled());
  }, []);

  useEffect(() => {
    setComposer(null);
    lastTrackedTextRef.current = null;
  }, [pathname]);

  const active = useTextSelection(hydrated && enabled && !composer);

  useEffect(() => {
    if (!active) return;
    if (lastTrackedTextRef.current === active.text) return;
    lastTrackedTextRef.current = active.text;
    const ctx = buildContext(active.range, active.text);
    track({
      name: "contextual_ai_selection",
      chars: active.text.length,
      sectionLabel: ctx.sectionLabel,
      path: ctx.url,
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
    track({
      name: "contextual_ai_composer_opened",
      chars: ctx.selection.length,
      sectionLabel: ctx.sectionLabel,
      path: ctx.url,
    });

    setComposer({ ctx, rect: active.rect });
    window.getSelection()?.removeAllRanges();
  }, [active]);

  const handlePopoverDismiss = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    track({ name: "contextual_ai_dismissed", reason: "escape" });
  }, []);

  const handleComposerSubmit = useCallback(
    (userPrompt: string) => {
      if (!composer) return;
      const ctx: EnrichedContext = userPrompt
        ? { ...composer.ctx, userPrompt }
        : composer.ctx;

      track({
        name: "contextual_ai_composer_sent",
        chars: ctx.selection.length,
        userPromptChars: userPrompt.length,
        sectionLabel: ctx.sectionLabel,
        path: ctx.url,
      });

      const adapter = resolveAdapter();
      if (!adapter) {
        track({ name: "contextual_ai_adapter_missing", path: ctx.url });
        setComposer(null);
        return;
      }

      void adapter.send(ctx);
      setComposer(null);
    },
    [composer],
  );

  const handleComposerDismiss = useCallback(
    (reason: ComposerDismissReason) => {
      track({ name: "contextual_ai_composer_dismissed", reason });
      setComposer(null);
    },
    [],
  );

  return (
    <>
      {children}
      {hydrated && enabled && active && !composer && (
        <SelectionPopover
          rect={active.rect}
          onClick={handleOpen}
          onDismiss={handlePopoverDismiss}
        />
      )}
      {hydrated && composer && (
        <SelectionComposer
          ctx={composer.ctx}
          rect={composer.rect}
          onSubmit={handleComposerSubmit}
          onDismiss={handleComposerDismiss}
        />
      )}
    </>
  );
}
```

Changes:
- Dropped `isStubEnabled` import, `StubDebugCard` dynamic import, `stubPayload` state, and the conditional `<StubDebugCard />` render.
- `adapter.prefillWithContext(ctx)` → `adapter.send(ctx)`.

- [ ] **Step 2: Run typecheck — should now pass**

Run: `npm run typecheck`
Expected: PASS (zero errors).

---

## Task 7: Delete `stub-debug-card.tsx`

**Files:**
- Delete: `components/contextual-ai/stub-debug-card.tsx`

- [ ] **Step 1: Delete the file**

Run: `rm components/contextual-ai/stub-debug-card.tsx`
Expected: file removed; no output on success.

- [ ] **Step 2: Confirm nothing else imports it**

Run: `grep -R "stub-debug-card" . --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next`
Expected: no matches.

---

## Task 8: Add the pre-init queue stub to `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx:153-158`

- [ ] **Step 1: Insert the queue stub script before `autocrew-config`**

In `app/layout.tsx`, find the existing block (currently lines 153–158):

```tsx
        <Script id="autocrew-config" strategy="beforeInteractive">
          {`window.AutoCrewConfig = {
            crewCode: 'AUTOCREW-001-SUP-001',
            configUrl: 'https://app.autocrew-ai.com/api/widget/config'
          };`}
        </Script>
```

Add a new `<Script>` immediately before it so the full block becomes:

```tsx
        <Script id="autocrew-queue-stub" strategy="beforeInteractive">
          {`window.AutoCrew=window.AutoCrew||{q:[],ask:function(){(this.q=this.q||[]).push(['ask',arguments])},open:function(){(this.q=this.q||[]).push(['open',arguments])},close:function(){(this.q=this.q||[]).push(['close',arguments])},onReady:function(){(this.q=this.q||[]).push(['onReady',arguments])}};`}
        </Script>
        <Script id="autocrew-config" strategy="beforeInteractive">
          {`window.AutoCrewConfig = {
            crewCode: 'AUTOCREW-001-SUP-001',
            configUrl: 'https://app.autocrew-ai.com/api/widget/config'
          };`}
        </Script>
```

- [ ] **Step 2: Run lint + typecheck**

Run: `npm run typecheck && npm run lint`
Expected: PASS, zero errors.

- [ ] **Step 3: Commit the code changes**

Run:
```bash
git add lib/contextual-ai/types.ts lib/contextual-ai/adapter.ts lib/contextual-ai/flags.ts lib/contextual-ai/index.ts lib/contextual-ai/__tests__/adapter.test.ts components/contextual-ai/contextual-ai-provider.tsx components/contextual-ai/stub-debug-card.tsx app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(contextual-ai): rewrite adapter for AutoCrew.ask + add queue stub

Widget team shipped AutoCrew.ask(message, opts) instead of the expected
prefillWithContext(ctx). This rewrites the adapter to compose the
EnrichedContext into a single Format-B string (section-tagged quote +
user prompt) and call ask() with autoSend: true. A beforeInteractive
queue stub in the root layout buffers any pre-init calls. Removes the
now-unused NEXT_PUBLIC_CONTEXTUAL_AI_STUB mode and debug card.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Delete the stale handover doc

**Files:**
- Delete: `docs/highlight-to-chat-widget-api-handover.md`

- [ ] **Step 1: Delete the file**

Run: `rm docs/highlight-to-chat-widget-api-handover.md`
Expected: file removed.

- [ ] **Step 2: Confirm nothing references the filename**

Run: `grep -R "highlight-to-chat-widget-api-handover" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git`
Expected: no matches (the doc was standalone; the spec references its PR conceptually but not by filename beyond historical context).

---

## Task 10: Rewrite the Contextual AI section in `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md:138-157`

- [ ] **Step 1: Replace the `## Contextual AI (Highlight-to-Chat)` section**

In `CLAUDE.md`, replace lines 138–157 (the entire `## Contextual AI (Highlight-to-Chat)` section) with:

```md
## Contextual AI (Highlight-to-Chat)

Phase 1 feature that turns any highlighted text on a marketing page into a live AutoCrew conversation. Mounted under `app/(public)/layout.tsx`; every current and future `(public)/*` page inherits it automatically.

**Toggle**

- Global: `NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED=false` in env.
- Per-session: append `?contextual-ai=off` (or `=on`) to any URL.
- Per-visitor: `localStorage.setItem('contextual-ai:disabled', '1')` in the browser console.

**How it works**

On submit, `lib/contextual-ai/adapter.ts` composes the selection, section label, and user prompt into a single message and calls `window.AutoCrew.ask(message, { autoSend: true, mode: 'chat' })` — the API exposed by `widget.js` (loaded from `app.autocrew-ai.com` in `app/layout.tsx`). A tiny `beforeInteractive` queue stub in the root layout buffers any calls made before `widget.js` finishes loading; the widget drains the queue on init.

**Dogfood locally**

1. `npm run dev`.
2. Highlight any paragraph of text (≥15 chars) on a `(public)/*` page.
3. Click "Ask Sarah →", optionally type a question, press Enter.
4. The AutoCrew widget opens with your composed message already submitted and Sarah answering.

**Opt an element out**

Stamp `data-contextual-ai="off"` on any element; selections inside it are ignored.
```

Leave everything before line 138 and after line 157 untouched.

- [ ] **Step 2: Verify the file looks right**

Run: `grep -n "## Contextual AI" CLAUDE.md`
Expected: one match, at the start of the rewritten section.

- [ ] **Step 3: Commit the doc changes**

Run:
```bash
git add CLAUDE.md docs/highlight-to-chat-widget-api-handover.md
git commit -m "$(cat <<'EOF'
docs(contextual-ai): align CLAUDE.md with shipped widget API, remove stale handover

The widget team shipped AutoCrew.ask() rather than prefillWithContext().
The handover doc documented a contract that was never built — delete it.
CLAUDE.md's dogfood steps referenced the removed stub mode — rewrite to
match the current adapter (real widget only).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full validation script**

Run: `npm run validate`
Expected: PASS — typecheck + lint + format:check all green.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS — all existing tests plus the 7 new adapter tests.

- [ ] **Step 3: Manual dev-server smoke test**

The dev server is already running at port 64141 (see `.claude/launch.json`).

Open `http://localhost:64141` (or whichever port `preview_start` reported). Highlight ≥15 characters of text anywhere on the landing page. Click "Ask Sarah →". Optionally type a question. Press Enter.

Expected:
- AutoCrew widget opens on the right.
- The composed message (`On {section}:\n> "{selection}"\n\n{prompt}`) appears as the first user turn in the transcript.
- Sarah begins answering.

If the widget does not open or the message does not appear:
- Open browser devtools → Network tab. Confirm `widget.js` loads with 200.
- Open devtools → Console. Confirm no errors from `adapter.ts`.
- Check `window.AutoCrew` in the console. It should be an object with `ask`, `open`, `close`, `onReady`, `isReady`, `version` after widget load completes.

- [ ] **Step 4: Confirm fallback message when userPrompt is empty**

On a `(public)/*` page, highlight text, click "Ask Sarah →", do NOT type anything, press Enter.

Expected: widget opens; first user turn is `On {section}:\n> "{selection}"\n\nCan you explain this?`.

- [ ] **Step 5: Confirm kill switches still work**

In the browser console:
```js
localStorage.setItem('contextual-ai:disabled', '1')
```
Refresh. Try to highlight text. Expected: no popover appears.

Remove the kill switch:
```js
localStorage.removeItem('contextual-ai:disabled')
```
Refresh. Expected: popover works again.

- [ ] **Step 6: No further commits needed**

All changes were committed in Tasks 8 and 10.

---

## Self-review notes (completed)

- **Spec coverage:** Every section of the design spec is covered by a task:
  - § 4.1 Adapter contract → Task 1.
  - § 4.2 Message composition → Tasks 2 + 3.
  - § 4.3 Adapter implementation → Task 3.
  - § 4.4 Queue stub → Task 8.
  - § 5.1 Stub/debug deletions → Tasks 4, 5, 6, 7.
  - § 5.2 Handover doc deletion → Task 9.
  - § 5.3 CLAUDE.md rewrite → Task 10.
  - § 6 Tests → Task 2.
  - § 7 Verification → Task 11.
- **No placeholders.** Every step has exact paths, exact code, exact commands, expected output.
- **Type consistency.** `ContextualAIAdapter.send` is used in the test (Task 2), implementation (Task 3), and call site (Task 6) with the same signature.
