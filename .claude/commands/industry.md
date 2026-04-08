---
description: "Generate a complete industry-specific landing page following Autocrew's design system and the coaching page pattern. Triggers on: industry page, new industry, create industry page, vertical page, industry landing page."
---

# Industry Landing Page Generator

Generate a complete, conversion-optimized industry landing page at `/industry/{name}` following the exact patterns established by the coaching page (`/industry/coaching`).

**Usage:** `/industry {industry-name}` (e.g., `/industry restaurant`, `/industry "real estate"`)

If `$ARGUMENTS` is empty, ask the user which industry to build.

---

## Phase 1 — Research

Before writing any code, do web research on the target industry. Search for:

1. **Pain points** — What admin tasks consume the most time for professionals in this industry? (scheduling, follow-ups, client/customer management, intake, bookings)
2. **AI automation competitors** — What AI/automation solutions exist in this vertical? What messaging do they use?
3. **Industry terminology** — What do practitioners call themselves, their clients, their workflows? (e.g., coaches say "clients" and "sessions", restaurants say "guests" and "reservations")
4. **Metrics** — What stats exist about time wasted on admin, missed opportunities, or ROI from automation in this industry?

Synthesize findings into a brief research summary before proceeding.

---

## Phase 2 — Clarify

Ask the user 1-2 quick questions only if the industry is ambiguous:

- Target audience within the industry? (e.g., "restaurant owners" vs "restaurant chain managers")
- Any specific pain points or messaging angles to emphasize?

If the industry is clear and straightforward, skip this phase.

---

## Phase 3 — Plan (enter plan mode)

Generate a detailed section-by-section plan with all industry-specific content filled in. The plan must follow the **8-Section Template** below. Present for user approval before building.

### Content Strategy

- **Lead with the industry professional's world first, product second** (poly.ai pattern)
- Use industry-specific terminology, not generic SaaS speak
- Pain points should be visceral and relatable to practitioners in that field
- Testimonials should use realistic names and roles common in that industry
- FAQ should address the top objections specific to that vertical
- Metrics should be plausible and conservative (not hyperbolic)
- Hero workflow steps should reflect the actual workflow (e.g., restaurant: "Guest Calls → AI Books → You Host")

### 8-Section Template

Plan each section with specific content:

| #   | Section          | What to Plan                                                                                                                                 | Reference                                                |
| --- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | **Hero**         | Badge text, headline (prefix + accent), subheadline, primary CTA, secondary CTA, trust text (3 metrics), 3 workflow cascade steps with icons | `components/industry/coaching/coaching-hero.tsx`         |
| 2   | **Pain Points**  | Badge, headline, subheadline, 3 cards (icon, title, description)                                                                             | `components/industry/coaching/coaching-pain-points.tsx`  |
| 3   | **Features**     | Badge, headline (prefix + accent), 3 cards (icon, title, description, 4 bullet points each)                                                  | `components/industry/coaching/coaching-features.tsx`     |
| 4   | **Metrics**      | 4 stats: value, label, sublabel                                                                                                              | `components/industry/coaching/coaching-metrics.tsx`      |
| 5   | **How It Works** | 4 steps: number (01-04), title, description                                                                                                  | `components/industry/coaching/coaching-how-it-works.tsx` |
| 6   | **Testimonials** | Badge, headline, 3 testimonials: quote, name, role, initials, avatar gradient color                                                          | `components/industry/coaching/coaching-testimonials.tsx` |
| 7   | **FAQ**          | 6 questions with answers addressing industry-specific objections                                                                             | `components/industry/coaching/coaching-faq.tsx`          |
| 8   | **CTA + Footer** | Headline (line1 + line2), subheadline, brand description customized for industry                                                             | `components/industry/coaching/coaching-cta.tsx`          |

---

## Phase 4 — Build

After plan approval, create all files. **IMPORTANT: Before writing any component code, invoke the `/frontend-design` skill:**

```
/frontend-design {Industry} industry landing page for Autocrew AI automation platform - need to design a high-quality, conversion-optimized landing page at /industry/{name}
```

This ensures the design thinking framework is active and all components follow the aesthetics guidelines.

### Naming Convention

For industry `{name}` (e.g., "restaurant"):

- Route: `/industry/{name}`
- Page file: `app/(public)/industry/{name}/page.tsx`
- Data file: `lib/mock-data/{name}-data.ts`
- Components: `components/industry/{name}/{name}-{section}.tsx`
- Route constant: `INDUSTRY_{NAME_UPPER}` (e.g., `INDUSTRY_RESTAURANT`)
- Component exports: `{PascalName}{Section}` (e.g., `RestaurantHero`, `RestaurantFaq`)

### File Creation Order

#### Step 1: Data file — `lib/mock-data/{name}-data.ts`

Create all section data in a single file. Import reusable types:

```typescript
import type { StatItem, Step } from "@/lib/mock-data/landing-data";
import type { FAQItem } from "@/lib/mock-data/docs-content";
```

Required exports (replace `{name}` with industry name in camelCase):

```
{name}HeroData          — { badge, headline: { prefix, accent }, subheadline, primaryCta: { text, href }, secondaryCta: { text, href }, trustText, workflowSteps: [{ label, icon }] }
{name}PainPointsData    — { badge, headline, subheadline, items: [{ title, description, icon }] }
{name}FeaturesData      — { badge, headline: { prefix, accent }, items: [{ title, description, icon, bullets: string[] }] }
{name}Metrics           — StatItem[] (4 items: value, label, sublabel)
{name}Steps             — Step[] (4 items: number, title, description)
{name}TestimonialsData  — { badge, headline, items: [{ quote, name, role, initials, avatarColor }] }
{name}FaqItems          — FAQItem[] (6 items: question, answer)
{name}CtaData           — { headline: { line1, line2 }, subheadline, primaryCta: { text, href }, secondaryCta: { text, href } }
```

