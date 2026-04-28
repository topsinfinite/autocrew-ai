// lib/deck/filename.ts
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function deckFilename(opts: { template: string; prospectName?: string; date: Date }): string {
  const d = opts.date;
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const prospect = opts.prospectName ? slugify(opts.prospectName) : "";
  return ["autocrew", slugify(opts.template), prospect, dateStr].filter(Boolean).join("-");
}
