import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { MonoLabel } from "../primitives/MonoLabel";
import type { QuoteContent } from "@/lib/deck/slide-content-types";

export function Quote({ content, positionLabel }: { content: QuoteContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number ?? "—"} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 48, maxWidth: 1400 }}>
        <blockquote style={{ margin: 0, fontFamily: "var(--deck-display-family)", fontStyle: "italic", fontWeight: 400, fontSize: 80, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--deck-text-primary)" }}>
          &ldquo;{content.quote}&rdquo;
        </blockquote>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline", color: "var(--deck-text-muted)", fontFamily: "var(--deck-body-family)", fontSize: 18 }}>
          <span style={{ color: "var(--deck-text-primary)", fontWeight: 600 }}>{content.attribution.name}</span>
          {content.attribution.title ? <span>· {content.attribution.title}</span> : null}
          {content.attribution.org ? <span>· {content.attribution.org}</span> : null}
        </div>
      </div>
    </SlideFrame>
  );
}
