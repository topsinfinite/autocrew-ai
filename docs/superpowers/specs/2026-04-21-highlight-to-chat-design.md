# Contextual AI — Highlight-to-Chat (Phase 1) Design

**Status:** Approved design — ready for implementation plan
**Date:** 2026-04-21
**Related PRD:** [`docs/highlight-to-chat-prd.md`](../../highlight-to-chat-prd.md)
**Scope:** Phase 1 only — marketing-site prototype against a stubbed widget adapter. Widget-side `window.AutoCrew.prefillWithContext` is a later handoff.

---

## 1. Summary

When a visitor highlights ≥15 characters of text on any marketing page, a compact "Ask Sarah →" popover anchors above the selection. Clicking it calls `adapter.prefillWithContext({ selection, surrounding, sectionLabel, url })`. In production the adapter routes to the real widget API when it exists. For local dogfood, a stub adapter activated by `NEXT_PUBLIC_CONTEXTUAL_AI_STUB=true` renders a debug card showing the payload.

## 2. Scope & non-goals

**In scope (Phase 1):**
- Mount under `app/(public)/layout.tsx` — all current and future marketing pages inherit the feature.
- Pure-frontend prototype. No backend, no widget-runtime work.
- Stubbed adapter for dogfood. Clean public contract for the widget team to implement later.
- GA4 analytics (consent-gated) + `CustomEvent` dual emission for future subscribers.
- jsdom unit tests for the pure modules (`buildContext`, `resolveAdapter`, `isEnabled`).

**Out of scope (deferred):**
- Mobile / touch trigger — explicit no-op via `matchMedia('(pointer: coarse)')`. v2.
- `data-section` attribute rollout across components — heading inference covers v1; add explicit labels later based on dogfood data.
- Widget-side `prefillWithContext` implementation — handoff to widget team with adapter contract in §5.
- A/B experiments from the PRD — the env/URL/localStorage flags support Experiment 1 (presence/absence) naturally; others require backend + analytics baselines.
- iframe / cross-origin content.

## 3. Architecture

Three module groups with strict boundaries:

```
lib/contextual-ai/
├── adapter.ts           # ContextualAIAdapter, resolveAdapter, stubAdapter
├── context.ts           # buildContext, inferSectionLabel
├── events.ts            # track() — GA4 + CustomEvent dual emission
├── flags.ts             # isEnabled() — env + URL + localStorage
└── index.ts

components/contextual-ai/
├── contextual-ai-provider.tsx   # mount point; owns state
├── selection-popover.tsx        # presentational popover (portal + positioning)
├── stub-debug-card.tsx          # dev-only floating panel showing payload
├── use-text-selection.ts        # selection hook (mouseup + selectionchange)
└── index.ts
```

**Boundary rules:**
- `adapter.ts` is the only module that references `window.AutoCrew`.
- `use-text-selection.ts` is the only module that calls `window.getSelection()` or reads `Range`.
- `contextual-ai-provider.tsx` is the only module mounted in the React tree.

**Data flow:**
```
mouseup / selectionchange
   └─ use-text-selection
        ├─ filter: <15 chars, inside excluded element, touch device → bail
        ├─ 250ms debounce
        └─ setSelection({ text, rect })
             └─ SelectionPopover renders at rect (viewport-clamped, portaled to body)
                  └─ click "Ask Sarah →"
                       ├─ buildContext(range, selection) → EnrichedContext
                       ├─ track('contextual_ai_open', ...)
                       └─ adapter.prefillWithContext(ctx)
                            ├─ real:  window.AutoCrew.prefillWithContext(ctx)
                            └─ stub:  open StubDebugCard + console.info
```

## 4. Selection lifecycle

**Constants**
```ts
const MIN_CHARS = 15
const MAX_DISPLAY_CHARS = 120      // popover preview truncation
const MAX_SELECTION_CHARS = 1000   // hard cap on what we process
const DEBOUNCE_MS = 250
const SURROUNDING_CAP = 500
```

**Triggers**
- Listen to `mouseup` and `selectionchange` on `document`.
- On fire, read `window.getSelection()`. Bail if `isCollapsed`, `rangeCount === 0`, or `toString().trim().length < MIN_CHARS`.
- If selection > `MAX_SELECTION_CHARS`, truncate.
- Debounce 250 ms from the last event.

**Exclusions (ancestor walk from `range.commonAncestorContainer` to `body`)**
```ts
const EXCLUDED_SELECTORS = [
  'input', 'textarea', '[contenteditable=""]', '[contenteditable="true"]',
  'button', 'a', 'nav', 'code', 'pre', '[role="button"]',
  '[data-contextual-ai="off"]',
]
```
Any ancestor match → bail. `data-contextual-ai="off"` is the escape hatch stamped on `PhoneCallFab`, `CookieBanner`, and `CookiePreferencesDialog`.

**Touch / mobile no-op**
`window.matchMedia('(pointer: coarse)').matches === true` → hook never registers listeners.

**Popover positioning**
- `range.getBoundingClientRect()` → `{ top, left, width }`.
- Centered horizontally above the rect, 8 px gap.
- Flip below if `rect.top < 48`.
- Clamp horizontally to `[8, viewportWidth - 8]`.
- Rendered via React portal to `document.body`. `z-index: 50` (below cookie banner).

