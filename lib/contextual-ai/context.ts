import type { EnrichedContext } from "./types";

const BLOCK_TAGS = new Set([
  "P",
  "LI",
  "BLOCKQUOTE",
  "FIGCAPTION",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
]);
const BOUNDARY_TAGS = new Set(["SECTION", "ARTICLE", "MAIN", "FOOTER"]);

export const SURROUNDING_CAP = 500;
export const SECTION_LABEL_CAP = 80;

export function buildContext(range: Range, selection: string): EnrichedContext {
  const start = range.commonAncestorContainer;
  let node: HTMLElement | null =
    start.nodeType === Node.TEXT_NODE
      ? (start.parentElement as HTMLElement | null)
      : (start as HTMLElement);

  let nearestBlock: HTMLElement | null = null;
  let boundary: HTMLElement | null = null;

  while (node && node !== document.body) {
    if (
      !nearestBlock &&
      (BLOCK_TAGS.has(node.tagName) || node.hasAttribute("data-block"))
    ) {
      nearestBlock = node;
    }
    if (BOUNDARY_TAGS.has(node.tagName) || node.hasAttribute("data-section")) {
      boundary = node;
      break;
    }
    node = node.parentElement;
  }

  const raw = nearestBlock?.textContent ?? "";
  const surrounding = raw.replace(/\s+/g, " ").trim().slice(0, SURROUNDING_CAP);

  return {
    selection,
    surrounding: surrounding ? surrounding : undefined,
    sectionLabel: inferSectionLabel(boundary),
    url: window.location.pathname,
  };
}

export function inferSectionLabel(
  boundary: HTMLElement | null,
): string | undefined {
  if (!boundary) return undefined;

  const explicit = boundary.getAttribute("data-section");
  if (explicit) return explicit;

  const heading = boundary.querySelector("h1, h2, h3");
  if (heading?.textContent) {
    return heading.textContent
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, SECTION_LABEL_CAP);
  }

  return boundary.getAttribute("aria-label") ?? boundary.id ?? undefined;
}
