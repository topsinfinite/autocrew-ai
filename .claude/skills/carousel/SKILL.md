---
name: carousel
description: "Content operating system for LinkedIn and Instagram carousel posts. Creates carousel content with markdown drafts, HTML rendering, and Figma export. Supports multiple layouts, variable slide counts, build-in-public mode, and learns from past performance. Triggers on: carousel, create a carousel, daily content, single post about, build in public post, carousel about, social media post, make a post, content for today."
---

# Autocrew Carousel Content Engine

Generate LinkedIn + Instagram carousel posts using the content operating system at `content-marketing/`.

**Usage:**
- `/carousel` — auto-pick theme from content calendar
- `/carousel {topic}` — override with custom topic
- `/carousel {topic} --slides {N}` — custom topic + slide count (3-7)
- `/carousel --bip` — build-in-public from recent git activity
- Natural language: "create a carousel about X", "daily content", "make a post about Y"

If `$ARGUMENTS` contains a topic, use it. If `--slides N` is present, extract N (validate 3-7). If `--bip` flag is present, enable build-in-public mode. If empty, auto-pick from the content calendar.

---

## Phase 0 — Context Loading

**Do not interact with the user during this phase. Read all context files silently.**

Read these files in parallel:

| # | File | Purpose |
|---|------|---------|
| 1 | `content-marketing/_brand/voice-guide.md` | Tone, vocabulary, dos/donts |
| 2 | `content-marketing/_brand/icon-reference.md` | Iconify Solar icons by theme |
| 3 | `content-marketing/_themes/content-calendar.md` | 7-day theme rotation + hooks bank |
| 4 | `content-marketing/_templates/carousel-post.md` | Field schema + character limits |
| 5 | `content-marketing/_templates/captions.md` | LinkedIn + Instagram caption structure |
| 6 | `content-marketing/_feedback/performance-log.md` | Past engagement data (if exists) |
| 7 | `content-marketing/_feedback/style-notes.md` | Design/copy corrections (if exists) |
| 8 | `content-marketing/_layouts/README.md` | Available layouts catalog |

Also:
- List `content-marketing/_layouts/*.html` to know available layouts
- List `content-marketing/posts/` to check existing posts and avoid duplicate topics
- Read `components/layout/logo.tsx` for the SVG logo data (needed for HTML generation)

**If `--bip` mode:**
- Run `git log --oneline -15` to get recent work
- Read `lib/mock-data/landing-data.ts` for product context
- Optionally read `lib/mock-data/coaching-data.ts` and `lib/mock-data/restaurant-data.ts` if recent commits touch industry pages

**Apply feedback before generating any content:**
- From `performance-log.md`: identify which themes/angles/hooks scored highest. Lean toward high performers. Avoid repeating low-scoring angles.
- From `style-notes.md`: apply all copy, design, and tone corrections. These are hard rules — follow them exactly.

---

## Phase 1 — Content Strategy

### 1.1 Determine Theme

- **Auto mode** (no arguments): Look up today's day of week in the content calendar:
  - Monday = Core Value Prop
  - Tuesday = Industry Spotlight (check week number: W1=Healthcare, W2=Coaching, W3=Restaurant, W4=General B2B)
  - Wednesday = Feature Highlight (rotate through the 8-feature list)
  - Thursday = Social Proof & Metrics
  - Friday = Behind the Tech
  - Saturday = Problem / Solution
  - Sunday = Vision / Culture

- **Override mode** (topic provided): Use the user's topic. Map it to the closest theme category for layout recommendation.

- **Build-in-public mode** (`--bip`): Summarize recent git commits into a narrative. Focus on what was built, shipped, or improved. Reference specific features by their user-facing names (from mock-data files), not technical implementation details.

### 1.2 Determine Slide Count

- If `--slides N` provided: use N (must be 3-7)
- Default: 5

### 1.3 Select Hook Format

Choose from the Content Hooks Bank based on theme + feedback:
- **Contrast**: "Stop [old way]. / Start [new way]." — best for value props
- **Question**: "What if your [thing] / could [benefit]?" — best for features
- **Stat shock**: "[Big number] / [context that surprises]" — best for social proof
- **Future state**: "Imagine [outcome] / without [pain point]" — best for vision
- **Challenge**: "Your [competitor/status quo] / can't do this." — best for differentiation

### 1.4 Present Strategy Summary

Present to the user for confirmation:

```
CONTENT STRATEGY
================
Date:        [YYYY-MM-DD]
Theme:       [theme name]
Topic:       [specific angle]
Hook type:   [Contrast/Question/etc] — [why this hook]
Slides:      [N]
Feedback:    [any adjustments from performance/style logs, or "No prior feedback"]

Proceed? (confirm / adjust)
```

Wait for user confirmation before moving to Phase 2.

---

## Phase 2 — Layout Selection

**Always present layout options to the user.** Use AskUserQuestion to let them choose.

### Available Layouts

Read `content-marketing/_layouts/README.md` for the current catalog. At launch:

