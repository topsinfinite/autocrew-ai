# Autocrew Journal — Style & Quality Guide

## Voice

- Use "Autocrew" for product references, never "we" or "our product"
- Second-person ("you") for the reader
- Never first-person plural ("we offer...", "our team...")
- Direct, concrete, builder's tone — no corporate buzzwords
- Name the thing: specify "dental clinic", "family law firm", not "healthcare provider", "legal business"

## Banned openers (instant rejection)

- "In today's fast-paced world..."
- "In the digital age..."
- "Businesses today face..."
- "As [technology] continues to evolve..."
- Any passive construction in the first sentence ("It has been shown that...")

## Structure rules

- First sentence of every section: define the term or state the conclusion. Don't tease.
  - Good: "An AI receptionist is a voice agent that answers calls 24/7 without hold music."
  - Bad: "Many clinics are turning to a new kind of solution for their call challenges."
- At least 2 H2s must be answerable questions ("How does X work?", "When should you Y?")
- Every H2 that is a question should have a 1–2 sentence direct answer as its first paragraph
- No section longer than 400 words without a visual break (subheading, list, table, or image)

## AEO patterns (required in every post)

1. **AEO Summary callout** — use `<AEOSummary>` MDX component, 40–60 words, immediately after the H1 in the post body. This is the paragraph ChatGPT/Perplexity will lift. Make it a complete, standalone answer to the post's core question.
2. **FAQ block** — minimum 4 entries, maximum 8. Questions should be things someone would literally type into Google or ChatGPT. Answers: 2–4 sentences, no fluff.
3. **Definitional H2s** — at least one H2 that defines the core concept ("What is an AI receptionist?")
4. **Lists and tables** — both engines extract these readily. Prefer lists over prose for comparisons, step-by-steps, and feature summaries.

## Length

- Pillar posts: 2,000–2,500 words (the four industry pillars)
- Cluster posts: 1,200–1,800 words
- Playbook posts: 800–1,200 words (how-to, numbered steps)

## Originality requirements

Every post needs at least one original artifact:
- An Autocrew workflow screenshot or diagram
- A Recharts chart with sourced data (cite the source inline)
- A comparison table with sourced numbers
- A real Autocrew use case drawn from the industry pages

**No stock photo placeholders.** Use a placeholder div in the MDX until a real image exists; never commit a post that links a stock photo.

Every claim with a number gets an inline source link. Example: "Businesses lose an average of $75 per missed call [(Source)](https://example.com)".

## AI-assisted writing rules

Posts may use AI assistance for research compilation and first drafts. Before publishing:
1. All AI-generated passages must be reviewed and rewritten to remove generic phrasing
2. Target < 30% AI-detectable content (check with originality.ai or similar)
3. Every section must contain at least one piece of information not in the AI's first draft (a real example, a sourced stat, a specific Autocrew feature detail)
4. Run a plagiarism check before publishing

## Autocrew references

When linking to Autocrew product pages, use the actual route:
- AI Receptionist: `/ai-receptionist`
- Widget: `/widget`
- Healthcare industry: `/industry/healthcare`
- Legal industry: `/industry/legal`
- Coaching industry: `/industry/coaching`
- Restaurant industry: `/industry/restaurant`

Always link the first mention of "Autocrew" in a post to the homepage or the most relevant product page. Never link to external competitors.

## SEO checklist (per post, before publish)

- [ ] Title contains the primary keyword in first 60 characters
- [ ] Meta description is 145–158 characters, ends with a CTA or value hook
- [ ] Primary keyword appears in: title, H1, first paragraph, one H2, and the AEO Summary
- [ ] At least 3 internal links (1 to an industry page, 1 to a product page, 1 to a related post)
- [ ] Alt text on every image (describe the image concretely, not "image showing...")
- [ ] Slug matches primary keyword, hyphens only, no dates
- [ ] `faqs` frontmatter has at least 4 entries
- [ ] `related` frontmatter has at least 2 post slugs (or leave empty for auto-fill)

## Frontmatter completeness (required before publish)

- `draft: false`
- `publishedAt` set to publish date
- `categories` has at least 1 entry matching a defined category slug
- `coverImage` points to a real file in `/public/images/blog/`
- `coverAlt` is filled
- `faqs` has ≥ 4 entries
- `description` is 145–158 characters
- `aeoSummary` is 40–60 words
