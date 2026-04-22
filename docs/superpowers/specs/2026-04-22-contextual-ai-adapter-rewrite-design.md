# Contextual AI Adapter Rewrite — Design

**Date:** 2026-04-22
**Status:** Approved
**Branch:** `feature/highlight-to-chat`
**Related:** `docs/superpowers/specs/2026-04-21-highlight-to-chat-design.md`, `docs/superpowers/plans/2026-04-21-highlight-to-chat.md`

## 1. Context

The marketing site shipped the client-side half of highlight-to-chat ahead of the widget team and wrote a handover doc expecting the widget to expose `window.AutoCrew.prefillWithContext(ctx: EnrichedContext)`. The widget team shipped a different API in `topsinfinite/autocrew-saas#117`:

```ts
window.AutoCrew.ask(message: string, options?: { mode?, autoSend?, focus? })
window.AutoCrew.open(options?: { mode? })
window.AutoCrew.close()
window.AutoCrew.isReady()
window.AutoCrew.onReady(cb)
window.AutoCrew.version
```

It accepts a single string, not a structured context object. There is no `prefillWithContext`. This means our current `lib/contextual-ai/adapter.ts` always falls through to `contextual_ai_adapter_missing` in production — the feature is broken-by-contract.

Phase 1 rewrites the adapter to call the shipped `AutoCrew.ask()` API, composes the rich context into a single string, adds a pre-init queue stub, and removes the now-unused stub/dogfood mode.

## 2. Goals

- Make the highlight-to-chat feature functional against the shipped widget API.
- Preserve the adapter seam so the composer stays decoupled from the widget's API shape.
- Preserve all existing analytics events (no dashboard regressions).
- Remove code, env flags, and docs that reference contracts that were never built.

## 3. Non-goals

- Reintroducing a structured-context API on the widget side (separate conversation with widget team).
- New UI on the popover or composer.
- Listening for the widget's `autocrew:triggered` event for analytics correlation.
- Handling `widget.js` load failures (ad-blockers, 500s) with user-facing toasts.
- Any change to selection detection, buildContext DOM walker, or viewport clamping.

## 4. Design

### 4.1 Adapter contract

Rename `prefillWithContext` → `send`. `EnrichedContext` stays as the input type — the adapter composes the outgoing string internally.

```ts
// lib/contextual-ai/types.ts
export interface ContextualAIAdapter {
  send(ctx: EnrichedContext): void | Promise<void>;
}
```

`EnrichedContext` itself is unchanged (`selection`, `surrounding?`, `sectionLabel?`, `url`, `userPrompt?`). `surrounding` and `url` are still built by `buildContext()` and used in analytics events; they just don't land in the composed message in this phase.

### 4.2 Message composition (Format B — section-tagged)

```ts
function composeMessage(ctx: EnrichedContext): string {
  const prompt = ctx.userPrompt?.trim() || "Can you explain this?";
  const prefix = ctx.sectionLabel ? `On ${ctx.sectionLabel}:\n` : "";
  return `${prefix}> "${ctx.selection}"\n\n${prompt}`;
}
```

Shape with section label:
```
On Healthcare features:
> "HIPAA-aware patient engagement"

Does this handle Spanish-speaking patients?
```

Shape without section label (falls back cleanly):
```
> "HIPAA-aware patient engagement"

Does this handle Spanish-speaking patients?
```

### 4.3 Adapter implementation

```ts
// lib/contextual-ai/adapter.ts
import type { ContextualAIAdapter, EnrichedContext } from "./types";

interface AutoCrewAPI {
  ask?: (message: string, options?: { mode?: "chat" | "voice"; autoSend?: boolean; focus?: boolean }) => void;
}

function composeMessage(ctx: EnrichedContext): string {
  const prompt = ctx.userPrompt?.trim() || "Can you explain this?";
  const prefix = ctx.sectionLabel ? `On ${ctx.sectionLabel}:\n` : "";
  return `${prefix}> "${ctx.selection}"\n\n${prompt}`;
}

export function resolveAdapter(): ContextualAIAdapter | null {
  if (typeof window === "undefined") return null;
  const api = (window as unknown as { AutoCrew?: AutoCrewAPI }).AutoCrew;
  if (typeof api?.ask !== "function") return null;
  return {
    send: (ctx) => api.ask!(composeMessage(ctx), { autoSend: true, mode: "chat" }),
  };
}
```

Key properties:
- `autoSend: true` — message fires immediately per user decision; composer submit IS the send.
- `mode: "chat"` — highlight-to-chat is text, not voice.
- Returns `null` only when `AutoCrew` is genuinely absent (neither widget nor queue stub present). In practice this only happens before the layout.tsx pre-init script runs or in test environments that haven't mocked `window.AutoCrew`.

### 4.4 Pre-init queue stub in `app/layout.tsx`

Inserted immediately before the existing `autocrew-config` script, using `strategy="beforeInteractive"` so it runs before `widget.js` (which loads `afterInteractive`).

