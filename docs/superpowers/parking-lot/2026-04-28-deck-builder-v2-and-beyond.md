# Parking Lot — Deck Builder v2 and Beyond

**Captured:** 2026-04-28
**Related spec:** `docs/superpowers/specs/2026-04-28-sales-deck-builder-design.md`
**Related parking-lot:** `docs/superpowers/parking-lot/2026-04-28-workflow-c-live-page-editor.md`

This is the catch-all of "we deliberately didn't build it in v1" items. Each entry has a
revisit trigger so we don't reopen things speculatively — only when the actual signal
shows up.

---

## Workflow B — DB-backed persistent workspace

**The concept:** Sales lands in `/decks` and sees a list of their saved decks, each editable
across machines and devices. Add per-user identity, "duplicate this deck," sharing via
preview link, version history.

**Why parked:** Requires Supabase / Vercel KV + an auth provider + an email service for
invites. Workflow A ships in days; B is a multi-week feature. Sales told us "ship ASAP."

**Trigger to revisit:**
- Sales builds >10 decks/week and re-types prospect data each time, OR
- Two reps need to collaborate on the same prospect deck, OR
- A rep loses drafts when their browser cache wipes and complains.

---

## Workflow C — Page → Deck Transformer

**Status:** Already documented in detail at
`docs/superpowers/parking-lot/2026-04-28-workflow-c-live-page-editor.md`. See that file
for the full concept, what it would take to build, and the trigger to revisit.

---

## Native editable PPTX (Option PPTX-2)

**The concept:** Each of the 13 slide templates gets a second author — a TypeScript
function that maps `DeckSlide` data → PptxGenJS API calls (text boxes with absolute
coords, fills, fonts as system fonts). Sales — and prospects — can edit text in
PowerPoint after download.

**Why parked:** ~1 day per template to author + visual QA × 13 templates = ~13 days. Same
order of magnitude as the entire v1 build, just for editable PPTX. Image-based PPTX
covers the "polished artifact for a prospect" case.

**Trigger to revisit:**
- Sales reports prospects asking to edit the PPTX, OR
- Sales themselves want to retype headlines in PowerPoint after download.

When we revisit: probably author native PPTX for only the 2-3 templates sales actually
needs editable, not all 13.

---

## Server-side export (Path B / Path C)

**Path B:** Upgrade to Vercel Pro ($20/mo), use the original server-side rendering design
with `@sparticuz/chromium-min` + `puppeteer-core`. Direct download for both formats.

**Path C:** Use an external rendering service (DocRaptor, Browserless, ApiTemplate) for
~$9–15/mo. Same outcome.

**Why parked:** Vercel Hobby's 10s timeout makes Path B infeasible without the upgrade.
Client-side rendering (Path A) is free and ships now. The only cost is the print dialog
extra-click for PDF.

**Trigger to revisit:**
- Sales complains about the print dialog ≥3 times, OR
- PPTX generation regularly takes >20s, OR
- We adopt native-editable PPTX (which benefits from server-side composition).

When we revisit: this is a 1-day refactor — the same `<DeckRender>` component moves
behind a `/api/decks/pdf` and `/api/decks/pptx` route. Editor, templates, design system,
and personalization model are all unchanged.

---

## Sharing a draft via preview URL

**The concept:** Sales generates a shareable link (still password-gated) that another rep
or their manager can open in any browser to see the current draft.

**Why parked:** Drafts are browser-local in Workflow A. Sharing requires persistence,
which requires Workflow B.

**Trigger to revisit:** Same as Workflow B.

---

## Multi-user collab on one draft

**The concept:** Two reps editing the same draft live, like Google Slides.

**Why parked:** Requires Workflow B + CRDT/operational-transform for conflict resolution.
Big engineering investment for a use case we have zero data on.

**Trigger to revisit:** Real demand from ≥2 reps repeatedly asking.

---

## Undo / Redo / Version history

**The concept:** Cmd+Z in the editor; restore previous versions of a slide.

**Why parked:** Real engineering investment for a tool not yet in user hands. Sales has
"Reset" (back to template defaults) as the v1 escape hatch.