**Lifecycle events**

| Event | Behavior |
|---|---|
| Click inside popover | `buildContext` + `adapter.prefillWithContext` + hide |
| Click anywhere else | Hide |
| `scroll` / `resize` | Hide (track with reason) |
| `Escape` key | Hide + clear browser selection |
| Selection shortens below threshold | Hide |
| New valid selection | Replace position (no duplicate popovers) |
| Next.js client nav (pathname change, observed via `usePathname`) | Hide and reset state |

**Accessibility**
- Popover: `role="dialog"` with `aria-label="Ask Sarah about selected text"`.
- Single focusable button inside; keyboard users `Tab` to it.
- `Escape` closes and returns focus.
- Once-per-session `aria-live="polite"` hint: *"Press Tab to ask Sarah about the selected text."*
- No entrance animation if `prefers-reduced-motion: reduce`; otherwise 120 ms fade+rise.

## 5. Context enrichment

**Surrounding-paragraph walk**
```ts
const BLOCK_TAGS = new Set(['P','LI','BLOCKQUOTE','FIGCAPTION','H1','H2','H3','H4','H5','H6'])
const BOUNDARY_TAGS = new Set(['SECTION','ARTICLE','MAIN','FOOTER'])

function buildContext(range: Range, selection: string): EnrichedContext {
  const start = range.commonAncestorContainer
  let node: HTMLElement | null =
    start.nodeType === Node.TEXT_NODE ? start.parentElement : (start as HTMLElement)

  let nearestBlock: HTMLElement | null = null
  let boundary: HTMLElement | null = null
  while (node && node !== document.body) {
    if (!nearestBlock && (BLOCK_TAGS.has(node.tagName) || node.hasAttribute('data-block'))) {
      nearestBlock = node
    }
    if (BOUNDARY_TAGS.has(node.tagName) || node.hasAttribute('data-section')) {
      boundary = node
      break
    }
    node = node.parentElement
  }

  const surrounding = (nearestBlock?.textContent ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, SURROUNDING_CAP)

  return {
    selection,
    surrounding: surrounding || undefined,
    sectionLabel: inferSectionLabel(boundary),
    url: location.pathname,
  }
}
```

**Section label inference (no up-front `data-section` rollout)**
```ts
function inferSectionLabel(boundary: HTMLElement | null): string | undefined {
  if (!boundary) return undefined
  const explicit = boundary.getAttribute('data-section')
  if (explicit) return explicit
  const heading = boundary.querySelector('h1, h2, h3')
  if (heading?.textContent) {
    return heading.textContent.replace(/\s+/g, ' ').trim().slice(0, 80)
  }
  return boundary.getAttribute('aria-label') ?? boundary.id ?? undefined
}
```

## 6. Adapter contract

```ts
export interface EnrichedContext {
  selection: string       // exact highlighted text, <= 1000 chars
  surrounding?: string    // <= 500 chars, whitespace-collapsed
  sectionLabel?: string   // <= 80 chars
  url: string             // location.pathname (no search, no hash)
}

export interface ContextualAIAdapter {
  prefillWithContext(ctx: EnrichedContext): Promise<void> | void
}

export function resolveAdapter(): ContextualAIAdapter | null {
  const api = (window as any).AutoCrew
  if (api && typeof api.prefillWithContext === 'function') {
    return { prefillWithContext: (ctx) => api.prefillWithContext(ctx) }
  }
  if (process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB === 'true') {
    return stubAdapter
  }
  return null
}
```

Adapter is resolved **at click time**, not at mount time, because `widget.js` is loaded with `strategy="afterInteractive"` and may arrive after the provider mounts.

**Widget-team handoff — what they should implement**
```ts
window.AutoCrew.prefillWithContext = (ctx: EnrichedContext) => {
  const visibleMessage = `Can you explain this from your website: "${ctx.selection}"`
  const silentSystem = [
    ctx.sectionLabel && `Page section: ${ctx.sectionLabel}`,
    ctx.surrounding && `Surrounding text: ${ctx.surrounding}`,
    `URL: ${ctx.url}`,
  ].filter(Boolean).join('\n')

  window.AutoCrew.open()
  window.AutoCrew.prefill({ user: visibleMessage, system: silentSystem })
}
```

