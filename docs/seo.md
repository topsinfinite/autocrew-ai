# SEO + AEO Playbook

This document is the source of truth for how the Autocrew marketing site is optimized for traditional search (Google) and AI answer engines (ChatGPT search, Perplexity, Claude, Google AI Overviews). Update it whenever the rules change — silent regressions are the enemy.

## Where SEO is configured

| Concern                                            | File                                                                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Root metadata, title template, OG/Twitter defaults | [app/layout.tsx](../app/layout.tsx)                                                       |
| Sitemap                                            | [app/sitemap.ts](../app/sitemap.ts)                                                       |
| Robots / AI crawlers                               | [app/robots.ts](../app/robots.ts)                                                         |
| `/llms.txt` (concise index for AI)                 | [app/llms.txt/route.ts](../app/llms.txt/route.ts)                                         |
| `/llms-full.txt` (full corpus for AI)              | [app/llms-full.txt/route.ts](../app/llms-full.txt/route.ts)                               |
| Schema generators                                  | [lib/seo/schemas.ts](../lib/seo/schemas.ts)                                               |
| OG image helper + per-page OG images               | [lib/seo/og-image.tsx](../lib/seo/og-image.tsx) and `app/(public)/**/opengraph-image.tsx` |
| Sarah training corpus (canonical narrative)        | [content/sarah-training/](../content/sarah-training/)                                     |

## Per-page metadata checklist

Every public route MUST export a `metadata` (or `generateMetadata`) object with:

- `title` — human-readable, ≤60 chars including the " | Autocrew" suffix from the root template.
- `description` — 140–170 chars, action-oriented, includes a key noun phrase.
- `alternates.canonical` — relative path (the root `metadataBase` makes it absolute).
- `openGraph.title` / `openGraph.description` / `openGraph.url` — duplicated from page metadata, always present.
- `openGraph.images[0]` — page-specific OG image route (1200×630). Falls back to root if omitted, but every pillar page should have its own.

Pages that are dynamic, gated behind authentication, or work-in-progress should set `robots: { index: false }` explicitly.

If the page UI is interactive (form, state, effects), keep the `page.tsx` server-side and extract the client portion to a sibling client component (`contact-form.tsx` is the reference pattern). Top-level `"use client"` blocks `metadata` exports.

## Schema deployment matrix

Schemas live in [lib/seo/schemas.ts](../lib/seo/schemas.ts) and are emitted via the `<JsonLd>` component.

| Schema                      | Where it ships                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `organizationSchema`        | Root layout (every page)                                                                                                         |
| `websiteSchema`             | Root layout (every page)                                                                                                         |
| `softwareApplicationSchema` | Home (`/`)                                                                                                                       |
| `faqPageSchema`             | Home, `/ai-receptionist`, `/docs/faq`, every industry page                                                                       |
| `howToSchema`               | Home, `/ai-receptionist`                                                                                                         |
| `serviceSchema`             | `/ai-receptionist`, `/widget`, every industry page                                                                               |
| `breadcrumbSchema`          | `/ai-receptionist`, `/widget`, every industry page, `/contact`, `/contact-support`, every docs page (via `DocsBreadcrumbSchema`) |
| `webPageSchema`             | `/about`, `/ai-receptionist`, `/widget`, every industry page, `/contact`, `/contact-support`                                     |

**Do NOT ship `aggregateRating` or `reviewSchema`** until real reviews are rendered on the page in HTML. Google's structured-data policy requires the rating to be visible — invisible ratings can trigger manual actions.

## OG image conventions

- Use the helper at [lib/seo/og-image.tsx](../lib/seo/og-image.tsx). Pass `title` and `description`; the helper produces a 1200×630 PNG with the brand gradient + orange accent.
- File location: `app/(public)/<route>/opengraph-image.tsx`. Next.js auto-wires the route at `<route>/opengraph-image`.
- Reference it from page metadata as `url: "/<route>/opengraph-image"`.
- Keep titles ≤6 words; descriptions ≤140 chars (else line breaks get ugly at 1200×630).

## AI crawler / AEO policy

`app/robots.ts` allows everything for the standard `*` agent and explicit allow-lists for: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Bytespider, CCBot, Applebot-Extended, DuckAssistBot, MistralAI-User, Cohere-AI.

Rationale: this is a marketing site. We **want** AI engines to index, summarize, and cite us. If we ever need to block a specific training crawler (e.g., `Google-Extended`), change its `allow: "/"` to `disallow: "/"` and document the decision here.

`/llms.txt` is the one-screen index for agents. `/llms-full.txt` concatenates the Sarah training corpus from `content/sarah-training/` (excluding `_template.md`, `README.md`, `CHANGELOG.md`). When you update a corpus file, the route is rebuilt automatically — no extra action needed.

## Sitemap freshness rule

`app/sitemap.ts` lists routes with explicit `lastModified` dates and priorities. Two rules:

1. **Bump `lastModified`** for any route whose page or supporting `lib/mock-data/*-data.ts` was edited in the same PR. Stale dates teach Google to ignore our `lastmod` signal.
2. **Industry pages stay at priority 0.8.** Pillar pages (`/`, `/ai-receptionist`, `/widget`) stay at ≥0.9. Docs at 0.6–0.9 by depth. Legal at 0.5.

## Updating the Sarah corpus

The corpus in `content/sarah-training/` is the source of truth for both (a) the AutoCrew widget admin upload and (b) `/llms-full.txt`. When a landing page or its `lib/mock-data/*.ts` source changes:

1. Edit the matching `.md` file in `content/sarah-training/`.
2. Bump the `version` and `last_updated` fields in the frontmatter.
3. Append a line to `content/sarah-training/CHANGELOG.md`.
4. Re-upload to AutoCrew admin under "Sarah → Knowledge documents."
5. `/llms-full.txt` picks up the change automatically on the next deploy.

## Production environment requirements

- `NEXT_PUBLIC_APP_URL` MUST be set to the canonical absolute URL (e.g. `https://autocrew-ai.com`). Without it, schemas, sitemap entries, and `metadataBase` resolve to `http://localhost:3000`.
- Verify after every deploy: `curl https://<host>/sitemap.xml | grep loc` should return absolute https URLs.

## Verification commands

| Check              | Command                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Type, lint, format | `npm run validate`                                                                          |
| Production build   | `npm run build`                                                                             |
| Sitemap            | `curl http://localhost:3000/sitemap.xml`                                                    |
| Robots             | `curl http://localhost:3000/robots.txt`                                                     |
| llms.txt           | `curl http://localhost:3000/llms.txt`                                                       |
| llms-full.txt      | `curl http://localhost:3000/llms-full.txt`                                                  |
| Schema             | Paste page URL into [Google Rich Results Test](https://search.google.com/test/rich-results) |
| OG preview         | Paste page URL into [opengraph.xyz](https://www.opengraph.xyz/)                             |

## When to update this doc

- A new schema generator is added to `lib/seo/schemas.ts`.
- A new pillar route is shipped.
- AI-crawler policy changes.
- The sitemap structure or freshness rule changes.
- A new convention emerges (e.g. `/.well-known/`, `humans.txt`, etc.).
