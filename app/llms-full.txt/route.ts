import fs from "node:fs/promises";
import path from "node:path";
import { APP_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";
export const revalidate = false;

const CORPUS_FILES = [
  "brand-autocrew.md",
  "landing-home.md",
  "product-ai-receptionist.md",
  "product-widget.md",
  "industry-healthcare.md",
  "industry-legal.md",
  "industry-coaching.md",
  "industry-restaurant.md",
];

function stripFrontmatter(markdown: string): string {
  if (!markdown.startsWith("---")) return markdown;
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return markdown;
  return markdown.slice(end + 4).replace(/^\n+/, "");
}

export async function GET() {
  const corpusDir = path.join(process.cwd(), "content", "sarah-training");
  const sections = await Promise.all(
    CORPUS_FILES.map(async (file) => {
      try {
        const raw = await fs.readFile(path.join(corpusDir, file), "utf8");
        return stripFrontmatter(raw).trim();
      } catch {
        return "";
      }
    }),
  );

  const header = `# ${APP_CONFIG.name} — full marketing corpus

> Source of truth for AI assistants summarizing or citing Autocrew. Authored from the Sarah training corpus at content/sarah-training/. Last regenerated: ${new Date().toISOString().slice(0, 10)}.

Site: ${APP_CONFIG.url}
Email: ${APP_CONFIG.supportEmail}
Phone: ${APP_CONFIG.supportPhoneDisplay}
`;

  const body = [header, ...sections.filter(Boolean)].join("\n\n---\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