```tsx
<Script id="autocrew-queue-stub" strategy="beforeInteractive">
  {`window.AutoCrew=window.AutoCrew||{q:[],ask:function(){(this.q=this.q||[]).push(['ask',arguments])},open:function(){(this.q=this.q||[]).push(['open',arguments])},close:function(){(this.q=this.q||[]).push(['close',arguments])},onReady:function(){(this.q=this.q||[]).push(['onReady',arguments])}};`}
</Script>
```

Widget drains `window.AutoCrew.q` on init per widget integration docs. Any `send()` fired during the async `widget.js` load window is buffered and delivered on ready.

### 4.5 Flow (updated)

```
User selects ≥15 chars on a (public)/* page
  → useTextSelection fires
  → SelectionPopover renders
  → user clicks "Ask Sarah →"
  → buildContext() produces EnrichedContext
  → SelectionComposer opens
  → user hits Enter or send (with or without typed userPrompt)
  → adapter.send(ctx)
    → composeMessage(ctx) → string
    → window.AutoCrew.ask(message, { autoSend: true, mode: "chat" })
      → widget ready: opens widget, sends message, Sarah answers
      → widget queued (stub): pushes to q; drains when widget.js ready; then above
  → composer closes synchronously (existing behavior preserved)
```

## 5. Code deletions

### 5.1 Stub mode and debug card

- Delete `stubAdapter` export and the `NEXT_PUBLIC_CONTEXTUAL_AI_STUB` branch from `lib/contextual-ai/adapter.ts`.
- Delete `isStubEnabled()` from `lib/contextual-ai/flags.ts`.
- Delete `components/contextual-ai/stub-debug-card.tsx` entirely.
- Remove the stub-debug-card import and conditional mount from `components/contextual-ai/contextual-ai-provider.tsx`.

### 5.2 Stale documentation

- Delete `docs/highlight-to-chat-widget-api-handover.md` — documents a contract that was never built. Widget team's `docs/widget-integration.md` (in `autocrew-saas`) is now the source of truth.

### 5.3 CLAUDE.md section

Rewrite the `## Contextual AI (Highlight-to-Chat)` section in the project's root `CLAUDE.md`:
- Remove the `NEXT_PUBLIC_CONTEXTUAL_AI_STUB` and debug-card dogfood steps.
- Replace "how it wires to the real widget" paragraph with the current `AutoCrew.ask()` reality.
- Keep toggles (global env, URL param, localStorage) and opt-out data attribute — those are unchanged.

## 6. Tests

### 6.1 Updated: `lib/contextual-ai/__tests__/adapter.test.ts`

Rewrite to cover:
- `resolveAdapter()` returns `null` when `window.AutoCrew` is undefined.
- `resolveAdapter()` returns `null` when `window.AutoCrew.ask` is not a function.
- `resolveAdapter()` returns a working adapter when `AutoCrew.ask` is a function.
- `send(ctx)` calls `AutoCrew.ask` with the composed Format B message and `{ autoSend: true, mode: "chat" }`.
- Composed message shape with `sectionLabel` present.
- Composed message shape with `sectionLabel` absent.
- Composed message shape with empty `userPrompt` → uses `"Can you explain this?"` fallback.
- Composed message shape with whitespace-only `userPrompt` → uses fallback.

### 6.2 Updated: `lib/contextual-ai/__tests__/flags.test.ts`

Drop any existing `isStubEnabled()` tests.

### 6.3 Not touched

`context.test.ts` — unchanged. `buildContext()` behavior is unaffected.

## 7. Rollout and verification

- Branch is already `feature/highlight-to-chat`. No new branch needed.
- Verification: `npm run dev`, open a `(public)/*` page, highlight ≥15 chars of text, click "Ask Sarah →", type a question, send. Widget should open with the composed message as the first visible user turn, and Sarah should answer.
- No env changes needed in production. `NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED` retains its current meaning.
- No changes to widget-side code; feature is fully client-side on the marketing repo.

## 8. Failure modes

| Scenario | Behavior |
|---|---|
| Widget fully loaded at send time | `ask()` fires directly; widget opens and sends. |
| Widget still loading | Queue stub buffers via `window.AutoCrew.q`; widget drains on ready. |
| `widget.js` fails to load (ad-blocker, 500) | Silent drop — composer closed, no visible result. Browser devtools surface the network error. Accepted in Phase 1. |
| `window.AutoCrew` missing entirely | Adapter returns `null`; provider fires existing `contextual_ai_adapter_missing` event. In practice this only happens if the `beforeInteractive` stub script fails — essentially impossible under normal browser behavior. |

## 9. Follow-ups (out of scope, tracked for later)

- Reopen conversation with widget team about a structured-context API so `surrounding` and `url` can be passed as silent LLM context rather than being folded into the visible message.
- Listen for `autocrew:triggered` CustomEvent to verify widget received the message; emit a new `contextual_ai_widget_received` analytics event to measure composer→widget delivery drop-off.
- Add a user-facing error when `widget.js` fails to load (rare, but silent drop is not great UX).
