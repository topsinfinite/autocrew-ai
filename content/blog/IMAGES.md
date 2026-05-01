# Blog Cover Images — Generation Workflow

Every published post needs two images:
- **Hero** — `public/images/blog/{slug}.jpg` — 1456×640 (16:7)
- **OG**   — `public/images/blog/og/{slug}.jpg` — 1200×630 (Open Graph share card)

Both are generated from the post's `coverAlt` (or `description` if no alt) by `scripts/generate-blog-covers.mjs`.

## One-time setup

1. **Sign up for Recraft v3** at https://www.recraft.ai. Add your API key to `.env.local`:
   ```
   RECRAFT_API_KEY=...
   ```

2. **Create a brand style** (this is what gives you visual cohesion across 100+ posts):
   - In the Recraft dashboard, go to **Styles → Create style**
   - Upload 3–5 reference illustrations that capture the look you want. Good seed material: editorial illustrations from Intercom's blog, NYT illustrations, Stripe brand illustrations, or hand-drawn flat illustrations with warm cream + orange palette.
   - After creation, copy the **style ID** (UUID format) into `.env.local`:
   ```
   RECRAFT_STYLE_ID=...
   ```

3. **Add OpenAI as fallback**. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```
   Used automatically if Recraft fails (rate limit, account issue, etc.). Uses `gpt-image-1` at `medium` quality (~$0.042/image).

## Generating covers

```bash
npm run blog:covers          # generate any missing covers
npm run blog:covers:force    # regenerate ALL covers (use sparingly — costs money)
npm run blog:covers:dry      # show what would run without calling APIs

# Generate for a single post
node scripts/generate-blog-covers.mjs --slug after-hours-call-problem-healthcare-ai
```

The script:
1. Reads every `content/blog/*.mdx` (skips `_template.mdx`, drafts, and underscore-prefixed files)
2. For each post without a cover image on disk, calls Recraft v3 with the style ID
3. If Recraft errors out, falls back to gpt-image-1 with the same prompt prefix
4. Resizes the generated image into both hero (1456×640) and OG (1200×630) sizes via `sharp`
5. Skips posts whose hero already exists (use `--force` to regenerate)

## How the prompt is built

```
{STYLE_BLUEPRINT}

Subject of the illustration: {post.coverAlt || post.description || post.title}
```

The `STYLE_BLUEPRINT` is a fixed paragraph in `scripts/generate-blog-covers.mjs` describing:
- Editorial illustration tone
- Cream paper background (#F4EFE6)
- Flat shapes + paper grain texture
- Color palette (cream, ink, orange, one supporting tone)
- Composition rules (clear silhouette, negative space on right, no text)

**Do not change the blueprint casually** — if you change it, every regenerated cover will look subtly different from the existing ones. Treat it like a brand asset.

## Writing good `coverAlt` text

The `coverAlt` field in frontmatter doubles as both accessibility text and image generation prompt subject. Write it like a director's note for an illustrator:

✅ **Good**: `"A glowing phone on a darkened dental clinic counter at night, with subtle waveform lines emanating from it"`

❌ **Bad**: `"after-hours call image"` (too vague — model has nothing to anchor on)

❌ **Bad**: `"image showing healthcare practices using AI"` (abstract, not visual)

Keep it concrete, visual, single-subject. If the post is about AI handling restaurant reservations on a busy Friday night, `coverAlt` should describe the *scene* (a hostess station with a glowing tablet, a queue of restaurant guests blurred in the background) — not the *concept*.

## When Recraft drifts

Even with `style_id`, Recraft can drift if you go many months between batches or change `STYLE_BLUEPRINT`. Catch drift early:

1. Generate one new cover.
2. Place it in a row with the last 3 published covers in the file browser thumbnail view.
3. If it sticks out (different palette, different texture, photorealistic vs flat), regenerate that single post: `node scripts/generate-blog-covers.mjs --slug X --force`.

If drift is widespread (3+ recent covers feel "off"), refresh the Recraft style by adding the most recent successful covers as new reference images — this re-anchors the style ID to the current visual direction.

## Cost expectations

- Per post: ~$0.04 (Recraft v3) or ~$0.042 (gpt-image-1 medium)
- 4 seed posts: < $0.20
- 100 posts: ~$4
- Regenerating all 100 with `--force`: another $4

Cheap. Don't optimize against this; optimize against quality.

## Manual override

If you have a hand-illustrated or photographed cover for a specific post:
1. Drop the file at `public/images/blog/{slug}.jpg` (1456×640 or larger)
2. Drop the OG variant at `public/images/blog/og/{slug}.jpg` (1200×630)
3. The generator will skip it (existence check)

## Future: per-author OG cards

Open question — do we want the OG variant to overlay author + title on top of the illustration (like Stripe's blog OG cards) instead of cropping the raw illustration? If yes, that's a follow-up task: extend `lib/seo/og-image.tsx` to compose hero + title + author into a 1200×630 card using `next/og`.