This repo never constructs the prompt string — prompt framing (including PRD Experiment 4's section-aware templates) belongs in the widget.

**PII guardrails**
- `url` is `location.pathname` only — drop `search` and `hash`.
- Selection and surrounding are public page content the visitor highlighted themselves; no new PII surface.
- No user identifiers, no cookies, no storage reads.

## 7. Analytics & consent

```ts
type ContextualAIEvent =
  | { name: 'contextual_ai_selection'; chars: number; sectionLabel?: string; path: string }
  | { name: 'contextual_ai_open';      chars: number; sectionLabel?: string; path: string; hasSurrounding: boolean }
  | { name: 'contextual_ai_dismissed'; reason: 'click_away' | 'escape' | 'scroll' | 'resize' }
  | { name: 'contextual_ai_adapter_missing'; path: string }

export function track(event: ContextualAIEvent) {
  document.dispatchEvent(new CustomEvent('contextual_ai', { detail: event }))
  if (typeof window.gtag === 'function' && hasAnalyticsConsent()) {
    const { name, ...params } = event
    window.gtag('event', name, params)
  }
}
```

- Popover is **always on** (subject to feature flags). It's a UI affordance, not tracking.
- Analytics events are **gated on the existing analytics consent category** via `hasAnalyticsConsent()`, which reads from `components/providers/consent-provider.tsx` (the same source that gates GA4 in `app/layout.tsx`).
- Consent is checked at event time so late-accepting visitors start being tracked from that point forward.
- `CustomEvent('contextual_ai')` is emitted regardless, so future destinations (Segment, internal observability) can subscribe without touching this code.

## 8. Feature flags (kill switches)

Checked in order, short-circuit on disabled:

| Layer | Mechanism | Default |
|---|---|---|
| Build-time | `NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED` | `true` |
| URL override | `?contextual-ai=off` / `on` | — |
| localStorage | `contextual-ai:disabled` key | — |

When disabled: provider returns `null`, no listeners attached, no popover renders.

`NEXT_PUBLIC_CONTEXTUAL_AI_STUB=true` additionally activates the stub debug card when `window.AutoCrew.prefillWithContext` isn't present.

## 9. Files

**Created**
```
lib/contextual-ai/adapter.ts
lib/contextual-ai/context.ts
lib/contextual-ai/events.ts
lib/contextual-ai/flags.ts
lib/contextual-ai/index.ts

components/contextual-ai/contextual-ai-provider.tsx
components/contextual-ai/selection-popover.tsx
components/contextual-ai/stub-debug-card.tsx
components/contextual-ai/use-text-selection.ts
components/contextual-ai/index.ts

__tests__/contextual-ai/context.test.ts
__tests__/contextual-ai/adapter.test.ts
__tests__/contextual-ai/flags.test.ts
```

**Modified**

| File | Change |
|---|---|
| `app/(public)/layout.tsx` | Wrap children with `<ContextualAIProvider>` |
| `components/layout/phone-call-fab.tsx` | Add `data-contextual-ai="off"` to root |
| `components/consent/cookie-banner.tsx` | Add `data-contextual-ai="off"` to root |
| `components/consent/cookie-preferences-dialog.tsx` | Add `data-contextual-ai="off"` to content root |
| `.env.example` | Document `NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED`, `NEXT_PUBLIC_CONTEXTUAL_AI_STUB` |
| `CLAUDE.md` | Short section: "Contextual AI — how to toggle, how to dogfood" |

## 10. Testing

**Unit (jsdom)**
- `buildContext` — selection inside `<p>`; inside `<li>`; inside nested `<div>` with no block ancestor; at `body` root; spanning two elements; surrounding text > 500 chars (verify cap).
- `inferSectionLabel` — explicit `data-section`; inferred from `<h2>`; fallback to `aria-label`; fallback to `id`; none.
- `resolveAdapter` — real API present; stub flag on + no API; stub flag off + no API.
- `isEnabled` — env flag combinations; URL override beats env; localStorage persists across reloads.

**Manual QA (from PRD §6.A, verified against the built feature)**
- Selection below / above threshold.
- Position: normal, near top (flip), near right edge (clamp).
- Widget not loaded yet; widget already open.
- Dismissal via click-away / Escape / scroll / resize.
- Rapid multi-select.
- Mobile touch device — no popover, no listeners.
- Keyboard selection — popover appears, Tab reaches it.
- iframes — does not interfere.

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Widget API ships late | Stub adapter unblocks dogfood + UI validation; production fails silent (no popover) |
| Popover conflicts with existing floating UI (`PhoneCallFab`, cookie banner) | `z-index: 50` below banner (60); `data-contextual-ai="off"` escape hatch on both FAB and banner |
| DOM walk explodes on complex layouts | Capped at `body`; surrounding capped at 500 chars; falls back to selection-only if no block ancestor found |
| Selection-change event thrash on drag | 250 ms debounce |
| Bundle weight | Popover + stub card lazy-loaded via `next/dynamic` from the provider; hook + context are tiny |
| SSR / hydration mismatch | Provider is `'use client'`; all DOM access guarded by `typeof window !== 'undefined'` |
| Stub shows in production | Stub gated on `NEXT_PUBLIC_CONTEXTUAL_AI_STUB` env var, not set in prod |

## 12. Rollout

1. Merge behind `NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED=true` (default on) with stub flag off. In production this means: popover appears, but clicks fire `contextual_ai_adapter_missing` and a no-op — safe.
2. Dogfood locally with stub flag on; validate payload quality against the debug card.
3. Share adapter contract (§6) with widget team.
4. Once widget ships `window.AutoCrew.prefillWithContext`, flip nothing — adapter auto-resolves to the real API at click time.
5. Collect 2 weeks of analytics against a baseline; publish findings.

---

*Next step: generate an implementation plan via `superpowers:writing-plans`.*
