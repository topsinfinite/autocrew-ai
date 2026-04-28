// lib/deck/tokens.ts
// Single source of truth for design constants. Used by React components AND PptxGenJS exporter.

export const ACCENT_TOKENS = {
  green:  { hex: "#5EBD3E", cssVar: "--deck-accent-green" },
  yellow: { hex: "#FFB900", cssVar: "--deck-accent-yellow" },
  orange: { hex: "#F78200", cssVar: "--deck-accent-orange" },
  red:    { hex: "#E23838", cssVar: "--deck-accent-red" },
  purple: { hex: "#973999", cssVar: "--deck-accent-purple" },
  blue:   { hex: "#009CDF", cssVar: "--deck-accent-blue" },
} as const;

export type AccentToken = keyof typeof ACCENT_TOKENS;
export const ACCENT_LIST: AccentToken[] = ["green", "yellow", "orange", "red", "purple", "blue"];

export const DISPLAY_STYLES = {
  "serif-italic": { family: "var(--font-instrument-serif), Georgia, serif", style: "italic", weight: 400 },
  "bold-sans":    { family: "var(--font-geist-sans), -apple-system, sans-serif", style: "normal", weight: 700 },
} as const;

export type DisplayStyle = keyof typeof DISPLAY_STYLES;

export const DECK_BG = "#0A0A0A";
export const DECK_SURFACE = "#0F0F0F";
export const DECK_BORDER = "#1F1F1F";
export const DECK_TEXT_PRIMARY = "#FFFFFF";
export const DECK_TEXT_MUTED = "#7A7A7A";

// Slide frame
export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const SLIDE_OUTER_MARGIN = 80;
export const SLIDE_HEADLINE_TOP = 200;
export const SLIDE_CONTENT_WIDTH = SLIDE_WIDTH - SLIDE_OUTER_MARGIN * 2;
