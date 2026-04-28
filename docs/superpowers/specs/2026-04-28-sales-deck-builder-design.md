# Sales Deck Builder — Design Spec

**Status:** Approved design, awaiting implementation plan
**Date:** 2026-04-28
**Author:** Brainstorm session (Claude + jeberulz)
**Scope:** v1 of an internal-only deck builder for the AutoCrew sales team
**Parking lot:** `docs/superpowers/parking-lot/2026-04-28-workflow-c-live-page-editor.md` and `docs/superpowers/parking-lot/2026-04-28-deck-builder-v2-and-beyond.md`

---

## 1. Goal & constraints

### What we're building

A self-contained section of the marketing site, gated by a shared password, where the AutoCrew sales team can:

1. Pick from a small gallery of pre-built **deck templates** (Widget Pitch, Healthcare Pitch, Restaurant Pitch, Blank).
2. Fill out a one-screen **wizard** that captures prospect info, accent color, display style, and sales-rep info.
3. Land in a **slide-by-slide editor** with hybrid inline/side-panel editing, drag-reorder, include/exclude per slide, and "+ Add slide" from a catalog of 13 layouts.
4. **Download the deck as PDF (vector text, via `window.print()`) or PPTX (image-based, via `PptxGenJS` + `html2canvas`).**

### Hard constraints driving design choices

- **Ship ASAP.** Days, not weeks. Workflow A only (ephemeral / browser-local) — no DB, no auth provider, no email service.
- **Vercel Hobby plan** (10s serverless function timeout) — rules out server-side headless Chromium for v1.
- **Public GitHub repo** (`topsinfinite/autocrew-ai`) — accepted as a known risk; sensitive prospect-tier copy must NOT live in committed template defaults.
- **Marketing site must remain untouched** — zero changes to existing components, layout, or routes.
- **Sales-team-only access** — gated by single-password middleware.
- **Sales picks from two display styles** per deck: serif-italic (Instrument Serif) or bold-sans (Geist).
- **Sales picks from one of 6 accent colors** per deck.

### Explicit non-goals (parking-lot)

- No persistent database, no per-user accounts, no draft sharing.
- No collaborative editing, no version history, no undo/redo.
- No native-editable PPTX (image-based only in v1).
- No page→deck transformer (Workflow C is parked).

---

## 2. Architecture & isolation

### File layout

```
app/
├── (public)/                     # existing — UNTOUCHED
├── (auth)/                       # existing — UNTOUCHED
├── (deck)/                       # NEW — fully isolated route group
│   ├── layout.tsx                # own layout: NO PublicNav, NO BackgroundEffects, NO ContextualAIProvider
│   ├── decks.css                 # own design tokens, scoped to [data-surface="deck"]
│   ├── page.tsx                  # /decks — gallery of deck templates
│   ├── __login/page.tsx          # /decks/__login — password gate
│   ├── new/[deckTemplate]/page.tsx   # /decks/new/[deckTemplate] — wizard
│   ├── preview/[id]/page.tsx     # /decks/preview/[id] — editor + downloads
│   └── render/[id]/page.tsx      # /decks/render/[id] — chromeless slide stack (PDF/PPTX source)
└── api/
    └── decks/
        └── auth/route.ts         # POST → set HttpOnly cookie if password matches

middleware.ts                     # NEW — gates /decks/*, /api/decks/* with cookie check

components/deck/                  # NEW — slide kit + builder UI; MUST NOT import from components/landing/**
├── slides/
│   ├── Cover.tsx
│   ├── Problem.tsx
│   ├── Solution.tsx
│   ├── FiveCardGrid.tsx
│   ├── DetailWithCode.tsx
│   ├── SixCardGrid.tsx
│   ├── NumberedPoints.tsx
│   ├── HeadlineWithScreenshot.tsx
│   ├── HeadlineWithCode.tsx
│   ├── ComparisonTable.tsx
│   ├── ClosingCTA.tsx
│   ├── BigStat.tsx
│   └── Quote.tsx
├── primitives/
│   ├── SlideFrame.tsx
│   ├── SlideHeader.tsx
│   ├── DisplayHeadline.tsx
│   ├── BodyCopy.tsx
│   ├── Accent.tsx
│   ├── MonoLabel.tsx
│   └── CodePanel.tsx
└── builder/
    ├── TemplateGallery.tsx
    ├── WizardForm.tsx
    ├── EditorShell.tsx
    ├── SlideRail.tsx
    ├── SlideStage.tsx
    ├── SlideInspector.tsx
    ├── DownloadButtons.tsx
    └── DeckThemeContext.tsx

lib/deck/
├── templates.ts                  # the 4 deck-template manifests
├── slide-templates.ts            # the 13 slide-template registry (id → component, default content shape)
├── state.ts                      # localStorage I/O, hash, draft schema
├── personalization.ts            # variable substitution
├── tokens.ts                     # design tokens consumed by both React and PptxGenJS
└── exporters/
    ├── pdf.ts                    # window.print() flow
    └── pptx.ts                   # PptxGenJS + html2canvas flow
```