| Layout | Style | Best For |
|--------|-------|----------|
| **Default** | Editorial, clean top rail `01/05`, chat UI showcase, vertical features, hero metric + testimonial, orange CTA | Brand awareness, value props, industry spotlights, social proof, culture |
| **Pipeline** | Technical, glass-panels, workflow pipeline diagram, bento grid, comparison bars, terminal CTA, white button | Build-in-public, feature deep-dives, behind-the-tech, dev audience, launches |

### Recommendation Logic

- Core Value Prop / Vision / Culture / Industry Spotlight / Social Proof → recommend **Default**
- Behind the Tech / Build-in-Public / Feature Highlight / Problem-Solution → recommend **Pipeline**
- User can always override

### Slide Content Adapts to Layout

The chosen layout determines slide structure:

**Default layout slides:**
- Slide 1: 3-line headline (white/zinc-500/#FF4500), subtitle, status line
- Slide 2: Agent chat conversation (2 agent messages + 1 user message)
- Slide 3: 3 features vertical list with icon boxes
- Slide 4: Single big metric + testimonial quote with attribution
- Slide 5: Glass card CTA with orange button

**Pipeline layout slides:**
- Slide 1: Glass card with left border, 2-line headline, task label
- Slide 2: Workflow pipeline (user request → router agent → resolution agents with labels)
- Slide 3: Bento grid (2 top cards + 1 full-width bottom card with badge)
- Slide 4: Comparison bars (before/after) + 2-stat metric grid
- Slide 5: Terminal window with CLI commands + white CTA button

### Variable Slide Counts (3-7)

Hero (always first) and CTA (always last) are fixed. For middle slides, present the slide type menu:

| Slide Type | Available In | Description |
|-----------|-------------|-------------|
| Chat UI Showcase | Default | Agent conversation mock |
| Workflow Pipeline | Pipeline | Request routing diagram |
| Features (Vertical) | Default | 3 features with icon boxes |
| Features (Bento) | Pipeline | 2x2 grid + full-width card |
| Metrics/Proof | Both | Stats + testimonial (Default) or comparison bars (Pipeline) |
| Step-by-Step | Both | Numbered process steps |

### New Layout Generation

If the user requests a layout that doesn't exist, generate one following the shared style system:
- 1080x1350px per slide (use `transform: scale(2.7)` on 400px base OR direct pixel dimensions)
- Background: `#0F0F0F`, body: `#0A0A0A`, accent: `#FF4500`
- Font: Inter via Google Fonts CDN
- Icons: Iconify Solar set via CDN
- Include Tailwind CDN and Figma capture script
- Save to `content-marketing/_layouts/{name}-{N}slide.html`
- Update `content-marketing/_layouts/README.md`

---

## Phase 3 — Content Generation

### 3.1 Create Post Directory

```
content-marketing/posts/YYYY-MM-DD_slug-name/
```

Use today's date. Slug from topic (lowercase, hyphens, no special chars).

### 3.2 Generate `carousel.md`

Follow the template structure from `content-marketing/_templates/carousel-post.md`. Use the table format with Field/Value columns. Adapt the field set based on the chosen layout.

**Content rules (from voice guide — these are mandatory):**

1. **Headlines**: Short, punchy. Default layout uses 3-line format (white setup / zinc-500 bridge / #FF4500 payoff). Pipeline uses 2-line format (white + zinc-500). Max ~15 chars per line.
2. **Agent names**: Branded format — `Intake_Agent`, `Router_AI`, `Support_Agent`, `Finance_AI`, etc.
3. **Feature titles**: Lead with the benefit, not the feature name (e.g., "Live in Days" not "Fast Deployment")
4. **Metrics**: One dominant number per slide. Don't clutter with multiple stats.
5. **CTA**: Command voice — "Deploy Your Crew" not "Learn How to Deploy"
6. **Banned vocabulary**: Never use "revolutionary", "game-changing", "AI magic", "chatbot", "cheap", "simple"
7. **Preferred vocabulary**: Deploy, launch, autonomous agents, AI crew, digital workforce, enterprise-grade, HIPAA-aware

**Character limits** (from template — respect these strictly):

| Element | Max Chars |
|---------|-----------|
| Status line / task label | ~40 |
| Headline per line | ~15 |
| Subtitle | ~100 |
| Agent messages | ~60 each |
| User message | ~50 |
| Feature titles | ~30 |
| Feature descriptions | ~70 |
| Metric label | ~25 |
| Metric number | ~4 |
| Quote / testimonial | ~120 |
| CTA headline | ~30 |
| CTA subtitle | ~60 |
| Button text | ~20 |

### 3.3 Generate `captions.md`

Follow `content-marketing/_templates/captions.md` structure.

**LinkedIn** (800-1300 chars):
- Structure: Hook line → Problem → Solution → Proof point → CTA → Hashtags
- Tone: Professional, thought-leadership, data-driven
- End with: `autocrew-ai.com` link
- Always include `#Autocrew` + 5-8 relevant hashtags

**Instagram** (300-500 chars):
- Structure: Hook → Key benefit → CTA → Hashtags
- Tone: Concise, visual-first, action-oriented
- End with: "Link in bio"
- Always include `#Autocrew` + 5-8 relevant hashtags

### 3.4 Build-in-Public Special Rules

When `--bip` mode is active:
- Reference specific commits by description (NOT SHA hashes)
- Mention features/pages built using user-facing names from mock-data files
- Use "we shipped" / "we built" / "here's what went live" language
- Pipeline Slide 2: Show workflow of what was built (not generic agent routing)
- Pipeline Slide 5 terminal: Show relevant commands from the actual build process
- LinkedIn caption: Frame as founder/builder narrative, not marketing
- Instagram caption: Focus on the visual output / before-after

---

## Phase 4 — Review Pause

**THIS IS A HARD GATE. DO NOT PROCEED UNTIL THE USER EXPLICITLY APPROVES.**

Present the complete `carousel.md` and `captions.md` content to the user. Display them clearly.

```
REVIEW YOUR CONTENT
====================

📋 CAROUSEL (Layout: [name])
[Display full carousel.md content]

---

📝 CAPTIONS
[Display full captions.md content]

---

Ready to render HTML and export to Figma?
- "approve" / "looks good" → proceed to Phase 5
- Provide specific edits → I'll revise and re-present
- "start over" → return to Phase 1
```

If the user provides edits:
1. Apply the edits to carousel.md and/or captions.md
2. Save the updated files
3. Re-present for approval
4. Repeat until approved

---

## Phase 5 — Render & Export

### 5.1 Generate HTML

1. Read the selected layout HTML from `content-marketing/_layouts/{layout}.html`
2. Generate a new `slides.html` in `content-marketing/posts/YYYY-MM-DD_slug/` by writing the complete HTML with the approved carousel.md content injected into the layout structure
3. Adapt slide count — add or remove slide `<div>` blocks as needed
4. Update all slide counters to reflect actual count (`01/05`, `02/05`, etc. for Default; `01`, `02`, etc. for Pipeline)
5. Use the actual Autocrew SVG logo from `components/layout/logo.tsx` (the full logo with wordmark, not the Iconify icon placeholder)
6. Ensure the Figma capture script is present: `<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>`

### 5.2 Serve Locally

Check if port 8888 is in use. If so, use 8889 or the next available port.

```bash
cd content-marketing/posts/YYYY-MM-DD_slug && python3 -m http.server 8888
```

Run in background.

### 5.3 Figma Capture

1. Call `mcp__figma__generate_figma_design` with `outputMode: "existingFile"` and `fileKey: "UW1wcgPNEr74lGBz8TTGkU"` (Autocrew AI file)
   - If user requests a new file: use `outputMode: "newFile"` with auto-generated fileName from the post slug
2. This returns a captureId and capture URL hash
3. Open the browser: `open "http://localhost:8888/slides.html#figmacapture={captureId}&figmaendpoint={endpoint}&figmadelay=3000"`
4. Wait 5-8 seconds for the page to render (slides are large)
5. Poll `mcp__figma__generate_figma_design` with `captureId` every 5 seconds, up to 10 attempts
6. On success: report the Figma URL and open it in the browser
7. On failure after 10 polls: tell the user to check the browser tab and try the manual capture toolbar

### 5.4 Report & Cleanup

Stop the background HTTP server. Present the final summary:

```
EXPORT COMPLETE
===============
Post:     content-marketing/posts/YYYY-MM-DD_slug/
Files:    carousel.md, captions.md, slides.html
Figma:    [URL to the Figma node]
Layout:   [layout name used]

NEXT STEPS:
1. Export slides from Figma as PNG (select frames → Export → PNG 1x)
2. Upload to LinkedIn as PDF carousel or individual images
3. Upload to Instagram as carousel post
4. After publishing, log performance:
   content-marketing/_feedback/performance-log.md
```

---

## Reference: Product Context

When generating content, draw from these product data sources for accuracy:

| Source | Contains |
|--------|----------|
| `lib/mock-data/landing-data.ts` | Hero messaging, features, AI crews, stats, CTAs |
| `lib/mock-data/coaching-data.ts` | Coaching industry pain points, features, metrics |
| `lib/mock-data/restaurant-data.ts` | Restaurant industry pain points, features, metrics |
| `components/layout/logo.tsx` | SVG logo (icon mark #FF6B35, wordmark currentColor) |

Key product facts:
- Autocrew deploys AI-powered digital workforces for customer interactions and business operations
- Three AI crews: Healthcare (HIPAA-aware), Support, LeadGen (coming soon)
- Multi-channel: voice, chat, email, SMS, WhatsApp
- Enterprise security: SOC2 Type II, AES-256, audit trails
- Key stats: 99.9% uptime, <2s response, 95% satisfaction
- Setup: live in 3-5 days, not months
