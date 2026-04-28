// lib/deck/slide-content-types.ts
// Concrete content shapes per slide template. Discriminated by `template` field on SlideInstance.

export type CoverContent = {
  /** Mono eyebrow at top, e.g. "V1.1 · LIVE" */
  eyebrow?: string;
  /** Headline split into runs; runs with `accent: true` render in the deck accent color. */
  headlineParts: Array<{ text: string; accent?: boolean }>;
  sub?: string;
  /** Footer left chip (e.g. site URL). Right chip is auto: "<deck>.<slide-num>". */
  footerLeft?: string;
};

export type ProblemContent = {
  number: string;       // "01"
  label: string;        // "THE PROBLEM"
  headlineParts: Array<{ text: string; accent?: boolean }>;
  body: string;
  /** Optional bottom comparison strip with hairline divider. */
  comparison?: { leftLabel: string; leftValues: string[]; rightLabel: string; rightValues: string[] };
};

export type SolutionContent = {
  number: string;
  label: string;
  headlineParts: Array<{ text: string; accent?: boolean }>;
  body: string;
  /** Horizontal dot-bullet items rendered along the bottom. */
  bullets: string[];
};

export type FiveCardGridContent = {
  number: string;
  label: string;
  secondary?: string;   // optional secondary eyebrow segment
  headline: string;
  sub: string;
  cards: Array<{ number: string; title: string; body: string }>;  // exactly 5
};

export type DetailWithCodeContent = {
  number: string;       // "01"
  label: string;        // "DECLARATIVE"
  headline: string;
  body: string;
  bestForLabel?: string; // default "BEST FOR"
  bestFor: string[];     // bullet items
  code: { filename?: string; cornerLabel?: string; code: string };
};

export type SixCardGridContent = {
  number: string;
  label: string;
  headline: string;
  cards: Array<{ cornerLabel: string; title: string; body: string }>;  // exactly 6, 2x3
};

export type NumberedPointsContent = {
  number: string;
  label: string;
  headline: string;
  /** Exactly 6 numbered points; renders as 2 columns × 3 rows with hairline rules. */
  points: Array<{ number: string; title: string; body: string }>;
};

export type HeadlineWithScreenshotContent = {
  number: string;
  label: string;
  headlineParts: Array<{ text: string; accent?: boolean }>;
  body: string;
  bullets: string[];
  /** Right-side card. Either an image src or a structured key-value preview. */
  screenshot:
    | { kind: "image"; src: string; alt?: string }
    | { kind: "kv"; title: string; rightLabel?: string; rows: Array<{ label: string; value: string }> };
};

export type HeadlineWithCodeContent = {
  number: string;
  label: string;
  /** Headline rendered as stacked lines; each can be accented. */
  headlineLines: Array<{ text: string; accent?: boolean }>;
  code: { filename?: string; cornerLabel?: string; code: string };
  /** Mono caption rendered below the code panel. */
  footerCaption?: string;
};

export type ComparisonTableContent = {
  number: string;
  label: string;
  headlineParts: Array<{ text: string; accent?: boolean }>;
  /** First col is the capability column. Last col is the highlighted "us" column. */
  columns: string[];          // e.g. ["CAPABILITY", "STATIC FORM", "GENERIC CHATBOT", "CUSTOM AI BUILD", "AUTOCREW"]
  rows: Array<string[]>;      // each row length === columns.length; final column highlighted
};

export type ClosingCTAContent = {
  /** Optional logo wordmark at top centre. */
  logo?: { src: string; alt?: string };
  headlineParts: Array<{ text: string; accent?: boolean }>;
  sub: string;
  primaryCta: { label: string; href?: string };
  secondaryCta?: { label: string; href?: string };
};

export type BigStatContent = {
  number?: string;
  label: string;
  /** The big number, e.g. "30s" or "94%". */
  stat: string;
  /** Short label under the stat, e.g. "AVERAGE TIME-TO-CONVERSATION". */
  statLabel: string;
  /** Sub-context paragraph below. */
  context: string;
};

export type QuoteContent = {
  number?: string;
  label: string;            // e.g. "TESTIMONIAL"
  /** The pull-quote. Rendered in display-italic. */
  quote: string;
  attribution: { name: string; title?: string; org?: string };
};

/** Discriminated union — used by the rest of the codebase. */
export type SlideContent =
  | { template: "Cover";                  content: CoverContent }
  | { template: "Problem";                content: ProblemContent }
  | { template: "Solution";               content: SolutionContent }
  | { template: "FiveCardGrid";           content: FiveCardGridContent }
  | { template: "DetailWithCode";         content: DetailWithCodeContent }
  | { template: "SixCardGrid";            content: SixCardGridContent }
  | { template: "NumberedPoints";         content: NumberedPointsContent }
  | { template: "HeadlineWithScreenshot"; content: HeadlineWithScreenshotContent }
  | { template: "HeadlineWithCode";       content: HeadlineWithCodeContent }
  | { template: "ComparisonTable";        content: ComparisonTableContent }
  | { template: "ClosingCTA";             content: ClosingCTAContent }
  | { template: "BigStat";                content: BigStatContent }
  | { template: "Quote";                  content: QuoteContent };

export type SlideTemplateId = SlideContent["template"];
export const SLIDE_TEMPLATE_IDS: SlideTemplateId[] = [
  "Cover", "Problem", "Solution", "FiveCardGrid",
  "DetailWithCode", "SixCardGrid", "NumberedPoints",
  "HeadlineWithScreenshot", "HeadlineWithCode", "ComparisonTable",
  "ClosingCTA", "BigStat", "Quote",
];