### Isolation rules (enforced by ESLint convention)

1. `components/deck/**` MUST NOT import from `components/landing/**` or `components/layout/**`.
2. `app/(deck)/layout.tsx` does NOT render `PublicNav`, `PublicFooter`, `BackgroundEffects`, or `ContextualAIProvider`.
3. Deck CSS is scoped via `[data-surface="deck"]` on the `(deck)/layout.tsx` root, so deck tokens never leak into the marketing site even though `globals.css` is shared at the root layout level. **Mechanically this means:** all deck CSS custom properties (`--deck-bg`, `--deck-accent-*`, etc.) are declared inside `[data-surface="deck"] { ... }` rather than `:root { ... }`. Tailwind utility classes are shared (no conflict — utilities are namespaced); only deck-specific tokens are scoped.
4. Instrument Serif and DM Mono are loaded via `next/font/google` **only** in `app/(deck)/layout.tsx` — they are NOT loaded on the marketing site.
5. New ESLint rule (or a code-review checklist item if rule-authoring is too heavy) enforces #1.

### Access gate

**Middleware (`middleware.ts`):**
```
matcher: ['/decks/:path*', '/api/decks/:path*']

For each matched request:
  - if path === '/decks/__login' or '/api/decks/auth' → allow
  - else: read cookie 'decks_auth'; if HMAC matches expected, allow; else redirect to /decks/__login (HTML) or 401 (API)
```

**`/api/decks/auth`:**
```
POST { password }
  - if password === env.DECKS_PASSWORD:
      - cookie = hmac(env.DECKS_AUTH_SECRET, "v1:" + Date.now())
      - Set-Cookie: decks_auth=<cookie>; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000 (30d); Path=/
      - return 204
  - else: rate-limit (5/min/IP, in-memory Map), return 401
```

Rate-limit storage is an in-process `Map<ip, attempts>` cleared every minute. Acceptable for a single-region Hobby deployment with 5–10 sales users; not a real defense against a determined attacker, but the password is the actual gate.

### Branch strategy

- New feature branch `feat/sales-deck-builder` from `main`.
- All work happens there. Merge to `main` when shippable.
- No long-lived branches.

### Deps added

- `pptxgenjs` (~5MB)
- `html2canvas` (~50KB)
- `@dnd-kit/core` + `@dnd-kit/sortable` (~30KB total) — for slide-list drag-reorder in the editor

That's it. No `puppeteer-core`, no `@sparticuz/chromium-min`, no auth library, no DB driver.

### Env vars added (production + local)

- `DECKS_PASSWORD` — the shared password sales uses on `/decks/__login`
- `DECKS_AUTH_SECRET` — random 32-byte hex for HMAC

---

## 3. Slide kit & design language

### Slide-template inventory (13 templates, all in v1)

