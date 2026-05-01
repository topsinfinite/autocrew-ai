#!/usr/bin/env node
/**
 * Generate blog cover images from MDX frontmatter.
 *
 * Primary:  Recraft v3 (uses RECRAFT_STYLE_ID for cohesive brand look)
 * Fallback: OpenAI gpt-image-1 (medium quality, ~$0.042/image)
 *
 * Usage:
 *   node scripts/generate-blog-covers.mjs            # generate missing
 *   node scripts/generate-blog-covers.mjs --force    # regenerate all
 *   node scripts/generate-blog-covers.mjs --slug X   # one specific post
 *   node scripts/generate-blog-covers.mjs --dry-run  # show what would run
 *
 * Output:
 *   public/images/blog/{slug}.jpg      hero (1456x640, 16:7)
 *   public/images/blog/og/{slug}.jpg   open-graph (1200x630)
 *
 * Env (loaded from .env.local):
 *   RECRAFT_API_KEY=
 *   RECRAFT_STYLE_ID=        (optional, hugely recommended for consistency)
 *   OPENAI_API_KEY=          (fallback)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import sharp from "sharp";

// ---- env loader ----------------------------------------------------------
function loadDotEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      // Strip inline comments (e.g. VALUE=foo  # comment)
      value = value.replace(/\s+#.*$/, "");
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "content/blog");
const IMG_DIR = join(ROOT, "public/images/blog");
const OG_DIR = join(IMG_DIR, "og");

loadDotEnv();

// ---- style blueprint -----------------------------------------------------
// Used for both Recraft (in addition to style_id) and OpenAI (as a hard prefix
// so consistency holds when the fallback runs). Keep this stable across the
// life of the blog — changing it visually re-brands every cover.
const STYLE_BLUEPRINT = [
  "Editorial illustration in a calm, modern publication style.",
  "Warm cream paper background, color #F4EFE6.",
  "Flat shapes with subtle paper-grain texture and hand-drawn imperfection.",
  "Limited palette: warm cream, deep ink #1A1410, accent orange #FF6B35,",
  "and one supporting muted tone.",
  "A single strong central subject. Clear silhouette. No tiny details lost",
  "at thumbnail size. Composition leaves negative space on the right side.",
  "No photorealism. No 3D rendering. No glossy gradients. No text or letters",
  "in the image.",
].join(" ");

// ---- API: Recraft v3 -----------------------------------------------------
async function generateRecraft({ subject }) {
  const apiKey = process.env.RECRAFT_API_KEY;
  if (!apiKey) throw new Error("RECRAFT_API_KEY not set");

  const body = {
    prompt: `${STYLE_BLUEPRINT}\n\nSubject of the illustration: ${subject}`,
    n: 1,
    model: "recraftv3",
    response_format: "b64_json",
    size: "1707x1024", // closest 16:9-ish that Recraft supports cleanly
  };
  const styleId = process.env.RECRAFT_STYLE_ID;
  if (styleId) body.style_id = styleId;
  else body.style = "digital_illustration";

  const r = await fetch("https://external.api.recraft.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Recraft error ${r.status}: ${txt.slice(0, 300)}`);
  }
  const json = await r.json();
  return Buffer.from(json.data[0].b64_json, "base64");
}

// ---- API: OpenAI gpt-image-1 (fallback) ---------------------------------
async function generateOpenAI({ subject }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: `${STYLE_BLUEPRINT}\n\nSubject of the illustration: ${subject}`,
      n: 1,
      size: "1536x1024", // gpt-image-1 supported size
      quality: "medium", // good cost/quality trade — ~$0.042
      output_format: "jpeg",
      moderation: "auto",
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`OpenAI error ${r.status}: ${txt.slice(0, 300)}`);
  }
  const json = await r.json();
  // gpt-image-1 always returns b64_json
  return Buffer.from(json.data[0].b64_json, "base64");
}

// ---- post discovery ------------------------------------------------------
function getPosts() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((file) => {
      const raw = readFileSync(join(BLOG_DIR, file), "utf8");
      const { data: fm } = matter(raw);
      const slug =
        fm.slug ?? file.replace(/^\d{4}-\d{2}-/, "").replace(/\.mdx$/, "");
      return { file, slug, fm };
    });
}

// ---- main ----------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const FORCE = args.includes("--force");
  const DRY = args.includes("--dry-run");
  const slugFilter = args.includes("--slug")
    ? args[args.indexOf("--slug") + 1]
    : null;

  mkdirSync(IMG_DIR, { recursive: true });
  mkdirSync(OG_DIR, { recursive: true });

  const posts = getPosts().filter((p) => {
    if (slugFilter && p.slug !== slugFilter) return false;
    if (p.fm.draft) return false;
    return true;
  });

  if (posts.length === 0) {
    console.log("No posts to process.");
    return;
  }

  console.log(`Processing ${posts.length} post(s)...\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const { slug, fm } of posts) {
    const heroPath = join(IMG_DIR, `${slug}.jpg`);
    const ogPath = join(OG_DIR, `${slug}.jpg`);

    if (existsSync(heroPath) && !FORCE) {
      console.log(`SKIP  ${slug} (exists — use --force to regenerate)`);
      skipped++;
      continue;
    }

    const subject = fm.coverAlt ?? fm.description ?? fm.title;

    if (DRY) {
      console.log(`DRY   ${slug}\n      → ${subject}\n`);
      continue;
    }

    console.log(`GEN   ${slug}`);
    console.log(`      subject: ${subject}`);

    let buf;
    let provider;
    try {
      buf = await generateRecraft({ subject });
      provider = "Recraft v3";
    } catch (err) {
      console.warn(`      ⚠ Recraft failed: ${err.message}`);
      console.warn(`      → falling back to gpt-image-1`);
      try {
        buf = await generateOpenAI({ subject });
        provider = "gpt-image-1 (medium)";
      } catch (err2) {
        console.error(`      ✗ Both providers failed: ${err2.message}`);
        failed++;
        continue;
      }
    }

    try {
      await sharp(buf)
        .resize(1456, 640, { fit: "cover", position: "centre" })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(heroPath);
      await sharp(buf)
        .resize(1200, 630, { fit: "cover", position: "centre" })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(ogPath);
      console.log(`      ✓ ${provider}`);
      console.log(`      → ${heroPath.replace(ROOT, ".")}`);
      console.log(`      → ${ogPath.replace(ROOT, ".")}\n`);
      generated++;
    } catch (err) {
      console.error(`      ✗ Image processing failed: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\nDone. Generated: ${generated}  Skipped: ${skipped}  Failed: ${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
