# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Autocrew Marketing Site - Static Next.js 16 marketing website for the Autocrew AI-powered automation platform. This repo contains only the marketing/public-facing pages. Login and signup pages are static demos (no backend).

## Key Commands

```bash
npm run dev          # Start Next.js development server on localhost:3000
npm run build        # Build the application for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run typecheck    # Run TypeScript compiler check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run validate     # Run typecheck + lint + format:check
```

## Architecture

### Tech Stack

- **Framework**: Next.js 16 with App Router, React 19, Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom dark mode theme
- **UI Components**: Shadcn UI (New York style) with Radix UI primitives
- **Charts**: Recharts (for dashboard preview on landing page)

### Route Structure

- **`app/(public)/`**: Marketing pages (landing, about, contact, contact-support)
- **`app/(auth)/`**: Static login and signup pages (no backend)
- **`app/docs/`**: Documentation pages

### Component Organization

```
components/
├── ui/              # Shadcn UI primitives (auto-generated, don't edit)
├── landing/         # Landing page sections (hero, features, pricing, etc.)
├── docs/            # Documentation components
├── layout/          # Public navigation, footer, docs sidebar
└── providers/       # Theme provider
```

### Styling & Design System

- Dark mode is the default and primary theme
- **Primary (Cyan/Teal)**: `--primary: 185 80% 50%`
- **Background**: Dark slate (`222 47% 11%`)
- All UI components use CSS variables with HSL color space
- Shadcn components are in `components/ui/` and should not be modified directly

### Key Directories

```
lib/
├── constants/       # App config, routes
├── contexts/        # Theme context (client-side only)
├── hooks/           # useTheme, useLocalStorage
├── mock-data/       # Static data for landing and docs
└── utils/           # cn, slug generator, validators, transformers
```

### Path Aliases

- `@/*` maps to root directory (configured in `tsconfig.json`)

## Development Notes

- All pages are static - no database, no API routes, no authentication backend
- Login/signup pages are visual demos only
- Landing page data comes from `lib/mock-data/landing-data.ts`
- Docs content comes from `lib/mock-data/docs-content.ts`
- Theme toggle uses localStorage (no backend)

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills:

- `/office-hours` - Office hours workflow
- `/plan-ceo-review` - CEO review planning
- `/plan-eng-review` - Engineering review planning
- `/plan-design-review` - Design review planning
- `/design-consultation` - Design consultation
- `/design-shotgun` - Design shotgun
- `/design-html` - Design to HTML
- `/review` - Code review
- `/ship` - Ship workflow
- `/land-and-deploy` - Land and deploy
- `/canary` - Canary deployment
- `/benchmark` - Benchmarking
- `/browse` - Web browsing (use this for ALL web browsing)
- `/connect-chrome` - Connect to Chrome
- `/qa` - QA testing
- `/qa-only` - QA only testing
- `/design-review` - Design review
- `/setup-browser-cookies` - Setup browser cookies
- `/setup-deploy` - Setup deployment
- `/retro` - Retrospective
- `/investigate` - Investigation
- `/document-release` - Document a release
- `/codex` - Codex workflow
- `/cso` - CSO workflow
- `/autoplan` - Auto planning
- `/careful` - Careful mode
- `/freeze` - Freeze deployments
- `/guard` - Guard mode
- `/unfreeze` - Unfreeze deployments
- `/gstack-upgrade` - Upgrade gstack
- `/learn` - Learn workflow

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:

- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health

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

## Sales Deck Builder (`/decks`)

Internal-only deck builder for the AutoCrew sales team. Password-gated, browser-local (Workflow A — no DB), client-side PDF + PPTX export.

**Where to access**

- Live at `/decks/login` (set `DECKS_PASSWORD` and `DECKS_AUTH_SECRET` env vars first; see `.env.example`).
- Full design: `docs/superpowers/specs/2026-04-28-sales-deck-builder-design.md`
- Implementation plan: `docs/superpowers/plans/2026-04-28-sales-deck-builder.md` (+ `-part2.md`)
- Parking lot: `docs/superpowers/parking-lot/2026-04-28-{workflow-c-live-page-editor,deck-builder-v2-and-beyond}.md`

**Code layout**

- `app/(deck)/` — isolated route group with its own layout + `decks.css` (scoped to `[data-surface="deck"]`). Pages nest under `decks/` because `(deck)` is a route group with no URL segment, so e.g. `app/(deck)/decks/preview/[id]/page.tsx` resolves to `/decks/preview/<id>`.
- `app/api/decks/auth/route.ts` — POST password gate; HMAC cookie via `lib/deck/auth.ts`.
- `middleware.ts` (root) — gates `/decks/*` and `/api/decks/*`.
- `components/deck/primitives/*` — 7 slide primitives (SlideFrame, SlideHeader, DisplayHeadline, BodyCopy, Accent, MonoLabel, CodePanel).
- `components/deck/slides/*` — 13 slide templates composed from primitives.
- `components/deck/builder/*` — wizard, editor shell, slide rail (drag-reorder via `@dnd-kit`), slide stage, JSON inspector, login form, hidden render iframe, download buttons.
- `lib/deck/templates/*` — 4 deck-template manifests (Widget Pitch=15, Healthcare=10, Restaurant=10, Blank=2).
- `lib/deck/state.ts` + `draft-factory.ts` + `personalization.ts` + `hash.ts` + `canonical-json.ts` + `filename.ts` + `image.ts` — state layer.
- `lib/deck/exporters/{pdf,pptx,wait}.ts` — client-side export pipeline.

**Hard isolation rules**

- ESLint config blocks `components/deck/**` and `lib/deck/**` from importing `components/landing/**` or `components/layout/**`.
- Deck CSS variables live under `[data-surface="deck"]`, NOT `:root`. They also override marketing tokens (`--background`, `--primary`, etc.) so a stray Tailwind utility resolves to deck colors instead of cyan.
- The marketing site is untouched by the deck feature.

**Design system**

- Dark `#0A0A0A` bg, 6 swappable accent colors (green default), 2 swappable display styles (Instrument Serif italic / Geist 700). Per-deck choice via `DeckThemeProvider` cascading CSS vars.
- Slides are 1920×1080. PDF export uses `window.print()` with `@page` 1920×1080 rules in `decks.css`. PPTX export uses `html2canvas` per slide → `PptxGenJS` image-based PPT.

**End-to-end flow**

1. Sales hits `/decks` → password gate → gallery.
2. Picks a deck template → wizard form (prospect, accent, display style, optional sales-rep info — sales-rep persists per browser).
3. Editor opens at `/decks/preview/<id>`. Drag-reorder slides, toggle include/exclude, edit content via JSON inspector (right panel). Auto-save to localStorage debounced 500ms.
4. Click PDF → browser print dialog → Save as PDF (vector text).
5. Click PPTX → progress per slide → file downloads (image-based PPTX, opens in PowerPoint/Keynote pixel-identical to PDF).

**Drafts are browser-local** — no DB, no cross-machine sync, no sharing. PDF/PPTX is the artifact for sharing. If a sales rep's browser cache clears, the draft is gone (intentional for v1; see parking lot for Workflow B if/when persistence is needed).