| # | Template ID | Use case |
|---|---|---|
| 1 | `Cover` | Opening — logo + version chip + accent-word headline + sub + footer URL |
| 2 | `Problem` | Numbered eyebrow + 2–3 line headline + body + comparison strip |
| 3 | `Solution` | Numbered eyebrow + 2-line headline + body + horizontal dot-bullets |
| 4 | `FiveCardGrid` | Eyebrow + headline + sub + 5 numbered cards |
| 5 | `DetailWithCode` | Sub-numbered eyebrow + headline + body + "BEST FOR" bullets + code panel right |
| 6 | `SixCardGrid` | Eyebrow + headline + 2×3 grid of category cards |
| 7 | `NumberedPoints` | Eyebrow + headline + 2-col 6-item numbered list with hairline rules |
| 8 | `HeadlineWithScreenshot` | Eyebrow + 2-line headline + body + bullets + UI-screenshot card right |
| 9 | `HeadlineWithCode` | Eyebrow + 3-line stacked headline + full-width code block + footer caption |
| 10 | `ComparisonTable` | Eyebrow + 2-line headline + comparison table with our column highlighted |
| 11 | `ClosingCTA` | Centered logo + accent-word headline + sub + 2 CTA buttons + bottom rule |
| 12 | `BigStat` | One huge number + label + sub-context |
| 13 | `Quote` | Pull-quote / testimonial — italic display + attribution row |

### Design language (deck-only, separate from marketing site)

**Frame:** 16:9, authoritative size **1920×1080**. Outer margin 80px. Eyebrow baseline 80px from top. Headline starts 200px from top. 12-column grid, 24px gutter, 1760px content width.

**Colors:**
| Token | Hex | Use |
|---|---|---|
| `deck-bg` | `#0A0A0A` | Slide background |
| `deck-surface` | `#0F0F0F` | Card surface |
| `deck-border` | `#1F1F1F` | Hairlines, card borders |
| `deck-text-primary` | `#FFFFFF` | Headlines, body |
| `deck-text-muted` | `#7A7A7A` | Eyebrow, footer chips, secondary copy |
| `deck-accent-green` | `#5EBD3E` | Default accent |
| `deck-accent-yellow` | `#FFB900` | Alternate |
| `deck-accent-orange` | `#F78200` | Alternate (closest to current pitch deck) |
| `deck-accent-red` | `#E23838` | Alternate |
| `deck-accent-purple` | `#973999` | Alternate |
| `deck-accent-blue` | `#009CDF` | Alternate |

The accent is **per-deck, not per-slide.** Sales picks one accent in the wizard; it cascades to every accent word, dot bullet, table highlight, and CTA across the deck.

**Typography:**
| Token | Family | Size | Weight | LH | LS | Use |
|---|---|---|---|---|---|---|
| `display-xl` | Serif-italic mode: Instrument Serif italic / Bold-sans mode: Geist Sans 700 | 144px | 400 / 700 | 0.95 | -0.03em | Cover headline |
| `display-lg` | Same family pair | 96px | 400 / 700 | 1.0 | -0.025em | Section headlines |
| `display-md` | Same family pair | 64px | 400 / 700 | 1.05 | -0.02em | Standard slide headline |
| `body-lg` | Geist Sans | 22px | 400 | 1.45 | -0.005em | Slide body copy |
| `body-md` | Geist Sans | 16px | 400 | 1.5 | 0 | Card body |
| `mono-eyebrow` | DM Mono | 12px | 400 | 1.0 | 0.18em / UPPERCASE | `01 · THE PROBLEM` |
| `mono-label` | DM Mono | 11px | 400 | 1.4 | 0.12em / UPPERCASE | Card labels, footer chips |
| `mono-code` | DM Mono | 16px | 400 | 1.5 | 0 | Code panels |

**Two display styles per deck:**
- `serif-italic` (default) — Instrument Serif italic for `display-*` tokens
- `bold-sans` — Geist Sans 700 for `display-*` tokens (matches existing pitch deck)

`<DisplayHeadline>` reads `displayStyle` from `DeckThemeContext` and switches family + weight + italic on the same component — no template branching. Both variants share grid, spacing, accent palette, and primitives. Cost: one extra font load (lazy via `next/font`).

