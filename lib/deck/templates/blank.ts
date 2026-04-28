import type { SlideContent } from "../slide-content-types";

export const BLANK_SLIDES: SlideContent[] = [
  { template: "Cover", content: {
      headlineParts: [{ text: "Untitled deck for " }, { text: "{{prospect.name}}", accent: true }],
      sub: "Add your slides from the + Add slide button.",
      footerLeft: "autocrew-ai.com",
  }},
  { template: "ClosingCTA", content: {
      headlineParts: [{ text: "Ready when you are" }, { text: ".", accent: true }],
      sub: "Tell us what to build next.",
      primaryCta: { label: "Talk to sales", href: "https://autocrew-ai.com/contact" },
  }},
];
