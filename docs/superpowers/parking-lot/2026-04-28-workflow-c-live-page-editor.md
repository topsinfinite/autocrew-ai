# Parking Lot — Workflow C: Live Page → Deck Editor

**Status:** Parked. Not in v1 of the deck builder. Revisit after Workflow A ships and we
have data on how sales actually uses it.
**Captured:** 2026-04-28
**Related spec:** `docs/superpowers/specs/2026-04-28-sales-deck-builder-design.md`

## The concept in one paragraph

Sales opens an existing marketing page (e.g., `/industry/healthcare`) in a special
"deck mode" by visiting `/decks/from?page=/industry/healthcare`. The page re-renders
itself as 16:9 slides using the deck design system (Instrument Serif italic,
DM Mono labels, #0A0A0A bg, accent palette) instead of as a scrolling website
layout. Sales edits inline (contenteditable headlines, swappable accent words,
overrideable stats), pulls in a prospect strip (logo, name, primary color), and
clicks **Download PDF / PPTX**. Marketing makes one page; sales gets a deck for free.

## Why we're not doing it now

- **Pages aren't slides.** The current marketing page sections (Hero, Stats,
  Features, AiCrews, ContactSales, HowItWorks, Faq, Cta) are designed for a
  ~7000px scrolling layout, not a 16:9 frame. Rebuilding each section to also
  render as a slide is real work and we'd be designing two surfaces in parallel.
- **Workflow A is enough for the immediate need.** Sales told us they need PDFs
  on their laptops "ASAP" — a template gallery + wizard + export gives them that
  without forcing every page to also be deck-shaped.
- **No data yet on which pages sales would actually convert.** We might find
  sales only ever wants the healthcare page as a deck, in which case it's cheaper
  to author "Healthcare pitch" as a Workflow A template than to build a generic
  page→deck transformer.
- **No DB constraint right now.** Workflow A ships without a backend; Workflow C
  doesn't change that, but the engineering surface area is much larger.

## What we'd need to build when we're ready

1. **Slide-mode renderer for each marketing section.** Each section component
   (`HeroSection`, `StatsSection`, etc.) gets a sibling `*.SlideMode.tsx` (or a
   prop `mode="slide"`) that renders the same content in 16:9 with deck design
   tokens.
2. **Section-to-slide-template mapping.** Decide, per section, which deck slide
   template it maps to (e.g., `HeroSection` → `Cover`, `FeaturesSection` →
   `FiveCardGrid`, `FaqSection` → `NumberedPoints`).
3. **A page-walker.** Read the page's section list (already easy — landing page
   is just a list of components in `app/(public)/page.tsx`), produce an ordered
   slide draft, hand to the existing `/decks/preview/[id]` editor.
4. **Per-page slide overrides.** Some pages will need a custom slide order or
   content tweaks for deck form. Each `(public)/.../page.tsx` could export an
   optional `deckSlides` array describing the deck variant.
5. **Inline contenteditable layer in the editor.** Probably already exists from
   Workflow A's tweak step; this would extend it to bind directly to each slide's
   text fields with character limits enforced.
6. **Per-prospect personalization layer that survives a page→deck import.**
   Prospect strip (logo, name, accent) needs to apply on top of the imported
   slides without losing the original copy.

## Decisions we'd need to revisit

- **Auto-import vs manual mapping.** Does picking a page produce a finished
  draft instantly, or does sales pick which sections become which slides?
- **Marketing change → existing decks.** If marketing edits a page after sales
  has downloaded a deck, do we re-render the deck (live link) or keep the
  downloaded snapshot (static)? Workflow A is implicitly snapshot; Workflow C
  invites the live-link expectation.
- **What about pages with effects** (animations, dashboards, charts)? These
  don't always translate to a static slide. Need a fallback story.

## When to revisit

Revisit Workflow C when **any** of these is true:

- Sales has used Workflow A for ≥ 1 month and is asking "can I just turn the
  healthcare page into a deck?"
- We're about to launch a new industry page and want it to ship with both a
  marketing page AND a deck without authoring twice.
- Marketing keeps making content changes that sales then has to re-paste into
  decks.

Until then, this stays parked.