**Surfaces:** Outlined treatment, 1px `deck-border`. Cards have 2px radius, 32px padding, no shadow. Optional hairline gradient shell on Cover and ClosingCTA only (per DESIGN.md technique).

### Primitives

```tsx
<SlideFrame size="1920x1080" footer={...}>
  <SlideHeader number="01" label="THE PROBLEM" />
  <DisplayHeadline size="md" accent="green">
    Static forms send visitors into a <Accent>queue</Accent>. Conversations don't.
  </DisplayHeadline>
  <BodyCopy size="lg">
    Every "Contact us" button is a form. Every form is a wait...
  </BodyCopy>
  {/* template-specific block(s) */}
</SlideFrame>
```

Each of the 13 templates is a thin composition over these primitives.

### Deck templates (curated arrangements) shipped in v1

1. **Widget Pitch** — rebuild of the existing 15-slide AutoCrew Widget Pitch. Default accent `orange`, default display `bold-sans` (matches existing).
2. **Healthcare Pitch** — sourced from `AutoCrew-Healthcare-06APR2026.key/.pptx` content. Default accent `green`, default display `serif-italic`.
3. **Restaurant Industry Pitch** — sourced from `app/(public)/industry/restaurant/page.tsx` copy + structure. Default accent `orange`, default display `serif-italic`.
4. **Blank** — `Cover` + `ClosingCTA` only; sales adds slides.

A deck template is a JSON manifest in `lib/deck/templates.ts`:

```ts
{
  id: 'widget-pitch',
  name: 'Widget Pitch (15 slides)',
  thumbnail: '/decks/thumbs/widget-pitch.jpg',
  defaultAccent: 'orange',
  defaultDisplayStyle: 'bold-sans',
  slides: [
    { template: 'Cover',    content: { eyebrow: 'V1.1 · LIVE', headlineParts: [...], sub: '...' } },
    { template: 'Problem',  content: { number: '01', label: 'THE PROBLEM', ... } },
    // ...
  ]
}
```

Adding more deck templates later is a content-only PR. No engineering.

---

## 4. Builder wizard UX

### Screen flow

```
/decks/__login → /decks → /decks/new/[deckTemplate] → /decks/preview/[id] → /decks/render/[id]
   password       gallery     wizard form (cover-info)     editor + downloads      chromeless slides
```

### Screen 1 — `/decks/__login`

One password field, one button. Same deck design system. POSTs to `/api/decks/auth`. On success, redirects to `/decks`. On failure, shows `ACCESS DENIED` eyebrow for 3 seconds. Rate-limited 5/min/IP.

### Screen 2 — `/decks` (gallery)

Grid of 4 deck-template cards, each showing the template's first slide as a 16:9 thumbnail. Hover reveals slide count + "Use this deck →". Below the gallery: small note *"Drafts live in this browser only — download as PDF/PPTX to keep them."*

No "my drafts" list in v1 (data model supports adding it later).

### Screen 3 — `/decks/new/[deckTemplate]` (wizard form)

One screen. All fields optional except prospect name.

**Required:**
- **Prospect name** (text)