**Trigger to revisit:** Sales reports lost work, OR sales wants to A/B copy variants
within a single deck session.

---

## Recent-drafts list UI in `/decks`

**The concept:** Below the deck-template gallery, show a "Continue editing" section with
the rep's last 5–10 drafts as thumbnails.

**Why parked:** Data model already supports it (we write `deck:list` to localStorage); the
UI is just not built. Easy add later as a polish iteration.

**Trigger to revisit:** After ~2 weeks of use.

---

## "Duplicate this deck" button

**The concept:** Open a draft, clone it with a new id, edit the clone for a new prospect.

**Why parked:** One-day add when needed. The DeckDraft is a JSON object — duplicating it
is a `structuredClone` + new id + write.

**Trigger to revisit:** Sales does the same prospect template twice for different
stakeholders, or two prospects in the same vertical with similar pitches.

---

## Per-rep / per-team custom deck templates

**The concept:** Right now the 4 deck templates are global and committed in
`lib/deck/templates.ts`. Per-rep templates would let reps save their own arrangements as
new starting points.

**Why parked:** Requires persistence beyond localStorage (Workflow B), or a clunky
"export/import deck template JSON file" flow that nobody will use.

**Trigger to revisit:** ≥3 reps independently customize the same template the same way →
that's a global-template change, not a per-rep one.

---

## Speaker notes

**The concept:** A notes panel per slide, exported to PPTX speaker-notes pane and to a
print-friendly handout PDF.

**Why parked:** Not asked for in v1. The data model has room for it (add
`slide.speakerNotes?: string`).

**Trigger to revisit:** Sales asks for it. Probably ~1 day of work — UI surface in the
inspector + PptxGenJS `slide.addNotes()` + a `print=notes` query param on the render
route for the handout PDF.

---

## Deck analytics — "which slides do prospects view longest"

**The concept:** Host the deck on a viewer page (instead of just sending PDF) so the deck
phones home with view-time per slide. Sales sees which slides held attention.

**Why parked:** Requires Workflow B (deck must live on a server) + a small analytics
backend + a viewer route + email-link delivery.

**Trigger to revisit:** Sales is sending decks weekly and has nothing to optimize from.

---

## Branded subdomain `decks.autocrew-ai.com`

**The concept:** Same Vercel project, just a domain alias on the `(deck)` route group.

**Why parked:** Cheap to add but cosmetic. `autocrew-ai.com/decks` is fine for v1.

**Trigger to revisit:** Whenever the team wants the visual separation, or when we move
the deck builder to its own deploy (which we shouldn't need to).

---

## Custom slide template authored in-browser

**The concept:** Sales designs a brand-new slide layout (not just edits an existing one)
inside the editor.

**Why parked:** Way out of scope. Engineering authors templates; sales picks and
customizes within them. Custom layouts are a different product.

**Trigger to revisit:** Probably never.

---

## Privatize the GitHub repo

**The concept:** Make `topsinfinite/autocrew-ai` private so committed slide template
default content (and any future sales-tactical copy) isn't public.

**Why parked:** Independent of this build. Vercel deploys public repos and private repos
identically.

**Trigger to revisit:** When sales-tactical or prospect-tier content is about to land in
`lib/deck/templates.ts`. Until then, only public-pitch-equivalent content goes in
committed defaults.

---

## CSS features to AVOID in slide kit (constraint, not parking-lot)

This isn't parked — it's a hard constraint that the slide-kit primitives must respect so
`html2canvas` produces faithful PPTX images. Listed here for visibility:

- ❌ `mask-image`, `-webkit-mask-image`
- ❌ `mix-blend-mode`, `background-blend-mode`
- ❌ `backdrop-filter`
- ❌ CSS Houdini paint worklets
- ❌ Non-trivial `filter` chains (avoid `blur()` on text; gradients-in-text via `background-clip` are also flaky)
- ✅ Solid fills, linear/radial gradients, borders, box-shadow, opacity, transform, all standard typography, web fonts via `next/font`

If a future template needs one of the avoided properties for visual punch, we either:
1. Find a `html2canvas`-safe alternative, OR
2. Render that single template via server-side chromium (Path B/C trigger).
