// lib/deck/personalization.ts
export type SubstitutionContext = {
  prospect: {
    name?: string;
    industry?: string;
    contactName?: string;
    dealValue?: string;
  };
  salesRep: { name?: string; email?: string };
  date: Date;
};

const ALLOWED = new Set([
  "prospect.name",
  "prospect.industry",
  "prospect.contactName",
  "prospect.dealValue",
  "salesRep.name",
  "salesRep.email",
  "date",
  "date.short",
]);

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
export function formatDateShort(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${mm}/${d.getFullYear()}`;
}

function lookup(ctx: SubstitutionContext, path: string): string {
  if (!ALLOWED.has(path)) return "";
  switch (path) {
    case "prospect.name":
      return ctx.prospect.name ?? "";
    case "prospect.industry":
      return ctx.prospect.industry ?? "";
    case "prospect.contactName":
      return ctx.prospect.contactName ?? "";
    case "prospect.dealValue":
      return ctx.prospect.dealValue ?? "";
    case "salesRep.name":
      return ctx.salesRep.name ?? "";
    case "salesRep.email":
      return ctx.salesRep.email ?? "";
    case "date":
      return formatDate(ctx.date);
    case "date.short":
      return formatDateShort(ctx.date);
    default:
      return "";
  }
}

export function substitute(text: string, ctx: SubstitutionContext): string {
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => lookup(ctx, path));
}