**Default-shown:**
- **Prospect industry** (text)
- **Accent color** (visual radio, 6 swatches; pre-fills from template's `defaultAccent`)
- **Display style** (visual radio, 2 cards "Aa" in serif-italic vs bold-sans; pre-fills from template's `defaultDisplayStyle`)
- **Prospect logo** (image upload, max 200KB enforced + downscaled client-side via `<canvas>`; stored as base64 data URL)

**Behind a `+ More personalization (optional)` disclosure:**
- **Prospect contact name** (text)
- **Prospect deal value** (free-text, sales formats themselves: "$50,000")
- **Sales rep name** (text; pre-filled from `localStorage["deck:sales-rep-profile"]` if present)
- **Sales rep email** (text; pre-filled from same; saved back on submit)

Click **Generate deck →**:
1. Compute `id = sha1(canonical-JSON(draft)).slice(0, 12)`
2. Write `localStorage["deck:" + id] = draft`
3. Push `id` into `localStorage["deck:list"]`
4. Persist sales-rep profile to `localStorage["deck:sales-rep-profile"]`
5. Navigate to `/decks/preview/[id]`

### Screen 4 — `/decks/preview/[id]` (editor)

Layout:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to decks   autocrew-001 · widget-pitch          [PDF] [PPTX] [Reset]   │  top bar
├──────────────┬─────────────────────────────────────────────────────────────────┤
│ SLIDES       │                                                                 │
│ ▣ 01 Cover   │                                                                 │
│ ▣ 02 Problem │              ┌───────────────────────────┐                      │
│ ▣ 03 Solution│              │   [active slide rendered  │                      │
│ ▣ 04 5-grid  │              │    at fit-to-viewport,    │                      │
│ ▣ 05 Detail  │              │    16:9 aspect locked,    │                      │
│ ▢ 06 6-grid  │              │    contenteditable on     │                      │
│ ▣ 07 Numbers │              │    text fields]           │                      │
│ ...          │              │                           │                      │
│              │              └───────────────────────────┘                      │
│ + Add slide  │                                                                 │
├──────────────┴─────────────────────────────────────────────────────────────────┤
│  ← prev   01 / 12   next →                              [Edit theme]           │  bottom bar
└────────────────────────────────────────────────────────────────────────────────┘
```

**Left rail (slide list):**
- Thumbnail-sized list of slides in deck order.
- ▣ = included in export; ▢ = excluded (toggle without deleting).
- Drag handles for reorder.
- `+ Add slide` opens a popover with all 13 slide templates; clicking inserts at end (or below current).

**Center stage:**
- Active slide rendered at viewport fit, locked 16:9 aspect, letterboxed if window is wrong aspect.
- Reads from the `[data-surface="deck"]` design tokens. Uses real Instrument Serif / DM Mono / Geist via `next/font`.

**Hybrid editing model (chosen design):**
- **Click any text** on the slide → it becomes a focused contenteditable region; char-limit chip appears bottom-right of the text element. Blur to commit.
- **Click any non-text field** (image slot, accent dot, card background) → right-side **slide inspector panel** opens with form fields specific to that slide template (e.g., for `FiveCardGrid`: an array of 5 cards, each with `number`, `title`, `body`).
- **The inspector also exposes deck-wide theme** (accent color, display style, prospect strip) under "Edit theme" — flipping it cascades to all slides.

**Top-bar buttons:**
- **PDF** → triggers client-side PDF flow (Section 5).
- **PPTX** → triggers client-side PPTX flow (Section 5).
- **Reset** → confirm modal; reload from deck-template defaults but preserve prospect strip + theme.

**Auto-save:** every change writes back to `localStorage["deck:" + id]` debounced 500ms. The `id` does NOT change on edit (URL stays stable).

### Screen 5 — `/decks/render/[id]` (chromeless)

A vertical stack of N rendered slides at 1920×1080 each, no margin between them. No editor chrome, no nav, no inspector. `<meta name="robots" content="noindex,nofollow">`. Gated by the same auth.

This is the **shared source for both export pipelines**:
- The PDF flow opens this in a hidden iframe and calls `window.print()` on it.
- The PPTX flow opens this in a hidden iframe and walks each `[data-deck-slide]` element with `html2canvas`.

Sales never visits this directly.

### Edge cases handled

- **Different machine:** opening `/decks/preview/[id]` on a machine without that draft in localStorage → "Draft not found in this browser. Start a new deck →"
- **Two tabs:** banner via `BroadcastChannel` API: *"Heads up — this deck is open in another tab; your edits may overlap."* Last write wins per field.
- **localStorage quota exceeded:** evict oldest draft, retry once, toast: *"Storage full — old drafts removed. Download decks you want to keep."*
- **Logo over 200KB:** client-side downscale via `<canvas>` to fit under cap; on extreme cases, reject with a friendly error.

---

## 5. Export pipeline (client-side, Path A)

### PDF — `window.print()` with print stylesheet

**Trigger:** sales clicks **Download PDF** in the editor top bar.

**Flow:**
```ts
async function downloadPdf(draftId: string) {
  const iframe = document.getElementById('deck-render-iframe') as HTMLIFrameElement;
  // iframe is mounted with src="/decks/render/<id>" already, kept warm
  await waitForFonts(iframe.contentWindow!);    // document.fonts.ready
  await waitForImages(iframe.contentDocument!); // all <img>.complete
  iframe.contentWindow!.focus();                // required by some browsers for window.print()
  iframe.contentWindow!.print();                // opens browser print dialog
}
```

**Print stylesheet (loaded inside `/decks/render/[id]`):**
```css
@page {
  size: 1920px 1080px;
  margin: 0;
}
@media print {
  html, body { width: 1920px; height: 1080px; background: #0A0A0A; }
  [data-deck-slide] {
    width: 1920px; height: 1080px;
    page-break-after: always;
    break-after: page;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  [data-deck-slide]:last-child { page-break-after: auto; }
}
```

**Output:** vector text PDF, ~200–400KB for 15 slides, native browser quality. Sales picks "Save as PDF" in the print dialog destination dropdown (preselected on Chrome/Edge), names the file, hits Save.

**Suggested filename hint** (set via `document.title` of the render iframe before printing):
```
autocrew-<deck-template>-<prospect-slug>-<YYYY-MM-DD>
```
Most browsers use `document.title` as the default Save As filename in the print dialog.

**Trade-off accepted:** one extra click (Save dialog) vs. direct download. Vector quality is worth it for a sales artifact emailed to prospects.

### PPTX — `PptxGenJS` + `html2canvas`

**Trigger:** sales clicks **Download PPTX**.

**Flow:**
```ts
async function downloadPptx(draftId: string) {
  const iframe = document.getElementById('deck-render-iframe') as HTMLIFrameElement;
  const doc = iframe.contentDocument!;
  await waitForFonts(iframe.contentWindow!);
  await waitForImages(doc);

  const slides = Array.from(doc.querySelectorAll('[data-deck-slide]'));
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'AC_16x9', width: 13.333, height: 7.5 });
  pptx.layout = 'AC_16x9';

  // sequential to keep memory bounded; show per-slide progress
  for (let i = 0; i < slides.length; i++) {
    setProgress(i, slides.length);
    const canvas = await html2canvas(slides[i] as HTMLElement, {
      scale: 2,                    // 3840×2160 PNG per slide
      backgroundColor: '#0A0A0A',
      useCORS: true,
      logging: false
    });
    const dataUrl = canvas.toDataURL('image/png');
    pptx.addSlide().addImage({ data: dataUrl, x: 0, y: 0, w: 13.333, h: 7.5 });
  }

  await pptx.writeFile({ fileName: filename(draft) + '.pptx' });
}
```

**Output:** image-based PPTX, ~6–10MB for 15 slides. Each slide is a single full-bleed PNG; not editable in PowerPoint.

**Trade-off accepted (parking-lot for native-editable PPTX):** sales sends finished decks; they don't need to edit text in PowerPoint after download. Image-based gives pixel-perfect parity with PDF + zero double-authoring of templates.

**Performance:** ~5–10s of user CPU for 15 slides at 2× scale. Progress indicator ticks per slide so sales sees movement.

### Hidden render iframe — kept warm

The editor mounts `<iframe src="/decks/render/[id]" hidden>` on load. By the time sales clicks Download, fonts and images are typically already cached. Reduces export-button latency.

### Why no server-side export

- Vercel Hobby: 10s function timeout, chromium-min cold-start alone is 5–10s.
- Workflow A is browser-local; doing the export in the browser is the natural extension.
- If we ever upgrade to Vercel Pro or hit a quality limit with `html2canvas`, **moving to server-side is a 1-day refactor** — same `<DeckRender>` component, just behind an API route.

---

## 6. Personalization & state

### Personalization scopes

```
SCOPE 1 — DECK THEME (set once per deck, applies to every slide)
  • theme.accent           → all <Accent> word colors, dot bullets, table highlights
  • theme.displayStyle     → 'serif-italic' | 'bold-sans'

SCOPE 2 — PROSPECT (set once per deck, available to any template via {{...}})
  • prospect.name
  • prospect.industry
  • prospect.contactName
  • prospect.dealValue       (free text, sales formats)
  • prospect.logoDataUrl     (base64, ≤200KB)

SCOPE 2b — SALES REP (set once per browser, pre-filled on every deck)
  • salesRep.name
  • salesRep.email

SCOPE 3 — SLIDE CONTENT (per slide instance, edited inline)
  • Anything specific to that slide template
```

### Variable substitution — `{{ ... }}` mustache-lite

```ts
// lib/deck/personalization.ts
const ALLOWED = [
  'prospect.name', 'prospect.industry', 'prospect.contactName', 'prospect.dealValue',
  'salesRep.name', 'salesRep.email',
  'date', 'date.short'
];
export function substitute(text: string, ctx: SubstitutionContext): string {
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
    if (!ALLOWED.includes(path)) return '';
    return get(ctx, path) ?? '';
  });
}
```

- `date` → `"April 2026"`; `date.short` → `"04/2026"`.
- Variables not in the whitelist render as empty strings (not literal `{{...}}`).
- Default content is written so optional vars look clean when blank — variables appear standalone (e.g., on a footer chip), not embedded mid-sentence.

### State model (`DeckDraft`)

```ts
type AccentToken = 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'blue';
type DisplayStyle = 'serif-italic' | 'bold-sans';
type SlideTemplateId = 'Cover' | 'Problem' | 'Solution' | 'FiveCardGrid'
  | 'DetailWithCode' | 'SixCardGrid' | 'NumberedPoints'
  | 'HeadlineWithScreenshot' | 'HeadlineWithCode' | 'ComparisonTable'
  | 'ClosingCTA' | 'BigStat' | 'Quote';

