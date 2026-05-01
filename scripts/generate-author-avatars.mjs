#!/usr/bin/env node
/**
 * Generate author avatar images for blog authors defined in lib/blog/authors.ts.
 *
 * Primary:  Recraft v3 (uses RECRAFT_STYLE_ID for cohesive brand look)
 * Fallback: OpenAI gpt-image-1 (medium quality)
 *
 * Usage:
 *   node scripts/generate-author-avatars.mjs              # generate missing
 *   node scripts/generate-author-avatars.mjs --force      # regenerate all
 *   node scripts/generate-author-avatars.mjs --key sarah-autocrew
 *   node scripts/generate-author-avatars.mjs --dry-run
 *
 * Output:
 *   public/images/blog/authors/{key}.png  (square 512x512 PNG)
 *
 * Env (loaded from .env.local):
 *   RECRAFT_API_KEY=
 *   RECRAFT_STYLE_ID=        (optional, hugely recommended for consistency)
 *   OPENAI_API_KEY=          (fallback)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");

// ---- env loader (mirrors generate-blog-covers.mjs) ----------------------
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
      value = value.replace(/\s+#.*$/, "");
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv();

// ---- author registry (read from lib/blog/authors.ts) ---------------------
// Parsed with a tiny regex rather than importing TS to avoid a build step.
function getAuthors() {
  const src = readFileSync(join(ROOT, "lib/blog/authors.ts"), "utf8");
  const objects = [...src.matchAll(/\{([^{}]*?)\}/gs)].map((m) => m[1]);
  const authors = [];
  for (const block of objects) {
    const get = (field) => {
      const m = block.match(new RegExp(`${field}\\s*:\\s*"([^"]+)"`));
      return m ? m[1] : null;
    };
    const key = get("key");
    const avatar = get("avatar");
    const name = get("name");
    const role = get("role");
    if (key && avatar) authors.push({ key, avatar, name, role });
  }
  return authors;
}

// ---- per-author prompt ---------------------------------------------------
const STYLE_BLUEPRINT = [
  "Editorial illustration in a calm, modern publication style.",
  "Warm cream paper background, color #F4EFE6.",
  "Flat shapes with subtle paper-grain texture and hand-drawn imperfection.",
  "Limited palette: warm cream, deep ink #1A1410, accent orange #FF6B35,",
  "and one supporting muted tone.",
  "No photorealism. No 3D rendering. No glossy gradients. No text or letters",
  "in the image.",
].join(" ");

const PROMPTS = {
  "sarah-autocrew": [
    "Avatar headshot of one friendly woman named Sarah, an AI receptionist.",
    "ONE person. Head and shoulders, facing the viewer, warm soft smile,",
    "short bob hair. Slim modern call-center headset with mic on her ear.",
    "Face centered, fills most of the square, crops cleanly into a small",
    "circular avatar. Plain cream background — no rooms, no objects, no",
    "other people. Magazine contributor profile-photo composition.",
  ].join(" "),
  "autocrew-team": [
    "A small editorial vignette representing an editorial team for a",
    "voice-AI brand: a stylised cluster of three soft abstract figures",
    "around a glowing call indicator. No faces shown in detail.",
    "Centered, square composition that crops cleanly into a circle.",
  ].join(" "),
};

// ---- API: Recraft v3 -----------------------------------------------------
async function generateRecraft({ subject }) {
  const apiKey = process.env.RECRAFT_API_KEY;
  if (!apiKey) throw new Error("RECRAFT_API_KEY not set");

  const body = {
    prompt: `${STYLE_BLUEPRINT}\n\nSubject of the illustration: ${subject}`,
    n: 1,
    model: "recraftv3",
    response_format: "b64_json",
    size: "1024x1024",
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
      size: "1024x1024",
      quality: "medium",
      output_format: "png",
      moderation: "auto",
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`OpenAI error ${r.status}: ${txt.slice(0, 300)}`);
  }
  const json = await r.json();
  return Buffer.from(json.data[0].b64_json, "base64");
}

// ---- main ----------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const FORCE = args.includes("--force");
  const DRY = args.includes("--dry-run");
  const keyFilter = args.includes("--key")
    ? args[args.indexOf("--key") + 1]
    : null;

  const authors = getAuthors().filter((a) => !keyFilter || a.key === keyFilter);
  if (authors.length === 0) {
    console.log("No authors to process.");
    return;
  }

  console.log(`Processing ${authors.length} author(s)...\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const { key, avatar } of authors) {
    const outPath = join(PUBLIC_DIR, avatar.replace(/^\//, ""));
    mkdirSync(dirname(outPath), { recursive: true });

    if (existsSync(outPath) && !FORCE) {
      console.log(`SKIP  ${key} (exists — use --force to regenerate)`);
      skipped++;
      continue;
    }

    const subject = PROMPTS[key];
    if (!subject) {
      console.warn(`SKIP  ${key} (no prompt defined in script)`);
      skipped++;
      continue;
    }

    if (DRY) {
      console.log(`DRY   ${key}\n      → ${subject}\n`);
      continue;
    }

    console.log(`GEN   ${key}`);

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
        .resize(512, 512, { fit: "cover", position: "centre" })
        .png({ compressionLevel: 9 })
        .toFile(outPath);
      console.log(`      ✓ ${provider}`);
      console.log(`      → ${outPath.replace(ROOT, ".")}\n`);
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
