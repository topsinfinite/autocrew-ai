# Autocrew Blog — Research Workflow (Ideabrowser MCP)

The Ideabrowser MCP connection is the primary editorial research engine. Topics are demand-validated against real search/platform trends rather than guessed.

## Setup (one-time)

1. Connect the Ideabrowser MCP in your Claude Code settings.
2. Run `create_project` with:
   - Name: "Autocrew Blog SEO Engine"
   - Description: "Topic research and validation for the Autocrew Journal. Autocrew is a voice AI + customer automation platform. ICPs: coaching studios, dental/medical clinics, law firms, restaurants. Core product: AI receptionist that answers calls 24/7 and handles bookings, support escalation, and lead capture."
3. Save the founder profile (`save_archetype` or `update_project_notes`) so `browse_ideas` results are pre-filtered to relevant skill/budget/industry context.

## Weekly editorial cycle

Run this cycle every 1–2 weeks to generate 3–5 validated post briefs.

### 1. Get personalized quickstart

```
get_quickstart
```

Read the personalized weekly suggestions. These are pre-filtered by your profile. Note any that intersect Autocrew's product surface.

### 2. Browse platform trends

```
browse_platform_trends(filters: { industries: ["healthcare", "legal", "coaching", "restaurants", "AI", "automation"] })
```

Capture 5–10 raw trends. For each, note:
- Is there search intent (would someone Google this)?
- Does it intersect Autocrew's product (voice AI, receptionist, support automation, lead gen)?
- Is there commercial intent (someone would pay to solve this)?

### 3. Browse platform insights

```
browse_platform_insights(filters: { same industries as above })
```

Capture 5–10 pain points and "underserved" opportunities. Focus on things operators say in forums, reviews, Reddit — not polished industry reports.

### 4. Triage

For each trend/insight, score on three criteria (1–3 each):
- **Product fit**: Does Autocrew directly solve this?
- **Search intent**: Would someone search for a solution in Google?
- **Underserved**: Is the current top-10 weak (thin content, old posts, no direct answer)?

Total score ≥ 7/9 → write a brief. Score 5–6 → park for later. Score < 5 → discard.

### 5. Deep-dive the top picks

```
research_market_insight(id: <insight_id>)
```

Run on the top 3 surviving topics. Read the full research output. Extract:
- The core pain/question
- Real numbers (search volume estimate, cost of the problem)
- Who has authority on this topic currently (competitors, aggregators)
- What angle Autocrew can own that others can't (the "only we can say this" fact)

### 6. Bank the research

```
attach_insight_to_project(project_id: <autocrew_blog_project_id>, insight_id: <id>)
attach_research_to_project(project_id: <autocrew_blog_project_id>, research_id: <id>)
```

Everything that survives triage goes into the Autocrew project context.

### 7. Write post briefs

For each surviving topic, create `content/blog/_briefs/{slug}.md` with this structure:

```markdown
# Brief: {Working Title}

**Status**: Drafting | Review | Approved | Published
**Target publish**: YYYY-MM-DD
**Word count target**: NNNN
**Primary keyword**: {keyword phrase}
**Secondary keywords**: {3–5 related phrases}

## Why this topic
{1–2 sentences: the pain, the search intent, the Autocrew angle}

## Must-cover questions (→ FAQ entries)
1. {Question 1}
2. {Question 2}
3. {Question 3}
4. {Question 4}
5. (optional: Question 5)

## Internal link targets
- Industry page: /industry/{slug}
- Product page: /ai-receptionist or /widget
- Sibling post: {slug} (or TBD if not yet written)

## Original artifact to create
{Screenshot / chart / diagram / table — specific description}

## Competitive gap
{What the current top-10 doesn't answer well that we can own}
```

### 8. Update the editorial calendar

Add the new briefs to `content/blog/_editorial-calendar.md` in the Ideas column.

---

## Coverage targets (first 90 days)

| Type | Count | Status |
|------|-------|--------|
| Industry pillar posts (one per vertical, 2000+ words) | 4 | In progress |
| Cluster posts (200–400 daily search vol range) | 8 | Pending |
| Cross-cut AI automation posts | 4 | Pending |
| Calculator/tool post (missed call cost) | 1 | Pending |

Industry pillars: healthcare, coaching, legal, restaurants  
Cross-cuts: AI receptionist overview, AI vs live answering, cost of missed calls, ROI of automation

---

## Using Ideabrowser alongside writing

During drafting, use `get_market_insight_detail` to pull specific stats and context without re-searching. Use `get_project_context` to review what's already banked.

After publishing, run `attach_trend_to_project` with a note on what angle performed well — this builds up a corpus of validated approaches for future posts.
