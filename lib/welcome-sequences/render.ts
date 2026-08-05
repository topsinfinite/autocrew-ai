import {
  FRICTION_FOOTER_TEMPLATE,
  TOKEN_KEYS,
  type TokenValues,
} from "./types";

const TOKEN_RE = /\{\{(\w+)\}\}/g;

export function findUnknownTokens(template: string): string[] {
  const unknown: string[] = [];
  for (const match of template.matchAll(TOKEN_RE)) {
    const key = match[1];
    if (!key) continue;
    if (!(TOKEN_KEYS as readonly string[]).includes(key)) {
      unknown.push(key);
    }
  }
  return [...new Set(unknown)];
}

export function stripMarkdownToPlain(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function resolveToken(key: string, values: TokenValues): string {
  if (key === "go_live") {
    const raw = values.go_live.trim();
    return raw.length > 0 ? raw : "your target go-live date (TBD)";
  }
  return values[key as keyof TokenValues] ?? "";
}

export function resolveTokens(
  template: string,
  values: TokenValues,
): { text: string; unknownTokens: string[] } {
  const unknownTokens = findUnknownTokens(template);
  const text = template.replace(TOKEN_RE, (_full, key: string) =>
    resolveToken(key, values),
  );
  return { text, unknownTokens };
}

export function renderSubject(
  subjectTemplate: string,
  values: TokenValues,
): { subject: string; unknownTokens: string[]; ok: boolean } {
  const { text, unknownTokens } = resolveTokens(subjectTemplate, values);
  return {
    subject: text.trim(),
    unknownTokens,
    ok: unknownTokens.length === 0,
  };
}

export function renderBody(
  bodyTemplate: string,
  values: TokenValues,
): { body: string; unknownTokens: string[]; ok: boolean } {
  const bodyResolved = resolveTokens(bodyTemplate, values);
  const footerResolved = resolveTokens(FRICTION_FOOTER_TEMPLATE, values);
  const unknownTokens = [
    ...new Set([
      ...bodyResolved.unknownTokens,
      ...footerResolved.unknownTokens,
    ]),
  ];
  const plain = stripMarkdownToPlain(bodyResolved.text);
  const footer = stripMarkdownToPlain(footerResolved.text);
  return {
    body: `${plain}\n\n---\n${footer}`,
    unknownTokens,
    ok: unknownTokens.length === 0,
  };
}

export function buildMailto({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): string | null {
  // mailto URLs blow up past ~2000 chars in many clients
  const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (href.length > 1800) return null;
  return href;
}