type DeckDraft = {
  id: string;                  // sha1(canonical(draft)).slice(0,12); stable across edits
  schemaVersion: 1;
  template: 'widget-pitch' | 'healthcare-pitch' | 'restaurant-pitch' | 'blank';
  createdAt: string;           // ISO
  theme: {
    accent: AccentToken;
    displayStyle: DisplayStyle;
  };
  prospect: {
    name?: string;
    industry?: string;
    contactName?: string;
    dealValue?: string;        // free text
    logoDataUrl?: string;      // base64, ≤200KB
  };
  salesRep: {
    name?: string;
    email?: string;
  };
  slides: Array<{
    uid: string;               // slide instance id, stable across edits
    template: SlideTemplateId;
    included: boolean;         // ▣ vs ▢
    content: SlideContent;     // shape depends on template
  }>;
};
```

### localStorage layout

```
"deck:list"                    → string[]  (ids in this browser, newest first)
"deck:<id>"                    → DeckDraft JSON
"deck:<id>:thumb"              → optional cached slide-1 thumbnail (data URL)
"deck:sales-rep-profile"       → { name?: string; email?: string }
```

### Quotas + safety

- Browser quota ~5–10MB; typical draft 5–50KB; logo ≤200KB.
- On `QuotaExceededError`: evict oldest from `deck:list`, retry once, toast user.
- No PII leaves the browser. localStorage is per-origin, per-browser.

### Lifecycle

| Moment | What happens |
|---|---|
| Wizard submit | Compute id, write draft, push id to list, save sales-rep profile, navigate to preview |
| Editor field edit | Debounced 500ms write to `deck:<id>`; id unchanged |
| Reset | Confirm; reload from template defaults; preserve prospect + theme |
| Tab close | Nothing; draft persists in localStorage |
| Browser data cleared | Draft is gone (Workflow A trade-off, accepted) |
| Download PDF/PPTX | Render iframe reads draft by id; export; draft unchanged |

---

## 7. Out of scope for v1 (parking-lot)

See `docs/superpowers/parking-lot/2026-04-28-deck-builder-v2-and-beyond.md` for full list with revisit triggers. Highlights:

- **Workflow C** — page→deck transformer (separate parking-lot doc already written).
- **Workflow B** — DB-backed persistent workspace, sharing, per-user identity.
- **Native editable PPTX** — double-authored slide templates.
- **Server-side rendering** — Vercel Pro upgrade path or external service (DocRaptor / Browserless).
- **Recent-drafts list UI**, **duplicate deck**, **per-rep templates**, **speaker notes**, **deck analytics**, **branded subdomain**.

---

## 8. Known risks (tracked, not blocking)

1. **Public GitHub repo.** Slide template default content (e.g., "Static forms send visitors into a queue") will sit in `lib/deck/templates.ts` and be visible to the world. Fine for content already in your public pitch PDF; **never put** internal-only positioning, objection handling, pricing tactics, or prospect-tier discount logic in committed templates. Sales tunes that per-deck at runtime in their browser only. Mitigation path: privatize the repo when convenient — independent of this build.

2. **Cold-start of `/decks/render/[id]` iframe.** First export per session waits for fonts to load (~1–2s on a fresh page). The "kept warm" iframe pattern minimizes this. Acceptable.

3. **`html2canvas` quirks.** Known issues with some CSS features (mask-image, certain blend modes). Slide kit will be designed to use only properties `html2canvas` supports faithfully (border, background-color, gradient, transform, opacity, box-shadow, all standard typography). No CSS masks, no `mix-blend-mode`, no `backdrop-filter`. This is a real design constraint that the slide-kit builder must respect.

4. **Print dialog UX.** Sales has to click "Save" in the print dialog. After ~3 decks, muscle memory. If complaints accumulate, move to Vercel Pro and switch to server-side direct download (1-day refactor).

5. **No backup of drafts.** A sales rep's browser cache wipe = their drafts are gone. They've already downloaded the PDFs they care about, but partial drafts are lost. Acceptable for v1; Workflow B fixes it.

6. **Single shared password.** No per-user audit trail. If the password leaks, rotate `DECKS_PASSWORD` env var (sales gets new password from you). For v1 with a small stable team, acceptable.

---

## 9. Implementation phasing (informal)

The full implementation plan will be written next via the writing-plans skill. Rough sequencing:

1. **Foundation** — route group, layout isolation, design tokens, `next/font` for Instrument Serif + DM Mono, password middleware + `/decks/__login`.
2. **Primitives** — `SlideFrame`, `SlideHeader`, `DisplayHeadline`, `BodyCopy`, `Accent`, `MonoLabel`, `CodePanel`. Visual QA in a dev-only `/decks/__primitives` page (NOT Storybook — adds heavy dep for a small surface; one route is lighter).
3. **Slide kit** — 13 slide templates + visual QA. **Note for the implementation plan:** each template needs a concrete `SlideContent` shape (TypeScript discriminated union), e.g., `Cover` content has `{ eyebrow, headlineParts, sub, footerUrl }`, `FiveCardGrid` has `{ eyebrow, headline, sub, cards: Card[5] }`, etc. Spec leaves `SlideContent` polymorphic; the plan must enumerate concrete shapes per template before building.
4. **Deck templates** — 4 deck-template manifests with default content.
5. **State + personalization** — `lib/deck/state.ts` + `lib/deck/personalization.ts` with unit tests.
6. **Wizard** — `/decks/new/[deckTemplate]/page.tsx` with form, sales-rep persistence, hash + redirect.
7. **Editor** — left rail, center stage, hybrid editing, inspector, theme editor.
8. **Render route** — `/decks/render/[id]/page.tsx` chromeless stack, print stylesheet, hidden-iframe wiring.
9. **Exports** — `lib/deck/exporters/pdf.ts` + `lib/deck/exporters/pptx.ts`, progress UI on PPTX button.
10. **Gallery** — `/decks/page.tsx` with deck-template thumbnail grid.
11. **Polish** — empty states, edge cases (different machine, two tabs, quota), filename generation.

---

## 10. Approval

Design approved by user on 2026-04-28 (asynchronous brainstorming session). Implementation plan to follow.
