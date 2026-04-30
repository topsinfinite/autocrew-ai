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

## Sarah Training Corpus

Hand-authored Markdown documents that train the AutoCrew widget on this site live
in `content/sarah-training/`. One `.md` per landing page, plus a brand doc and a
product doc. Whenever a landing page or its `lib/mock-data/*.ts` source is edited,
update the matching `.md` file (bump `version` and `last_updated` in the
frontmatter, append a line to `CHANGELOG.md`), and re-upload it in the AutoCrew
admin under "Sarah → Knowledge documents."

See `content/sarah-training/README.md` for the page-to-doc mapping and the
authoring rules (no fabricated metrics, source files in frontmatter, 11-section
structure).