Define any needed interfaces (e.g., `{PascalName}PainPoint`, `{PascalName}Feature`, `{PascalName}Testimonial`).

#### Step 2: Page file — `app/(public)/industry/{name}/page.tsx`

Clone the structure from `app/(public)/industry/coaching/page.tsx`:

- Server component (no "use client")
- Export `metadata: Metadata` with SEO title, description, canonical URL, openGraph
- Import and render `JsonLd` with `faqPageSchema({name}FaqItems)`
- Render all 8 section components in order

#### Step 3: Components — `components/industry/{name}/`

Create 8 component files. **Each one must clone its coaching counterpart exactly in structure and styling**, only changing:

- Import paths (use new data file)
- Data variable names
- Component name

| File                      | Clone From                  | Notes                                                                    |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| `{name}-hero.tsx`         | `coaching-hero.tsx`         | Client component ("use client"). Update icon mapping for workflow steps. |
| `{name}-pain-points.tsx`  | `coaching-pain-points.tsx`  | Server component. Update icon imports.                                   |
| `{name}-features.tsx`     | `coaching-features.tsx`     | Server component. Update icon imports.                                   |
| `{name}-metrics.tsx`      | `coaching-metrics.tsx`      | Server component. No icon changes needed.                                |
| `{name}-how-it-works.tsx` | `coaching-how-it-works.tsx` | Server component. No changes beyond data imports.                        |
| `{name}-testimonials.tsx` | `coaching-testimonials.tsx` | Server component. No changes beyond data imports.                        |
| `{name}-faq.tsx`          | `coaching-faq.tsx`          | Server component. No changes beyond data imports.                        |
| `{name}-cta.tsx`          | `coaching-cta.tsx`          | Server component. Update brand description in footer.                    |

#### Step 4: Update existing files

1. **`lib/constants/index.ts`** — Add `INDUSTRY_{NAME_UPPER}: '/industry/{name}'` to ROUTES
2. **`lib/mock-data/landing-data.ts`** — Add the new industry to the `navLinks` industry dropdown items
3. **`components/layout/public-footer.tsx`** — Add `pathname === "/industry/{name}"` to the exclusion condition

### Design System Rules (MUST follow)

- **Fonts**: Space Grotesk (`font-space-grotesk`) for display/headings, Geist Sans (`font-geist`) for body text
- **Primary accent**: `#FF6B35` (warm orange) — used for badges, icon colors, hover glows, accent text
- **Glass cards**: `bg-linear-to-br from-foreground/[0.05] dark:from-white/5 to-transparent bg-white/[0.02] border border-white/[0.06] shadow-lg shadow-black/20`
- **Testimonial cards**: `bg-foreground/[0.03] dark:bg-white/[0.02] border border-foreground/[0.08] dark:border-white/[0.08]`
- **Icon boxes**: `w-12 h-12 rounded-lg bg-card border border-border` with hover glow `group-hover:shadow-[0_0_15px_-3px_rgba(255,107,53,0.3)]`
- **Animations**: `animate-fade-up` with staggered delays (100ms increments), `animate-scale-in` for hero visual, beam animations for how-it-works
- **Section spacing**: `pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32`
- **Max width**: `max-w-7xl mx-auto px-4 sm:px-6`
- **SectionBadge**: Import from `@/components/landing/section-badge`
- **Buttons**: `variant="pill"` / `variant="pill-outline"`, sizes `pill-md` / `pill-lg`
- **CTA section**: Must include the full contact grid (email, schedule demo, try Autocrew) + embedded footer (logo, nav columns, social links, copyright) — matching `coaching-cta.tsx` and `cta-section.tsx` layout exactly
- **Icons**: Use `lucide-react` — choose icons relevant to the industry

---

## Phase 5 — Review & Verify

### Accessibility & Visual Design Review

**IMPORTANT: After all components are created, invoke `/rams` on each component file:**

```
/rams components/industry/{name}/{name}-hero.tsx
/rams components/industry/{name}/{name}-pain-points.tsx
/rams components/industry/{name}/{name}-features.tsx
/rams components/industry/{name}/{name}-metrics.tsx
/rams components/industry/{name}/{name}-how-it-works.tsx
/rams components/industry/{name}/{name}-testimonials.tsx
/rams components/industry/{name}/{name}-faq.tsx
/rams components/industry/{name}/{name}-cta.tsx
```

Fix all issues by severity:

- **Critical (Must Fix)**: missing alt text, icon buttons without aria-label, non-semantic click handlers, missing link destinations
- **Serious (Should Fix)**: removed focus outlines, missing keyboard handlers, touch targets < 44x44px, color-only information
- **Moderate (Consider)**: heading hierarchy, positive tabIndex, roles without required attributes
- **Visual**: layout consistency, typography hierarchy, color contrast (4.5:1 min), dark mode consistency

### Build Verification

1. Run `npm run typecheck` — must pass with zero errors
2. Run `npx prettier --write` on all new files
3. Run `npm run build` — verify the new page appears in static output
4. Navigate to `/industry/{name}` in dev server
5. Verify all 8 sections render correctly
6. Test responsive: mobile (375px), tablet (768px), desktop (1280px)
7. Verify dark/light theme toggle works
8. Check all CTA links point to correct destinations
9. Verify nav dropdown links to the new page
